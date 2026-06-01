import enum
import uuid

from sqlalchemy import Enum, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class SeatType(str, enum.Enum):
    standard = "standard"
    vip = "vip"
    love = "love"


class Seat(Base):
    __tablename__ = "seats"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    screen_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("screens.id", ondelete="CASCADE"), nullable=False
    )

    row_label: Mapped[str] = mapped_column(String(1), nullable=False)
    seat_number: Mapped[int] = mapped_column(Integer, nullable=False)
    seat_type: Mapped[SeatType] = mapped_column(
        Enum(SeatType, name="seat_type_enum"), default=SeatType.standard, nullable=False
    )

    screen: Mapped["Screen"] = relationship(back_populates="seats")
