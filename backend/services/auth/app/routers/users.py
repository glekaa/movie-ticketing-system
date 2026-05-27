from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.deps import require_admin
from app.models.user import User, UserRole
from app.schemas.user import UserResponse
from app.services.user_service import UserService, get_user_service

router = APIRouter(prefix="/users", tags=["users"])


class RoleUpdate(BaseModel):
    role: UserRole


@router.get("/", response_model=list[UserResponse])
async def get_users(
    skip: int = 0,
    limit: int = 100,
    _admin: Annotated[User, Depends(require_admin)] = None,
    user_service: UserService = Depends(get_user_service),
):
    return await user_service.get_users(skip=skip, limit=limit)


@router.put("/{user_id}/role", response_model=UserResponse)
async def update_user_role(
    user_id: UUID,
    body: RoleUpdate,
    _admin: Annotated[User, Depends(require_admin)] = None,
    user_service: UserService = Depends(get_user_service),
):
    return await user_service.update_user_role(user_id, body.role)
