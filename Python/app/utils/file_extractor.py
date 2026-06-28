from PyPDF2 import PdfReader
from docx import Document


def extract_text_from_pdf(file) -> str:
    reader = PdfReader(file)
    return "".join(page.extract_text() or "" for page in reader.pages).strip()


def extract_text_from_docx(file) -> str:
    doc = Document(file)
    return "\n".join(p.text for p in doc.paragraphs).strip()
