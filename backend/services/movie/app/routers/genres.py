from fastapi import APIRouter, Depends, status

from app.schemas.genre import GenreCreate, GenreResponse
from app.services.genre_service import GenreService, get_genre_service

router = APIRouter(prefix="/genres", tags=["genres"])


@router.get("/", response_model=list[GenreResponse])
async def get_genres(
    skip: int = 0,
    limit: int = 10,
    genre_service: GenreService = Depends(get_genre_service),
):
    return await genre_service.get_genres(skip=skip, limit=limit)


@router.post("/", response_model=GenreResponse, status_code=status.HTTP_201_CREATED)
async def create_genre(
    genre_in: GenreCreate, genre_service: GenreService = Depends(get_genre_service)
):
    return await genre_service.create_genre(genre_in)
