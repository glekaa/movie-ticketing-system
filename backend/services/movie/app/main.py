from fastapi import FastAPI

from app.routers import genres, movies, theaters

app = FastAPI(title="Movie Service", version="0.1.0")

app.include_router(movies.router, prefix="/api/v1")
app.include_router(genres.router, prefix="/api/v1")
app.include_router(theaters.router, prefix="/api/v1")


@app.get("/health")
async def health():
    return {"status": "ok"}
