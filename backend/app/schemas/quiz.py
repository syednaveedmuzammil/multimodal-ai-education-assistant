from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class QuizGenerateRequest(BaseModel):
    file_id: int | None = Field(
        default=None,
        description="ID of uploaded file to generate quiz from",
    )
    topic: str | None = Field(
        default=None,
        min_length=2,
        max_length=255,
        description="Academic topic or subject to generate quiz on",
    )
    num_questions: int = Field(
        default=5,
        ge=1,
        le=15,
        description="Number of questions to generate",
    )
    difficulty: str = Field(
        default="medium",
        pattern="^(easy|medium|hard)$",
        description="Difficulty level: easy, medium, or hard",
    )


class QuizQuestionResponse(BaseModel):
    id: int
    question_text: str
    question_type: str
    options: list[str]
    explanation: str

    model_config = {"from_attributes": True}


class QuizResponse(BaseModel):
    id: int
    title: str
    topic: str
    difficulty: str
    total_questions: int
    created_at: datetime
    questions: list[QuizQuestionResponse]

    model_config = {"from_attributes": True}


class QuizListItem(BaseModel):
    id: int
    title: str
    topic: str
    difficulty: str
    total_questions: int
    created_at: datetime
    best_score: float | None = None
    attempts_count: int = 0

    model_config = {"from_attributes": True}


class QuizAnswerSubmit(BaseModel):
    question_id: int
    selected_answer: str


class QuizSubmitRequest(BaseModel):
    answers: list[QuizAnswerSubmit]
    time_taken_seconds: int | None = Field(
        default=None,
        ge=0,
    )


class QuestionReview(BaseModel):
    question_id: int
    question_text: str
    options: list[str]
    selected_answer: str
    correct_answer: str
    is_correct: bool
    explanation: str


class QuizAttemptResponse(BaseModel):
    id: int
    quiz_id: int
    score: int
    total_questions: int
    percentage: float
    time_taken_seconds: int | None
    created_at: datetime
    review: list[QuestionReview]

    model_config = {"from_attributes": True}
