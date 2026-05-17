import logging
from typing import Any

import httpx

from app.config import settings

logger = logging.getLogger(__name__)

OMDB_BASE_URL = "https://www.omdbapi.com/"


async def fetch_movie_details(title: str) -> dict[str, Any] | None:
    params = {
        "apikey": settings.OMDB_API_KEY,
        "t": title,
        "type": "movie",
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(OMDB_BASE_URL, params=params)
            response.raise_for_status()

        data = response.json()

        if data.get("Response") == "False":
            logger.warning("OMDB returned no results for '%s': %s", title, data.get("Error"))
            return None

        logger.info("OMDB data fetched for '%s'", title)
        return data

    except httpx.HTTPStatusError as e:
        logger.error("OMDB HTTP error for '%s': %s", title, e)
        return None
    except httpx.RequestError as e:
        logger.error("OMDB request failed for '%s': %s", title, e)
        return None


def extract_omdb_fields(data: dict[str, Any]) -> dict[str, Any]:
    return {
        "director": data.get("Director", "N/A"),
        "actors": data.get("Actors", "N/A"),
        "imdb_rating": data.get("imdbRating", "N/A"),
        "plot": data.get("Plot", "N/A"),
        "country": data.get("Country", "N/A"),
        "language": data.get("Language", "N/A"),
        "awards": data.get("Awards", "N/A"),
    }
