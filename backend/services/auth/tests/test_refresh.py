from datetime import timedelta

import jwt
from sqlalchemy import select

from app.config import settings
from app.models.refresh_token import RefreshToken
from conftest import DEFAULT_PASSWORD


def _decode(token: str) -> dict:
    return jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])


async def _stored_token(db_session, refresh_token: str) -> RefreshToken:
    jti = _decode(refresh_token)["jti"]
    result = await db_session.execute(select(RefreshToken).where(RefreshToken.jti == jti))
    return result.scalars().first()


async def test_refresh_rotates_tokens(client, make_user, login):
    await make_user(email="rotate@example.com")
    original = await login("rotate@example.com")

    resp = await client.post(
        "/api/v1/auth/refresh", json={"refresh_token": original["refresh_token"]}
    )

    assert resp.status_code == 200, resp.text
    rotated = resp.json()
    # The refresh token embeds a random jti, so it's guaranteed to differ.
    # The access token isn't: it's a deterministic encoding of sub/role/type/
    # iat/exp, so two mints within the same wall-clock second are
    # byte-identical. That's fine — uniqueness was never a property access
    # tokens need — so we only assert it decodes, not that it changed.
    assert rotated["refresh_token"] != original["refresh_token"]
    assert _decode(rotated["access_token"])["type"] == "access"


async def test_refresh_revokes_the_presented_token(client, make_user, login, db_session):
    await make_user(email="revoke@example.com")
    original = await login("revoke@example.com")

    await client.post("/api/v1/auth/refresh", json={"refresh_token": original["refresh_token"]})

    old_row = await _stored_token(db_session, original["refresh_token"])
    assert old_row.is_revoked is True


async def test_refresh_rejects_an_already_rotated_token(client, make_user, login):
    await make_user(email="reuse@example.com")
    original = await login("reuse@example.com")

    await client.post("/api/v1/auth/refresh", json={"refresh_token": original["refresh_token"]})
    replay = await client.post(
        "/api/v1/auth/refresh", json={"refresh_token": original["refresh_token"]}
    )

    assert replay.status_code == 401
    assert replay.json() == {"detail": "Invalid or expired refresh token"}


async def test_refresh_rejects_garbage_token(client):
    resp = await client.post("/api/v1/auth/refresh", json={"refresh_token": "not-a-jwt"})

    assert resp.status_code == 401
    assert resp.json() == {"detail": "Invalid or expired refresh token"}


async def test_refresh_rejects_an_access_token(client, make_user, login):
    await make_user(email="wrongtype@example.com")
    tokens = await login("wrongtype@example.com")

    resp = await client.post(
        "/api/v1/auth/refresh", json={"refresh_token": tokens["access_token"]}
    )

    assert resp.status_code == 401
    assert resp.json() == {"detail": "Invalid or expired refresh token"}


async def test_refresh_preserves_session_start_across_rotations(
    client, make_user, login, db_session
):
    await make_user(email="chain@example.com")
    original = await login("chain@example.com")
    original_row = await _stored_token(db_session, original["refresh_token"])
    original_started_at = original_row.session_started_at

    resp = await client.post(
        "/api/v1/auth/refresh", json={"refresh_token": original["refresh_token"]}
    )
    rotated_row = await _stored_token(db_session, resp.json()["refresh_token"])

    assert rotated_row.session_started_at == original_started_at


async def test_refresh_fails_once_session_exceeds_max_age(
    client, make_user, login, db_session
):
    await make_user(email="stale-session@example.com")
    tokens = await login("stale-session@example.com")

    row = await _stored_token(db_session, tokens["refresh_token"])
    row.session_started_at -= timedelta(days=settings.REFRESH_SESSION_MAX_DAYS + 1)
    await db_session.commit()

    resp = await client.post(
        "/api/v1/auth/refresh", json={"refresh_token": tokens["refresh_token"]}
    )

    assert resp.status_code == 401
    assert resp.json() == {"detail": "Session expired. Please sign in again."}


async def test_refresh_marks_session_revoked_once_expired(
    client, make_user, login, db_session
):
    await make_user(email="stale-session-2@example.com")
    tokens = await login("stale-session-2@example.com")

    row = await _stored_token(db_session, tokens["refresh_token"])
    row.session_started_at -= timedelta(days=settings.REFRESH_SESSION_MAX_DAYS + 1)
    await db_session.commit()

    await client.post("/api/v1/auth/refresh", json={"refresh_token": tokens["refresh_token"]})

    await db_session.refresh(row)
    assert row.is_revoked is True


async def test_refresh_rejects_inactive_user(client, make_user, login, db_session):
    user = await make_user(email="deactivated@example.com")
    tokens = await login("deactivated@example.com")

    user.is_active = False
    await db_session.commit()

    resp = await client.post(
        "/api/v1/auth/refresh", json={"refresh_token": tokens["refresh_token"]}
    )

    assert resp.status_code == 403
    assert resp.json() == {"detail": "Account is deactivated"}
