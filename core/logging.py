import logging
from pathlib import Path


def setup_logging(log_directory: Path) -> None:
    log_directory.mkdir(parents=True, exist_ok=True)

    log_file = log_directory / "synora.log"

    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
        handlers=[
            logging.FileHandler(log_file, encoding="utf-8"),
            logging.StreamHandler(),
        ],
    )