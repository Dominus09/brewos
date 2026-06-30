import type { LucideIcon } from "lucide-react";

export type NavModuleId =
  | "control-center"
  | "resources"
  | "inventory"
  | "recipes"
  | "production"
  | "traceability"
  | "botanical-garden"
  | "laboratory"
  | "reports"
  | "settings";

export type NavModule = {
  id: NavModuleId;
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
};

export type BreadcrumbItem = {
  label: string;
  href?: string;
};
