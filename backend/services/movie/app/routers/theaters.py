from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.theater import Theater
from app.schemas.theater import TheaterCreate, TheaterResponse

router = APIRouter(
    prefix="/theaters",
    tags=["theaters"],
)


@router.get("/", response_model=list[TheaterResponse])
async def get_theaters(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Theater))
    theaters = result.scalars().all()
    return theaters


@router.post("/", response_model=TheaterResponse)
async def create_theater(theater_in: TheaterCreate, db: AsyncSession = Depends(get_db)):
    new_theater = Theater(**theater_in.model_dump())
    db.add(new_theater)
    await db.commit()
    return new_theater
