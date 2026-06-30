"""Units of measure."""

from __future__ import annotations

import uuid

from sqlalchemy import Boolean, ForeignKey, Integer, Numeric, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, SoftDeleteMixin, TimestampMixin, UUIDPrimaryKeyMixin


class Unit(UUIDPrimaryKeyMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "units"

    code: Mapped[str] = mapped_column(String(20), nullable=False, unique=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    symbol: Mapped[str] = mapped_column(String(20), nullable=False)
    unit_type: Mapped[str] = mapped_column(String(30), nullable=False)
    is_base: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    base_unit_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("units.id", name="fk_units_base_unit_id"),
        nullable=True,
    )
    conversion_factor: Mapped[float | None] = mapped_column(
        Numeric(18, 8),
        nullable=True,
    )
    decimal_places: Mapped[int] = mapped_column(Integer, nullable=False, default=2)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="active")

    base_unit: Mapped["Unit | None"] = relationship(
        remote_side="Unit.id",
        back_populates="derived_units",
    )
    derived_units: Mapped[list["Unit"]] = relationship(
        back_populates="base_unit",
    )
    resources: Mapped[list["Resource"]] = relationship(
        back_populates="unit",
    )
