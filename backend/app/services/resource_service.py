"""Resource domain service — orchestrates Core Engine (CE-2)."""

from __future__ import annotations

from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.audit import AuditEngine
from app.core.events import EventEngine
from app.core.identity import IdentityEngine
from app.core.identity.prefix_registry import get_by_entity_type
from app.models.resource import Resource
from app.models.resource_type import ResourceType
from app.models.unit import Unit
from app.repositories.base import active_only
from app.repositories.resource_repository import ResourceRepository
from app.schemas.resource import ResourceCreate, ResourceUpdate
from app.services.exceptions import (
    ResourceAlreadyPublishedError,
    ResourceNotDraftError,
    ResourceNotFoundError,
    ResourceTypeNotFoundError,
    UnitNotFoundError,
)

_FLAG_KEYS = (
    "is_inventoriable",
    "is_consumable",
    "is_cultivable",
    "is_equipment",
    "is_sellable",
    "is_traceable",
)


class ResourceService:
    """Minimal resource lifecycle: draft → publish with Identity + Event + Audit."""

    def __init__(
        self,
        session: Session,
        *,
        identity_engine: IdentityEngine | None = None,
        event_engine: EventEngine | None = None,
    ) -> None:
        self._session = session
        self._repository = ResourceRepository(session)
        self._identity = identity_engine or IdentityEngine()
        self._events = event_engine or EventEngine(AuditEngine())

    def create_draft(self, data: ResourceCreate) -> Resource:
        resource_type = self._get_resource_type(data.resource_type_id)
        self._get_unit(data.unit_id)

        payload = self._build_create_payload(data, resource_type)
        return self._repository.create(payload)

    def publish(self, resource_id: UUID, *, actor_id: UUID | None = None) -> Resource:
        resource = self._get_resource_or_raise(resource_id)

        if resource.status != "draft":
            if resource.internal_code is not None:
                raise ResourceAlreadyPublishedError(resource_id)
            raise ResourceNotDraftError(resource_id, resource.status)

        internal_code = self._identity.assign_master_code(self._session, "resource")
        prefix_row = get_by_entity_type(self._session, "resource")

        self._events.emit_operational_code_generated(
            self._session,
            entity_type="resource",
            entity_id=resource.id,
            internal_code=internal_code,
            prefix=prefix_row.prefix,
            format_type=prefix_row.format_type,
            created_by=actor_id,
        )

        resource = self._repository.update(
            resource,
            {"internal_code": internal_code, "status": "active"},
        )
        after_snapshot = self._snapshot(resource)

        self._events.emit_resource_created(
            self._session,
            entity_id=resource.id,
            internal_code=internal_code,
            after_data=after_snapshot,
            created_by=actor_id,
        )

        return resource

    def update(self, resource_id: UUID, data: ResourceUpdate, *, actor_id: UUID | None = None) -> Resource:
        resource = self._get_resource_or_raise(resource_id)
        if resource.status == "archived":
            raise ResourceNotDraftError(resource_id, resource.status)

        update_data = data.model_dump(exclude_unset=True)
        if not update_data:
            return resource

        before_snapshot = self._snapshot(resource)
        resource = self._repository.update(resource, update_data)
        after_snapshot = self._snapshot(resource)

        if resource.status == "active" and resource.internal_code:
            self._events.emit_resource_updated(
                self._session,
                entity_id=resource.id,
                internal_code=resource.internal_code,
                before_data=before_snapshot,
                after_data=after_snapshot,
                created_by=actor_id,
            )

        return resource

    def get(self, resource_id: UUID) -> Resource:
        return self._get_resource_or_raise(resource_id)

    def list(
        self,
        *,
        status: str | None = None,
        resource_type_id: UUID | None = None,
        limit: int = 100,
        offset: int = 0,
    ) -> list[Resource]:
        return self._repository.list(
            status=status,
            resource_type_id=resource_type_id,
            limit=limit,
            offset=offset,
        )

    def _get_resource_or_raise(self, resource_id: UUID) -> Resource:
        resource = self._repository.get_by_id(resource_id)
        if resource is None:
            raise ResourceNotFoundError(resource_id)
        return resource

    def _get_resource_type(self, resource_type_id: UUID) -> ResourceType:
        stmt = active_only(
            select(ResourceType).where(ResourceType.id == resource_type_id),
            ResourceType,
        )
        resource_type = self._session.scalars(stmt).first()
        if resource_type is None:
            raise ResourceTypeNotFoundError(resource_type_id)
        return resource_type

    def _get_unit(self, unit_id: UUID) -> Unit:
        stmt = active_only(select(Unit).where(Unit.id == unit_id), Unit)
        unit = self._session.scalars(stmt).first()
        if unit is None:
            raise UnitNotFoundError(unit_id)
        return unit

    def _build_create_payload(self, data: ResourceCreate, resource_type: ResourceType) -> dict[str, Any]:
        defaults = resource_type.default_flags or {}
        payload: dict[str, Any] = {
            "name": data.name,
            "description": data.description,
            "notes": data.notes,
            "resource_type_id": data.resource_type_id,
            "resource_subtype_id": data.resource_subtype_id,
            "resource_category_id": data.resource_category_id,
            "business_line_id": data.business_line_id,
            "unit_id": data.unit_id,
            "status": "draft",
            "internal_code": None,
            "requires_lot": data.requires_lot,
            "requires_expiry": data.requires_expiry,
            "requires_tech_sheet": data.requires_tech_sheet,
            "requires_safety_sheet": data.requires_safety_sheet,
            "min_stock": data.min_stock,
        }
        for flag in _FLAG_KEYS:
            explicit = getattr(data, flag)
            payload[flag] = explicit if explicit is not None else bool(defaults.get(flag, False))
        return payload

    @staticmethod
    def _snapshot(resource: Resource) -> dict[str, Any]:
        return {
            "id": str(resource.id),
            "internal_code": resource.internal_code,
            "name": resource.name,
            "description": resource.description,
            "notes": resource.notes,
            "resource_type_id": str(resource.resource_type_id),
            "resource_subtype_id": str(resource.resource_subtype_id)
            if resource.resource_subtype_id
            else None,
            "resource_category_id": str(resource.resource_category_id)
            if resource.resource_category_id
            else None,
            "business_line_id": str(resource.business_line_id)
            if resource.business_line_id
            else None,
            "unit_id": str(resource.unit_id),
            "status": resource.status,
            "is_inventoriable": resource.is_inventoriable,
            "is_consumable": resource.is_consumable,
            "is_cultivable": resource.is_cultivable,
            "is_equipment": resource.is_equipment,
            "is_sellable": resource.is_sellable,
            "is_traceable": resource.is_traceable,
            "requires_lot": resource.requires_lot,
            "requires_expiry": resource.requires_expiry,
            "requires_tech_sheet": resource.requires_tech_sheet,
            "requires_safety_sheet": resource.requires_safety_sheet,
            "min_stock": float(resource.min_stock) if resource.min_stock is not None else None,
        }
