from pathlib import Path
import pymupdf


def validate_pdf(file_path: Path) -> bool:
    """Validate whether the file is a readable PDF."""

    file_path = Path(file_path)

    if not file_path.exists():
        print("[PDF VALIDATOR] File does not exist.")
        return False

    if file_path.suffix.lower() != ".pdf":
        print("[PDF VALIDATOR] Not a PDF file.")
        return False

    try:
        document = pymupdf.open(str(file_path))

        page_count = document.page_count

        document.close()

        if page_count == 0:
            print("[PDF VALIDATOR] PDF contains no pages.")
            return False

        print(
            f"[PDF VALIDATOR] Valid PDF "
            f"with {page_count} page(s)."
        )

        return True

    except Exception as error:
        print(
            f"[PDF VALIDATOR] Invalid or unreadable PDF: "
            f"{error}"
        )

        return False