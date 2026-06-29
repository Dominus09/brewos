import {
  BarChart2,
  FlaskConical,
  LayoutDashboard,
  Microscope,
  Package,
  PlayCircle,
  Settings,
  Sprout,
  Warehouse,
  type LucideIcon,
} from "lucide-react";

export type BrewModule = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
};

export const BREW_MODULES: BrewModule[] = [
  {
    id: "inicio",
    label: "Inicio",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Centro de control",
  },
  {
    id: "catalogo",
    label: "Catálogo",
    href: "/dashboard/catalogo",
    icon: Package,
    description: "Recursos y materiales",
  },
  {
    id: "inventario",
    label: "Inventario",
    href: "/dashboard/inventario",
    icon: Warehouse,
    description: "Stock y movimientos",
  },
  {
    id: "recetas",
    label: "Recetas",
    href: "/dashboard/recetas",
    icon: FlaskConical,
    description: "Formulaciones",
  },
  {
    id: "produccion",
    label: "Producción",
    href: "/dashboard/produccion",
    icon: PlayCircle,
    description: "Lotes y procesos",
  },
  {
    id: "jardin",
    label: "Jardín Botánico",
    href: "/dashboard/jardin",
    icon: Sprout,
    description: "Cultivo y cosechas",
  },
  {
    id: "laboratorio",
    label: "Laboratorio",
    href: "/dashboard/laboratorio",
    icon: Microscope,
    description: "Análisis y control",
  },
  {
    id: "reportes",
    label: "Reportes",
    href: "/dashboard/reportes",
    icon: BarChart2,
    description: "Vistas analíticas",
  },
  {
    id: "configuracion",
    label: "Configuración",
    href: "/dashboard/configuracion",
    icon: Settings,
    description: "Sistema y preferencias",
  },
];
