"""Resource satellite table read schemas."""

from datetime import date, datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class ResourceSupplierRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    resource_id: UUID
    supplier_id: UUID
    supplier_sku: str | None
    is_primary: bool
    last_purchase_price: Decimal | None
    currency: str | None
    lead_time_days: int | None
    notes: str | None
    created_at: datetime
    updated_at: datetime


class ResourceCostRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    resource_id: UUID
    cost_type: str
    amount: Decimal
    currency: str
    source: str | None
    effective_date: date
    notes: str | None
    created_at: datetime
    updated_at: datetime


class ResourceDocumentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    resource_id: UUID
    document_type: str
    title: str
    file_url: str
    file_name: str
    mime_type: str | None
    uploaded_at: datetime
    notes: str | None
    created_at: datetime
    updated_at: datetime


class ResourcePhotoRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    resource_id: UUID
    photo_url: str
    file_name: str
    is_primary: bool
    caption: str | None
    uploaded_at: datetime
    created_at: datetime
    updated_at: datetime


class ResourceTagRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    slug: str
    color: str | None
    description: str | None
    created_at: datetime
    updated_at: datetime
