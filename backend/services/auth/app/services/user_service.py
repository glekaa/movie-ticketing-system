from uuid import UUID

from fastapi import Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User, UserRole


class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_users(self, skip: int = 0, limit: int = 100) -> list[User]:
        result = await self.db.execute(select(User).offset(skip).limit(limit))
        return list(result.scalars().all())

    async def get_user_by_id(self, user_id: UUID) -> User:
        result = await self.db.execute(select(User).where(User.id == user_id))
        user = result.scalars().first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )
        return user

    async def update_user_role(self, user_id: UUID, role: UserRole) -> User:
        user = await self.get_user_by_id(user_id)
        user.role = role
        await self.db.commit()
        await self.db.refresh(user)
        # TODO: Publish user.role_changed Kafka event
        return user


async def get_user_service(db: AsyncSession = Depends(get_db)) -> UserService:
    return UserService(db)
