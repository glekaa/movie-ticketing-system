async def test_logout_returns_no_content(client, make_user, login):
    await make_user(email="logout@example.com")
    tokens = await login("logout@example.com")

    resp = await client.post("/api/v1/auth/logout", json={"refresh_token": tokens["refresh_token"]})

    assert resp.status_code == 204


async def test_logout_revokes_the_refresh_token(client, make_user, login):
    await make_user(email="logout2@example.com")
    tokens = await login("logout2@example.com")

    await client.post("/api/v1/auth/logout", json={"refresh_token": tokens["refresh_token"]})
    resp = await client.post(
        "/api/v1/auth/refresh", json={"refresh_token": tokens["refresh_token"]}
    )

    assert resp.status_code == 401
    assert resp.json() == {"detail": "Invalid or expired refresh token"}


async def test_logout_with_garbage_token_is_still_no_content(client):
    resp = await client.post("/api/v1/auth/logout", json={"refresh_token": "not-a-jwt"})

    assert resp.status_code == 204


async def test_logout_with_already_revoked_token_is_still_no_content(client, make_user, login):
    await make_user(email="logout3@example.com")
    tokens = await login("logout3@example.com")

    await client.post("/api/v1/auth/logout", json={"refresh_token": tokens["refresh_token"]})
    resp = await client.post(
        "/api/v1/auth/logout", json={"refresh_token": tokens["refresh_token"]}
    )

    assert resp.status_code == 204
