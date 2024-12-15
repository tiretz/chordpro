from logging import DEBUG

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.middlewares.exception import ExceptionHandlerMiddleware
from app.api.routes.router import api_router
from app.core.logger import logger


logger.setLevel(DEBUG)


app: FastAPI = FastAPI(title="Chordpro API")

app.add_middleware(ExceptionHandlerMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://localhost:4200",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

app.include_router(api_router)
