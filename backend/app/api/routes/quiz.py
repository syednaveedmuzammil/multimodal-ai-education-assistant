import json
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import desc, func, select
from sqlalchemy.orm import Session, selectinload

from app.core.dependencies import get_current_user
from app.db.session import get_db
from app.models.extracted_content import ExtractedContent
from app.models.quiz import Quiz, QuizAttempt, QuizQuestion
from app.models.uploaded_file import UploadedFile
from app.models.user import User
from app.schemas.quiz import (
    QuestionReview,
    QuizAttemptResponse,
    QuizGenerateRequest,
    QuizListItem,
    QuizQuestionResponse,
    QuizResponse,
    QuizSubmitRequest,
)
from app.services.ollama_service import OllamaProcessingError
from app.services.quiz_service import generate_quiz_content

router = APIRouter(
    prefix="/quizzes",
    tags=["Quizzes"],
)


@router.post(
    "/generate",
    response_model=QuizResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_quiz(
    request: QuizGenerateRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> QuizResponse:
    """
    Generate an AI-powered educational quiz from an uploaded note or topic.
    """
    content = ""
    topic = request.topic or "Educational Concept"
    file_id = request.file_id

    if file_id is not None:
        uploaded_file = db.scalar(
            select(UploadedFile).where(
                UploadedFile.id == file_id,
                UploadedFile.user_id == current_user.id,
            )
        )
        if not uploaded_file:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Selected file was not found.",
            )

        extracted = db.scalar(
            select(ExtractedContent).where(
                ExtractedContent.uploaded_file_id == file_id,
            )
        )
        if not extracted or not extracted.extracted_text.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File has not been processed for text extraction yet.",
            )

        content = extracted.extracted_text
        if not request.topic:
            topic = uploaded_file.original_name.rsplit(".", 1)[0]

    if not content and not request.topic:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either a processed file_id or a topic must be provided.",
        )

    try:
        generated = generate_quiz_content(
            content=content,
            topic=topic,
            num_questions=request.num_questions,
            difficulty=request.difficulty,
        )
    except OllamaProcessingError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"AI Quiz Generation failed: {exc}",
        ) from exc

    quiz = Quiz(
        user_id=current_user.id,
        uploaded_file_id=file_id,
        title=generated["title"],
        topic=generated["topic"],
        difficulty=request.difficulty,
        total_questions=len(generated["questions"]),
    )
    db.add(quiz)
    db.flush()

    question_objects = []
    for q_data in generated["questions"]:
        q_obj = QuizQuestion(
            quiz_id=quiz.id,
            question_text=q_data["question"],
            question_type="mcq",
            options=json.dumps(q_data["options"]),
            correct_answer=q_data["correct_answer"],
            explanation=q_data.get("explanation", ""),
        )
        db.add(q_obj)
        question_objects.append(q_obj)

    db.commit()
    db.refresh(quiz)

    return QuizResponse(
        id=quiz.id,
        title=quiz.title,
        topic=quiz.topic,
        difficulty=quiz.difficulty,
        total_questions=quiz.total_questions,
        created_at=quiz.created_at,
        questions=[
            QuizQuestionResponse(
                id=q.id,
                question_text=q.question_text,
                question_type=q.question_type,
                options=json.loads(q.options),
                explanation=q.explanation,
            )
            for q in question_objects
        ],
    )


