from typing import Any

import requests

from app.core.config import settings


class OllamaProcessingError(Exception):
    """Raised when Ollama cannot process an AI request."""


def generate_response(
    prompt: str,
    system_prompt: str | None = None,
    as_json: bool = False,
    timeout: int = 120,
) -> str:
    """
    Generate a response using the configured Ollama model.
    """

    if not prompt.strip():
        raise OllamaProcessingError("Prompt cannot be empty.")

    payload: dict[str, Any] = {
        "model": settings.ollama_model,
        "prompt": prompt,
        "stream": False,
    }

    if system_prompt:
        payload["system"] = system_prompt

    if as_json:
        payload["format"] = "json"

    try:
        response = requests.post(
            f"{settings.ollama_base_url}/api/generate",
            json=payload,
            timeout=timeout,
        )
        response.raise_for_status()

    except requests.RequestException as exc:
        raise OllamaProcessingError("Unable to connect to Ollama.") from exc

    try:
        data = response.json()
    except ValueError as exc:
        raise OllamaProcessingError(
            "Ollama returned an invalid response."
        ) from exc

    generated_text = data.get("response", "")

    if not isinstance(generated_text, str):
        raise OllamaProcessingError("Ollama returned an invalid response.")

    generated_text = generated_text.strip()

    if not generated_text:
        raise OllamaProcessingError("Ollama returned an empty response.")

    return generated_text


def generate_chat_response(
    messages: list[dict[str, str]],
    system_prompt: str | None = None,
    timeout: int = 120,
) -> str:
    """
    Generate a multi-turn conversational response using Ollama /api/chat.
    """

    if not messages:
        raise OllamaProcessingError("Chat messages cannot be empty.")

    chat_messages = []
    if system_prompt:
        chat_messages.append({"role": "system", "content": system_prompt})

    for msg in messages:
        role = msg.get("role", "user")
        content = msg.get("content", "")
        if content.strip():
            chat_messages.append({"role": role, "content": content})

    payload: dict[str, Any] = {
        "model": settings.ollama_model,
        "messages": chat_messages,
        "stream": False,
    }

    try:
        response = requests.post(
            f"{settings.ollama_base_url}/api/chat",
            json=payload,
            timeout=timeout,
        )
        response.raise_for_status()

    except requests.RequestException as exc:
        raise OllamaProcessingError("Unable to connect to Ollama.") from exc

    try:
        data = response.json()
    except ValueError as exc:
        raise OllamaProcessingError(
            "Ollama returned an invalid response."
        ) from exc

    message_data = data.get("message", {})
    content = message_data.get("content", "")

    if not isinstance(content, str) or not content.strip():
        raise OllamaProcessingError("Ollama returned an empty response.")

    return content.strip()