"""Resource ↔ supplier link."""

from __future__ import annotations

import uuid

from sqlalchemy import Boolean, ForeignKey, Index, Integer, Numeric, String, Text, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, SoftDeleteMixin, TimestampMixin, UUIDPrimaryKeyMixin, brewos_table_args


class ResourceSupplier(UUIDPrimaryKeyMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "resource_suppliers"
    __table_args__ = brewos_table_args(
        Index(
            "uq_resource_suppliers_resource_id_supplier_id_active",
            "resource_id",
            "supplier_id",
            unique=True,
            postgresql_where=text("deleted_at IS NULL"),
        ),
        Index(
            "uq_resource_suppliers_resource_id_primary_active",
            "resource_id",
            unique=True,
            postgresql_where=text("is_primary = true AND deleted_at IS NULL"),
        ),
    )

    resource_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("resources.id", name="fk_resource_suppliers_resource_id"),
        nullable=False,
    )
    supplier_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("suppliers.id", name="fk_resource_suppliers_supplier_id"),
        nullable=False,
    )
    supplier_sku: Mapped[str | None] = mapped_column(String(100), nullable=True)
    is_primary: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    last_purchase_price: Mapped[float | None] = mapped_column(
        Numeric(12, 4),
        nullable=True,
    )
    currency: Mapped[str | None] = mapped_column(String(3), nullable=True)
    lead_time_days: Mapped[int | None] = mapped_column(Integer, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    resource: Mapped["Resource"] = relationship(back_populates="resource_suppliers")
    supplier: Mapped["Supplier"] = relationship(back_populates="resource_suppliers")
