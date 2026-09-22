import logging
from pathlib import Path

from watchdog.observers import Observer

from watcher.event_handler import PDFEventHandler


logger = logging.getLogger(__name__)


class PDFWatcher:

    def __init__(
        self,
        watched_folder: Path,
        processor,
    ):

        self.watched_folder = watched_folder
        self.processor = processor

        self.observer = Observer()

    def start(self):

        self.watched_folder.mkdir(
            parents=True,
            exist_ok=True,
        )

        handler = PDFEventHandler(
            self.processor
        )

        self.observer.schedule(
            handler,
            str(self.watched_folder),
            recursive=False,
        )

        self.observer.start()

        logger.info(
            "Watching folder: %s",
            self.watched_folder,
        )

    def stop(self):

        self.observer.stop()
        self.observer.join()

        logger.info(
            "PDF watcher stopped."
        )