from pathlib import Path


IMPORTANT_KEYWORDS = {
    "exam": "Exam-related information detected",
    "examination": "Examination-related information detected",
    "deadline": "Deadline mentioned",
    "last date": "Last date mentioned",
    "registration": "Registration information detected",
    "submit": "Submission requirement detected",
    "submission": "Submission requirement detected",
    "fee": "Fee/payment information detected",
    "payment": "Payment information detected",
    "warning": "Warning detected",
    "important": "Important notice detected",
    "notice": "Official notice detected",
    "interview": "Interview information detected",
    "appointment": "Appointment information detected",
    "event": "Event information detected",
}


def generate_insights(
    file_path: Path,
    extracted_data: dict,
) -> dict:
    """
    Generate basic rule-based insights from extracted PDF text.

    This is NOT AI analysis.
    """

    text = extracted_data["text"]

    lower_text = text.lower()

    detected_topics = []

    for keyword, description in IMPORTANT_KEYWORDS.items():

        if keyword in lower_text:

            if description not in detected_topics:
                detected_topics.append(description)

    preview = text.strip()

    if len(preview) > 500:
        preview = preview[:500] + "..."

    return {
        "file_name": file_path.name,
        "page_count": extracted_data["page_count"],
        "characters": extracted_data["characters"],
        "words": extracted_data["words"],
        "detected_topics": detected_topics,
        "preview": preview,
    }