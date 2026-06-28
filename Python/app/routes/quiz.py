from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List

from app.services.quiz_service import generate_quiz_from_context

router = APIRouter()


class QuizRequest(BaseModel):
    subject:       str = Field(..., min_length=1)
    difficulty:    str                          # easy | medium | hard
    num_questions: int = Field(5, ge=1, le=20)
    context:       str = Field("", min_length=0)


class Question(BaseModel):
    question:     str
    options:      List[str]
    correctIndex: int


class QuizResponse(BaseModel):
    questions: List[Question]


@router.post("/generate", response_model=QuizResponse)
def generate_quiz(payload: QuizRequest):
    if payload.difficulty not in ("easy", "medium", "hard"):
        raise HTTPException(400, "difficulty must be easy | medium | hard")
    if not payload.context or len(payload.context.strip()) < 80:
        raise HTTPException(400, "Context is too short or missing.")
    try:
        questions = generate_quiz_from_context(
            subject=payload.subject,
            difficulty=payload.difficulty,
            num_questions=payload.num_questions,
            context=payload.context,
        )
        return {"questions": questions}
    except Exception as e:
        raise HTTPException(500, str(e))
