"""SQLAlchemy declarative base and shared mixins."""

import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import DateTime, MetaData, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

from app.core.database_schema import DATABASE_SCHEMA

brewos_metadata = MetaData(schema=DATABASE_SCHEMA)


class Base(DeclarativeBase):
    """All BrewOS ORM models inherit schema brewos via shared metadata."""

    metadata = brewos_metadata


def brewos_table_args(*constraints: Any) -> tuple[Any, ...]:
    """Combine constraints/indexes with the brewos schema for models that define __table_args__."""
    if constraints:
        return (*constraints, {"schema": DATABASE_SCHEMA})
    return ({"schema": DATABASE_SCHEMA},)


class UUIDPrimaryKeyMixin:
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=func.gen_random_uuid(),
    )


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


class SoftDeleteMixin:
    deleted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
