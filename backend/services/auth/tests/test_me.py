from conftest import auth_header


async def test_me_returns_current_user(client, make_user, login):
    user = await make_user(email="me@example.com")
    tokens = await login("me@example.com")

    resp = await client.get("/api/v1/auth/me", headers=auth_header(tokens["access_token"]))

    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert body["id"] == str(user.id)
    assert body["email"] == "me@example.com"


async def test_me_without_token_rejected(client):
    resp = await client.get("/api/v1/auth/me")

    assert resp.status_code == 401


async def test_me_with_garbage_token_rejected(client):
    resp = await client.get("/api/v1/auth/me", headers=auth_header("not-a-jwt"))

    assert resp.status_code == 401
    assert resp.json() == {"detail": "Could not validate credentials"}


async def test_me_rejects_a_refresh_token(client, make_user, login):
    await make_user(email="metype@example.com")
    tokens = await login("metype@example.com")

    resp = await client.get("/api/v1/auth/me", headers=auth_header(tokens["refresh_token"]))

    assert resp.status_code == 401
    assert resp.json() == {"detail": "Could not validate credentials"}


async def test_me_rejects_deactivated_user(client, make_user, login, db_session):
    user = await make_user(email="meinactive@example.com")
    tokens = await login("meinactive@example.com")

    user.is_active = False
    await db_session.commit()

    resp = await client.get("/api/v1/auth/me", headers=auth_header(tokens["access_token"]))

    assert resp.status_code == 403
    assert resp.json() == {"detail": "Account is deactivated"}
