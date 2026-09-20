from pathlib import Path
from watchdog.events import FileSystemEventHandler
from watchdog.observers import Observer
import time

class PDFWatcherHandler(FileSystemEventHandler):
  """Handles filesystem events for the watch folder."""

  def on_any_event(self, event):
    """Called when a new filesystem object is created."""
    #ignore-directory
    if event.is_directory:
      return
    file_path=Path(event.src_path)

    if file_path.suffix.lower() !=".pdf":
      return

    print("\n[PDF Watcher]")
    print("New PDF detected: ")
    print(file_path.name)

class PDFWatcher:
  """Monitors a folder for newly created pdf files."""

  def __init__(self,folder:Path):
    self.folder=Path(folder)

    self.handler=PDFWatcherHandler()
    self.observer=Observer()

  def start(self):
    """Start watching the configured folder."""

    self.folder.mkdir(parents=True,exist_ok=True)

    self.observer.schedule(
      self.handler,
      str(self.folder),
      recursive=False,
    )

    self.observer.start()

    print("[PDF Watcher]")
    print(f"Watching folder: ")
    print(self.folder)
    print("\nWaiting for new PDFs....\n")

  def stop(self):
    """Stopn the filesystem ."""
    self.observer.stop()
    self.observer.join()

  def run(self):
    """Keep the watcher running until interrupted."""

    self.start()

    try:
      while True:
        time.sleep(1)

    except KeyboardInterrupt:
      print("n[PDf Watche")
      print("Stopping wathcher")
      self.stop()