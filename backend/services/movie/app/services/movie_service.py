from uuid import UUID

from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.exceptions import MovieNotFound
from app.models.genre import Genre
from app.models.movie import Movie, MovieStatus
from app.schemas.movie import MovieCreate, MovieResponse, MovieUpdate
from app.services.tmdb import extract_tmdb_fields, fetch_movie_details


class MovieService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_movies(
        self,
        skip: int = 0,
        limit: int = 100,
        genres: list[str] | None = None,
        status: MovieStatus | None = None,
    ) -> list[Movie]:
        query = select(Movie).options(selectinload(Movie.genres))

        if genres:
            query = query.join(Movie.genres).where(Genre.slug.in_(genres)).distinct()

        if status:
            query = query.where(Movie.status == status)

        query = query.offset(skip).limit(limit)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_movie(self, movie_id: UUID) -> MovieResponse:
        result = await self.db.execute(
            select(Movie)
            .options(selectinload(Movie.genres))
            .where(Movie.id == movie_id)
        )
        movie = result.scalars().first()
        if not movie:
            raise MovieNotFound

        # Enrich with TMDB data
        response = MovieResponse.model_validate(movie)
        tmdb_data = await fetch_movie_details(movie.title)
        if tmdb_data:
            tmdb_fields = extract_tmdb_fields(tmdb_data)
            for key, value in tmdb_fields.items():
                setattr(response, key, value)

        return response

    async def create_movie(self, movie_in: MovieCreate) -> Movie:
        movie_data = movie_in.model_dump(exclude={"genre_ids"})
        new_movie = Movie(**movie_data)

        if movie_in.genre_ids:
            genre_result = await self.db.execute(
                select(Genre).where(Genre.id.in_(movie_in.genre_ids))
            )
            new_movie.genres = list(genre_result.scalars().all())
        else:
            # Explicitly load-empty: leaving this untouched keeps the
            # relationship unloaded on the persisted object, and the response
            # model's later access to `.genres` needs a sync lazy-load that
            # isn't valid outside an awaited context (MissingGreenlet).
            new_movie.genres = []

        self.db.add(new_movie)
        await self.db.commit()
        return new_movie

    async def update_movie(self, movie_id: UUID, movie_in: MovieUpdate) -> Movie:
        result = await self.db.execute(
            select(Movie)
            .options(selectinload(Movie.genres))
            .where(Movie.id == movie_id)
        )
        movie = result.scalars().first()

        if not movie:
            raise MovieNotFound

        update_data = movie_in.model_dump(exclude_unset=True, exclude={"genre_ids"})
        for key, value in update_data.items():
            setattr(movie, key, value)

        if movie_in.genre_ids is not None:
            if len(movie_in.genre_ids) == 0:
                movie.genres = []
            else:
                genre_result = await self.db.execute(
                    select(Genre).where(Genre.id.in_(movie_in.genre_ids))
                )
                movie.genres = list(genre_result.scalars().all())

        await self.db.commit()
        # No db.refresh() here: it would expire (and not eagerly reload)
        # `genres`, which is already correct in memory from the selectinload
        # above plus the reassignment, forcing a sync lazy-load at response
        # serialization time that fails outside an awaited context.
        return movie

    async def delete_movie(self, movie_id: UUID) -> None:
        result = await self.db.execute(select(Movie).where(Movie.id == movie_id))
        movie = result.scalars().first()

        if not movie:
            raise MovieNotFound

        await self.db.delete(movie)
        await self.db.commit()


async def get_movie_service(db: AsyncSession = Depends(get_db)) -> MovieService:
    return MovieService(db)
