from app.schemas.chords import ChordsSchema
from app.services.chords.chords import get_chords


def get_chords_by_key(key: str) -> ChordsSchema:
    """Get chords by key."""

    chords: list[tuple[str, str, str, str]] = get_chords(key)

    return ChordsSchema(
        chords=list(map(lambda chord: chord[3], chords)),
        key=key,
    )
