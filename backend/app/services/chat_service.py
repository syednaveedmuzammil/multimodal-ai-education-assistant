from app.services.ollama_service import (
    OllamaProcessingError,
    generate_chat_response,
    generate_response,
)

CHAT_SYSTEM_PROMPT = """
You are LearnMate AI, an intelligent, helpful, and encouraging multimodal educational assistant.
Your goal is to help students learn effectively, understand complex topics, solve academic doubts,
and prepare for exams.

Guidelines:
- Explain concepts clearly with intuitive analogies and step-by-step examples.
- When formulas or mathematical concepts are discussed, format them cleanly.
- If the student provides learning notes or document context, ground your answers in that material.
- Maintain an encouraging, positive, and pedagogical tone.
- When appropriate, ask a brief check-for-understanding question at the end to reinforce learning.
"""

EXPLAIN_SYSTEM_PROMPT = """
You are an expert tutor. Your task is to provide clear, engaging, and comprehensive explanations of academic concepts.
Tailor your explanation to the requested depth level:
- "beginner" / "eli5": Use simple everyday language, vivid real-world analogies, and avoid heavy jargon.
- "intermediate": Balanced academic explanation with clear definitions, practical examples, and core mechanisms.
- "advanced": In-depth technical breakdown with formal definitions, edge cases, mathematical/theoretical underpinnings.
- "step-by-step": Logical procedural breakdown numbered from start to finish.
"""


def chat_with_assistant(
    messages: list[dict[str, str]],
    document_context: str | None = None,
) -> str:
    """
    Handle a conversation turn, injecting document context if provided.
    """
    system_prompt = CHAT_SYSTEM_PROMPT

    if document_context and document_context.strip():
        system_prompt += f"""

DOCUMENT CONTEXT PROVIDED BY STUDENT:
\"\"\"
{document_context[:5000]}
\"\"\"
Use this context to accurately answer the student's questions.
"""

    return generate_chat_response(
        messages=messages,
        system_prompt=system_prompt,
        timeout=120,
    )


def explain_concept(
    topic: str,
    level: str = "intermediate",
    context: str | None = None,
) -> str:
    """
    Generate an educational explanation of a specific topic or concept.
    """
    prompt = f"Please explain the concept of: '{topic}' at a '{level}' level."
    if context and context.strip():
        prompt += f"\n\nReference Material:\n{context[:3000]}"

    return generate_response(
        prompt=prompt,
        system_prompt=EXPLAIN_SYSTEM_PROMPT,
        timeout=120,
    )
