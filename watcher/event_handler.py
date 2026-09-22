import logging
from pathlib import Path

from watchdog.events import FileSystemEventHandler

from watcher.stability import wait_until_stable


logger = logging.getLogger(__name__)


class PDFEventHandler(FileSystemEventHandler):

    def __init__(self, processor):

        super().__init__()

        self.processor = processor

    def _handle(self, path: str):

        file_path = Path(path)

        if file_path.suffix.lower() != ".pdf":
            return

        logger.info(
            "PDF detected: %s",
            file_path,
        )

        if not wait_until_stable(file_path):

            logger.warning(
                "File did not become stable: %s",
                file_path,
            )

            return

        self.processor(file_path)

    def on_created(self, event):

        if event.is_directory:
            return

        self._handle(event.src_path)

    def on_moved(self, event):

        if event.is_directory:
            return

        self._handle(event.dest_path)