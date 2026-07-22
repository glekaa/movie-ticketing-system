import uuid

from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.exceptions import TheaterNotFound
from app.models.screen import Screen
from app.models.theater import Theater
from app.schemas.screen import ScreenBase
from app.schemas.theater import TheaterCreate, TheaterUpdate


class TheaterService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_theaters(self) -> list[Theater]:
        result = await self.db.execute(select(Theater).options(selectinload(Theater.screens)))
        return list(result.scalars().all())

    async def create_theater(self, theater_in: TheaterCreate) -> Theater:
        new_theater = Theater(**theater_in.model_dump())
        self.db.add(new_theater)
        await self.db.commit()
        
        result = await self.db.execute(
            select(Theater).options(selectinload(Theater.screens)).where(Theater.id == new_theater.id)
        )
        return result.scalars().first()

    async def update_theater(self, theater_id: uuid.UUID, theater_in: TheaterUpdate) -> Theater:
        result = await self.db.execute(
            select(Theater)
            .options(selectinload(Theater.screens))
            .where(Theater.id == theater_id)
        )
        theater = result.scalars().first()

        if not theater:
            raise TheaterNotFound

        update_data = theater_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(theater, field, value)

        await self.db.commit()
        
        result = await self.db.execute(
            select(Theater).options(selectinload(Theater.screens)).where(Theater.id == theater_id)
        )
        return result.scalars().first()

    async def create_screen(self, theater_id: uuid.UUID, screen_in: ScreenBase) -> Screen:
        new_screen = Screen(**screen_in.model_dump(), theater_id=theater_id)
        self.db.add(new_screen)
        await self.db.commit()
        return new_screen


async def get_theater_service(db: AsyncSession = Depends(get_db)) -> TheaterService:
    return TheaterService(db)
