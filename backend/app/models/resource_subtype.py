"""Resource subtype within a resource type."""

from __future__ import annotations

import uuid

from sqlalchemy import ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, SoftDeleteMixin, TimestampMixin, UUIDPrimaryKeyMixin


class ResourceSubtype(UUIDPrimaryKeyMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "resource_subtypes"
    __table_args__ = (
        UniqueConstraint(
            "resource_type_id",
            "code",
            name="uq_resource_subtypes_resource_type_id_code",
        ),
    )

    resource_type_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("resource_types.id", name="fk_resource_subtypes_resource_type_id"),
        nullable=False,
    )
    code: Mapped[str] = mapped_column(String(50), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    default_flags: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="active")

    resource_type: Mapped["ResourceType"] = relationship(
        back_populates="subtypes",
    )
    resources: Mapped[list["Resource"]] = relationship(
        back_populates="resource_subtype",
    )
