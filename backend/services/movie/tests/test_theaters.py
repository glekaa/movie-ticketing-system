async def test_create_theater_success(client):
    # No explicit status_code on this route, so FastAPI's default (200) applies
    # rather than 201 - unlike movies/genres, which do set 201 explicitly.
    resp = await client.post(
        "/api/v1/theaters/", json={"name": "Downtown Cinema", "location": "Main St"}
    )

    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert body["name"] == "Downtown Cinema"
    assert body["screens"] == []


async def test_list_theaters_includes_screens(client, make_theater, make_screen):
    theater = await make_theater(name="Downtown Cinema")
    await make_screen(theater=theater, name="Screen 1")

    resp = await client.get("/api/v1/theaters/")

    assert resp.status_code == 200
    [body] = [t for t in resp.json() if t["id"] == str(theater.id)]
    assert [s["name"] for s in body["screens"]] == ["Screen 1"]


async def test_list_theaters_with_no_screens(client, make_theater):
    await make_theater()

    resp = await client.get("/api/v1/theaters/")

    assert resp.status_code == 200
    assert all(t["screens"] == [] for t in resp.json())


async def test_update_theater_partial_leaves_other_fields(client, make_theater):
    theater = await make_theater(name="Old Name", location="Original Location")

    resp = await client.put(f"/api/v1/theaters/{theater.id}", json={"name": "New Name"})

    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert body["name"] == "New Name"
    assert body["location"] == "Original Location"


async def test_update_theater_not_found(client):
    resp = await client.put(
        "/api/v1/theaters/00000000-0000-0000-0000-000000000000",
        json={"name": "Doesn't matter"},
    )

    assert resp.status_code == 404
    assert resp.json() == {"detail": "Theater not found"}


async def test_create_screen_under_theater(client, make_theater):
    theater = await make_theater()

    resp = await client.post(
        f"/api/v1/theaters/{theater.id}/screens",
        json={"name": "IMAX", "total_rows": 20, "seats_per_row": 30},
    )

    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert body["name"] == "IMAX"
    assert body["total_rows"] == 20
    assert body["seats_per_row"] == 30
