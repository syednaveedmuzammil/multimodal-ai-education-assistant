from pathlib import Path
from typing import Annotated

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
    status,
)
from fastapi.responses import FileResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.core.file_storage import (
    generate_stored_filename,
    get_user_upload_directory,
    validate_file,
)
from app.core.config import settings
from app.db.session import get_db
from app.models.uploaded_file import UploadedFile
from app.models.user import User
from app.schemas.upload import UploadedFileResponse

from app.models.extracted_content import ExtractedContent
from app.schemas.extracted_content import (
    ExtractedContentResponse,
)
from app.services.document_processor import (
    DocumentProcessingError,
    calculate_text_statistics,
    extract_document_text,
)

router = APIRouter(
    prefix="/uploads",
    tags=["Uploads"],
)


async def save_upload_file(
    file: UploadFile,
    destination: Path,
) -> int:
    """
    Save an uploaded file in chunks.

    Returns:
        Number of bytes written.
    """

    total_size = 0
    max_size = (
        settings.max_upload_size_mb
        * 1024
        * 1024
    )

    with destination.open("wb") as output:

        while True:
            chunk = await file.read(1024 * 1024)

            if not chunk:
                break

            total_size += len(chunk)

            if total_size > max_size:
                output.close()

                if destination.exists():
                    destination.unlink()

                raise ValueError(
                    "File exceeds the maximum allowed size."
                )

            output.write(chunk)

    return total_size


@router.post(
    "",
    response_model=UploadedFileResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_file(
    file: Annotated[
        UploadFile,
        File(...),
    ],
    current_user: Annotated[
        User,
        Depends(get_current_user),
    ],
    db: Annotated[
        Session,
        Depends(get_db),
    ],
):
    """
    Upload a learning resource for the authenticated user.
    """

    try:
        extension, category = validate_file(file)

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )

    user_directory = get_user_upload_directory(
        current_user.id
    )

    stored_name = generate_stored_filename(
        extension
    )

    destination = (
        user_directory
        / stored_name
    )

    try:
        file_size = await save_upload_file(
            file,
            destination,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=str(exc),
        )

    except OSError:
        if destination.exists():
            destination.unlink()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to save uploaded file.",
        )

    destination = destination.resolve()
    base_directory = Path.cwd().resolve()

    try:
        relative_path = str(
            destination.relative_to(
                base_directory
            )
        )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Invalid upload destination.",
        )

    uploaded_file = UploadedFile(
        user_id=current_user.id,
        original_name=file.filename,
        stored_name=stored_name,
        file_path=relative_path,
        mime_type=file.content_type
        or "application/octet-stream",
        file_extension=extension,
        file_size=file_size,
        file_category=category,
        processing_status="uploaded",
    )

    db.add(uploaded_file)
    db.commit()
    db.refresh(uploaded_file)

    return uploaded_file

@router.get(
    "/{file_id}",
    response_model=UploadedFileResponse,
)
def get_uploaded_file(
    file_id: int,
    current_user: Annotated[
        User,
        Depends(get_current_user),
    ],
    db: Annotated[
        Session,
        Depends(get_db),
    ],
):
    """
    Get metadata for one uploaded file owned by
    the authenticated user.
    """

    uploaded_file = db.scalar(
        select(UploadedFile).where(
            UploadedFile.id == file_id,
            UploadedFile.user_id
            == current_user.id,
        )
    )

    if uploaded_file is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found.",
        )

    return uploaded_file

@router.get(
    "",
    response_model=list[UploadedFileResponse],
)
def list_uploaded_files(
    current_user: Annotated[
        User,
        Depends(get_current_user),
    ],
    db: Annotated[
        Session,
        Depends(get_db),
    ],
):
    """
    List files belonging only to the authenticated user.
    """

    files = db.scalars(
        select(UploadedFile)
        .where(
            UploadedFile.user_id
            == current_user.id
        )
        .order_by(
            UploadedFile.created_at.desc()
        )
    ).all()

    return list(files)

