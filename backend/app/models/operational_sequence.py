"""Transactional sequence counters per operational prefix."""

from __future__ import annotations

import uuid
from datetime import date

from sqlalchemy import Date, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin, UUIDPrimaryKeyMixin, brewos_table_args


class OperationalSequence(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "operational_sequences"
    __table_args__ = brewos_table_args()

    prefix_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(
            "operational_code_prefixes.id",
            name="fk_operational_sequences_prefix_id",
            ondelete="RESTRICT",
        ),
        nullable=False,
    )
    sequence_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    current_value: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    prefix: Mapped["OperationalCodePrefix"] = relationship(
        back_populates="sequences",
    )
