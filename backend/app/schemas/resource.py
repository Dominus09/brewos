"""Pydantic schemas for the Resource aggregate (CE-2)."""

from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ResourceCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    resource_type_id: UUID
    unit_id: UUID
    description: str | None = None
    notes: str | None = None
    resource_subtype_id: UUID | None = None
    resource_category_id: UUID | None = None
    business_line_id: UUID | None = None
    is_inventoriable: bool | None = None
    is_consumable: bool | None = None
    is_cultivable: bool | None = None
    is_equipment: bool | None = None
    is_sellable: bool | None = None
    is_traceable: bool | None = None
    requires_lot: bool = False
    requires_expiry: bool = False
    requires_tech_sheet: bool = False
    requires_safety_sheet: bool = False
    min_stock: Decimal | None = None


class ResourceUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=255)
    description: str | None = None
    notes: str | None = None
    resource_subtype_id: UUID | None = None
    resource_category_id: UUID | None = None
    business_line_id: UUID | None = None
    is_inventoriable: bool | None = None
    is_consumable: bool | None = None
    is_cultivable: bool | None = None
    is_equipment: bool | None = None
    is_sellable: bool | None = None
    is_traceable: bool | None = None
    requires_lot: bool | None = None
    requires_expiry: bool | None = None
    requires_tech_sheet: bool | None = None
    requires_safety_sheet: bool | None = None
    min_stock: Decimal | None = None


class ResourceListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    internal_code: str | None
    status: str
    resource_type_id: UUID
    unit_id: UUID
    business_line_id: UUID | None
    created_at: datetime
    updated_at: datetime


class ResourceRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    internal_code: str | None
    name: str
    description: str | None
    notes: str | None
    resource_type_id: UUID
    resource_subtype_id: UUID | None
    resource_category_id: UUID | None
    business_line_id: UUID | None
    unit_id: UUID
    status: str
    is_inventoriable: bool
    is_consumable: bool
    is_cultivable: bool
    is_equipment: bool
    is_sellable: bool
    is_traceable: bool
    requires_lot: bool
    requires_expiry: bool
    requires_tech_sheet: bool
    requires_safety_sheet: bool
    min_stock: Decimal | None
    created_at: datetime
    updated_at: datetime
