import time
from pathlib import Path
from config.settings import(
    STABILITY_CHECK_INTERVAL,
    STABILITY_CHECKS,
)


def wait_for_file_stability(
    file_path: Path,
    check_interval: float = STABILITY_CHECK_INTERVAL,
    stable_checks: int = STABILITY_CHECKS,
) -> bool:

    if not file_path.exists():
        return False

    previous_state=None
    stable_count=0

    while stable_count<stable_checks:
        if not file_path.exists():
            return False
        
        stat=file_path.stat()
        current_state=(
            stat.st_size,
            stat.st_mtime_ns,
        )

        if current_state==previous_state:
            stable_count +=1
        else:
            stable_count = 0

        previous_state=current_state

        time.sleep(check_interval)

    return True