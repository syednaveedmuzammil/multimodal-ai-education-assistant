from datetime import datetime

from sqlalchemy import (
    DateTime,
    ForeignKey,
    Integer,
    Text,
    func,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.db.base import Base


class ExtractedContent(Base):
    """
    Extracted textual content belonging to an uploaded file.
    """

    __tablename__ = "extracted_contents"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    uploaded_file_id: Mapped[int] = mapped_column(
        ForeignKey(
            "uploaded_files.id",
            ondelete="CASCADE",
        ),
        unique=True,
        nullable=False,
        index=True,
    )

    extracted_text: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    character_count: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    word_count: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    page_count: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    uploaded_file: Mapped["UploadedFile"] = relationship(
        "UploadedFile",
        back_populates="extracted_content",
    )

    def __repr__(self) -> str:
        return (
            f"<ExtractedContent("
            f"id={self.id}, "
            f"uploaded_file_id="
            f"{self.uploaded_file_id}"
            f")>"
        )