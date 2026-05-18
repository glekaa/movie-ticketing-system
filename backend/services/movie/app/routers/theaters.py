import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.screen import Screen
from app.models.theater import Theater
from app.schemas.screen import ScreenBase, ScreenResponse
from app.schemas.theater import TheaterCreate, TheaterResponse, TheaterUpdate

router = APIRouter(
    prefix="/theaters",
    tags=["theaters"],
)


@router.get("/", response_model=list[TheaterResponse])
async def get_theaters(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Theater).options(selectinload(Theater.screens)))
    theaters = result.scalars().all()
    return theaters


@router.post("/", response_model=TheaterResponse)
async def create_theater(theater_in: TheaterCreate, db: AsyncSession = Depends(get_db)):
    new_theater = Theater(**theater_in.model_dump())
    db.add(new_theater)
    await db.commit()
    
    result = await db.execute(
        select(Theater).options(selectinload(Theater.screens)).where(Theater.id == new_theater.id)
    )
    return result.scalars().first()


@router.put("/{theater_id}", response_model=TheaterResponse)
async def update_theater(
    theater_id: uuid.UUID, theater_in: TheaterUpdate, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Theater)
        .options(selectinload(Theater.screens))
        .where(Theater.id == theater_id)
    )
    theater = result.scalars().first()

    if not theater:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Theater not found"
        )

    update_data = theater_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(theater, field, value)

    await db.commit()
    
    result = await db.execute(
        select(Theater).options(selectinload(Theater.screens)).where(Theater.id == theater_id)
    )
    return result.scalars().first()


@router.post("/{theater_id}/screens", response_model=ScreenResponse)
async def create_screen(
    theater_id: uuid.UUID, screen_in: ScreenBase, db: AsyncSession = Depends(get_db)
):
    new_screen = Screen(**screen_in.model_dump(), theater_id=theater_id)
    db.add(new_screen)
    await db.commit()
    return new_screen
