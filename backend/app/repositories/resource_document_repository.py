"""Read-only access to resource_documents."""

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.resource_document import ResourceDocument
from app.repositories.base import ReadRepository, active_only


class ResourceDocumentRepository(ReadRepository):
    def __init__(self, session: Session) -> None:
        super().__init__(session, ResourceDocument)

    def list_by_resource_id(self, resource_id: UUID) -> list[ResourceDocument]:
        stmt = active_only(
            select(ResourceDocument)
            .where(ResourceDocument.resource_id == resource_id)
            .order_by(ResourceDocument.uploaded_at.desc()),
            ResourceDocument,
        )
        return list(self._session.scalars(stmt).all())
