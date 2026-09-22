import logging
from datetime import datetime
from pathlib import Path
from uuid import uuid4

from core.hashing import calculate_sha256
from core.models import Document
from ingestion.validator import validate_pdf
from ingestion.extraction.pdf_extractor import extract_pdf_text
from ingestion.extraction.text_cleaner import clean_text
from ingestion.chunking.chunker import DocumentChunker
from database.database import Database


logger = logging.getLogger(__name__)


class IngestionPipeline:

    def __init__(self, database: Database):

        self.database = database
        self.chunker = DocumentChunker()

    def process(self, file_path: Path):

        logger.info(
            "Starting ingestion: %s",
            file_path.name,
        )

        file_hash = calculate_sha256(file_path)

        if self.database.document_exists(file_hash):

            logger.info(
                "Duplicate document skipped: %s",
                file_path.name,
            )

            return

        if not validate_pdf(file_path):

            logger.error(
                "Invalid PDF: %s",
                file_path,
            )

            return

        document_id = uuid4().hex

        document = Document(
            document_id=document_id,
            file_path=file_path,
            file_name=file_path.name,
            file_hash=file_hash,
            created_at=datetime.now(),
            status="processing",
        )

        self.database.save_document(
            document_id=document.document_id,
            file_name=document.file_name,
            file_path=str(document.file_path),
            file_hash=document.file_hash,
            status=document.status,
            created_at=document.created_at.isoformat(),
        )

        pages = extract_pdf_text(file_path)

        cleaned_pages = []

        for page in pages:

            cleaned = clean_text(page["text"])

            if cleaned:

                cleaned_pages.append(
                    {
                        "page": page["page"],
                        "text": cleaned,
                    }
                )

        chunks = self.chunker.chunk_pages(
            document_id=document_id,
            pages=cleaned_pages,
            source_file=file_path.name,
        )

        logger.info(
            "Document processed: %s | chunks=%d",
            file_path.name,
            len(chunks),
        )

        for chunk in chunks:

            logger.info(
                "Chunk %s | page=%s | chars=%d",
                chunk.chunk_id,
                chunk.page_start,
                len(chunk.text),
            )

        return {
            "document": document,
            "chunks": chunks,
        }