from app.schemas.chords import ChordsSchema
from app.services.chords.chords import get_chords


def get_chords_by_key(key: str) -> ChordsSchema:
    """Get chords by key."""

    chords: list[tuple[str, str, str, str]] = get_chords(key)

    final_chords: list[str] = list(map(lambda chord: chord[3], chords))

    # remove diminished chords
    final_chords = [x for x in final_chords if "°" not in x]

    return ChordsSchema(
        chords=final_chords,
        key=key,
    )