@router.post(
    "/{file_id}/process",
    response_model=UploadedFileResponse,
)
def process_uploaded_file(
    file_id: int,
    current_user: Annotated[
        User,
        Depends(get_current_user),
    ],
    db: Annotated[
        Session,
        Depends(get_db),
    ],
):
    """
    Extract text from an uploaded document.

    Currently supported:
        TXT
        Markdown
        DOCX
        PDF
    """

    uploaded_file = db.scalar(
        select(UploadedFile).where(
            UploadedFile.id == file_id,
            UploadedFile.user_id
            == current_user.id,
        )
    )

    if uploaded_file is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found.",
        )

    if uploaded_file.file_category not in {
        "pdf",
        "text",
        "document",
    }:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "This file type does not support "
                "text extraction yet."
            ),
        )

    file_path = Path(
        uploaded_file.file_path
    )

    if not file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Stored file not found.",
        )

    uploaded_file.processing_status = (
        "processing"
    )

    db.commit()

    try:
        extracted_text, page_count = (
            extract_document_text(
                file_path
            )
        )

        if not extracted_text:
            uploaded_file.processing_status = (
                "needs_ocr"
            )

            db.commit()

            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=(
                    "No extractable text was found. "
                    "This document may require OCR."
                ),
            )

        character_count, word_count = (
            calculate_text_statistics(
                extracted_text
            )
        )

        existing_content = db.scalar(
            select(ExtractedContent).where(
                ExtractedContent.uploaded_file_id
                == uploaded_file.id,
            )
        )

        if existing_content is None:
            extracted_content = ExtractedContent(
                uploaded_file_id=uploaded_file.id,
                extracted_text=extracted_text,
                character_count=character_count,
                word_count=word_count,
                page_count=page_count,
            )

            db.add(extracted_content)

        else:
            existing_content.extracted_text = (
                extracted_text
            )
            existing_content.character_count = (
                character_count
            )
            existing_content.word_count = (
                word_count
            )
            existing_content.page_count = (
                page_count
            )

        uploaded_file.processing_status = (
            "completed"
        )

        db.commit()
        db.refresh(uploaded_file)

        return uploaded_file

    except HTTPException:
        raise

    except DocumentProcessingError as exc:
        uploaded_file.processing_status = (
            "failed"
        )

        db.commit()

        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        ) from exc

    except Exception:
        db.rollback()

        uploaded_file.processing_status = (
            "failed"
        )

        db.commit()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=(
                "An unexpected error occurred "
                "while processing the document."
            ),
        )

@router.get(
    "/{file_id}/content",
    response_model=ExtractedContentResponse,
)
def get_extracted_content(
    file_id: int,
    current_user: Annotated[
        User,
        Depends(get_current_user),
    ],
    db: Annotated[
        Session,
        Depends(get_db),
    ],
):
    """
    Retrieve extracted text for an uploaded document.
    """

    uploaded_file = db.scalar(
        select(UploadedFile).where(
            UploadedFile.id == file_id,
            UploadedFile.user_id
            == current_user.id,
        )
    )

    if uploaded_file is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found.",
        )

    extracted_content = db.scalar(
        select(ExtractedContent).where(
            ExtractedContent.uploaded_file_id
            == file_id,
        )
    )

    if extracted_content is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Extracted content not found.",
        )

    return extracted_content


@router.get(
    "/{file_id}/download",
)
def download_uploaded_file(
    file_id: int,
    current_user: Annotated[
        User,
        Depends(get_current_user),
    ],
    db: Annotated[
        Session,
        Depends(get_db),
    ],
):
    """
    Download an uploaded file owned by the authenticated user.
    """

    uploaded_file = db.scalar(
        select(UploadedFile).where(
            UploadedFile.id == file_id,
            UploadedFile.user_id
            == current_user.id,
        )
    )

    if uploaded_file is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found.",
        )

    file_path = Path(
        uploaded_file.file_path
    )

    if not file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Stored file not found.",
        )

    return FileResponse(
        path=file_path,
        media_type=uploaded_file.mime_type,
        filename=uploaded_file.original_name,
    )


@router.delete(
    "/{file_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_uploaded_file(
    file_id: int,
    current_user: Annotated[
        User,
        Depends(get_current_user),
    ],
    db: Annotated[
        Session,
        Depends(get_db),
    ],
):
    """
    Delete an uploaded file owned by the authenticated user.
    """

    uploaded_file = db.scalar(
        select(UploadedFile).where(
            UploadedFile.id == file_id,
            UploadedFile.user_id
            == current_user.id,
        )
    )

    if uploaded_file is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found.",
        )

    file_path = Path(
        uploaded_file.file_path
    )

    if file_path.exists():
        try:
            file_path.unlink()
        except OSError:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Unable to delete stored file.",
            )

    db.delete(uploaded_file)
    db.commit()

    return None