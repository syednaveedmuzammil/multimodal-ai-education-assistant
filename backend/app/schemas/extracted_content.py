from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ExtractedContentResponse(BaseModel):
    """
    Response containing extracted document text and statistics.
    """

    id: int
    uploaded_file_id: int
    extracted_text: str
    character_count: int
    word_count: int
    page_count: int | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )