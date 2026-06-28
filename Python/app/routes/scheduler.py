from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date

router = APIRouter()


class Subject(BaseModel):
    name:         str = Field(..., min_length=1)
    marks:        int = Field(..., ge=0,  le=100)
    commandLevel: int = Field(..., ge=1,  le=5)
    recentScore:  Optional[float] = Field(None, ge=0, le=100)   # NEW: quiz score %


class ScheduleRequest(BaseModel):
    subjects:    List[Subject]
    hoursPerDay: int = Field(4, ge=1, le=12)


class Task(BaseModel):
    subject:          str
    topic:            str
    duration_minutes: int


class ScheduleResponse(BaseModel):
    date:  str
    tasks: List[Task]


@router.post("/", response_model=ScheduleResponse)
def generate_schedule(payload: ScheduleRequest):
    if not payload.subjects:
        raise HTTPException(400, "No subjects provided.")

    priorities = []
    for s in payload.subjects:
        # Base priority: low marks + low command = higher priority
        base = (100 - s.marks) + (5 - s.commandLevel) * 10

        # Quiz score penalty: poor recent score boosts priority further
        # If recentScore is None (no quiz done), neutral boost of 0
        if s.recentScore is not None:
            # Score 0% → +30 boost  |  Score 100% → 0 boost
            score_boost = (1 - s.recentScore / 100) * 30
        else:
            score_boost = 10  # slight nudge when no data yet

        priority = base + score_boost
        priorities.append((s, priority))

    total = sum(p for _, p in priorities)
    if total == 0:
        raise HTTPException(400, "Cannot calculate schedule from provided data.")

    tasks = []
    for subject, priority in priorities:
        allocated_minutes = int((priority / total) * payload.hoursPerDay * 60)
        # Minimum 10 minutes per subject
        allocated_minutes = max(10, allocated_minutes)
        tasks.append({
            "subject":          subject.name,
            "topic":            "Revision / Practice Session",
            "duration_minutes": allocated_minutes,
        })

    return {"date": str(date.today()), "tasks": tasks}
