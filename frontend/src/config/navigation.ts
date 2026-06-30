import {
  BarChart2,
  BookOpen,
  FlaskConical,
  GitBranch,
  LayoutDashboard,
  Package,
  PlayCircle,
  Settings,
  Sprout,
  Warehouse,
} from "lucide-react";

import type { NavModule } from "@/types/navigation";

/**
 * Fuente única de verdad para la navegación principal.
 * Debe coincidir con docs/10-navigation-map.md — exactamente 10 módulos.
 */
export const MAIN_NAVIGATION: NavModule[] = [
  {
    id: "control-center",
    label: "Centro de Control",
    href: "/control-center",
    icon: LayoutDashboard,
    description: "Vista operativa del estado del sistema",
  },
  {
    id: "resources",
    label: "Recursos",
    href: "/resources",
    icon: Package,
    description: "Catálogo maestro de recursos",
  },
  {
    id: "inventory",
    label: "Inventario",
    href: "/inventory",
    icon: Warehouse,
    description: "Stock y movimientos",
  },
  {
    id: "recipes",
    label: "Recetas",
    href: "/recipes",
    icon: FlaskConical,
    description: "Formulaciones versionadas",
  },
  {
    id: "production",
    label: "Producción",
    href: "/production",
    icon: PlayCircle,
    description: "Lotes y procesos",
  },
  {
    id: "traceability",
    label: "Trazabilidad",
    href: "/traceability",
    icon: GitBranch,
    description: "Historial completo por lote",
  },
  {
    id: "botanical-garden",
    label: "Jardín Botánico",
    href: "/botanical-garden",
    icon: Sprout,
    description: "Cultivo y cosechas",
  },
  {
    id: "laboratory",
    label: "Laboratorio",
    href: "/laboratory",
    icon: BookOpen,
    description: "Documentación y conocimiento",
  },
  {
    id: "reports",
    label: "Reportes",
    href: "/reports",
    icon: BarChart2,
    description: "Vistas analíticas",
  },
  {
    id: "settings",
    label: "Configuración",
    href: "/settings",
    icon: Settings,
    description: "Administración del sistema",
  },
];

export function getNavModuleById(id: NavModule["id"]): NavModule | undefined {
  return MAIN_NAVIGATION.find((item) => item.id === id);
}

export function getNavModuleByHref(href: string): NavModule | undefined {
  return MAIN_NAVIGATION.find(
    (item) => href === item.href || href.startsWith(`${item.href}/`),
  );
}

export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/control-center") {
    return pathname === "/control-center";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
