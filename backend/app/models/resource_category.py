"""Hierarchical resource categories."""

from __future__ import annotations

import uuid

from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, SoftDeleteMixin, TimestampMixin, UUIDPrimaryKeyMixin


class ResourceCategory(UUIDPrimaryKeyMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "resource_categories"

    resource_type_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("resource_types.id", name="fk_resource_categories_resource_type_id"),
        nullable=True,
    )
    parent_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("resource_categories.id", name="fk_resource_categories_parent_id"),
        nullable=True,
    )
    business_line_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("business_lines.id", name="fk_resource_categories_business_line_id"),
        nullable=True,
    )
    code: Mapped[str | None] = mapped_column(String(50), nullable=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="active")

    resource_type: Mapped["ResourceType | None"] = relationship(
        back_populates="categories",
    )
    business_line: Mapped["BusinessLine | None"] = relationship(
        back_populates="resource_categories",
    )
    parent: Mapped["ResourceCategory | None"] = relationship(
        remote_side="ResourceCategory.id",
        back_populates="children",
    )
    children: Mapped[list["ResourceCategory"]] = relationship(
        back_populates="parent",
    )
    resources: Mapped[list["Resource"]] = relationship(
        back_populates="resource_category",
    )
