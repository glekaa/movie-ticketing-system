async def test_register_success(client):
    resp = await client.post(
        "/api/v1/auth/register",
        json={"email": "new@example.com", "username": "newuser", "password": "hunter2pass"},
    )

    assert resp.status_code == 201, resp.text
    body = resp.json()
    assert body["email"] == "new@example.com"
    assert body["username"] == "newuser"
    assert body["role"] == "user"
    assert body["is_active"] is True
    assert "id" in body
    assert "created_at" in body
    assert "password" not in body
    assert "hashed_password" not in body


async def test_register_duplicate_email_rejected(client, make_user):
    await make_user(email="taken@example.com", username="original")

    resp = await client.post(
        "/api/v1/auth/register",
        json={"email": "taken@example.com", "username": "different", "password": "hunter2pass"},
    )

    assert resp.status_code == 409
    assert resp.json() == {"detail": "Email already registered"}


async def test_register_duplicate_username_rejected(client, make_user):
    await make_user(email="original@example.com", username="taken")

    resp = await client.post(
        "/api/v1/auth/register",
        json={"email": "different@example.com", "username": "taken", "password": "hunter2pass"},
    )

    assert resp.status_code == 409
    assert resp.json() == {"detail": "Username already taken"}


async def test_register_invalid_email_rejected(client):
    resp = await client.post(
        "/api/v1/auth/register",
        json={"email": "not-an-email", "username": "someone", "password": "hunter2pass"},
    )

    assert resp.status_code == 422


async def test_register_password_too_short_rejected(client):
    resp = await client.post(
        "/api/v1/auth/register",
        json={"email": "someone@example.com", "username": "someone", "password": "short"},
    )

    assert resp.status_code == 422


async def test_register_username_too_short_rejected(client):
    resp = await client.post(
        "/api/v1/auth/register",
        json={"email": "someone@example.com", "username": "ab", "password": "hunter2pass"},
    )

    assert resp.status_code == 422
