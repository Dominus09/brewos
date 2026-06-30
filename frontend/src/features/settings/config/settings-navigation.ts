export type SettingsNavItem = {
  id: string;
  label: string;
  href: string;
  description: string;
};

export type SettingsNavGroup = {
  id: string;
  label: string;
  items: SettingsNavItem[];
};

/**
 * Subnavegación del módulo Configuración.
 * Rutas en inglés; labels en español (ADR-0001).
 */
export const SETTINGS_NAVIGATION: SettingsNavGroup[] = [
  {
    id: "configuration",
    label: "Configuración",
    items: [
      {
        id: "company",
        label: "Empresa",
        href: "/settings/company",
        description:
          "Datos de Insular Origins, identidad del proyecto y parámetros generales.",
      },
      {
        id: "users",
        label: "Usuarios",
        href: "/settings/users",
        description: "Cuentas de acceso y perfiles operativos del sistema.",
      },
      {
        id: "security",
        label: "Seguridad",
        href: "/settings/security",
        description:
          "Políticas de contraseña, sesiones y controles de acceso.",
      },
      {
        id: "backups",
        label: "Respaldos",
        href: "/settings/backups",
        description: "Copias de seguridad y restauración del sistema.",
      },
      {
        id: "integrations",
        label: "Integraciones",
        href: "/settings/integrations",
        description:
          "Conexiones futuras: BrewNode, ESP32, APIs y servicios externos.",
      },
    ],
  },
  {
    id: "production-admin",
    label: "Administración de producción",
    items: [
      {
        id: "types",
        label: "Tipos",
        href: "/settings/production/types",
        description: "Tipos maestros de recursos y clasificaciones base.",
      },
      {
        id: "categories",
        label: "Categorías",
        href: "/settings/production/categories",
        description: "Jerarquía de categorías operativas.",
      },
      {
        id: "subcategories",
        label: "Subcategorías",
        href: "/settings/production/subcategories",
        description: "Subdivisiones dentro de cada categoría.",
      },
      {
        id: "properties",
        label: "Propiedades",
        href: "/settings/production/properties",
        description: "Atributos personalizables por tipo de recurso.",
      },
      {
        id: "units",
        label: "Unidades",
        href: "/settings/production/units",
        description: "Unidades de medida: kg, L, unidad, % y conversiones.",
      },
      {
        id: "states",
        label: "Estados",
        href: "/settings/production/states",
        description: "Estados globales y extendidos del ciclo de vida.",
      },
      {
        id: "processes",
        label: "Procesos",
        href: "/settings/production/processes",
        description: "Procesos de elaboración, fermentación y destilación.",
      },
      {
        id: "equipment",
        label: "Equipos",
        href: "/settings/production/equipment",
        description: "Maestro de equipamiento de producción.",
      },
      {
        id: "resources",
        label: "Recursos",
        href: "/settings/production/resources",
        description: "Parámetros y reglas del catálogo maestro de recursos.",
      },
      {
        id: "botanicals",
        label: "Botánicos",
        href: "/settings/production/botanicals",
        description: "Taxonomía y reglas específicas de botánicos.",
      },
      {
        id: "products",
        label: "Productos",
        href: "/settings/production/products",
        description: "Configuración de productos terminados y embotellado.",
      },
    ],
  },
];

export function getAllSettingsNavItems(): SettingsNavItem[] {
  return SETTINGS_NAVIGATION.flatMap((group) => group.items);
}

export function getSettingsNavItemByHref(
  href: string,
): SettingsNavItem | undefined {
  return getAllSettingsNavItems().find((item) => item.href === href);
}

export function getSettingsNavItemByPath(
  pathSegments: string[],
): SettingsNavItem | undefined {
  const href =
    pathSegments.length === 0
      ? "/settings"
      : `/settings/${pathSegments.join("/")}`;
  return getSettingsNavItemByHref(href);
}

export function isSettingsNavActive(
  pathname: string,
  href: string,
): boolean {
  return pathname === href;
}
