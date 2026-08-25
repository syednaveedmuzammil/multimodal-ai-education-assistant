from datetime import datetime

from pydantic import BaseModel, ConfigDict


class UserResponse(BaseModel):
    """
    Public representation of a user.
    """

    id: int
    name: str
    email: str
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )