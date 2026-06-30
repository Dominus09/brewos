"""Resource API routes (CE-2 minimal)."""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.resource import ResourceCreate, ResourceListItem, ResourceRead, ResourceUpdate
from app.services.exceptions import (
    ResourceAlreadyPublishedError,
    ResourceNotDraftError,
    ResourceNotFoundError,
    ResourceServiceError,
    ResourceTypeNotFoundError,
    UnitNotFoundError,
)
from app.services.resource_service import ResourceService

router = APIRouter(prefix="/resources", tags=["resources"])


def _handle_service_error(exc: ResourceServiceError) -> HTTPException:
    if isinstance(exc, ResourceNotFoundError):
        return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    if isinstance(exc, (ResourceTypeNotFoundError, UnitNotFoundError)):
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    if isinstance(exc, (ResourceNotDraftError, ResourceAlreadyPublishedError)):
        return HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc))
    return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))


@router.get("", response_model=list[ResourceListItem])
def list_resources(
    status_filter: str | None = Query(None, alias="status"),
    resource_type_id: UUID | None = None,
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
) -> list[ResourceListItem]:
    service = ResourceService(db)
    resources = service.list(
        status=status_filter,
        resource_type_id=resource_type_id,
        limit=limit,
        offset=offset,
    )
    return [ResourceListItem.model_validate(r) for r in resources]


@router.get("/{resource_id}", response_model=ResourceRead)
def get_resource(
    resource_id: UUID,
    db: Session = Depends(get_db),
) -> ResourceRead:
    service = ResourceService(db)
    try:
        resource = service.get(resource_id)
    except ResourceServiceError as exc:
        raise _handle_service_error(exc) from exc
    return ResourceRead.model_validate(resource)


@router.post("", response_model=ResourceRead, status_code=status.HTTP_201_CREATED)
def create_resource(
    body: ResourceCreate,
    db: Session = Depends(get_db),
) -> ResourceRead:
    service = ResourceService(db)
    try:
        resource = service.create_draft(body)
        db.commit()
        db.refresh(resource)
    except ResourceServiceError as exc:
        db.rollback()
        raise _handle_service_error(exc) from exc
    return ResourceRead.model_validate(resource)


@router.post("/{resource_id}/publish", response_model=ResourceRead)
def publish_resource(
    resource_id: UUID,
    db: Session = Depends(get_db),
) -> ResourceRead:
    service = ResourceService(db)
    try:
        resource = service.publish(resource_id)
        db.commit()
        db.refresh(resource)
    except ResourceServiceError as exc:
        db.rollback()
        raise _handle_service_error(exc) from exc
    return ResourceRead.model_validate(resource)


@router.patch("/{resource_id}", response_model=ResourceRead)
def update_resource(
    resource_id: UUID,
    body: ResourceUpdate,
    db: Session = Depends(get_db),
) -> ResourceRead:
    service = ResourceService(db)
    try:
        resource = service.update(resource_id, body)
        db.commit()
        db.refresh(resource)
    except ResourceServiceError as exc:
        db.rollback()
        raise _handle_service_error(exc) from exc
    return ResourceRead.model_validate(resource)
