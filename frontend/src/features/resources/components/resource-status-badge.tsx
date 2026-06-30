import type { ResourceStatus } from "@/features/resources/types";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<
  ResourceStatus,
  { label: string; className: string }
> = {
  draft: {
    label: "Borrador",
    className: "border-border bg-transparent text-muted-foreground",
  },
  active: {
    label: "Activo",
    className: "border-success/30 bg-success-muted/20 text-success",
  },
  inactive: {
    label: "Inactivo",
    className: "border-warning/30 bg-warning-muted/20 text-warning",
  },
  archived: {
    label: "Archivado",
    className: "border-border bg-muted/50 text-muted-foreground",
  },
};

type ResourceStatusBadgeProps = {
  status: ResourceStatus;
  className?: string;
};

export function ResourceStatusBadge({
  status,
  className,
}: ResourceStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
