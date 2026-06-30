"""Identity Engine facade — single entry point for operational codes."""

from __future__ import annotations

from datetime import date

from sqlalchemy.orm import Session

from app.core.identity.code_generator import generate_master_code, generate_operation_code
from app.core.identity.prefix_registry import get_by_prefix


class IdentityEngine:
    """Assigns operational codes from database-backed prefixes and transactional sequences."""

    def assign_master_code(self, session: Session, entity_type: str) -> str:
        """Assign a persistent master code (e.g. BREW-RES-000001)."""
        return generate_master_code(session, entity_type)

    def assign_operation_code(
        self,
        session: Session,
        *,
        entity_type: str | None = None,
        prefix: str | None = None,
        operation_date: date | None = None,
    ) -> str:
        """Assign a daily operation code (e.g. DIS-20260701-001)."""
        return generate_operation_code(
            session,
            entity_type=entity_type,
            prefix=prefix,
            operation_date=operation_date,
        )

    def validate_prefix(self, session: Session, prefix: str) -> bool:
        """Return True if prefix is registered and active."""
        try:
            get_by_prefix(session, prefix)
        except Exception:
            return False
        return True
