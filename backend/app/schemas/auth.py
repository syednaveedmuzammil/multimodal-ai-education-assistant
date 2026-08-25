from pydantic import BaseModel, EmailStr, Field

from app.schemas.user import UserResponse


class RegisterRequest(BaseModel):
    """
    Request body for user registration.
    """

    name: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    email: EmailStr

    password: str = Field(
        ...,
        min_length=8,
        max_length=128,
    )


class LoginRequest(BaseModel):
    """
    Request body for user login.
    """

    email: EmailStr

    password: str = Field(
        ...,
        min_length=1,
        max_length=128,
    )


class TokenResponse(BaseModel):
    """
    JWT authentication response.
    """

    access_token: str
    token_type: str = "bearer"
    user: UserResponse