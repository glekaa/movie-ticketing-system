from typing import Annotated

from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm

from app.deps import get_current_user
from app.models.user import User
from app.schemas.token import RefreshRequest, Token
from app.schemas.user import UserCreate, UserResponse
from app.services.auth_service import AuthService, get_auth_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_in: UserCreate,
    auth_service: AuthService = Depends(get_auth_service),
):
    return await auth_service.register(user_in)


@router.post("/login", response_model=Token)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    auth_service: AuthService = Depends(get_auth_service),
):
    return await auth_service.login(form_data.username, form_data.password)


@router.post("/refresh", response_model=Token)
async def refresh(
    body: RefreshRequest,
    auth_service: AuthService = Depends(get_auth_service),
):
    return await auth_service.refresh(body.refresh_token)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    body: RefreshRequest,
    auth_service: AuthService = Depends(get_auth_service),
):
    # No get_current_user dependency on purpose: the refresh token in the body
    # is the credential. Requiring a live access token would make logout fail
    # in exactly the case it is needed most — an expired session.
    await auth_service.logout(body.refresh_token)


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: Annotated[User, Depends(get_current_user)]):
    return current_user
