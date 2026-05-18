from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.models.showtime import ShowtimeStatus


class ShowtimeBase(BaseModel):
    start_time: datetime
    end_time: datetime
    base_price: Decimal
    status: ShowtimeStatus


class ShowtimeCreate(ShowtimeBase):
    screen_id: UUID
    movie_id: UUID


class ShowtimeResponse(ShowtimeBase):
    id: UUID
    screen_id: UUID

    model_config = ConfigDict(from_attributes=True)
