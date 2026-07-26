"""Shared test fixtures for the movie service.

Tests run against a real Postgres database (a sibling `movie_test_db` next to
the dev `movie_db`) rather than SQLite, because the models rely on
Postgres-only types (native UUID, native ENUM). This suite is meant to run
inside the compose network (e.g. `docker compose run --rm movie-service uv
run pytest`) so it inherits the real DATABASE_URL the service already uses —
only the database name is swapped for a test-only one. Env vars are patched
before any `app.*` module is imported, since `app.config.Settings()` is
instantiated at import time.

TMDB_API_KEY is forced empty so movie enrichment never makes a real network
call during tests; the one test that exercises enrichment monkeypatches
`fetch_movie_details` directly instead.
"""

import os

os.environ["DATABASE_URL"] = os.environ["DATABASE_URL"].rsplit("/", 1)[0] + "/movie_test_db"
os.environ["TMDB_API_KEY"] = ""

import asyncio  # noqa: E402
from datetime import date, datetime, timezone  # noqa: E402
from decimal import Decimal  # noqa: E402

import asyncpg  # noqa: E402
import pytest  # noqa: E402
import pytest_asyncio  # noqa: E402
from httpx import ASGITransport, AsyncClient  # noqa: E402
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine  # noqa: E402

from app.config import settings  # noqa: E402
from app.database import Base, get_db  # noqa: E402
from app.main import app  # noqa: E402
from app.models.genre import Genre  # noqa: E402
from app.models.movie import Movie, MovieStatus  # noqa: E402
from app.models.screen import Screen  # noqa: E402
from app.models.showtime import Showtime, ShowtimeStatus  # noqa: E402
from app.models.theater import Theater  # noqa: E402

TEST_DB_NAME = "movie_test_db"


async def _ensure_test_database(db_name: str) -> None:
    admin_url = settings.DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://").rsplit(
        "/", 1
    )[0] + "/postgres"
    conn = await asyncpg.connect(admin_url)
    try:
        exists = await conn.fetchval("SELECT 1 FROM pg_database WHERE datname = $1", db_name)
        if not exists:
            await conn.execute(f'CREATE DATABASE "{db_name}"')
    finally:
        await conn.close()


async def _reset_schema() -> None:
    await _ensure_test_database(TEST_DB_NAME)
    engine = create_async_engine(settings.DATABASE_URL)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    await engine.dispose()


@pytest.fixture(scope="session", autouse=True)
def _prepare_database():
    """One-time schema setup, run in its own throwaway event loop.

    Deliberately not an async fixture: pytest-asyncio gives each test
    function its own event loop, and an asyncpg engine created in one loop
    breaks if reused from another. Doing setup via asyncio.run() keeps this
    engine fully self-contained so nothing crosses a loop boundary.
    """
    asyncio.run(_reset_schema())


@pytest_asyncio.fixture
async def db_session():
    engine = create_async_engine(settings.DATABASE_URL)
    connection = await engine.connect()
    trans = await connection.begin()

    session = AsyncSession(
        bind=connection, expire_on_commit=False, join_transaction_mode="create_savepoint"
    )

    try:
        yield session
    finally:
        await session.close()
        await trans.rollback()
        await connection.close()
        await engine.dispose()


@pytest_asyncio.fixture
async def client(db_session):
    async def _override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = _override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()


@pytest_asyncio.fixture
async def make_genre(db_session):
    counter = iter(range(1, 10_000))

    async def _make_genre(name: str | None = None, slug: str | None = None) -> Genre:
        n = next(counter)
        genre = Genre(name=name or f"Genre {n}", slug=slug or f"genre-{n}")
        db_session.add(genre)
        await db_session.commit()
        await db_session.refresh(genre)
        return genre

    return _make_genre


@pytest_asyncio.fixture
async def make_theater(db_session):
    counter = iter(range(1, 10_000))

    async def _make_theater(name: str | None = None, location: str | None = None) -> Theater:
        n = next(counter)
        theater = Theater(name=name or f"Theater {n}", location=location or f"Location {n}")
        db_session.add(theater)
        await db_session.commit()
        await db_session.refresh(theater)
        return theater

    return _make_theater


@pytest_asyncio.fixture
async def make_screen(db_session, make_theater):
    async def _make_screen(
        theater: Theater | None = None,
        name: str = "Screen 1",
        total_rows: int = 10,
        seats_per_row: int = 12,
    ) -> Screen:
        theater = theater or await make_theater()
        screen = Screen(
            theater_id=theater.id,
            name=name,
            total_rows=total_rows,
            seats_per_row=seats_per_row,
        )
        db_session.add(screen)
        await db_session.commit()
        await db_session.refresh(screen)
        return screen

    return _make_screen


@pytest_asyncio.fixture
async def make_movie(db_session):
    counter = iter(range(1, 10_000))

    async def _make_movie(
        title: str | None = None,
        status: MovieStatus = MovieStatus.now_showing,
        genres: list[Genre] | None = None,
        duration_minutes: int = 120,
        release_date: date = date(2026, 1, 1),
    ) -> Movie:
        n = next(counter)
        movie = Movie(
            title=title or f"Movie {n}",
            duration_minutes=duration_minutes,
            release_date=release_date,
            status=status,
        )
        if genres:
            movie.genres = genres
        db_session.add(movie)
        await db_session.commit()
        await db_session.refresh(movie)
        return movie

    return _make_movie


@pytest_asyncio.fixture
async def make_showtime(db_session, make_screen, make_movie):
    async def _make_showtime(
        movie: Movie | None = None,
        screen: Screen | None = None,
        start_time: datetime = datetime(2026, 6, 1, 18, 0, tzinfo=timezone.utc),
        end_time: datetime = datetime(2026, 6, 1, 20, 0, tzinfo=timezone.utc),
        base_price: Decimal = Decimal("12.50"),
        status: ShowtimeStatus = ShowtimeStatus.scheduled,
    ) -> Showtime:
        movie = movie or await make_movie()
        screen = screen or await make_screen()
        showtime = Showtime(
            movie_id=movie.id,
            screen_id=screen.id,
            start_time=start_time,
            end_time=end_time,
            base_price=base_price,
            status=status,
        )
        db_session.add(showtime)
        await db_session.commit()
        await db_session.refresh(showtime)
        return showtime

    return _make_showtime
