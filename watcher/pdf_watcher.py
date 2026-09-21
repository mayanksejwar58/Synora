import time
from pathlib import Path

from watchdog.events import FileSystemEventHandler
from watchdog.observers import Observer

from processor.pdf_extractor import extract_text
from processor.pdf_insights import generate_insights
from processor.pdf_validator import validate_pdf
from watcher.file_stability import wait_for_file_stability


class PDFWatcherHandler(FileSystemEventHandler):
    """Handles filesystem events for the watched folder."""

    def on_created(self, event):

        if event.is_directory:
            return

        file_path = Path(event.src_path)

        if file_path.suffix.lower() != ".pdf":
            return

        print("\n" + "=" * 60)
        print("[PDF WATCHER]")
        print(f"New PDF detected: {file_path.name}")
        print("=" * 60)

        # --------------------------------------------------
        # STEP 1: WAIT FOR FILE STABILITY
        # --------------------------------------------------

        stable = wait_for_file_stability(file_path)

        if not stable:
            print("[PDF WATCHER] File was not stable.")
            return

        # --------------------------------------------------
        # STEP 2: VALIDATE PDF
        # --------------------------------------------------

        print("\n[PROCESSOR]")
        print("Validating PDF...")

        valid = validate_pdf(file_path)

        if not valid:
            print("[PROCESSOR] PDF validation failed.")
            return

        # --------------------------------------------------
        # STEP 3: EXTRACT TEXT
        # --------------------------------------------------

        print("\n[PROCESSOR]")
        print("Extracting text...")

        try:

            extracted_data = extract_text(file_path)

        except Exception as error:

            print(
                f"[PROCESSOR] Text extraction failed: {error}"
            )

            return

        # --------------------------------------------------
        # STEP 4: GENERATE BASIC INSIGHTS
        # --------------------------------------------------

        print("\n[INSIGHTS]")
        print("Analyzing extracted text...")

        insights = generate_insights(
            file_path,
            extracted_data,
        )

        # --------------------------------------------------
        # STEP 5: DISPLAY RESULTS
        # --------------------------------------------------

        print("\n" + "=" * 60)
        print("[PDF INSIGHTS]")
        print("=" * 60)

        print(f"File: {insights['file_name']}")
        print(f"Pages: {insights['page_count']}")
        print(f"Characters: {insights['characters']}")
        print(f"Words: {insights['words']}")

        print("\nDetected topics:")

        if insights["detected_topics"]:

            for topic in insights["detected_topics"]:
                print(f"  • {topic}")

        else:

            print("  No predefined important topics detected.")

        print("\nText preview:")
        print("-" * 60)
        print(insights["preview"])
        print("-" * 60)

        print("\n[PROCESSING COMPLETE]")


class PDFWatcher:
    """Monitors a folder for newly created PDF files."""

    def __init__(self, folder: Path):

        self.folder = Path(folder)

        self.handler = PDFWatcherHandler()
        self.observer = Observer()

    def start(self):

        self.folder.mkdir(
            parents=True,
            exist_ok=True,
        )

        self.observer.schedule(
            self.handler,
            str(self.folder),
            recursive=False,
        )

        self.observer.start()

        print("=" * 60)
        print("[PDF WATCHER]")
        print("Watcher started.")
        print()
        print(f"Watching folder:")
        print(self.folder)
        print()
        print("Waiting for new PDFs...")
        print("=" * 60)

    def stop(self):

        self.observer.stop()
        self.observer.join()

    def run(self):

        self.start()

        try:

            while True:
                time.sleep(1)

        except KeyboardInterrupt:

            print("\n[PDF WATCHER]")
            print("Stopping watcher...")

            self.stop()