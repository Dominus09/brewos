"""Read-only access to resource_photos."""

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.resource_photo import ResourcePhoto
from app.repositories.base import ReadRepository, active_only


class ResourcePhotoRepository(ReadRepository):
    def __init__(self, session: Session) -> None:
        super().__init__(session, ResourcePhoto)

    def list_by_resource_id(self, resource_id: UUID) -> list[ResourcePhoto]:
        stmt = active_only(
            select(ResourcePhoto)
            .where(ResourcePhoto.resource_id == resource_id)
            .order_by(ResourcePhoto.is_primary.desc(), ResourcePhoto.uploaded_at.desc()),
            ResourcePhoto,
        )
        return list(self._session.scalars(stmt).all())
