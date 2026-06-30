"""Resource photos."""

from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Index, String, Text, func, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, SoftDeleteMixin, TimestampMixin, UUIDPrimaryKeyMixin, brewos_table_args


class ResourcePhoto(UUIDPrimaryKeyMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "resource_photos"
    __table_args__ = brewos_table_args(
        Index(
            "uq_resource_photos_resource_id_primary_active",
            "resource_id",
            unique=True,
            postgresql_where=text("is_primary = true AND deleted_at IS NULL"),
        ),
    )

    resource_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("resources.id", name="fk_resource_photos_resource_id"),
        nullable=False,
    )
    photo_url: Mapped[str] = mapped_column(String(2048), nullable=False)
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    is_primary: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    caption: Mapped[str | None] = mapped_column(Text, nullable=True)
    uploaded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    resource: Mapped["Resource"] = relationship(back_populates="resource_photos")
