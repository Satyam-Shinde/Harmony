from transformers import pipeline
import torch
from typing import List

DEVICE = 0 if torch.cuda.is_available() else -1
print(f"Summarizer running on: {'GPU' if DEVICE == 0 else 'CPU'}")

summarizer = pipeline(
    "summarization",
    model="sshleifer/distilbart-cnn-12-6",
    device=DEVICE,
)

MAX_CHARS = 900


def _chunk_text(text: str, max_chars: int) -> List[str]:
    chunks, start = [], 0
    while start < len(text):
        chunks.append(text[start: start + max_chars])
        start += max_chars
    return chunks


def summarize_text_service(text: str, max_length: int = 150, min_length: int = 40) -> str:
    text = text.strip()
    if not text:
        raise ValueError("Empty text cannot be summarized")

    if len(text) <= MAX_CHARS:
        result = summarizer(text, max_length=max_length, min_length=min_length, do_sample=False)
        return result[0]["summary_text"]

    chunks    = _chunk_text(text, MAX_CHARS)
    summaries = []
    for chunk in chunks:
        r = summarizer(chunk, max_length=max_length, min_length=min_length, do_sample=False)
        summaries.append(r[0]["summary_text"])

    combined = " ".join(summaries)
    final    = summarizer(combined, max_length=max_length, min_length=min_length, do_sample=False)
    return final[0]["summary_text"]
