"""Read-only access to resource_tags."""

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.resource_tag import ResourceTag
from app.repositories.base import ReadRepository, active_only


class ResourceTagRepository(ReadRepository):
    def __init__(self, session: Session) -> None:
        super().__init__(session, ResourceTag)

    def list_all(self) -> list[ResourceTag]:
        stmt = active_only(
            select(ResourceTag).order_by(ResourceTag.name),
            ResourceTag,
        )
        return list(self._session.scalars(stmt).all())

    def get_by_slug(self, slug: str) -> ResourceTag | None:
        stmt = active_only(
            select(ResourceTag).where(ResourceTag.slug == slug),
            ResourceTag,
        )
        return self._session.scalars(stmt).first()

    def list_by_resource_id(self, resource_id: UUID) -> list[ResourceTag]:
        from app.models.resource_tag_link import ResourceTagLink

        stmt = (
            select(ResourceTag)
            .join(ResourceTagLink, ResourceTagLink.tag_id == ResourceTag.id)
            .where(
                ResourceTagLink.resource_id == resource_id,
                ResourceTagLink.deleted_at.is_(None),
                ResourceTag.deleted_at.is_(None),
            )
            .order_by(ResourceTag.name)
        )
        return list(self._session.scalars(stmt).all())
