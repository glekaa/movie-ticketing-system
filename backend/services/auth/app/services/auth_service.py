import uuid
from datetime import datetime, timedelta, timezone

import jwt
from fastapi import Depends, HTTPException, status
from pwdlib import PasswordHash
from pydantic import ValidationError
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.models.refresh_token import RefreshToken
from app.models.user import User
from app.schemas.token import RefreshTokenClaims, Token
from app.schemas.user import UserCreate

password_hash = PasswordHash.recommended()

invalid_refresh_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Invalid or expired refresh token",
)


class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db

    def hash_password(self, password: str) -> str:
        return password_hash.hash(password)

    def verify_password(self, plain: str, hashed: str) -> bool:
        return password_hash.verify(plain, hashed)

    def create_access_token(self, user: User) -> str:
        now = datetime.now(timezone.utc)
        payload = {
            "sub": str(user.id),
            "role": user.role.value,
            "type": "access",
            "iat": now,
            "exp": now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
        }
        return jwt.encode(
            payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM
        )

    def create_refresh_token(self, user: User) -> tuple[str, uuid.UUID, datetime]:
        """Returns the encoded token, its jti, and when it expires.

        The jti is generated first so the same value can be embedded in the
        payload and written to the database.
        """
        now = datetime.now(timezone.utc)
        jti = uuid.uuid4()
        expires_at = now + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        payload = {
            "sub": str(user.id),
            "jti": str(jti),
            "type": "refresh",
            "iat": now,
            "exp": expires_at,
        }
        token = jwt.encode(
            payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM
        )
        return token, jti, expires_at

    def _decode_refresh_token(self, token: str) -> RefreshTokenClaims:
        try:
            payload = jwt.decode(
                token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
            )
            # Validation rejects an access token here: its payload has no jti
            # and its `type` is not the "refresh" Literal.
            return RefreshTokenClaims.model_validate(payload)
        except (jwt.InvalidTokenError, ValidationError):
            raise invalid_refresh_exception

    async def _issue_token_pair(
        self, user: User, session_started_at: datetime
    ) -> Token:
        access_token = self.create_access_token(user)
        refresh_token, jti, expires_at = self.create_refresh_token(user)

        self.db.add(
            RefreshToken(
                user_id=user.id,
                jti=jti,
                session_started_at=session_started_at,
                expires_at=expires_at,
            )
        )
        await self.db.commit()

        return Token(access_token=access_token, refresh_token=refresh_token)

    async def register(self, user_in: UserCreate) -> User:
        # Check for existing email
        result = await self.db.execute(select(User).where(User.email == user_in.email))
        if result.scalars().first():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered",
            )

        # Check for existing username
        result = await self.db.execute(
            select(User).where(User.username == user_in.username)
        )
        if result.scalars().first():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Username already taken",
            )

        user = User(
            email=user_in.email,
            username=user_in.username,
            hashed_password=self.hash_password(user_in.password),
        )
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def authenticate_user(self, email: str, password: str) -> User:
        result = await self.db.execute(select(User).where(User.email == email))
        user = result.scalars().first()

        if not user or not self.verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is deactivated",
            )

        return user

    async def login(self, email: str, password: str) -> Token:
        user = await self.authenticate_user(email, password)
        return await self._issue_token_pair(
            user, session_started_at=datetime.now(timezone.utc)
        )

    async def refresh(self, refresh_token: str) -> Token:
        claims = self._decode_refresh_token(refresh_token)

        result = await self.db.execute(
            select(RefreshToken).where(RefreshToken.jti == claims.jti)
        )
        stored = result.scalars().first()

        if stored is None:
            raise invalid_refresh_exception

        now = datetime.now(timezone.utc)

        # Rotated already, or revoked by logout. Dead either way — this session
        # ends, but other sessions the user has are left alone.
        if stored.is_revoked:
            raise invalid_refresh_exception

        # Belt-and-braces: jwt.decode already enforced `exp`, but the stored
        # copy is authoritative if the two ever disagree.
        if stored.expires_at <= now:
            raise invalid_refresh_exception

        session_age = now - stored.session_started_at
        if session_age > timedelta(days=settings.REFRESH_SESSION_MAX_DAYS):
            stored.is_revoked = True
            await self.db.commit()
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Session expired. Please sign in again.",
            )

        user_result = await self.db.execute(
            select(User).where(User.id == stored.user_id)
        )
        user = user_result.scalars().first()

        if user is None:
            raise invalid_refresh_exception

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is deactivated",
            )

        # Rotate: the presented token dies, a new one takes its place. Both the
        # revocation and the new row land in the commit inside _issue_token_pair.
        stored.is_revoked = True

        return await self._issue_token_pair(
            user, session_started_at=stored.session_started_at
        )

    async def logout(self, refresh_token: str) -> None:
        """Revoke a refresh token.

        Deliberately forgiving: if the token is already invalid the caller's
        intent is satisfied anyway, so this never raises.
        """
        try:
            claims = self._decode_refresh_token(refresh_token)
        except HTTPException:
            return

        await self.db.execute(
            update(RefreshToken)
            .where(RefreshToken.jti == claims.jti)
            .values(is_revoked=True)
        )
        await self.db.commit()


async def get_auth_service(db: AsyncSession = Depends(get_db)) -> AuthService:
    return AuthService(db)
