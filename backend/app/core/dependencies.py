from typing import Annotated

from fastapi import Depends
from lyricsgenius import Genius
from spotipy import Spotify
from spotipy.oauth2 import SpotifyClientCredentials

from app.core.settings import settings


spotify_auth_manager: SpotifyClientCredentials = SpotifyClientCredentials(client_id=settings.spotipy_client_id, client_secret=settings.spotipy_client_secret)
spotify: Spotify = Spotify(auth_manager=spotify_auth_manager)

genius: Genius = Genius(access_token=settings.genius_access_token, verbose=False)

# Override package default to prevent 403 Forbidden
genius._session.headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0"}


async def get_genius():

    return genius


async def get_spotify():

    return spotify


GeniusDep = Annotated[Genius, Depends(get_genius)]
SpotifyDep = Annotated[Spotify, Depends(get_spotify)]
