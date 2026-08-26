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