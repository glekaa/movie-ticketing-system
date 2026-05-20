from uuid import UUID

from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.showtime import Showtime
from app.schemas.showtime import ShowtimeCreate


class ShowtimeService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_showtime(self, showtime_in: ShowtimeCreate) -> Showtime:
        new_showtime = Showtime(**showtime_in.model_dump())
        self.db.add(new_showtime)
        await self.db.commit()
        return new_showtime

    async def get_movie_showtimes(self, movie_id: UUID) -> list[Showtime]:
        result = await self.db.execute(select(Showtime).where(Showtime.movie_id == movie_id))
        return list(result.scalars().all())


async def get_showtime_service(db: AsyncSession = Depends(get_db)) -> ShowtimeService:
    return ShowtimeService(db)
