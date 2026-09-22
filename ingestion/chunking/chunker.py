from core.models import DocumentChunk
from config.settings import CHUNK_SIZE, CHUNK_OVERLAP


class DocumentChunker:

    def __init__(
        self,
        chunk_size: int = CHUNK_SIZE,
        chunk_overlap: int = CHUNK_OVERLAP,
    ):
        if chunk_overlap >= chunk_size:
            raise ValueError(
                "chunk_overlap must be smaller than chunk_size"
            )

        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def chunk_pages(
        self,
        document_id: str,
        pages: list[dict],
        source_file: str,
    ) -> list[DocumentChunk]:

        chunks = []

        chunk_index = 0

        for page in pages:

            text = page["text"].strip()

            if not text:
                continue

            start = 0

            while start < len(text):

                end = start + self.chunk_size

                chunk_text = text[start:end].strip()

                if chunk_text:

                    chunk_id = (
                        f"{document_id}_"
                        f"chunk_{chunk_index}"
                    )

                    chunks.append(
                        DocumentChunk(
                            chunk_id=chunk_id,
                            document_id=document_id,
                            text=chunk_text,
                            chunk_index=chunk_index,
                            page_start=page["page"],
                            page_end=page["page"],
                            metadata={
                                "source": source_file,
                                "page": page["page"],
                            },
                        )
                    )

                    chunk_index += 1

                start = end - self.chunk_overlap

        return chunks