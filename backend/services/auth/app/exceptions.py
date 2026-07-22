"""Domain errors raised by the service layer.

Nothing here imports FastAPI. Services describe *what went wrong* in domain
terms; translating that into an HTTP response is the transport layer's job and
lives in app.error_handlers. That keeps the services callable from anywhere —
a test, a CLI, a future Kafka consumer — without dragging in a web framework.

``status_code`` is carried on the class because it expresses the *category* of
failure (conflict, not found, unauthorised), which is part of the error's
meaning rather than a transport detail. A separate mapping table would only
drift out of sync with the exceptions it maps.
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


# --- Categories -------------------------------------------------------------


class NotFoundError(AppError):
    status_code = 404
    detail = "Resource not found"


class ConflictError(AppError):
    status_code = 409
    detail = "Resource already exists"


class AuthenticationError(AppError):
    """The caller could not be identified."""

    status_code = 401
    detail = "Could not validate credentials"
    headers = {"WWW-Authenticate": "Bearer"}


class ForbiddenError(AppError):
    """The caller is known, but not allowed to do this."""

    status_code = 403
    detail = "Operation not permitted"


# --- Concrete errors --------------------------------------------------------


class UserNotFound(NotFoundError):
    detail = "User not found"


class EmailAlreadyRegistered(ConflictError):
    detail = "Email already registered"


class UsernameAlreadyTaken(ConflictError):
    detail = "Username already taken"


class InvalidCredentials(AuthenticationError):
    detail = "Invalid username or password"


class InvalidRefreshToken(AuthenticationError):
    detail = "Invalid or expired refresh token"
    # No WWW-Authenticate: this is a token in a request body, not a bearer
    # challenge, so advertising the bearer scheme here would be misleading.
    headers = None


class SessionExpired(AuthenticationError):
    detail = "Session expired. Please sign in again."
    headers = None


class InactiveAccount(ForbiddenError):
    detail = "Account is deactivated"


class AdminRequired(ForbiddenError):
    detail = "Admin privileges required"
