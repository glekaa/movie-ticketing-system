from uuid import UUID

from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.genre import Genre
from app.schemas.genre import GenreCreate


class GenreService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_genres(self, skip: int = 0, limit: int = 10) -> list[Genre]:
        result = await self.db.execute(select(Genre).offset(skip).limit(limit))
        return list(result.scalars().all())

    async def create_genre(self, genre_in: GenreCreate) -> Genre:
        new_genre = Genre(**genre_in.model_dump())
        self.db.add(new_genre)
        await self.db.commit()
        await self.db.refresh(new_genre)
        return new_genre


async def get_genre_service(db: AsyncSession = Depends(get_db)) -> GenreService:
    return GenreService(db)
