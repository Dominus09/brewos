"""Business line (industry) configuration."""

from sqlalchemy import Boolean, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, SoftDeleteMixin, TimestampMixin, UUIDPrimaryKeyMixin


class BusinessLine(UUIDPrimaryKeyMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "business_lines"

    code: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    settings: Mapped[dict | None] = mapped_column(JSONB, nullable=True)

    resource_types: Mapped[list["ResourceType"]] = relationship(
        back_populates="business_line",
    )
    resource_categories: Mapped[list["ResourceCategory"]] = relationship(
        back_populates="business_line",
    )
    resources: Mapped[list["Resource"]] = relationship(
        back_populates="business_line",
    )
