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


class MovieResponse(MovieBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    genres: list[GenreResponse] = []

    # Enriched from OMDB (optional — populated when OMDB data is available)
    director: str | None = None
    actors: str | None = None
    imdb_rating: str | None = None
    plot: str | None = None
    country: str | None = None
    language: str | None = None
    awards: str | None = None

    model_config = ConfigDict(from_attributes=True)

