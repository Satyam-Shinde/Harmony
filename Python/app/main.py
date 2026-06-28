from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import summarizer, quiz, scheduler
from app.db.database import init_db

app = FastAPI(title="StudyAI Python Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

app.include_router(summarizer.router, prefix="/api/summarize", tags=["Summarizer"])
app.include_router(quiz.router,       prefix="/api/quiz",      tags=["Quiz"])
app.include_router(scheduler.router,  prefix="/api/schedule",  tags=["Scheduler"])


@app.get("/")
def root():
    return {"status": "StudyAI Python service is running"}
