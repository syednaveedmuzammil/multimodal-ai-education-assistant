"""
SQLAlchemy database models for LearnMate AI.
"""

from app.models.student_profile import StudentProfile
from app.models.user import User

__all__ = [
    "StudentProfile",
    "User",
]