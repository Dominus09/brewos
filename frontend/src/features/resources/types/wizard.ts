import type { ResourceFlags, ResourceStatus, ResourceTypeId } from "@/features/resources/types";

export type ResourceWizardFormData = {
  type: ResourceTypeId | null;
  name: string;
  subtype: string;
  description: string;
  unit: string;
  status: ResourceStatus;
  notes: string;
  supplierName: string;
  purchaseCost: string;
  flags: ResourceFlags;
  documentNames: string[];
  photoCount: number;
};

export const WIZARD_DEFAULT_VALUES: ResourceWizardFormData = {
  type: null,
  name: "",
  subtype: "",
  description: "",
  unit: "",
  status: "draft",
  notes: "",
  supplierName: "",
  purchaseCost: "",
  flags: {
    inventariable: false,
    consumible: false,
    cultivable: false,
    vendible: false,
    trazable: false,
    equipamiento: false,
  },
  documentNames: [],
  photoCount: 0,
};
