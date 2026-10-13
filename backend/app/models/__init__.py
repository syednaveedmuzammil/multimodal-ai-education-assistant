"""
SQLAlchemy database models for LearnMate AI.
"""

from app.models.extracted_content import ExtractedContent
from app.models.quiz import Quiz, QuizAttempt, QuizQuestion
from app.models.student_profile import StudentProfile
from app.models.uploaded_file import UploadedFile
from app.models.user import User

__all__ = [
    "ExtractedContent",
    "Quiz",
    "QuizAttempt",
    "QuizQuestion",
    "StudentProfile",
    "UploadedFile",
    "User",
]