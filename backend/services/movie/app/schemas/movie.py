from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.models.movie import MovieStatus


class MovieBase(BaseModel):
    title: str
    description: str | None = None
    poster_url: str | None = None
    duration_minutes: int
    release_date: date
    status: MovieStatus = MovieStatus.coming_soon


class MovieCreate(MovieBase):
    pass


class MovieUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    poster_url: str | None = None
    duration_minutes: int | None = None
    release_date: date | None = None
    status: MovieStatus | None = None


class MovieResponse(MovieBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
