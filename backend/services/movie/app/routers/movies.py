from uuid import UUID

from fastapi import APIRouter, Depends, Query, status

from app.models.movie import MovieStatus
from app.schemas.movie import MovieCreate, MovieResponse, MovieUpdate
from app.services.movie_service import MovieService, get_movie_service

router = APIRouter(
    prefix="/movies",
    tags=["movies"],
)


@router.get("/", response_model=list[MovieResponse])
async def get_movies(
    skip: int = 0,
    limit: int = 100,
    genres: list[str] = Query(default=None, description="Filter by genre slugs"),
    status: MovieStatus | None = Query(default=None, description="Filter by movie status"),
    movie_service: MovieService = Depends(get_movie_service),
):
    return await movie_service.get_movies(
        skip=skip, limit=limit, genres=genres, status=status
    )


@router.get("/{movie_id}", response_model=MovieResponse)
async def get_movie(
    movie_id: UUID, movie_service: MovieService = Depends(get_movie_service)
):
    return await movie_service.get_movie(movie_id)


@router.post("/", response_model=MovieResponse, status_code=status.HTTP_201_CREATED)
async def create_movie(
    movie_in: MovieCreate, movie_service: MovieService = Depends(get_movie_service)
):
    return await movie_service.create_movie(movie_in)


@router.put("/{movie_id}", response_model=MovieResponse)
async def update_movie(
    movie_id: UUID,
    movie_in: MovieUpdate,
    movie_service: MovieService = Depends(get_movie_service),
):
    return await movie_service.update_movie(movie_id, movie_in)


@router.delete("/{movie_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_movie(
    movie_id: UUID, movie_service: MovieService = Depends(get_movie_service)
):
    await movie_service.delete_movie(movie_id)
