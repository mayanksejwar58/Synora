from pathlib import Path

from core.hashing import calculate_sha256


class Deduplicator:

    def __init__(self):
        self.processed_hashes: set[str] = set()

    def is_duplicate(self, file_path: Path) -> bool:
        file_hash = calculate_sha256(file_path)

        if file_hash in self.processed_hashes:
            return True

        self.processed_hashes.add(file_hash)

        return False