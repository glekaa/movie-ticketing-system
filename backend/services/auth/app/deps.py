from typing import Annotated

import jwt
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import ValidationError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.exceptions import AdminRequired, AuthenticationError, InactiveAccount
from app.models.user import User, UserRole
from app.schemas.token import AccessTokenClaims

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: AsyncSession = Depends(get_db),
) -> User:
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
        )
        # Both token types are signed with the same secret, so a valid signature
        # is not enough. Validating against AccessTokenClaims rejects a refresh
        # token, which would otherwise work here as a 7-day credential.
        claims = AccessTokenClaims.model_validate(payload)
    except (jwt.InvalidTokenError, ValidationError):
        raise AuthenticationError

    result = await db.execute(select(User).where(User.id == claims.sub))
    user = result.scalars().first()

    if user is None:
        raise AuthenticationError

    if not user.is_active:
        raise InactiveAccount

    return user


async def require_admin(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    if current_user.role != UserRole.admin:
        raise AdminRequired
    return current_user
