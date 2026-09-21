from pathlib import Path

import fitz


def extract_text(file_path: Path) -> dict:
    """
    Extract text from all pages of a PDF.

    Returns a dictionary containing:
    - page count
    - extracted text
    - character count
    - word count
    """

    file_path = Path(file_path)

    document = fitz.open(file_path)

    pages = []
    full_text_parts = []

    for page_number, page in enumerate(document, start=1):

        text = page.get_text("text")

        pages.append(
            {
                "page_number": page_number,
                "text": text,
                "characters": len(text),
                "words": len(text.split()),
            }
        )

        full_text_parts.append(text)

    document.close()

    full_text = "\n".join(full_text_parts)

    return {
        "page_count": len(pages),
        "text": full_text,
        "characters": len(full_text),
        "words": len(full_text.split()),
        "pages": pages,
    }