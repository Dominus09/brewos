"""Read-only access to resource_suppliers."""

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.resource_supplier import ResourceSupplier
from app.repositories.base import ReadRepository, active_only


class ResourceSupplierRepository(ReadRepository):
    def __init__(self, session: Session) -> None:
        super().__init__(session, ResourceSupplier)

    def list_by_resource_id(self, resource_id: UUID) -> list[ResourceSupplier]:
        stmt = active_only(
            select(ResourceSupplier)
            .where(ResourceSupplier.resource_id == resource_id)
            .order_by(ResourceSupplier.is_primary.desc(), ResourceSupplier.created_at),
            ResourceSupplier,
        )
        return list(self._session.scalars(stmt).all())

    def list_by_supplier_id(self, supplier_id: UUID) -> list[ResourceSupplier]:
        stmt = active_only(
            select(ResourceSupplier)
            .where(ResourceSupplier.supplier_id == supplier_id)
            .order_by(ResourceSupplier.created_at),
            ResourceSupplier,
        )
        return list(self._session.scalars(stmt).all())
