import uuid

from fastapi import APIRouter, Depends

from app.schemas.screen import ScreenBase, ScreenResponse
from app.schemas.theater import TheaterCreate, TheaterResponse, TheaterUpdate
from app.services.theater_service import TheaterService, get_theater_service

router = APIRouter(
    prefix="/theaters",
    tags=["theaters"],
)


@router.get("/", response_model=list[TheaterResponse])
async def get_theaters(theater_service: TheaterService = Depends(get_theater_service)):
    return await theater_service.get_theaters()


@router.post("/", response_model=TheaterResponse)
async def create_theater(
    theater_in: TheaterCreate,
    theater_service: TheaterService = Depends(get_theater_service),
):
    return await theater_service.create_theater(theater_in)


@router.put("/{theater_id}", response_model=TheaterResponse)
async def update_theater(
    theater_id: uuid.UUID,
    theater_in: TheaterUpdate,
    theater_service: TheaterService = Depends(get_theater_service),
):
    return await theater_service.update_theater(theater_id, theater_in)


@router.post("/{theater_id}/screens", response_model=ScreenResponse)
async def create_screen(
    theater_id: uuid.UUID,
    screen_in: ScreenBase,
    theater_service: TheaterService = Depends(get_theater_service),
):
    return await theater_service.create_screen(theater_id, screen_in)
