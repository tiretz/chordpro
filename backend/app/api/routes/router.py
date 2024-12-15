from fastapi import APIRouter

from app.api.routes import chords, track

api_router = APIRouter(prefix="/api")

api_router.include_router(chords.router)
api_router.include_router(track.router)
