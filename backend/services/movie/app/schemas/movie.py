from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.models.movie import MovieStatus
from app.schemas.genre import GenreResponse


class MovieBase(BaseModel):
    title: str
    description: str | None = None
    poster_url: str | None = None
    duration_minutes: int
    release_date: date
    status: MovieStatus = MovieStatus.coming_soon


class MovieCreate(MovieBase):
    genre_ids: list[UUID] = []


class MovieUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    poster_url: str | None = None
    duration_minutes: int | None = None
    release_date: date | None = None
    status: MovieStatus | None = None
    genre_ids: list[UUID] | None = None


class MovieResponse(MovieBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    genres: list[GenreResponse] = []

    model_config = ConfigDict(from_attributes=True)
