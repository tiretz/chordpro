from datetime import date

from pydantic import Field

from app.schemas.base import BaseSchema


class TrackSearchSchema(BaseSchema):

    album_cover_url: str = Field(description="Track album cover URL")
    album_name: str = Field(description="Track album name")
    album_release_date: date = Field(description="Track album release date")
    artists: list[str] = Field(description="Track artists")
    id: str = Field(description="Track ID")
    spotify_url: str = Field(description="Track Spotify URL")
    title: str = Field(description="Track title")


class TrackSchema(TrackSearchSchema):

    chords: list[str] = Field(description="Track chords")
    chordpro_body: str = Field(description="Track body with chrodpro meta data")
    duration: str = Field(description="Track duration")
    key: str = Field(description="Track key")
    lyrics: str = Field(description="Track lyrics")
    mode: str = Field(description="Track mode")
    tempo: float = Field(description="Track tempo")
    time_signature: str = Field(description="Track time signature")
