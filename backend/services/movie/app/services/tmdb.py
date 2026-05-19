import logging
from typing import Any

import httpx

from app.config import settings
from app.schemas.movie import Person

logger = logging.getLogger(__name__)

TMDB_API_URL = "https://api.themoviedb.org/3"
TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"

async def fetch_movie_details(title: str) -> dict[str, Any] | None:
    """
    Fetch movie details from TMDB API by title.
    Returns a dict with movie details including cast and crew.
    Returns None if the movie is not found or request fails.
    """
    if not settings.TMDB_API_KEY:
        logger.warning("TMDB_API_KEY is not set.")
        return None

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # 1. Search for the movie by title
            search_params = {
                "api_key": settings.TMDB_API_KEY,
                "query": title,
            }
            search_res = await client.get(f"{TMDB_API_URL}/search/movie", params=search_params)
            search_res.raise_for_status()
            
            results = search_res.json().get("results", [])
            if not results:
                logger.warning("TMDB returned no results for '%s'", title)
                return None
            
            movie_id = results[0]["id"]
            
            # 2. Fetch full details with credits
            details_params = {
                "api_key": settings.TMDB_API_KEY,
                "append_to_response": "credits",
            }
            details_res = await client.get(f"{TMDB_API_URL}/movie/{movie_id}", params=details_params)
            details_res.raise_for_status()
            
            data = details_res.json()
            logger.info("TMDB data fetched for '%s' (ID: %d)", title, movie_id)
            return data

    except httpx.HTTPStatusError as e:
        logger.error("TMDB HTTP error for '%s': %s", title, e)
        return None
    except httpx.RequestError as e:
        logger.error("TMDB request failed for '%s': %s", title, e)
        return None

def _get_image_url(path: str | None) -> str | None:
    if not path:
        return None
    return f"{TMDB_IMAGE_BASE_URL}{path}"

def extract_tmdb_fields(data: dict[str, Any]) -> dict[str, Any]:
    """
    Extract the fields we care about from a raw TMDB response.
    """
    credits = data.get("credits", {})
    cast = credits.get("cast", [])
    crew = credits.get("crew", [])
    
    # Find the director
    director_data = next((c for c in crew if c.get("job") == "Director"), None)
    director = None
    if director_data:
        director = Person(
            name=director_data.get("name"),
            profile_url=_get_image_url(director_data.get("profile_path")),
            job="Director"
        )
    
    # Get top 5 actors
    actors = []
    for actor_data in cast[:5]:
        actors.append(
            Person(
                name=actor_data.get("name"),
                profile_url=_get_image_url(actor_data.get("profile_path")),
                character=actor_data.get("character")
            )
        )
        
    return {
        "director": director,
        "actors": actors,
        "tmdb_rating": data.get("vote_average"),
        "plot": data.get("overview"),
        "language": data.get("original_language"),
    }
