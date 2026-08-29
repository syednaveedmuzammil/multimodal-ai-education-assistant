from pathlib import Path

import fitz
import easyocr

class OCRProcessingError(Exception):
    """
    Raised when OCR processing fails.
    """

IMAGE_EXTENSIONS = {
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
}

_reader: easyocr.Reader | None = None


def get_ocr_reader() -> easyocr.Reader:
    """
    Lazily initialize and return the EasyOCR reader.

    The reader is created only when OCR is actually requested,
    rather than when the FastAPI application starts.
    """

    global _reader

    if _reader is None:
        try:
            _reader = easyocr.Reader(
                ["en"],
                gpu=False,
            )
        except Exception as exc:
            raise OCRProcessingError(
                "Unable to initialize the OCR engine."
            ) from exc

    return _reader


def extract_text_from_image(
    file_path: Path,
) -> str:
    """
    Extract text from an image using EasyOCR.
    """

    if not file_path.exists():
        raise OCRProcessingError(
            "Image file not found."
        )

    try:
        reader = get_ocr_reader()

        results = reader.readtext(
            str(file_path),
            detail=1,
            paragraph=False,
        )

    except Exception as exc:
        raise OCRProcessingError(
            "Unable to process the image with OCR."
        ) from exc

    text_parts = []

    for result in results:
        if len(result) < 3:
            continue

        detected_text = result[1]

        if detected_text and detected_text.strip():
            text_parts.append(
                detected_text.strip()
            )

    return "\n".join(text_parts).strip()


def is_meaningful_ocr_text(
    text: str,
) -> bool:
    """
    Determine whether OCR produced usable text.
    """

    if not text:
        return False

    normalized = " ".join(
        text.split()
    ).strip()

    return bool(normalized)

def extract_text_from_scanned_pdf(
    file_path: Path,
) -> tuple[str, int]:
    """
    Render PDF pages as images and run OCR on each page.

    Returns:
        (extracted_text, page_count)
    """

    if not file_path.exists():
        raise OCRProcessingError(
            "PDF file not found."
        )

    try:
        document = fitz.open(
            str(file_path)
        )
    except Exception as exc:
        raise OCRProcessingError(
            "Unable to open the PDF for OCR."
        ) from exc

    try:
        page_count = len(document)

        reader = get_ocr_reader()

        page_texts = []

        for page in document:
            pixmap = page.get_pixmap(
                matrix=fitz.Matrix(
                    2,
                    2,
                ),
                alpha=False,
            )

            image_bytes = pixmap.tobytes(
                "png"
            )

            results = reader.readtext(
                image_bytes,
                detail=1,
                paragraph=False,
            )

            page_parts = []

            for result in results:
                if len(result) < 3:
                    continue

                detected_text = result[1]

                if (
                    detected_text
                    and detected_text.strip()
                ):
                    page_parts.append(
                        detected_text.strip()
                    )

            if page_parts:
                page_texts.append(
                    "\n".join(page_parts)
                )

    except Exception as exc:
        raise OCRProcessingError(
            "Unable to process the scanned PDF with OCR."
        ) from exc

    finally:
        document.close()

    return (
        "\n\n".join(page_texts).strip(),
        page_count,
    )

def extract_text_with_ocr(
    file_path: Path,
) -> tuple[str, int | None]:
    """
    Run OCR according to the file type.

    Supported:
        Images
        Scanned PDFs
    """

    extension = file_path.suffix.lower()

    if extension in IMAGE_EXTENSIONS:
        text = extract_text_from_image(
            file_path
        )

        return text, None

    if extension == ".pdf":
        return extract_text_from_scanned_pdf(
            file_path
        )

    raise OCRProcessingError(
        f"Unsupported OCR file type: {extension}"
    )