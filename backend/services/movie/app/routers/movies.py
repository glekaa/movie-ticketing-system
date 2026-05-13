from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.movie import Movie
from app.schemas.movie import MovieCreate, MovieResponse, MovieUpdate

router = APIRouter(
    prefix="/movies",
    tags=["movies"],
)


@router.get("/", response_model=list[MovieResponse])
async def get_movies(
    skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Movie).offset(skip).limit(limit))
    movies = result.scalars().all()
    return movies


@router.get("/{movie_id}", response_model=MovieResponse)
async def get_movie(movie_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Movie).where(Movie.id == movie_id))
    movie = result.scalars().first()
    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Movie not found"
        )
    return movie


@router.post("/", response_model=MovieResponse, status_code=status.HTTP_201_CREATED)
async def create_movie(movie_in: MovieCreate, db: AsyncSession = Depends(get_db)):
    new_movie = Movie(**movie_in.model_dump())
    db.add(new_movie)
    await db.commit()
    await db.refresh(new_movie)
    return new_movie


@router.put("/{movie_id}", response_model=MovieResponse)
async def update_movie(
    movie_id: UUID, movie_in: MovieUpdate, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Movie).where(Movie.id == movie_id))
    movie = result.scalars().first()

    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Movie not found"
        )

    update_data = movie_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(movie, key, value)

    await db.commit()
    await db.refresh(movie)
    return movie


@router.delete("/{movie_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_movie(movie_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Movie).where(Movie.id == movie_id))
    movie = result.scalars().first()

    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Movie not found"
        )

    await db.delete(movie)
    await db.commit()
