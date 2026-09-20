from config.settings import WATCHED_FOLDER
from watcher.pdf_watcher import PDFWatcher

def main():
  watcher=PDFWatcher(WATCHED_FOLDER)
  watcher.run()

if __name__ =="__main__":
  main()