"""Read operational code prefixes from the database registry."""

from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.identity.exceptions import InactivePrefixError, PrefixNotFoundError
from app.models.operational_code_prefix import OperationalCodePrefix


def get_by_entity_type(session: Session, entity_type: str) -> OperationalCodePrefix:
    """Resolve an active prefix by entity_type (e.g. resource → BREW-RES)."""
    row = session.scalar(
        select(OperationalCodePrefix).where(
            OperationalCodePrefix.entity_type == entity_type,
            OperationalCodePrefix.deleted_at.is_(None),
        )
    )
    if row is None:
        raise PrefixNotFoundError(f"No prefix registered for entity_type={entity_type!r}")
    if not row.is_active:
        raise InactivePrefixError(f"Prefix for entity_type={entity_type!r} is inactive")
    return row


def get_by_prefix(session: Session, prefix: str) -> OperationalCodePrefix:
    """Resolve an active prefix by its visible prefix string (e.g. DIS, BREW-RES)."""
    row = session.scalar(
        select(OperationalCodePrefix).where(
            OperationalCodePrefix.prefix == prefix,
            OperationalCodePrefix.deleted_at.is_(None),
        )
    )
    if row is None:
        raise PrefixNotFoundError(f"No prefix registered for prefix={prefix!r}")
    if not row.is_active:
        raise InactivePrefixError(f"Prefix {prefix!r} is inactive")
    return row
