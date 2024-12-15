from math import floor


def get_duration_in_minutes_and_seconds(duration_in_ms: int) -> str:

    min: int = floor(duration_in_ms / 60000)
    sec: int = floor((duration_in_ms % 60000) / 1000)

    return str(min + 1) + ":00" if sec == 60 else str(min) + ":" + ("0" if sec < 10 else "") + str(sec)
