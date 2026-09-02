from pathlib import Path

import whisper


class WhisperProcessingError(Exception):
    """
    Raised when speech-to-text processing fails.
    """


_model: whisper.Whisper | None = None


def get_whisper_model() -> whisper.Whisper:
    """
    Lazily load the Whisper Tiny model.

    The model is loaded only when transcription is first
    requested, rather than when FastAPI starts.
    """

    global _model

    if _model is None:
        try:
            _model = whisper.load_model(
                "tiny",
                device="cpu",
            )
        except Exception as exc:
            raise WhisperProcessingError(
                "Unable to initialize the Whisper model."
            ) from exc

    return _model


def transcribe_audio(
    file_path: Path,
) -> str:
    """
    Transcribe an audio file using Whisper Tiny.
    """

    if not file_path.exists():
        raise WhisperProcessingError(
            "Audio file not found."
        )

    try:
        model = get_whisper_model()

        result = model.transcribe(
            str(file_path),
            fp16=False,
        )

    except Exception as exc:
        raise WhisperProcessingError(
            "Unable to transcribe the audio file."
        ) from exc

    text = result.get(
        "text",
        "",
    )

    return text.strip()


def is_meaningful_transcription(
    text: str,
) -> bool:
    """
    Determine whether transcription produced usable text.
    """

    if not text:
        return False

    return bool(
        " ".join(text.split()).strip()
    )