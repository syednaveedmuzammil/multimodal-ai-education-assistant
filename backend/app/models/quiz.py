from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.uploaded_file import UploadedFile
    from app.models.user import User


class Quiz(Base):
    """
    Database model representing an AI-generated educational quiz.
    """

    __tablename__ = "quizzes"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    uploaded_file_id: Mapped[int | None] = mapped_column(
        ForeignKey(
            "uploaded_files.id",
            ondelete="SET NULL",
        ),
        nullable=True,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    topic: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    difficulty: Mapped[str] = mapped_column(
        String(50),
        default="medium",
        nullable=False,
    )

    total_questions: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=5,
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

    user: Mapped["User"] = relationship(
        "User",
        back_populates="quizzes",
    )

    uploaded_file: Mapped["UploadedFile | None"] = relationship(
        "UploadedFile",
    )

    questions: Mapped[list["QuizQuestion"]] = relationship(
        "QuizQuestion",
        back_populates="quiz",
        cascade="all, delete-orphan",
        order_by="QuizQuestion.id",
    )

    attempts: Mapped[list["QuizAttempt"]] = relationship(
        "QuizAttempt",
        back_populates="quiz",
        cascade="all, delete-orphan",
        order_by="QuizAttempt.created_at.desc()",
    )

    def __repr__(self) -> str:
        return f"<Quiz(id={self.id}, title='{self.title}', topic='{self.topic}')>"


class QuizQuestion(Base):
    """
    Individual question within a Quiz.
    """

    __tablename__ = "quiz_questions"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    quiz_id: Mapped[int] = mapped_column(
        ForeignKey(
            "quizzes.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    question_text: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    question_type: Mapped[str] = mapped_column(
        String(50),
        default="mcq",
        nullable=False,
    )

    # JSON-encoded array of choices (e.g. ["A. ...", "B. ..."])
    options: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    correct_answer: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    explanation: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        default="",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )

    quiz: Mapped["Quiz"] = relationship(
        "Quiz",
        back_populates="questions",
    )

    def __repr__(self) -> str:
        return f"<QuizQuestion(id={self.id}, quiz_id={self.quiz_id})>"


class QuizAttempt(Base):
    """
    Student submission and telemetry for a quiz attempt.
    """

    __tablename__ = "quiz_attempts"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    quiz_id: Mapped[int] = mapped_column(
        ForeignKey(
            "quizzes.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    score: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    total_questions: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    percentage: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    # JSON-encoded breakdown of student responses and correctness
    answers: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    time_taken_seconds: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )

    quiz: Mapped["Quiz"] = relationship(
        "Quiz",
        back_populates="attempts",
    )

    user: Mapped["User"] = relationship(
        "User",
        back_populates="quiz_attempts",
    )

    def __repr__(self) -> str:
        return (
            f"<QuizAttempt(id={self.id}, quiz_id={self.quiz_id}, "
            f"score={self.score}/{self.total_questions})>"
        )
