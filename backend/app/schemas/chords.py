from pydantic import Field

from app.schemas.base import BaseSchema


class ChordsSchema(BaseSchema):

    chords: list[str] | None = Field(description="Chords of key")
    key: str | None = Field(description="Key")
