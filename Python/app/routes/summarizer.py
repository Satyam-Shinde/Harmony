from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel, Field
from typing import Optional

from app.services.summarization_service import summarize_text_service
from app.db.database import save_summary, fetch_all_summaries
from app.utils.file_extractor import extract_text_from_pdf, extract_text_from_docx

router = APIRouter()

SUPPORTED_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
}


class SummarizeRequest(BaseModel):
    text:       str           = Field(..., min_length=50)
    max_length: Optional[int] = Field(150, ge=50,  le=300)
    min_length: Optional[int] = Field(40,  ge=20,  le=100)


@router.post("/")
async def summarize_text(payload: SummarizeRequest):
    if len(payload.text) > 20_000:
        raise HTTPException(413, "Input text too long.")
    try:
        summary = summarize_text_service(
            payload.text.strip(),
            max_length=payload.max_length,
            min_length=payload.min_length,
        )
        save_summary(payload.text, summary)
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(500, f"Summarization failed: {e}")


@router.post("/file")
async def summarize_file(file: UploadFile = File(...)):
    if file.content_type not in SUPPORTED_TYPES:
        raise HTTPException(400, "Unsupported file type. Use PDF, DOCX, or TXT.")
    try:
        if file.content_type == "application/pdf":
            text = extract_text_from_pdf(file.file)
        elif "wordprocessingml" in (file.content_type or ""):
            text = extract_text_from_docx(file.file)
        else:
            text = (await file.read()).decode("utf-8")

        text = text.strip()
        if len(text) < 50:
            raise HTTPException(400, "File has insufficient readable text.")
        if len(text) > 20_000:
            raise HTTPException(413, "File content too large.")

        summary = summarize_text_service(text)
        save_summary(text, summary)
        return {"summary": summary}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"File summarization failed: {e}")


@router.get("/history")
def get_history():
    return fetch_all_summaries()
