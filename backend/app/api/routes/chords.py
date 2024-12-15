from typing import Annotated
from fastapi import APIRouter, Query

from app.schemas.chords import ChordsSchema
from app.services.chords import service

router = APIRouter(prefix="/chords", tags=["chords"])


@router.get("/byKey")
def get_chords_by_key(*, key: Annotated[str, Query()]) -> ChordsSchema:
    """Get chords by given key."""

    return service.get_chords_by_key(key)
