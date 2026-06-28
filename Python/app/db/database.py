import sqlite3
from datetime import datetime
from pathlib import Path

DB_PATH = Path("summaries.db")


def get_connection():
    return sqlite3.connect(DB_PATH, check_same_thread=False)


def init_db():
    conn = get_connection()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS summaries (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            original_text TEXT NOT NULL,
            summary       TEXT NOT NULL,
            created_at    TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()


def save_summary(original_text: str, summary: str):
    conn = get_connection()
    conn.execute(
        "INSERT INTO summaries (original_text, summary, created_at) VALUES (?,?,?)",
        (original_text, summary, datetime.utcnow().isoformat()),
    )
    conn.commit()
    conn.close()


def fetch_all_summaries():
    conn = get_connection()
    rows = conn.execute(
        "SELECT id, summary, created_at FROM summaries ORDER BY id DESC"
    ).fetchall()
    conn.close()
    return [{"id": r[0], "summary": r[1], "created_at": r[2]} for r in rows]
