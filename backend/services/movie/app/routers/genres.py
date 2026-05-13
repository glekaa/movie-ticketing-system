from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.genre import Genre
from app.schemas.genre import GenreCreate, GenreResponse

router = APIRouter(prefix="/genres", tags=["genres"])


@router.get("/", response_model=list[GenreResponse])
async def get_genres(
    skip: int = 0, limit: int = 10, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Genre).offset(skip).limit(limit))
    genres = result.scalars().all()
    return genres


@router.post("/", response_model=GenreResponse, status_code=status.HTTP_201_CREATED)
async def create_genre(genre_in: GenreCreate, db: AsyncSession = Depends(get_db)):
    new_genre = Genre(**genre_in.model_dump())
    db.add(new_genre)
    await db.commit()
    await db.refresh(new_genre)
    return new_genre
