import time
from pathlib import Path

from config.settings import (
    STABILITY_CHECK_INTERVAL,
    STABILITY_CHECKS,
)


def wait_until_stable(
    file_path: Path,
    interval: float = STABILITY_CHECK_INTERVAL,
    required_checks: int = STABILITY_CHECKS,
) -> bool:

    if not file_path.exists():
        return False

    previous_state = None
    stable_count = 0

    while stable_count < required_checks:

        if not file_path.exists():
            return False

        stat = file_path.stat()

        current_state = (
            stat.st_size,
            stat.st_mtime_ns,
        )

        if current_state == previous_state:
            stable_count += 1
        else:
            stable_count = 0

        previous_state = current_state

        time.sleep(interval)

    return True