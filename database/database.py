import sqlite3
from pathlib import Path


class Database:

    def __init__(self, database_path: Path):

        self.database_path = database_path

        self.database_path.parent.mkdir(
            parents=True,
            exist_ok=True,
        )

        self._initialize()

    def _connect(self):
        return sqlite3.connect(self.database_path)

    def _initialize(self):

        with self._connect() as connection:

            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS documents (
                    document_id TEXT PRIMARY KEY,
                    file_name TEXT NOT NULL,
                    file_path TEXT NOT NULL,
                    file_hash TEXT UNIQUE NOT NULL,
                    status TEXT NOT NULL,
                    created_at TEXT NOT NULL
                )
                """
            )

            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS chunks (
                    chunk_id TEXT PRIMARY KEY,
                    document_id TEXT NOT NULL,
                    text TEXT NOT NULL,
                    chunk_index INTEGER NOT NULL,
                    page_start INTEGER,
                    page_end INTEGER,
                    metadata TEXT,
                    FOREIGN KEY(document_id)
                        REFERENCES documents(document_id)
                )
                """
            )

            connection.commit()

    def document_exists(self, file_hash: str) -> bool:

        with self._connect() as connection:

            result = connection.execute(
                """
                SELECT 1
                FROM documents
                WHERE file_hash = ?
                LIMIT 1
                """,
                (file_hash,),
            ).fetchone()

            return result is not None

    def save_document(
        self,
        document_id: str,
        file_name: str,
        file_path: str,
        file_hash: str,
        status: str,
        created_at: str,
    ):

        with self._connect() as connection:

            connection.execute(
                """
                INSERT OR IGNORE INTO documents
                (
                    document_id,
                    file_name,
                    file_path,
                    file_hash,
                    status,
                    created_at
                )
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (
                    document_id,
                    file_name,
                    file_path,
                    file_hash,
                    status,
                    created_at,
                ),
            )

            connection.commit()