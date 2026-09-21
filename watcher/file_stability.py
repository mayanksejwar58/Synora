import time
from pathlib import Path


def wait_for_file_stability(
    file_path: Path,
    check_interval: float = 1.0,
    stable_checks: int = 3,
    timeout: float = 120.0,
) -> bool:
    """
    Wait until a file's size remains unchanged for a number of checks.

    Returns:
        True  -> file became stable
        False -> timeout occurred
    """

    file_path = Path(file_path)

    start_time = time.time()

    previous_size = -1
    stable_count = 0

    print(f"[STABILITY] Waiting for file to finish loading:")
    print(f"[STABILITY] {file_path.name}")

    while True:

        if not file_path.exists():
            print("[STABILITY] File disappeared.")
            return False

        current_size = file_path.stat().st_size

        print(
            f"[STABILITY] Size: "
            f"{current_size / (1024 * 1024):.2f} MB"
        )

        if current_size == previous_size and current_size > 0:
            stable_count += 1

            print(
                f"[STABILITY] Stable check "
                f"{stable_count}/{stable_checks}"
            )

        else:
            stable_count = 0

        if stable_count >= stable_checks:
            print("[STABILITY] File is stable.")
            return True

        previous_size = current_size

        if time.time() - start_time > timeout:
            print("[STABILITY] Timeout reached.")
            return False

        time.sleep(check_interval)