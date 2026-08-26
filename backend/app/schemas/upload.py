from datetime import datetime

from pydantic import BaseModel, ConfigDict


class UploadedFileResponse(BaseModel):
    """
    Public metadata representation of an uploaded file.
    """

    id: int
    user_id: int
    original_name: str
    mime_type: str
    file_extension: str
    file_size: int
    file_category: str
    processing_status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )