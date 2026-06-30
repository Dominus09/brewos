"""Operational code prefix registry (Identity Engine)."""

from __future__ import annotations

from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, SoftDeleteMixin, TimestampMixin, UUIDPrimaryKeyMixin, brewos_table_args


class OperationalCodePrefix(UUIDPrimaryKeyMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "operational_code_prefixes"
    __table_args__ = brewos_table_args()

    entity_type: Mapped[str] = mapped_column(String(50), nullable=False)
    prefix: Mapped[str] = mapped_column(String(20), nullable=False)
    format_type: Mapped[str] = mapped_column(String(20), nullable=False)
    reset_policy: Mapped[str] = mapped_column(String(20), nullable=False)
    example: Mapped[str | None] = mapped_column(String(50), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    sequences: Mapped[list["OperationalSequence"]] = relationship(
        back_populates="prefix",
    )
