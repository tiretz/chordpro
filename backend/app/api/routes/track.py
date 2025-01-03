from typing import Annotated
from fastapi import APIRouter, Path, Query

from app.core.dependencies import GeniusDep, SpotifyDep
from app.schemas.track import TrackSchema, SearchTrackSchema
from app.services.track import service

router = APIRouter(prefix="/track", tags=["track"])


@router.get("/template")
def get_track_chordpro_template() -> str:
    """Get empty template for track."""

    return service.get_track_chordpro_template()


@router.get("/search")
def search_tracks(*, spotify: SpotifyDep, title: Annotated[str | None, Query()] = None, artists: Annotated[list[str] | None, Query()] = None) -> list[SearchTrackSchema]:
    """Search for tracks by title and / or artist(s)."""

    return service.search_tracks(spotify, title, artists)


@router.get("/{id}")
def get_track_by_id(*, genius: GeniusDep, spotify: SpotifyDep, id: Annotated[str, Path()]) -> TrackSchema:
    """Get track by ID."""

    return service.get_track(genius, spotify, id)
