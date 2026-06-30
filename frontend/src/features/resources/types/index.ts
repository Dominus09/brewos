/** Identificadores internos de tipo — alineados con docs/13-resource-taxonomy.md */
export type ResourceTypeId =
  | "supply"
  | "botanical"
  | "container"
  | "equipment"
  | "tool"
  | "finished_product"
  | "service"
  | "cleaning_material"
  | "packaging_material"
  | "electronic_component";

/** Estados globales del recurso — docs/14-resource-lifecycle.md */
export type ResourceStatus = "draft" | "active" | "inactive" | "archived";

/** Flags de comportamiento — docs/12-resource-domain.md */
export type ResourceFlags = {
  inventariable: boolean;
  consumible: boolean;
  cultivable: boolean;
  vendible: boolean;
  trazable: boolean;
  equipamiento: boolean;
};

export type ResourceCost = {
  purchaseCost?: number;
  averageCost?: number;
  estimatedValue?: number;
  currency: string;
};

export type ResourceDocument = {
  id: string;
  name: string;
  type: string;
  url?: string;
  uploadedAt: string;
};

export type ResourcePhoto = {
  id: string;
  url?: string;
  alt: string;
  isPrimary: boolean;
  uploadedAt: string;
};

export type ResourceTimelineEventType =
  | "created"
  | "updated"
  | "status_changed"
  | "document_added"
  | "photo_added"
  | "cost_updated"
  | "stock_movement";

export type ResourceTimelineEvent = {
  id: string;
  type: ResourceTimelineEventType;
  title: string;
  description?: string;
  timestamp: string;
  user?: string;
};

export type ResourceRelationType =
  | "recipe_ingredient"
  | "production_input"
  | "production_output"
  | "supplier_product"
  | "garden_plant"
  | "parent_resource"
  | "child_resource";

export type ResourceRelation = {
  id: string;
  type: ResourceRelationType;
  targetId: string;
  targetName: string;
  targetType?: ResourceTypeId;
  description?: string;
};

export type ResourceSupplier = {
  id: string;
  name: string;
  contactEmail?: string;
  contactPhone?: string;
};

export type Resource = {
  id: string;
  internalCode: string;
  name: string;
  description?: string;
  type: ResourceTypeId;
  subtype: string;
  category?: string;
  tags?: string[];
  status: ResourceStatus;
  unit: string;
  flags: ResourceFlags;
  cost: ResourceCost;
  stock?: number | null;
  stockMinimum?: number;
  supplier?: ResourceSupplier;
  photos: ResourcePhoto[];
  documents: ResourceDocument[];
  timeline: ResourceTimelineEvent[];
  relations: ResourceRelation[];
  notes?: string;
  updatedAt: string;
  createdAt: string;
};

export type ResourceViewMode = "table" | "cards";

export type ResourceFilters = {
  search: string;
  types: ResourceTypeId[];
  statuses: ResourceStatus[];
  inventariable?: boolean | null;
  consumible?: boolean | null;
  cultivable?: boolean | null;
  vendible?: boolean | null;
};
