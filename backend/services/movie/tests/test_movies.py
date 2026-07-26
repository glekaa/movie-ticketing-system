from app.models.movie import MovieStatus


async def test_create_movie_success(client):
    resp = await client.post(
        "/api/v1/movies/",
        json={
            "title": "A New Hope",
            "duration_minutes": 121,
            "release_date": "1977-05-25",
        },
    )

    assert resp.status_code == 201, resp.text
    body = resp.json()
    assert body["title"] == "A New Hope"
    assert body["status"] == "coming_soon"
    assert body["genres"] == []


async def test_create_movie_with_genres(client, make_genre):
    action = await make_genre(name="Action", slug="action")
    scifi = await make_genre(name="Sci-Fi", slug="sci-fi")

    resp = await client.post(
        "/api/v1/movies/",
        json={
            "title": "A New Hope",
            "duration_minutes": 121,
            "release_date": "1977-05-25",
            "genre_ids": [str(action.id), str(scifi.id)],
        },
    )

    assert resp.status_code == 201, resp.text
    slugs = {g["slug"] for g in resp.json()["genres"]}
    assert slugs == {"action", "sci-fi"}


async def test_get_movie_success(client, make_movie):
    movie = await make_movie(title="Arrival")

    resp = await client.get(f"/api/v1/movies/{movie.id}")

    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert body["id"] == str(movie.id)
    assert body["title"] == "Arrival"
    # No TMDB_API_KEY in the test environment, so enrichment is a no-op.
    assert body["director"] is None
    assert body["actors"] is None


async def test_get_movie_not_found(client):
    resp = await client.get("/api/v1/movies/00000000-0000-0000-0000-000000000000")

    assert resp.status_code == 404
    assert resp.json() == {"detail": "Movie not found"}


async def test_get_movie_enriches_from_tmdb(client, make_movie, monkeypatch):
    movie = await make_movie(title="Dune")

    tmdb_payload = {
        "vote_average": 8.1,
        "overview": "A noble family becomes embroiled in a war for control of Arrakis.",
        "original_language": "en",
        "credits": {
            "crew": [{"job": "Director", "name": "Denis Villeneuve", "profile_path": "/dv.jpg"}],
            "cast": [{"name": "Timothee Chalamet", "character": "Paul", "profile_path": None}],
        },
    }

    async def fake_fetch(title: str):
        assert title == "Dune"
        return tmdb_payload

    monkeypatch.setattr("app.services.movie_service.fetch_movie_details", fake_fetch)

    resp = await client.get(f"/api/v1/movies/{movie.id}")

    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert body["director"]["name"] == "Denis Villeneuve"
    assert body["actors"][0]["name"] == "Timothee Chalamet"
    assert body["tmdb_rating"] == 8.1
    assert body["language"] == "en"


async def test_list_movies_returns_all(client, make_movie):
    await make_movie(title="One")
    await make_movie(title="Two")

    resp = await client.get("/api/v1/movies/")

    assert resp.status_code == 200
    titles = {m["title"] for m in resp.json()}
    assert titles == {"One", "Two"}


async def test_list_movies_filter_by_status(client, make_movie):
    await make_movie(title="Showing", status=MovieStatus.now_showing)
    await make_movie(title="Archived", status=MovieStatus.archived)

    resp = await client.get("/api/v1/movies/?status=now_showing")

    assert resp.status_code == 200
    titles = {m["title"] for m in resp.json()}
    assert titles == {"Showing"}


async def test_list_movies_filter_by_genre(client, make_movie, make_genre):
    action = await make_genre(name="Action", slug="action")
    await make_movie(title="Action Movie", genres=[action])
    await make_movie(title="Plain Movie")

    resp = await client.get("/api/v1/movies/?genres=action")

    assert resp.status_code == 200
    titles = {m["title"] for m in resp.json()}
    assert titles == {"Action Movie"}


async def test_list_movies_respects_limit(client, make_movie):
    for i in range(3):
        await make_movie()

    resp = await client.get("/api/v1/movies/?limit=2")

    assert resp.status_code == 200
    assert len(resp.json()) == 2


async def test_update_movie_partial_leaves_other_fields(client, make_movie):
    movie = await make_movie(title="Original Title", duration_minutes=100)

    resp = await client.put(f"/api/v1/movies/{movie.id}", json={"title": "Updated Title"})

    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert body["title"] == "Updated Title"
    assert body["duration_minutes"] == 100


async def test_update_movie_can_clear_genres(client, make_movie, make_genre):
    action = await make_genre(name="Action", slug="action")
    movie = await make_movie(genres=[action])

    resp = await client.put(f"/api/v1/movies/{movie.id}", json={"genre_ids": []})

    assert resp.status_code == 200, resp.text
    assert resp.json()["genres"] == []


async def test_update_movie_not_found(client):
    resp = await client.put(
        "/api/v1/movies/00000000-0000-0000-0000-000000000000", json={"title": "Nope"}
    )

    assert resp.status_code == 404
    assert resp.json() == {"detail": "Movie not found"}


async def test_delete_movie_success(client, make_movie):
    movie = await make_movie()

    resp = await client.delete(f"/api/v1/movies/{movie.id}")
    assert resp.status_code == 204

    resp = await client.get(f"/api/v1/movies/{movie.id}")
    assert resp.status_code == 404


async def test_delete_movie_not_found(client):
    resp = await client.delete("/api/v1/movies/00000000-0000-0000-0000-000000000000")

    assert resp.status_code == 404
    assert resp.json() == {"detail": "Movie not found"}
