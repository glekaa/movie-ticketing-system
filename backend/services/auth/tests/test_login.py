import jwt
from sqlalchemy import select

from app.config import settings
from app.models.refresh_token import RefreshToken
from conftest import DEFAULT_PASSWORD


async def test_login_success_returns_token_pair(client, make_user):
    await make_user(email="login@example.com")

    resp = await client.post(
        "/api/v1/auth/login",
        data={"username": "login@example.com", "password": DEFAULT_PASSWORD},
    )

    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert body["token_type"] == "bearer"
    assert body["access_token"]
    assert body["refresh_token"]


async def test_login_wrong_password_rejected(client, make_user):
    await make_user(email="login@example.com")

    resp = await client.post(
        "/api/v1/auth/login",
        data={"username": "login@example.com", "password": "wrong-password"},
    )

    assert resp.status_code == 401
    assert resp.json() == {"detail": "Invalid username or password"}


async def test_login_unknown_email_rejected_with_same_message(client):
    resp = await client.post(
        "/api/v1/auth/login",
        data={"username": "nobody@example.com", "password": DEFAULT_PASSWORD},
    )

    assert resp.status_code == 401
    assert resp.json() == {"detail": "Invalid username or password"}


async def test_login_inactive_account_rejected(client, make_user):
    await make_user(email="inactive@example.com", is_active=False)

    resp = await client.post(
        "/api/v1/auth/login",
        data={"username": "inactive@example.com", "password": DEFAULT_PASSWORD},
    )

    assert resp.status_code == 403
    assert resp.json() == {"detail": "Account is deactivated"}


async def test_access_token_has_expected_claims(client, make_user):
    user = await make_user(email="claims@example.com")

    resp = await client.post(
        "/api/v1/auth/login",
        data={"username": "claims@example.com", "password": DEFAULT_PASSWORD},
    )
    access_token = resp.json()["access_token"]

    claims = jwt.decode(access_token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
    assert claims["sub"] == str(user.id)
    assert claims["role"] == "user"
    assert claims["type"] == "access"
    assert "exp" in claims and "iat" in claims


async def test_login_persists_refresh_token_row(client, make_user, db_session):
    user = await make_user(email="persist@example.com")

    resp = await client.post(
        "/api/v1/auth/login",
        data={"username": "persist@example.com", "password": DEFAULT_PASSWORD},
    )
    refresh_token = resp.json()["refresh_token"]
    claims = jwt.decode(
        refresh_token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
    )

    result = await db_session.execute(
        select(RefreshToken).where(RefreshToken.jti == claims["jti"])
    )
    stored = result.scalars().first()

    assert stored is not None
    assert stored.user_id == user.id
    assert stored.is_revoked is False
