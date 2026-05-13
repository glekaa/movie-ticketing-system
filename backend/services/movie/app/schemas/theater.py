from uuid import UUID

from pydantic import BaseModel, ConfigDict


class TheaterBase(BaseModel):
    name: str
    location: str


class TheaterCreate(TheaterBase):
    pass


class TheaterResponse(TheaterBase):
    id: UUID

    model_config = ConfigDict(from_attributes=True)
