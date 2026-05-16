from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import genres, movies, theaters

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app = FastAPI(title="Movie Service", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(movies.router, prefix="/api/v1")
app.include_router(genres.router, prefix="/api/v1")
app.include_router(theaters.router, prefix="/api/v1")


@app.get("/health")
async def health():
    return {"status": "ok"}
