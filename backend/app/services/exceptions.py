"""Resource domain exceptions."""

from uuid import UUID


class ResourceServiceError(Exception):
    """Base error for resource operations."""


class ResourceNotFoundError(ResourceServiceError):
    def __init__(self, resource_id: UUID) -> None:
        super().__init__(f"Resource {resource_id} not found")
        self.resource_id = resource_id


class ResourceTypeNotFoundError(ResourceServiceError):
    def __init__(self, resource_type_id: UUID) -> None:
        super().__init__(f"Resource type {resource_type_id} not found")
        self.resource_type_id = resource_type_id


class UnitNotFoundError(ResourceServiceError):
    def __init__(self, unit_id: UUID) -> None:
        super().__init__(f"Unit {unit_id} not found")
        self.unit_id = unit_id


class ResourceNotDraftError(ResourceServiceError):
    def __init__(self, resource_id: UUID, status: str) -> None:
        super().__init__(f"Resource {resource_id} is not a draft (status={status})")
        self.resource_id = resource_id
        self.status = status


class ResourceAlreadyPublishedError(ResourceServiceError):
    def __init__(self, resource_id: UUID) -> None:
        super().__init__(f"Resource {resource_id} is already published")
        self.resource_id = resource_id
