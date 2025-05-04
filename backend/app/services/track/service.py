from dateutil.parser import parse
from typing import cast

from langdetect import detect
from lyricsgenius import Genius
from lyricsgenius.types.song import Song
from spotipy import Spotify

from app.core.exceptions import BadRequestException
from app.schemas.track import TrackSchema, SearchTrackSchema
from app.utils.duration import get_duration_in_minutes_and_seconds
from app.utils.lyrics import adapt_lyrics_to_chordpro


def determine_language(lyrics: str | None) -> str:

    if not lyrics:
        return "English"

    language: str = detect(lyrics)

    match (language):

        case "de":
            return "German"

        case "en" | _:
            return "English"


def get_track_chordpro_template(title: str | None = None, artists: list[str] | None = None, album_name: str | None = None, time_signature: str | None = None, duration: str | None = None, lyrics: str | None = None) -> str:

    language: str = determine_language(lyrics)

    fields = (
        f"{{title: {title or ""}}}",
        f"{{artist: {", ".join(artists) if artists else ""}}}",
        f"{{album: {album_name or ""}}}",
        f"{{key: }}",
        f"{{tempo: }}",
        f"{{time: {time_signature or "4/4"}}}",
        f"{{duration: {duration or "0:00"}}}",
        f"{{midi: PC0.0:0}}",
        f"{{keywords: {language}}}",
        "",
        adapt_lyrics_to_chordpro(lyrics) if lyrics else None,
    )

    return "\n".join([x for x in fields if x is not None])


def get_track(genius: Genius, spotify: Spotify, id: str) -> TrackSchema:
    """Get track data by track ID"""

    track_result: dict = cast(dict, spotify.track(track_id=id))

    genius_result: Song | None = genius.search_song(artist=", ".join([artist["name"] for artist in track_result["artists"]]), title=track_result["name"])

    album_name: str = track_result["album"]["name"]
    artists: list[str] = [artist["name"] for artist in track_result["artists"]]
    duration: str = get_duration_in_minutes_and_seconds(track_result["duration_ms"])
    lyrics: str = genius_result.lyrics if genius_result else ""
    time_signature: str = "4/4"
    title: str = track_result["name"]

    chordpro_body: str = get_track_chordpro_template(title, artists, album_name, time_signature, duration, lyrics)

    return TrackSchema(
        album_cover_url=track_result["album"]["images"][0]["url"],
        album_name=album_name,
        album_release_date=parse(track_result["album"]["release_date"]).date(),
        artists=artists,
        chords=[],
        chordpro_body=chordpro_body,
        duration=duration,
        id=track_result["id"],
        key="",
        lyrics=lyrics,
        mode="",
        spotify_url=track_result["external_urls"]["spotify"],
        tempo=0,
        time_signature=time_signature,
        title=title,
    )


def search_tracks(spotify: Spotify, title: str | None, artists: list[str] | None) -> list[SearchTrackSchema]:
    """Spotify search
    https://developer.spotify.com/documentation/web-api/reference/search
    """

    if title and artists:
        search_query: str = f"""{title.replace(" ", "%2520")}{f"%2520artist%3A{",".join(artists)}".replace(" ", "%2520")}"""

    elif title and not artists:
        search_query: str = title.replace(" ", "%2520")

    elif not title and artists:
        search_query: str = ",".join(artists).replace(" ", "%2520")

    else:
        raise BadRequestException("Invalid search parameters!")

    search_results: dict = cast(dict, spotify.search(search_query, 40, 0, "track"))

    if search_results["tracks"]["total"] == 0:
        return []

    tracks: list[SearchTrackSchema] = [
        SearchTrackSchema(
            album_cover_url=item["album"]["images"][0]["url"],
            album_name=item["album"]["name"],
            album_release_date=parse(item["album"]["release_date"]).date(),
            artists=[artist["name"] for artist in item["artists"]],
            id=item["id"],
            spotify_url=item["external_urls"]["spotify"],
            title=item["name"],
        )
        for item in search_results["tracks"]["items"]
    ]

    return tracks
