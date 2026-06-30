"""Read-only access to resource_costs."""

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.resource_cost import ResourceCost
from app.repositories.base import ReadRepository, active_only


class ResourceCostRepository(ReadRepository):
    def __init__(self, session: Session) -> None:
        super().__init__(session, ResourceCost)

    def list_by_resource_id(self, resource_id: UUID) -> list[ResourceCost]:
        stmt = active_only(
            select(ResourceCost)
            .where(ResourceCost.resource_id == resource_id)
            .order_by(ResourceCost.effective_date.desc(), ResourceCost.created_at.desc()),
            ResourceCost,
        )
        return list(self._session.scalars(stmt).all())
