from pathlib import Path

import fitz
from docx import Document


TEXT_EXTENSIONS = {
    ".txt",
    ".md",
}

DOCX_EXTENSIONS = {
    ".docx",
}

PDF_EXTENSIONS = {
    ".pdf",
}


class DocumentProcessingError(Exception):
    """
    Raised when a supported document cannot be processed.
    """


def normalize_text(text: str) -> str:
    """
    Normalize extracted text while preserving paragraph structure.
    """

    lines = [
        line.strip()
        for line in text.splitlines()
    ]

    non_empty_lines = [
        line
        for line in lines
        if line
    ]

    return "\n".join(non_empty_lines).strip()

def is_meaningful_pdf_text(
    text: str,
) -> bool:
    """
    Determine whether extracted PDF text contains
    meaningful document content.
    """

    normalized = normalize_text(
        text
    )

    if not normalized:
        return False

    lines = [
        line.strip().lower()
        for line in normalized.splitlines()
        if line.strip()
    ]

    scanner_lines = {
        "scanned by camscanner",
        "scanned by camscanner.com",
    }

    meaningful_lines = [
        line
        for line in lines
        if line not in scanner_lines
    ]

    return bool(meaningful_lines)

def extract_text_file(
    file_path: Path,
) -> tuple[str, int | None]:
    """
    Extract text from TXT or Markdown files.
    """

    try:
        text = file_path.read_text(
            encoding="utf-8",
        )
    except UnicodeDecodeError:
        try:
            text = file_path.read_text(
                encoding="utf-8-sig",
            )
        except UnicodeDecodeError as exc:
            raise DocumentProcessingError(
                "Unable to decode the text file."
            ) from exc
    except OSError as exc:
        raise DocumentProcessingError(
            "Unable to read the text file."
        ) from exc

    return normalize_text(text), None


def extract_docx_text(
    file_path: Path,
) -> tuple[str, int | None]:
    """
    Extract paragraph text from a DOCX document.
    """

    try:
        document = Document(
            str(file_path)
        )
    except Exception as exc:
        raise DocumentProcessingError(
            "Unable to open the DOCX document."
        ) from exc

    paragraphs = [
        paragraph.text.strip()
        for paragraph in document.paragraphs
        if paragraph.text.strip()
    ]

    text = "\n".join(paragraphs)

    return normalize_text(text), None


def extract_pdf_text(
    file_path: Path,
) -> tuple[str, int]:
    """
    Extract text from all pages of a PDF.

    Returns:
        (text, page_count)
    """

    try:
        document = fitz.open(
            str(file_path)
        )
    except Exception as exc:
        raise DocumentProcessingError(
            "Unable to open the PDF document."
        ) from exc

    try:
        page_count = len(document)

        pages = []

        for page in document:
            page_text = page.get_text(
                "text"
            )

            if page_text.strip():
                pages.append(
                    page_text
                )

        text = "\n".join(pages)

    finally:
        document.close()

    normalized_text = normalize_text(
        text
    )

    if not is_meaningful_pdf_text(
        normalized_text
    ):
        normalized_text = ""

    return normalized_text, page_count


def extract_document_text(
    file_path: Path,
) -> tuple[str, int | None]:
    """
    Extract text according to the file extension.

    Supported:
        .txt
        .md
        .docx
        .pdf
    """

    extension = file_path.suffix.lower()

    if extension in TEXT_EXTENSIONS:
        return extract_text_file(
            file_path
        )

    if extension in DOCX_EXTENSIONS:
        return extract_docx_text(
            file_path
        )

    if extension in PDF_EXTENSIONS:
        return extract_pdf_text(
            file_path
        )

    raise DocumentProcessingError(
        f"Unsupported document type: {extension}"
    )


def calculate_text_statistics(
    text: str,
) -> tuple[int, int]:
    """
    Calculate character and word counts.
    """

    character_count = len(text)

    word_count = len(
        text.split()
    )

    return (
        character_count,
        word_count,
    )