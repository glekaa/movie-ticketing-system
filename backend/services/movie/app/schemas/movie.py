from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.models.movie import MovieStatus
from app.schemas.genre import GenreResponse


class MovieBase(BaseModel):
    title: str
    description: str | None = None
    poster_url: str | None = None
    backdrop_url: str | None = None
    duration_minutes: int
    age_rating: int = 0
    release_date: date
    status: MovieStatus = MovieStatus.coming_soon


class MovieCreate(MovieBase):
    genre_ids: list[UUID] = []


class MovieUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    poster_url: str | None = None
    backdrop_url: str | None = None
    duration_minutes: int | None = None
    age_rating: int | None = None
    release_date: date | None = None
    status: MovieStatus | None = None
    genre_ids: list[UUID] | None = None


class Person(BaseModel):
    name: str
    profile_url: str | None = None
    character: str | None = None
    job: str | None = None

class MovieResponse(MovieBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    genres: list[GenreResponse] = []

    # Enriched from TMDB (optional)
    director: Person | None = None
    actors: list[Person] | None = None
    tmdb_rating: float | None = None
    plot: str | None = None
    language: str | None = None

    model_config = ConfigDict(from_attributes=True)

