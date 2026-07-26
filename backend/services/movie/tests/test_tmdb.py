from app.services.tmdb import TMDB_IMAGE_BASE_URL, _get_image_url, extract_tmdb_fields, fetch_movie_details


async def test_fetch_movie_details_returns_none_without_api_key():
    # conftest forces TMDB_API_KEY="" for the whole test session, so this
    # must short-circuit rather than attempt a real network call.
    result = await fetch_movie_details("Anything")
    assert result is None


def test_get_image_url_none_for_missing_path():
    assert _get_image_url(None) is None


def test_get_image_url_builds_full_url():
    assert _get_image_url("/poster.jpg") == f"{TMDB_IMAGE_BASE_URL}/poster.jpg"


def test_extract_tmdb_fields_full_payload():
    data = {
        "vote_average": 7.5,
        "overview": "A plot summary.",
        "original_language": "en",
        "credits": {
            "crew": [
                {"job": "Producer", "name": "Someone Else"},
                {"job": "Director", "name": "Jane Director", "profile_path": "/jd.jpg"},
            ],
            "cast": [
                {"name": f"Actor {i}", "character": f"Character {i}", "profile_path": None}
                for i in range(7)
            ],
        },
    }

    fields = extract_tmdb_fields(data)

    assert fields["director"].name == "Jane Director"
    assert fields["director"].profile_url == f"{TMDB_IMAGE_BASE_URL}/jd.jpg"
    # Only the top 5 cast members are kept.
    assert len(fields["actors"]) == 5
    assert fields["actors"][0].character == "Character 0"
    assert fields["tmdb_rating"] == 7.5
    assert fields["plot"] == "A plot summary."
    assert fields["language"] == "en"


def test_extract_tmdb_fields_without_director():
    data = {"credits": {"crew": [{"job": "Producer", "name": "Someone"}], "cast": []}}

    fields = extract_tmdb_fields(data)

    assert fields["director"] is None
    assert fields["actors"] == []


def test_extract_tmdb_fields_missing_credits_key():
    fields = extract_tmdb_fields({"vote_average": 5.0})

    assert fields["director"] is None
    assert fields["actors"] == []
    assert fields["tmdb_rating"] == 5.0
