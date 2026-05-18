import uuid

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Screen(Base):
    __tablename__ = "screens"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    theater_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("theaters.id", ondelete="CASCADE"), nullable=False
    )

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    total_rows: Mapped[int] = mapped_column(Integer, nullable=False)
    seats_per_row: Mapped[int] = mapped_column(Integer, nullable=False)

    theater: Mapped["Theater"] = relationship(back_populates="screens")
    seats: Mapped[list["Seat"]] = relationship(back_populates="screen")
    showtimes: Mapped[list["Showtime"]] = relationship(back_populates="screen")
