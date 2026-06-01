from uuid import UUID

from pydantic import BaseModel, ConfigDict


class ScreenBase(BaseModel):
    name: str
    total_rows: int
    seats_per_row: int


class ScreenResponse(ScreenBase):
    id: UUID

    model_config = ConfigDict(from_attributes=True)
