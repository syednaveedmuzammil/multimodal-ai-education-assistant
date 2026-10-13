from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.session import get_db
from app.models.extracted_content import ExtractedContent
from app.models.uploaded_file import UploadedFile
from app.models.user import User
from app.services.chat_service import chat_with_assistant, explain_concept
from app.services.ollama_service import (
    OllamaProcessingError,
    generate_response,
)
from app.services.summarization_service import summarize_text

router = APIRouter(
    prefix="/ai",
    tags=["AI"],
)


class AIRequest(BaseModel):
    prompt: str = Field(
        ...,
        min_length=1,
        max_length=10000,
    )
    system_prompt: str | None = Field(
        default=None,
        max_length=5000,
    )


class AIResponse(BaseModel):
    response: str


class SummaryResponse(BaseModel):
    file_id: int | None = None
    file_name: str | None = None
    summary: str


class TextSummaryRequest(BaseModel):
    text: str = Field(
        ...,
        min_length=10,
        max_length=50000,
        description="Educational text or notes to summarize",
    )


class ChatMessageSchema(BaseModel):
    role: str = Field(
        ...,
        pattern="^(user|assistant|system)$",
    )
    content: str = Field(
        ...,
        min_length=1,
        max_length=15000,
    )


class ChatRequest(BaseModel):
    messages: list[ChatMessageSchema] = Field(
        ...,
        min_length=1,
    )
    file_id: int | None = Field(
        default=None,
        description="Optional uploaded note ID to ground responses in",
    )


class ExplainRequest(BaseModel):
    topic: str = Field(
        ...,
        min_length=2,
        max_length=255,
    )
    level: str = Field(
        default="intermediate",
        pattern="^(beginner|intermediate|advanced|step-by-step)$",
    )
    file_id: int | None = Field(
        default=None,
    )


@router.post(
    "/generate",
    response_model=AIResponse,
)
def generate_ai_response(
    request: AIRequest,
    current_user: Annotated[User, Depends(get_current_user)],
) -> AIResponse:
    """
    Generate a general AI response using Ollama.
    """
    try:
        response = generate_response(
            prompt=request.prompt,
            system_prompt=request.system_prompt,
        )
    except OllamaProcessingError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc

    return AIResponse(response=response)


@router.post(
    "/chat",
    response_model=AIResponse,
)
def chat_ai(
    request: ChatRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> AIResponse:
    """
    Interactive educational chat endpoint with multi-turn support and document grounding.
    """
    document_context = None

    if request.file_id is not None:
        extracted = db.scalar(
            select(ExtractedContent).where(
                ExtractedContent.uploaded_file_id == request.file_id,
            )
        )
        if extracted and extracted.extracted_text.strip():
            document_context = extracted.extracted_text

    try:
        messages_dict = [msg.model_dump() for msg in request.messages]
        reply = chat_with_assistant(
            messages=messages_dict,
            document_context=document_context,
        )
    except OllamaProcessingError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Chat error: {exc}",
        ) from exc

    return AIResponse(response=reply)


@router.post(
    "/explain",
    response_model=AIResponse,
)
def explain_topic(
    request: ExplainRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> AIResponse:
    """
    Provide structured concept explanation customized to educational depth.
    """
    context = None
    if request.file_id is not None:
        extracted = db.scalar(
            select(ExtractedContent).where(
                ExtractedContent.uploaded_file_id == request.file_id,
            )
        )
        if extracted and extracted.extracted_text.strip():
            context = extracted.extracted_text

    try:
        reply = explain_concept(
            topic=request.topic,
            level=request.level,
            context=context,
        )
    except OllamaProcessingError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Explanation error: {exc}",
        ) from exc

    return AIResponse(response=reply)


@router.post(
    "/summarize/text",
    response_model=SummaryResponse,
)
def summarize_raw_text(
    request: TextSummaryRequest,
    current_user: Annotated[User, Depends(get_current_user)],
) -> SummaryResponse:
    """
    Generate an AI summary from raw pasted text.
    """
    try:
        summary = summarize_text(request.text)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
    except OllamaProcessingError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc

    return SummaryResponse(
        file_id=None,
        file_name="Pasted Text Notes",
        summary=summary,
    )


@router.post(
    "/summarize/{file_id}",
    response_model=SummaryResponse,
)
def summarize_uploaded_file(
    file_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> SummaryResponse:
    """
    Generate an AI summary for an uploaded file's extracted content.
    """
    uploaded_file = db.scalar(
        select(UploadedFile).where(
            UploadedFile.id == file_id,
            UploadedFile.user_id == current_user.id,
        )
    )

    if uploaded_file is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found.",
        )

    extracted_content = db.scalar(
        select(ExtractedContent).where(
            ExtractedContent.uploaded_file_id == file_id,
        )
    )

    if extracted_content is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "No extracted content is available. "
                "Process the file before requesting a summary."
            ),
        )

    if not extracted_content.extracted_text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The extracted content is empty.",
        )

    try:
        summary = summarize_text(extracted_content.extracted_text)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
    except OllamaProcessingError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc

    return SummaryResponse(
        file_id=uploaded_file.id,
        file_name=uploaded_file.original_name,
        summary=summary,
    )