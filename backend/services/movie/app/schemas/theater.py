from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.schemas.screen import ScreenResponse


class TheaterBase(BaseModel):
    name: str
    location: str


class TheaterCreate(TheaterBase):
    pass


class TheaterResponse(TheaterBase):
    id: UUID
    screens: list[ScreenResponse]

    model_config = ConfigDict(from_attributes=True)
