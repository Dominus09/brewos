import type { BreadcrumbItem } from "@/types/navigation";

export function resourcesBreadcrumbs(
  ...trail: BreadcrumbItem[]
): BreadcrumbItem[] {
  return [
    { label: "Centro de Control", href: "/control-center" },
    { label: "Recursos", href: "/resources" },
    ...trail,
  ];
}

export function formatCurrency(
  amount: number | undefined,
  currency = "CLP",
): string {
  if (amount === undefined) return "—";
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatStock(
  stock: number | null | undefined,
  unit: string,
  inventariable: boolean,
): string {
  if (!inventariable) return "—";
  if (stock === null || stock === undefined) return "—";
  return `${stock} ${unit}`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Ayer";
  if (diffDays < 7) return `Hace ${diffDays} días`;
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} sem.`;
  if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`;
  return formatDate(iso);
}
