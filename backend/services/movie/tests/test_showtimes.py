async def test_create_showtime_success(client, make_movie, make_screen):
    movie = await make_movie()
    screen = await make_screen()

    resp = await client.post(
        "/api/v1/showtimes",
        json={
            "movie_id": str(movie.id),
            "screen_id": str(screen.id),
            "start_time": "2026-06-01T18:00:00Z",
            "end_time": "2026-06-01T20:00:00Z",
            "base_price": "12.50",
            "status": "scheduled",
        },
    )

    # No explicit status_code on this route, so FastAPI's default (200) applies.
    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert body["screen_id"] == str(screen.id)
    assert body["base_price"] == "12.50"
    assert body["status"] == "scheduled"


async def test_get_movie_showtimes_returns_only_that_movies_showtimes(
    client, make_movie, make_showtime
):
    movie = await make_movie()
    other_movie = await make_movie()
    await make_showtime(movie=movie)
    await make_showtime(movie=movie)
    await make_showtime(movie=other_movie)

    resp = await client.get(f"/api/v1/movies/{movie.id}/showtimes")

    assert resp.status_code == 200
    assert len(resp.json()) == 2


async def test_get_movie_showtimes_empty_for_movie_with_none(client, make_movie):
    movie = await make_movie()

    resp = await client.get(f"/api/v1/movies/{movie.id}/showtimes")

    assert resp.status_code == 200
    assert resp.json() == []
