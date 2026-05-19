import enum
import uuid
from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy import DateTime, Enum, ForeignKey, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class ShowtimeStatus(str, enum.Enum):
    scheduled = "scheduled"
    completed = "completed"
    cancelled = "cancelled"


class Showtime(Base):
    __tablename__ = "showtimes"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    screen_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("screens.id", ondelete="CASCADE"), nullable=False
    )
    movie_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("movies.id", ondelete="CASCADE"), nullable=False
    )

    start_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    end_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    base_price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)

    status: Mapped[ShowtimeStatus] = mapped_column(
        Enum(ShowtimeStatus, name="showtime_status_enum"),
        default=ShowtimeStatus.scheduled,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    screen: Mapped["Screen"] = relationship(back_populates="showtimes")
    movie: Mapped["Movie"] = relationship(back_populates="showtimes")
