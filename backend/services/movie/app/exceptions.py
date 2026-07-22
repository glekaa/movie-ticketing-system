"""Domain errors raised by the service layer.

Nothing here imports FastAPI — services describe what went wrong, and
app.error_handlers turns that into an HTTP response.

The base classes are deliberately identical to the auth service's. They belong
in the shared package once it exists; duplicating them now is the lesser evil
compared to leaving HTTP concerns in the business logic.
"""


class AppError(Exception):
    """Base for every domain error."""

    status_code: int = 500
    detail: str = "Internal server error"
    headers: dict[str, str] | None = None

    def __init__(self, detail: str | None = None) -> None:
        if detail is not None:
            self.detail = detail
        super().__init__(self.detail)


class NotFoundError(AppError):
    status_code = 404
    detail = "Resource not found"


class MovieNotFound(NotFoundError):
    detail = "Movie not found"


class TheaterNotFound(NotFoundError):
    detail = "Theater not found"
