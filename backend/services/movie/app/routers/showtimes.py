from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Showtime
from app.schemas.showtime import ShowtimeCreate, ShowtimeResponse

router = APIRouter(tags=["showtimes"])


@router.post("/showtimes", response_model=ShowtimeResponse)
async def create_showtime(
    showtime_in: ShowtimeCreate, db: AsyncSession = Depends(get_db)
):
    new_showtime = Showtime(**showtime_in.model_dump())
    db.add(new_showtime)
    await db.commit()
    return new_showtime


@router.get("/movies/{movie_id}/showtimes", response_model=list[ShowtimeResponse])
async def get_movie_showtimes(movie_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Showtime).where(Showtime.movie_id == movie_id))
    showtimes = result.scalars().all()
    return showtimes
