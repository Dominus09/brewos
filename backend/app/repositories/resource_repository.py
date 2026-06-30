"""Resource aggregate persistence."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.resource import Resource
from app.repositories.base import active_only


class ResourceRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    def create(self, data: dict[str, Any]) -> Resource:
        resource = Resource(**data)
        self._session.add(resource)
        self._session.flush()
        return resource

    def get_by_id(self, resource_id: UUID) -> Resource | None:
        stmt = active_only(
            select(Resource).where(Resource.id == resource_id),
            Resource,
        )
        return self._session.scalars(stmt).first()

    def get_by_internal_code(self, internal_code: str) -> Resource | None:
        stmt = active_only(
            select(Resource).where(Resource.internal_code == internal_code),
            Resource,
        )
        return self._session.scalars(stmt).first()

    def list(
        self,
        *,
        status: str | None = None,
        resource_type_id: UUID | None = None,
        limit: int = 100,
        offset: int = 0,
    ) -> list[Resource]:
        stmt = active_only(select(Resource), Resource)
        if status is not None:
            stmt = stmt.where(Resource.status == status)
        if resource_type_id is not None:
            stmt = stmt.where(Resource.resource_type_id == resource_type_id)
        stmt = stmt.order_by(Resource.created_at.desc()).limit(limit).offset(offset)
        return list(self._session.scalars(stmt).all())

    def update(self, resource: Resource, data: dict[str, Any]) -> Resource:
        for key, value in data.items():
            setattr(resource, key, value)
        self._session.flush()
        return resource

    def soft_delete(self, resource: Resource) -> Resource:
        resource.deleted_at = datetime.now(timezone.utc)
        self._session.flush()
        return resource
