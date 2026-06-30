"""Core resource entity."""

from __future__ import annotations

import uuid

from sqlalchemy import Boolean, ForeignKey, Numeric, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, SoftDeleteMixin, TimestampMixin, UUIDPrimaryKeyMixin


class Resource(UUIDPrimaryKeyMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "resources"

    internal_code: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    resource_type_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("resource_types.id", name="fk_resources_resource_type_id"),
        nullable=False,
    )
    resource_subtype_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("resource_subtypes.id", name="fk_resources_resource_subtype_id"),
        nullable=True,
    )
    resource_category_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("resource_categories.id", name="fk_resources_resource_category_id"),
        nullable=True,
    )
    business_line_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("business_lines.id", name="fk_resources_business_line_id"),
        nullable=True,
    )
    unit_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("units.id", name="fk_resources_unit_id"),
        nullable=False,
    )

    status: Mapped[str] = mapped_column(String(20), nullable=False, default="draft")

    is_inventoriable: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    is_consumable: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    is_cultivable: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    is_equipment: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    is_sellable: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    is_traceable: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    requires_lot: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    requires_expiry: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    requires_tech_sheet: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    requires_safety_sheet: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    min_stock: Mapped[float | None] = mapped_column(Numeric(12, 4), nullable=True)

    resource_type: Mapped["ResourceType"] = relationship(
        back_populates="resources",
    )
    resource_subtype: Mapped["ResourceSubtype | None"] = relationship(
        back_populates="resources",
    )
    resource_category: Mapped["ResourceCategory | None"] = relationship(
        back_populates="resources",
    )
    business_line: Mapped["BusinessLine | None"] = relationship(
        back_populates="resources",
    )
    unit: Mapped["Unit"] = relationship(
        back_populates="resources",
    )
