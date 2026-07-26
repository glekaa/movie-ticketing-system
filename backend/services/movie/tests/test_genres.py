async def test_create_genre_success(client):
    resp = await client.post("/api/v1/genres/", json={"name": "Action", "slug": "action"})

    assert resp.status_code == 201, resp.text
    body = resp.json()
    assert body["name"] == "Action"
    assert body["slug"] == "action"
    assert "id" in body


async def test_list_genres_returns_created_genres(client, make_genre):
    await make_genre(name="Action", slug="action")
    await make_genre(name="Comedy", slug="comedy")

    resp = await client.get("/api/v1/genres/")

    assert resp.status_code == 200
    slugs = {g["slug"] for g in resp.json()}
    assert slugs == {"action", "comedy"}


async def test_list_genres_respects_limit(client, make_genre):
    for i in range(3):
        await make_genre()

    resp = await client.get("/api/v1/genres/?limit=2")

    assert resp.status_code == 200
    assert len(resp.json()) == 2


async def test_list_genres_respects_skip(client, make_genre):
    await make_genre(name="First", slug="first")
    await make_genre(name="Second", slug="second")

    resp = await client.get("/api/v1/genres/?skip=1&limit=10")

    assert resp.status_code == 200
    assert len(resp.json()) == 1
