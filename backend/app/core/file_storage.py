from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile

from app.core.config import settings


ALLOWED_FILE_TYPES = {
    "pdf": {
        ".pdf",
    },
    "image": {
        ".png",
        ".jpg",
        ".jpeg",
        ".webp",
    },
    "audio": {
        ".mp3",
        ".wav",
        ".m4a",
        ".ogg",
        ".webm",
    },
    "text": {
        ".txt",
        ".md",
    },
    "document": {
        ".docx",
    },
}


ALLOWED_EXTENSIONS = {
    extension
    for extensions in ALLOWED_FILE_TYPES.values()
    for extension in extensions
}


ALLOWED_MIME_TYPES = {
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/webp",
    "audio/mpeg",
    "audio/wav",
    "audio/x-wav",
    "audio/mp4",
    "audio/ogg",
    "audio/webm",
    "text/plain",
    "text/markdown",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}


def get_upload_root() -> Path:
    """
    Return the configured upload directory.
    """

    root = Path(settings.upload_dir)

    root.mkdir(
        parents=True,
        exist_ok=True,
    )

    return root


def get_user_upload_directory(
    user_id: int,
) -> Path:
    """
    Return a user-specific upload directory.
    """

    directory = (
        get_upload_root()
        / str(user_id)
    )

    directory.mkdir(
        parents=True,
        exist_ok=True,
    )

    return directory


def get_file_extension(
    filename: str,
) -> str:
    """
    Return a normalized file extension.
    """

    return Path(filename).suffix.lower()


def get_file_category(
    extension: str,
) -> str | None:
    """
    Determine the logical category of a file.
    """

    for category, extensions in ALLOWED_FILE_TYPES.items():
        if extension in extensions:
            return category

    return None


def validate_file(
    file: UploadFile,
) -> tuple[str, str]:
    """
    Validate filename extension and MIME type.

    Returns:
        (extension, category)
    """

    if not file.filename:
        raise ValueError(
            "A filename is required."
        )

    extension = get_file_extension(
        file.filename
    )

    if extension not in ALLOWED_EXTENSIONS:
        raise ValueError(
            "Unsupported file type."
        )

    if file.content_type:
        base_mime_type = file.content_type.split(";")[0].strip().lower()

        if base_mime_type not in ALLOWED_MIME_TYPES:
            raise ValueError(
                "Unsupported MIME type."
            )

    category = get_file_category(
        extension
    )

    if category is None:
        raise ValueError(
            "Unable to determine file category."
        )

    return extension, category


def generate_stored_filename(
    extension: str,
) -> str:
    """
    Generate a unique storage filename.

    The original filename is never used as the actual
    filesystem filename.
    """

    return (
        f"{uuid4().hex}"
        f"{extension}"
    )