"""Domain event emission (Event Engine CE-1)."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING, Any

from sqlalchemy.orm import Session

from app.core.events.event_types import EventType
from app.models.domain_event import DomainEvent

if TYPE_CHECKING:
    from app.core.audit.audit_engine import AuditEngine


class EventEngine:
    """Persists domain events and optionally derives audit records."""

    def __init__(self, audit_engine: AuditEngine | None = None) -> None:
        if audit_engine is None:
            from app.core.audit.audit_engine import AuditEngine as _AuditEngine

            audit_engine = _AuditEngine()
        self._audit_engine = audit_engine

    def emit(
        self,
        session: Session,
        *,
        event_type: EventType | str,
        entity_type: str,
        entity_id: uuid.UUID | None = None,
        internal_code: str | None = None,
        payload: dict[str, Any] | None = None,
        occurred_at: datetime | None = None,
        created_by: uuid.UUID | None = None,
        record_audit: bool = True,
    ) -> DomainEvent:
        """Emit a domain event within the current database transaction."""
        resolved_type = (
            event_type.value if isinstance(event_type, EventType) else event_type
        )
        event = DomainEvent(
            event_type=resolved_type,
            entity_type=entity_type,
            entity_id=entity_id,
            internal_code=internal_code,
            payload=payload or {},
            occurred_at=occurred_at or datetime.now(timezone.utc),
            created_by=created_by,
        )
        session.add(event)
        session.flush()

        if record_audit:
            self._audit_engine.record_from_event(session, event)

        return event

    def emit_resource_created(
        self,
        session: Session,
        *,
        entity_id: uuid.UUID,
        internal_code: str,
        after_data: dict[str, Any],
        created_by: uuid.UUID | None = None,
    ) -> DomainEvent:
        return self.emit(
            session,
            event_type=EventType.ResourceCreated,
            entity_type="resource",
            entity_id=entity_id,
            internal_code=internal_code,
            payload={"after": after_data},
            created_by=created_by,
        )

    def emit_resource_updated(
        self,
        session: Session,
        *,
        entity_id: uuid.UUID,
        internal_code: str,
        before_data: dict[str, Any],
        after_data: dict[str, Any],
        created_by: uuid.UUID | None = None,
    ) -> DomainEvent:
        return self.emit(
            session,
            event_type=EventType.ResourceUpdated,
            entity_type="resource",
            entity_id=entity_id,
            internal_code=internal_code,
            payload={"before": before_data, "after": after_data},
            created_by=created_by,
        )

    def emit_resource_archived(
        self,
        session: Session,
        *,
        entity_id: uuid.UUID,
        internal_code: str,
        before_data: dict[str, Any],
        created_by: uuid.UUID | None = None,
    ) -> DomainEvent:
        return self.emit(
            session,
            event_type=EventType.ResourceArchived,
            entity_type="resource",
            entity_id=entity_id,
            internal_code=internal_code,
            payload={"before": before_data},
            created_by=created_by,
        )

    def emit_operational_code_generated(
        self,
        session: Session,
        *,
        entity_type: str,
        internal_code: str,
        prefix: str,
        format_type: str,
        entity_id: uuid.UUID | None = None,
        created_by: uuid.UUID | None = None,
    ) -> DomainEvent:
        return self.emit(
            session,
            event_type=EventType.OperationalCodeGenerated,
            entity_type=entity_type,
            entity_id=entity_id,
            internal_code=internal_code,
            payload={
                "prefix": prefix,
                "format_type": format_type,
                "internal_code": internal_code,
            },
            created_by=created_by,
        )
