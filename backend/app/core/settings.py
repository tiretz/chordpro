from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    model_config = SettingsConfigDict(env_file="../dev.env", extra="allow")

    genius_access_token: str | None = Field(validation_alias="GENIUS_ACCESS_TOKEN", default=None)

    spotipy_client_id: str | None = Field(validation_alias="SPOTIPY_CLIENT_ID", default=None)
    spotipy_client_secret: str | None = Field(validation_alias="SPOTIPY_CLIENT_SECRET", default=None)


settings: Settings = Settings()
