from app.models.user import UserRole
from conftest import auth_header


async def _admin_headers(make_user, login) -> dict:
    await make_user(email="admin@example.com", username="admin", role=UserRole.admin)
    tokens = await login("admin@example.com")
    return auth_header(tokens["access_token"])


async def test_get_users_requires_authentication(client):
    resp = await client.get("/api/v1/users/")

    assert resp.status_code == 401


async def test_get_users_rejects_non_admin(client, make_user, login):
    await make_user(email="plain@example.com")
    tokens = await login("plain@example.com")

    resp = await client.get("/api/v1/users/", headers=auth_header(tokens["access_token"]))

    assert resp.status_code == 403
    assert resp.json() == {"detail": "Admin privileges required"}


async def test_get_users_as_admin_lists_users(client, make_user, login):
    headers = await _admin_headers(make_user, login)
    await make_user(email="one@example.com", username="one")
    await make_user(email="two@example.com", username="two")

    resp = await client.get("/api/v1/users/", headers=headers)

    assert resp.status_code == 200
    emails = {u["email"] for u in resp.json()}
    assert {"admin@example.com", "one@example.com", "two@example.com"} <= emails


async def test_get_users_respects_limit(client, make_user, login):
    headers = await _admin_headers(make_user, login)
    await make_user(email="one@example.com", username="one")
    await make_user(email="two@example.com", username="two")

    resp = await client.get("/api/v1/users/?limit=1", headers=headers)

    assert resp.status_code == 200
    assert len(resp.json()) == 1


async def test_update_user_role_requires_admin(client, make_user, login):
    target = await make_user(email="target@example.com", username="target")
    tokens = await login("target@example.com")

    resp = await client.put(
        f"/api/v1/users/{target.id}/role",
        json={"role": "admin"},
        headers=auth_header(tokens["access_token"]),
    )

    assert resp.status_code == 403


async def test_update_user_role_as_admin_promotes_user(client, make_user, login):
    headers = await _admin_headers(make_user, login)
    target = await make_user(email="promote@example.com", username="promote")

    resp = await client.put(
        f"/api/v1/users/{target.id}/role", json={"role": "admin"}, headers=headers
    )

    assert resp.status_code == 200, resp.text
    assert resp.json()["role"] == "admin"


async def test_update_user_role_unknown_user_returns_404(client, make_user, login):
    headers = await _admin_headers(make_user, login)

    resp = await client.put(
        "/api/v1/users/00000000-0000-0000-0000-000000000000/role",
        json={"role": "admin"},
        headers=headers,
    )

    assert resp.status_code == 404
    assert resp.json() == {"detail": "User not found"}
