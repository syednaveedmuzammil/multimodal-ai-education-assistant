from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ProfileBase(BaseModel):
    """
    Shared fields for student profile operations.
    """

    bio: str | None = Field(
        default=None,
        max_length=2000,
    )

    education_level: str | None = Field(
        default=None,
        max_length=100,
    )

    institution: str | None = Field(
        default=None,
        max_length=255,
    )

    field_of_study: str | None = Field(
        default=None,
        max_length=150,
    )

    learning_goals: str | None = Field(
        default=None,
        max_length=5000,
    )

    preferred_learning_style: str | None = Field(
        default=None,
        max_length=100,
    )


class ProfileUpdate(ProfileBase):
    """
    Request body for updating the authenticated
    student's profile.
    """

    pass


class ProfileResponse(ProfileBase):
    """
    Public student profile response.
    """

    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )