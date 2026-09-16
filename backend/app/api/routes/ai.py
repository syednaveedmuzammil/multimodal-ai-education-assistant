from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.ollama_service import (
    OllamaProcessingError,
    generate_response,
)


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


@router.post(
    "/generate",
    response_model=AIResponse,
)
def generate_ai_response(
    request: AIRequest,
    current_user: Annotated[
        User,
        Depends(get_current_user),
    ],
) -> AIResponse:
    """
    Generate an AI response using Ollama.
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

    return AIResponse(
        response=response,
    )