"""Audit log persistence derived from domain events (Audit Engine CE-1)."""

from __future__ import annotations

import uuid
from typing import Any

from sqlalchemy.orm import Session

from app.core.events.event_types import EVENT_ACTION_MAP, EventType
from app.models.audit_log import AuditLogEntry
from app.models.domain_event import DomainEvent


class AuditEngine:
    """Creates append-only audit_log rows from domain events or explicit calls."""

    def record(
        self,
        session: Session,
        *,
        entity_type: str,
        action: str,
        entity_id: uuid.UUID | None = None,
        event_id: uuid.UUID | None = None,
        before_data: dict[str, Any] | None = None,
        after_data: dict[str, Any] | None = None,
        actor_id: uuid.UUID | None = None,
    ) -> AuditLogEntry:
        entry = AuditLogEntry(
            event_id=event_id,
            entity_type=entity_type,
            entity_id=entity_id,
            action=action,
            before_data=before_data,
            after_data=after_data,
            actor_id=actor_id,
        )
        session.add(entry)
        session.flush()
        return entry

    def record_from_event(self, session: Session, event: DomainEvent) -> AuditLogEntry:
        """Derive an audit row from a persisted domain event."""
        action = self._resolve_action(event.event_type)
        payload = event.payload or {}
        before_data = payload.get("before")
        after_data = payload.get("after")

        if event.event_type == EventType.OperationalCodeGenerated.value:
            after_data = payload

        return self.record(
            session,
            event_id=event.id,
            entity_type=event.entity_type,
            entity_id=event.entity_id,
            action=action,
            before_data=before_data,
            after_data=after_data,
            actor_id=event.created_by,
        )

    @staticmethod
    def _resolve_action(event_type: str) -> str:
        try:
            return EVENT_ACTION_MAP[EventType(event_type)]
        except (ValueError, KeyError):
            return event_type
