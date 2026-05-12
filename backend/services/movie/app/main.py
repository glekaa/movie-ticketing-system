from fastapi import FastAPI

from app.routers import movies

app = FastAPI(title="Movie Service", version="0.1.0")

app.include_router(movies.router, prefix="/api/v1")


@app.get("/health")
async def health():
    return {"status": "ok"}
