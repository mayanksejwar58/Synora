from pathlib import Path
import os
from dotenv import load_dotenv

load_dotenv()

PROJECT_ROOT = Path(__file__).resolve().parent.parent

DATA_DIR = PROJECT_ROOT / "data"

DATABASE_DIR = DATA_DIR / "database"
VECTORSTORE_DIR = DATA_DIR / "vectorstore"
CACHE_DIR = DATA_DIR / "cache"
LOG_DIR = DATA_DIR / "logs"

WATCHED_FOLDER = Path(
    os.getenv(
        "SYNORA_WATCHED_FOLDER",
        str(Path.home() / "Downloads" / "ImportantPDFs")
    )
)

DATABASE_PATH = DATABASE_DIR / "synora.db"

CHUNK_SIZE = int(os.getenv("SYNORA_CHUNK_SIZE", "1000"))
CHUNK_OVERLAP = int(os.getenv("SYNORA_CHUNK_OVERLAP", "150"))

STABILITY_CHECK_INTERVAL = float(
    os.getenv("SYNORA_STABILITY_INTERVAL", "1.0")
)

STABILITY_CHECKS = int(
    os.getenv("SYNORA_STABILITY_CHECKS", "2")
)


def ensure_directories() -> None:
    """Create Synora's required local directories."""
    for directory in [
        DATA_DIR,
        DATABASE_DIR,
        VECTORSTORE_DIR,
        CACHE_DIR,
        LOG_DIR,
        WATCHED_FOLDER,
    ]:
        directory.mkdir(parents=True, exist_ok=True)