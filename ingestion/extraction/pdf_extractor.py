from pathlib import Path

import fitz


def extract_pdf_text(file_path: Path) -> list[dict]:

    pages = []

    document = fitz.open(file_path)

    try:
        for page_number, page in enumerate(document, start=1):

            text = page.get_text("text")

            pages.append(
                {
                    "page": page_number,
                    "text": text,
                }
            )

    finally:
        document.close()

    return pages