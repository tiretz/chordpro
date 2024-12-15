from datetime import datetime
from typing import cast

from lyricsgenius import Genius
from lyricsgenius.types.song import Song
from spotipy import Spotify

from app.core.exceptions import BadRequestException
from app.schemas.track import TrackSchema, TrackSearchSchema
from app.services.track.lyrics import adapt_lyrics_to_chordpro
from app.utils.duration import get_duration_in_minutes_and_seconds


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

    chordpro_body: str = "\n".join(
        (
            f"{{title: {title}}}",
            f"{{artist: {", ".join(artists)}}}",
            f"{{album: {album_name}}}",
            f"{{key: }}",
            f"{{tempo: }}",
            f"{{time: {time_signature}}}",
            f"{{duration: {duration}}}",
            f"{{midi: PC0.0:0}}",
            f"{{keywords: English}}",
            "",
            "",
            adapt_lyrics_to_chordpro(lyrics),
        )
    )

    return TrackSchema(
        album_cover_url=track_result["album"]["images"][0]["url"],
        album_name=album_name,
        album_release_date=datetime.strptime(track_result["album"]["release_date"], "%Y-%m-%d").date(),
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


def search_tracks(spotify: Spotify, title: str | None, artists: list[str] | None) -> list[TrackSearchSchema]:
    """Spotify search
    https://developer.spotify.com/documentation/web-api/reference/search
    """

    if title and artists:
        search_query: str = f"""{title.replace(" ", "%20")}%20track:{title.replace(" ", "%20")}{f"%20artist:{",".join(artists)}".replace(" ", "%20")}"""

    elif title and not artists:
        search_query: str = f"""{title.replace(" ", "%20")}%20track:{title.replace(" ", "%20")}"""

    elif not title and artists:
        search_query: str = f"""{",".join(artists).replace(" ", "%20")}%20artist:{",".join(artists).replace(" ", "%20")}"""

    else:
        raise BadRequestException("Invalid search parameters!")

    search_results: dict = cast(dict, spotify.search(search_query, 20, 0, "track"))

    if search_results["tracks"]["total"] == 0:
        return []

    tracks: list[TrackSearchSchema] = [
        TrackSearchSchema(
            album_cover_url=item["album"]["images"][0]["url"],
            album_name=item["album"]["name"],
            album_release_date=datetime.strptime(item["album"]["release_date"], "%Y-%m-%d").date(),
            artists=[artist["name"] for artist in item["artists"]],
            id=item["id"],
            spotify_url=item["external_urls"]["spotify"],
            title=item["name"],
        )
        for item in search_results["tracks"]["items"]
    ]

    return tracks
