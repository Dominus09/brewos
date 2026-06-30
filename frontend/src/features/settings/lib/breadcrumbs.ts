import type { BreadcrumbItem } from "@/types/navigation";

import type { SettingsNavItem } from "@/features/settings/config/settings-navigation";

export function settingsBreadcrumbs(
  item?: SettingsNavItem,
): BreadcrumbItem[] {
  const trail: BreadcrumbItem[] = [
    { label: "Centro de Control", href: "/control-center" },
    { label: "Configuración", href: "/settings" },
  ];

  if (item) {
    trail.push({ label: item.label });
  }

  return trail;
}
