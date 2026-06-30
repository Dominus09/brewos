"""Data access layer."""

from app.repositories.resource_repository import ResourceRepository
from app.repositories.resource_cost_repository import ResourceCostRepository
from app.repositories.resource_document_repository import ResourceDocumentRepository
from app.repositories.resource_photo_repository import ResourcePhotoRepository
from app.repositories.resource_supplier_repository import ResourceSupplierRepository
from app.repositories.resource_tag_repository import ResourceTagRepository

__all__ = [
    "ResourceRepository",
    "ResourceCostRepository",
    "ResourceDocumentRepository",
    "ResourcePhotoRepository",
    "ResourceSupplierRepository",
    "ResourceTagRepository",
]
