"""Smoke test for ResourceService + Core Engine (CE-2).

Run from backend/ after migrations 001-004 and seeds:

    .\\.venv\\Scripts\\python.exe -m scripts.resource_smoke_test
"""

from __future__ import annotations

from sqlalchemy import func, select

from app.db.session import SessionLocal
from app.models.audit_log import AuditLogEntry
from app.models.domain_event import DomainEvent
from app.models.operational_code_prefix import OperationalCodePrefix
from app.models.operational_sequence import OperationalSequence
from app.models.resource import Resource
from app.models.resource_type import ResourceType
from app.models.unit import Unit
from app.repositories.base import active_only
from app.schemas.resource import ResourceCreate
from app.services.resource_service import ResourceService


def main() -> None:
    with SessionLocal() as session:
        supply_type = session.scalars(
            active_only(
                select(ResourceType).where(ResourceType.code == "supply"),
                ResourceType,
            )
        ).first()
        liter_unit = session.scalars(
            active_only(select(Unit).where(Unit.code == "l"), Unit),
        ).first()

        if supply_type is None or liter_unit is None:
            raise SystemExit("Run seeds first (supply type and liter unit required).")

        service = ResourceService(session)

        with session.begin():
            draft = service.create_draft(
                ResourceCreate(
                    name="Alcohol Etílico 96°",
                    resource_type_id=supply_type.id,
                    unit_id=liter_unit.id,
                    description="Insumo base destilería",
                    is_inventoriable=True,
                    is_consumable=True,
                )
            )
            draft_id = draft.id
            assert draft.internal_code is None
            assert draft.status == "draft"

            published = service.publish(draft_id)
            assert published.internal_code is not None
            assert published.internal_code.startswith("BREW-RES-")
            assert published.status == "active"

        prefix = session.scalar(
            select(OperationalCodePrefix).where(
                OperationalCodePrefix.entity_type == "resource",
                OperationalCodePrefix.deleted_at.is_(None),
            )
        )
        seq = session.scalar(
            select(OperationalSequence).where(
                OperationalSequence.prefix_id == prefix.id,
                OperationalSequence.sequence_date.is_(None),
            )
        )
        expected_code = f"BREW-RES-{seq.current_value:06d}"
        if published.internal_code != expected_code:
            raise SystemExit(
                f"Code mismatch: got {published.internal_code}, expected {expected_code}"
            )

        # On a clean DB (no prior Identity smoke), first published resource is BREW-RES-000001
        resource_count = session.scalar(
            select(func.count()).select_from(Resource).where(Resource.internal_code.isnot(None))
        )

        event_count = session.scalar(
            select(func.count())
            .select_from(DomainEvent)
            .where(DomainEvent.entity_id == draft_id)
        )
        audit_count = session.scalar(
            select(func.count())
            .select_from(AuditLogEntry)
            .where(AuditLogEntry.entity_id == draft_id)
        )

        print(f"Draft created:   {draft_id}")
        print(f"Published code:  {published.internal_code}")
        if resource_count == 1 and published.internal_code == "BREW-RES-000001":
            print("Clean DB check:  BREW-RES-000001 OK")
        print(f"Domain events:   {event_count}")
        print(f"Audit log rows:  {audit_count}")

        if not event_count or event_count < 2:
            raise SystemExit("Expected at least 2 domain events (code + created)")
        if not audit_count or audit_count < 2:
            raise SystemExit("Expected at least 2 audit_log rows")


if __name__ == "__main__":
    main()
