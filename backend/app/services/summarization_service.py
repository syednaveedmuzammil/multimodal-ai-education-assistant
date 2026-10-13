from app.services.ollama_service import generate_response

SUMMARY_SYSTEM_PROMPT = """
You are LearnMate AI, an expert educational content summarizer.
Your task is to summarize educational material clearly, accurately, and concisely for students.

Format your summary in clean Markdown with:
1. **Overview**: A 2-3 sentence core summary of the material.
2. **Key Concepts & Definitions**: Important terms and formulas.
3. **Core Takeaways**: Bullet points highlighting crucial facts for exams.
4. **Summary**: A cohesive paragraph explaining the progression of ideas.

Keep language student-friendly, factual, and strictly grounded in the provided text.
"""


def summarize_text(text: str) -> str:
    """
    Generate a concise educational summary from text.
    """

    if not text or not text.strip():
        raise ValueError("No text is available to summarize.")

    # Truncate to reasonable context window for phi3:mini
    truncated = text[:7000].strip()

    prompt = f"""
Summarize the following educational content according to the requested format.

CONTENT START
\"\"\"
{truncated}
\"\"\"
CONTENT END
"""

    return generate_response(
        prompt=prompt,
        system_prompt=SUMMARY_SYSTEM_PROMPT,
        timeout=120,
    )