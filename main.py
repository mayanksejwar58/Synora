import logging
import time

from config.settings import (
    WATCHED_FOLDER,
    DATABASE_PATH,
    LOG_DIR,
    ensure_directories,
)

from core.logging import setup_logging

from database.database import Database

from ingestion.pipeline import IngestionPipeline

from watcher.pdf_watcher import PDFWatcher


def main():

    ensure_directories()

    setup_logging(LOG_DIR)

    logger = logging.getLogger(__name__)

    logger.info("Starting Synora...")

    database = Database(
        DATABASE_PATH
    )

    pipeline = IngestionPipeline(
        database
    )

    watcher = PDFWatcher(
        watched_folder=WATCHED_FOLDER,
        processor=pipeline.process,
    )

    watcher.start()

    logger.info(
        "Synora is watching: %s",
        WATCHED_FOLDER,
    )

    try:

        while True:
            time.sleep(1)

    except KeyboardInterrupt:

        logger.info(
            "Shutdown requested."
        )

    finally:

        watcher.stop()

        logger.info(
            "Synora stopped."
        )


if __name__ == "__main__":
    main()