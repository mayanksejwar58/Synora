from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path


@dataclass
class Document:
    document_id: str
    file_path: Path
    file_name: str
    file_hash: str
    created_at: datetime
    status: str = "discovered"


@dataclass
class DocumentChunk:
    chunk_id: str
    document_id: str
    text: str
    chunk_index: int
    page_start: int | None = None
    page_end: int | None = None
    metadata: dict = field(default_factory=dict)