@router.get(
    "",
    response_model=list[QuizListItem],
)
def list_quizzes(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> list[QuizListItem]:
    """
    List all quizzes created by or for the current student.
    """
    quizzes = db.scalars(
        select(Quiz)
        .where(Quiz.user_id == current_user.id)
        .options(selectinload(Quiz.attempts))
        .order_by(desc(Quiz.created_at))
    ).all()

    items = []
    for q in quizzes:
        best_score = None
        if q.attempts:
            best_score = max(att.percentage for att in q.attempts)

        items.append(
            QuizListItem(
                id=q.id,
                title=q.title,
                topic=q.topic,
                difficulty=q.difficulty,
                total_questions=q.total_questions,
                created_at=q.created_at,
                best_score=best_score,
                attempts_count=len(q.attempts),
            )
        )

    return items


@router.get(
    "/{quiz_id}",
    response_model=QuizResponse,
)
def get_quiz(
    quiz_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> QuizResponse:
    """
    Get full quiz details and questions for taking the quiz.
    """
    quiz = db.scalar(
        select(Quiz)
        .where(
            Quiz.id == quiz_id,
            Quiz.user_id == current_user.id,
        )
        .options(selectinload(Quiz.questions))
    )
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found.",
        )

    return QuizResponse(
        id=quiz.id,
        title=quiz.title,
        topic=quiz.topic,
        difficulty=quiz.difficulty,
        total_questions=quiz.total_questions,
        created_at=quiz.created_at,
        questions=[
            QuizQuestionResponse(
                id=q.id,
                question_text=q.question_text,
                question_type=q.question_type,
                options=json.loads(q.options),
                explanation=q.explanation,
            )
            for q in quiz.questions
        ],
    )


@router.post(
    "/{quiz_id}/submit",
    response_model=QuizAttemptResponse,
)
def submit_quiz_attempt(
    quiz_id: int,
    request: QuizSubmitRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> QuizAttemptResponse:
    """
    Evaluate student answers, calculate score, persist attempt telemetry, and return feedback.
    """
    quiz = db.scalar(
        select(Quiz)
        .where(
            Quiz.id == quiz_id,
            Quiz.user_id == current_user.id,
        )
        .options(selectinload(Quiz.questions))
    )
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found.",
        )

    answers_map = {ans.question_id: ans.selected_answer.strip() for ans in request.answers}
    correct_count = 0
    review_list: list[QuestionReview] = []

    for q in quiz.questions:
        user_choice = answers_map.get(q.id, "")
        correct_ans = q.correct_answer.strip()

        # Check correctness - allow full match or prefix match (e.g. "A)" vs "A) Option")
        is_correct = False
        if user_choice and (
            user_choice.lower() == correct_ans.lower()
            or user_choice[:2].lower() == correct_ans[:2].lower()
        ):
            is_correct = True
            correct_count += 1

        review_list.append(
            QuestionReview(
                question_id=q.id,
                question_text=q.question_text,
                options=json.loads(q.options),
                selected_answer=user_choice,
                correct_answer=correct_ans,
                is_correct=is_correct,
                explanation=q.explanation,
            )
        )

    total_q = len(quiz.questions)
    percentage = round((correct_count / total_q) * 100, 1) if total_q > 0 else 0.0

    attempt = QuizAttempt(
        quiz_id=quiz.id,
        user_id=current_user.id,
        score=correct_count,
        total_questions=total_q,
        percentage=percentage,
        answers=json.dumps([r.model_dump() for r in review_list]),
        time_taken_seconds=request.time_taken_seconds,
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    return QuizAttemptResponse(
        id=attempt.id,
        quiz_id=quiz.id,
        score=correct_count,
        total_questions=total_q,
        percentage=percentage,
        time_taken_seconds=request.time_taken_seconds,
        created_at=attempt.created_at,
        review=review_list,
    )


@router.get(
    "/{quiz_id}/attempts",
    response_model=list[QuizAttemptResponse],
)
def get_quiz_attempts(
    quiz_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> list[QuizAttemptResponse]:
    """
    Get past attempt history for a specific quiz.
    """
    attempts = db.scalars(
        select(QuizAttempt)
        .where(
            QuizAttempt.quiz_id == quiz_id,
            QuizAttempt.user_id == current_user.id,
        )
        .order_by(desc(QuizAttempt.created_at))
    ).all()

    results = []
    for att in attempts:
        raw_review = json.loads(att.answers) if att.answers else []
        review_models = [QuestionReview(**r) for r in raw_review]
        results.append(
            QuizAttemptResponse(
                id=att.id,
                quiz_id=att.quiz_id,
                score=att.score,
                total_questions=att.total_questions,
                percentage=att.percentage,
                time_taken_seconds=att.time_taken_seconds,
                created_at=att.created_at,
                review=review_models,
            )
        )

    return results


@router.delete(
    "/{quiz_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_quiz(
    quiz_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    """
    Delete a quiz and its associated attempts.
    """
    quiz = db.scalar(
        select(Quiz).where(
            Quiz.id == quiz_id,
            Quiz.user_id == current_user.id,
        )
    )
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found.",
        )

    db.delete(quiz)
    db.commit()
    return None
