"""Resource ↔ tag many-to-many link."""

from __future__ import annotations

import uuid

from sqlalchemy import ForeignKey, Index, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, SoftDeleteMixin, TimestampMixin, UUIDPrimaryKeyMixin, brewos_table_args


class ResourceTagLink(UUIDPrimaryKeyMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "resource_tag_links"
    __table_args__ = brewos_table_args(
        Index(
            "uq_resource_tag_links_resource_id_tag_id_active",
            "resource_id",
            "tag_id",
            unique=True,
            postgresql_where=text("deleted_at IS NULL"),
        ),
    )

    resource_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("resources.id", name="fk_resource_tag_links_resource_id"),
        nullable=False,
    )
    tag_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("resource_tags.id", name="fk_resource_tag_links_tag_id"),
        nullable=False,
    )

    resource: Mapped["Resource"] = relationship(back_populates="tag_links")
    tag: Mapped["ResourceTag"] = relationship(back_populates="tag_links")
