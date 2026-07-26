"""Shared test fixtures for the auth service.

Tests run against a real Postgres database (a sibling `auth_test_db` next to
the dev `auth_db`) rather than SQLite, because the models rely on
Postgres-only types (native UUID, native ENUM). This suite is meant to run
inside the compose network (e.g. `docker compose run --rm auth-service uv run
pytest`) so it inherits the real DATABASE_URL/JWT_SECRET_KEY the service
already uses — only the database name is swapped for a test-only one. Env
vars are patched before any `app.*` module is imported, since
`app.config.Settings()` is instantiated at import time.
"""

import os

os.environ["DATABASE_URL"] = os.environ["DATABASE_URL"].rsplit("/", 1)[0] + "/auth_test_db"

import asyncio  # noqa: E402

import asyncpg  # noqa: E402
import pytest  # noqa: E402
import pytest_asyncio  # noqa: E402
from httpx import ASGITransport, AsyncClient  # noqa: E402
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine  # noqa: E402

from app.config import settings  # noqa: E402
from app.database import Base, get_db  # noqa: E402
from app.main import app  # noqa: E402
from app.models.user import User, UserRole  # noqa: E402
from app.services.auth_service import AuthService  # noqa: E402

TEST_DB_NAME = "auth_test_db"
DEFAULT_PASSWORD = "correct-horse-battery-staple"


def auth_header(access_token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {access_token}"}


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
async def make_user(db_session):
    """Factory fixture: insert a user directly, bypassing the API."""

    async def _make_user(
        email: str = "user@example.com",
        username: str = "testuser",
        password: str = DEFAULT_PASSWORD,
        role: UserRole = UserRole.user,
        is_active: bool = True,
    ) -> User:
        auth_service = AuthService(db_session)
        user = User(
            email=email,
            username=username,
            hashed_password=auth_service.hash_password(password),
            role=role,
            is_active=is_active,
        )
        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)
        return user

    return _make_user


@pytest_asyncio.fixture
async def login(client):
    """Log in through the real endpoint and return the Token payload."""

    async def _login(email: str, password: str = DEFAULT_PASSWORD) -> dict:
        resp = await client.post(
            "/api/v1/auth/login",
            data={"username": email, "password": password},
        )
        assert resp.status_code == 200, resp.text
        return resp.json()

    return _login
