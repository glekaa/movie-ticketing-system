from uuid import UUID

from pydantic import BaseModel, ConfigDict


class GenreBase(BaseModel):
    name: str
    slug: str


class GenreCreate(GenreBase):
    pass


class GenreUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None


class GenreResponse(GenreBase):
    id: UUID

    model_config = ConfigDict(from_attributes=True)
