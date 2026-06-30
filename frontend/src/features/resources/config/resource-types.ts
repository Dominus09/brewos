import {
  Box,
  Cpu,
  FlaskConical,
  Package,
  Sparkles,
  Sprout,
  Tag,
  Ticket,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import type { ResourceFlags, ResourceTypeId } from "@/features/resources/types";

export type ResourceTypeConfig = {
  id: ResourceTypeId;
  label: string;
  description: string;
  colorToken: string;
  icon: LucideIcon;
  defaultFlags: ResourceFlags;
  suggestedSubtypes: string[];
};

export const RESOURCE_TYPES: ResourceTypeConfig[] = [
  {
    id: "supply",
    label: "Insumo",
    description:
      "Materia prima que se incorpora al producto o se transforma en el proceso.",
    colorToken: "var(--info)",
    icon: FlaskConical,
    defaultFlags: {
      inventariable: true,
      consumible: true,
      cultivable: false,
      vendible: false,
      trazable: true,
      equipamiento: false,
    },
    suggestedSubtypes: [
      "Alcohol",
      "Malta",
      "Lúpulo",
      "Levadura",
      "Agua",
      "Azúcar",
      "Aditivo",
    ],
  },
  {
    id: "botanical",
    label: "Botánico",
    description:
      "Material vegetal o extracto botánico para maceración, destilación o aromatización.",
    colorToken: "var(--success)",
    icon: Sprout,
    defaultFlags: {
      inventariable: true,
      consumible: true,
      cultivable: false,
      vendible: false,
      trazable: true,
      equipamiento: false,
    },
    suggestedSubtypes: [
      "Comprado",
      "Cultivado",
      "Silvestre / Recolección",
      "Seco",
      "Fresco",
    ],
  },
  {
    id: "container",
    label: "Envase",
    description: "Contenedor o cierre que envuelve el producto terminado.",
    colorToken: "var(--primary)",
    icon: Package,
    defaultFlags: {
      inventariable: true,
      consumible: true,
      cultivable: false,
      vendible: false,
      trazable: true,
      equipamiento: false,
    },
    suggestedSubtypes: ["Botella", "Tapa", "Corcho", "Caja", "Barril", "Growler"],
  },
  {
    id: "equipment",
    label: "Equipamiento",
    description:
      "Activo de elaboración reutilizable: alambiques, fermentadores, embotelladoras.",
    colorToken: "var(--warning)",
    icon: Box,
    defaultFlags: {
      inventariable: false,
      consumible: false,
      cultivable: false,
      vendible: false,
      trazable: false,
      equipamiento: true,
    },
    suggestedSubtypes: [
      "Elaboración",
      "Fermentación",
      "Destilación",
      "Embotellado",
      "Control",
    ],
  },
  {
    id: "tool",
    label: "Herramienta",
    description: "Instrumento reutilizable de apoyo en producción o mantenimiento.",
    colorToken: "var(--muted-foreground)",
    icon: Wrench,
    defaultFlags: {
      inventariable: false,
      consumible: false,
      cultivable: false,
      vendible: false,
      trazable: false,
      equipamiento: true,
    },
    suggestedSubtypes: [
      "Medición",
      "Manipulación",
      "Corte",
      "Limpieza",
      "Eléctrica",
    ],
  },
  {
    id: "finished_product",
    label: "Producto Terminado",
    description: "Producto elaborado listo para venta o distribución.",
    colorToken: "var(--primary)",
    icon: Box,
    defaultFlags: {
      inventariable: true,
      consumible: false,
      cultivable: false,
      vendible: true,
      trazable: true,
      equipamiento: false,
    },
    suggestedSubtypes: ["Cerveza", "Gin", "Destilado", "Licor", "Edición limitada"],
  },
  {
    id: "service",
    label: "Servicio",
    description: "Oferta comercial no inventariable: tours, catas, experiencias.",
    colorToken: "var(--info)",
    icon: Ticket,
    defaultFlags: {
      inventariable: false,
      consumible: false,
      cultivable: false,
      vendible: true,
      trazable: false,
      equipamiento: false,
    },
    suggestedSubtypes: ["Tour", "Cata", "Evento", "Experiencia", "Consultoría"],
  },
  {
    id: "cleaning_material",
    label: "Material de Limpieza",
    description: "Insumos de higiene y sanitización del proceso productivo.",
    colorToken: "var(--success)",
    icon: Sparkles,
    defaultFlags: {
      inventariable: true,
      consumible: true,
      cultivable: false,
      vendible: false,
      trazable: false,
      equipamiento: false,
    },
    suggestedSubtypes: [
      "Detergente",
      "Desinfectante",
      "Sanitizante",
      "Accesorio de limpieza",
    ],
  },
  {
    id: "packaging_material",
    label: "Material de Packaging",
    description: "Elementos de presentación y protección: etiquetas, cajas, estuches.",
    colorToken: "var(--warning)",
    icon: Tag,
    defaultFlags: {
      inventariable: true,
      consumible: true,
      cultivable: false,
      vendible: false,
      trazable: true,
      equipamiento: false,
    },
    suggestedSubtypes: ["Etiqueta", "Caja", "Estuche", "Sello", "Funda"],
  },
  {
    id: "electronic_component",
    label: "Componente Electrónico",
    description:
      "Componentes para automatización, sensores y control de proceso.",
    colorToken: "var(--info)",
    icon: Cpu,
    defaultFlags: {
      inventariable: true,
      consumible: true,
      cultivable: false,
      vendible: false,
      trazable: true,
      equipamiento: false,
    },
    suggestedSubtypes: [
      "Microcontrolador",
      "Sensor",
      "Actuador",
      "Display",
      "Módulo de comunicación",
    ],
  },
];

export function getResourceTypeConfig(
  typeId: ResourceTypeId,
): ResourceTypeConfig | undefined {
  return RESOURCE_TYPES.find((t) => t.id === typeId);
}

export function getResourceTypeLabel(typeId: ResourceTypeId): string {
  return getResourceTypeConfig(typeId)?.label ?? typeId;
}
