import random
import re
from typing import List, Dict


def _clean_text(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip())


def _split_sentences(text: str) -> List[str]:
    sentences = re.split(r"(?<=[.!?])\s+", text)
    return [s.strip() for s in sentences if len(s.strip()) >= 30]


def _make_question(sentence: str, subject: str, difficulty: str) -> Dict | None:
    words      = sentence.split()
    candidates = [w for w in words if len(w) >= 5 and w.isalpha()]
    if not candidates:
        return None

    correct = random.choice(candidates)
    blank   = sentence.replace(correct, "_____", 1)

    prompts = {
        "easy":   f"In {subject}, fill in the blank:",
        "medium": f"Choose the correct term for {subject}:",
        "hard":   f"Select the most accurate option for {subject}:",
    }
    question = f"{prompts.get(difficulty, prompts['medium'])}\n{blank}"

    generic = [
        "allocation", "synchronization", "compiler", "deadlock", "scheduling",
        "inheritance", "polymorphism", "encryption", "recursion", "cache",
    ]
    distractors = {w for w in candidates if w.lower() != correct.lower()}
    distractors.update(generic)
    distractors = list(distractors)
    random.shuffle(distractors)
    wrong = distractors[:3]
    while len(wrong) < 3:
        wrong.append(f"Option{len(wrong)+1}")

    options = wrong + [correct]
    random.shuffle(options)
    return {
        "question":     question,
        "options":      options,
        "correctIndex": options.index(correct),
    }


def generate_quiz_from_context(
    subject: str,
    difficulty: str,
    num_questions: int,
    context: str,
) -> List[Dict]:
    context   = _clean_text(context)
    if not context or len(context) < 80:
        raise ValueError("Context is too short.")

    sentences = _split_sentences(context)
    if not sentences:
        raise ValueError("Could not extract sentences from context.")

    random.shuffle(sentences)
    questions, seen = [], set()

    for s in sentences:
        q = _make_question(s, subject, difficulty)
        if not q or q["question"] in seen:
            continue
        seen.add(q["question"])
        questions.append(q)
        if len(questions) >= num_questions:
            break

    if not questions:
        raise ValueError("Quiz generation failed — try a different context.")

    return questions
