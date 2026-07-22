from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel

from app.models.user import UserRole


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str


class AccessTokenClaims(BaseModel):
    """Payload of an access token.

    ``type`` is a Literal on purpose: validating a decoded payload against this
    model makes a refresh token fail automatically, so the access-only guard is
    a property of the type rather than a check someone can forget to write.
    """

    sub: UUID
    role: UserRole
    type: Literal["access"]
    exp: datetime
    iat: datetime


class RefreshTokenClaims(BaseModel):
    """Payload of a refresh token.

    Deliberately carries no role: it lives for days, so any authorisation data
    baked into it would go stale (a demoted admin would keep admin rights until
    it expired). Identity only — everything else is looked up at refresh time.
    """

    sub: UUID
    jti: UUID
    type: Literal["refresh"]
    exp: datetime
    iat: datetime
