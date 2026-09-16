from typing import Any

import requests

from app.core.config import settings


class OllamaProcessingError(Exception):
    """Raised when Ollama cannot process an AI request."""


def generate_response(
    prompt: str,
    system_prompt: str | None = None,
) -> str:
    """
    Generate a response using the configured Ollama model.
    """

    if not prompt.strip():
        raise OllamaProcessingError(
            "Prompt cannot be empty."
        )

    payload: dict[str, Any] = {
        "model": settings.ollama_model,
        "prompt": prompt,
        "stream": False,
    }

    if system_prompt:
        payload["system"] = system_prompt

    try:
        response = requests.post(
            f"{settings.ollama_base_url}/api/generate",
            json=payload,
            timeout=120,
        )
        response.raise_for_status()

    except requests.RequestException as exc:
        raise OllamaProcessingError(
            "Unable to connect to Ollama."
        ) from exc

    try:
        data = response.json()
    except ValueError as exc:
        raise OllamaProcessingError(
            "Ollama returned an invalid response."
        ) from exc

    generated_text = data.get("response", "")

    if not isinstance(generated_text, str):
        raise OllamaProcessingError(
            "Ollama returned an invalid response."
        )

    generated_text = generated_text.strip()

    if not generated_text:
        raise OllamaProcessingError(
            "Ollama returned an empty response."
        )

    return generated_text