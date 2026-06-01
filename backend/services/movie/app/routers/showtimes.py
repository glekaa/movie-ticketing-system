from uuid import UUID

from fastapi import APIRouter, Depends

from app.schemas.showtime import ShowtimeCreate, ShowtimeResponse
from app.services.showtime_service import ShowtimeService, get_showtime_service

router = APIRouter(tags=["showtimes"])


@router.post("/showtimes", response_model=ShowtimeResponse)
async def create_showtime(
    showtime_in: ShowtimeCreate,
    showtime_service: ShowtimeService = Depends(get_showtime_service),
):
    return await showtime_service.create_showtime(showtime_in)


@router.get("/movies/{movie_id}/showtimes", response_model=list[ShowtimeResponse])
async def get_movie_showtimes(
    movie_id: UUID, showtime_service: ShowtimeService = Depends(get_showtime_service)
):
    return await showtime_service.get_movie_showtimes(movie_id)
