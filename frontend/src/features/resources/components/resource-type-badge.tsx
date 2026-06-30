import { getResourceTypeConfig } from "@/features/resources/config/resource-types";
import type { ResourceTypeId } from "@/features/resources/types";
import { cn } from "@/lib/utils";

type ResourceTypeBadgeProps = {
  type: ResourceTypeId;
  className?: string;
};

export function ResourceTypeBadge({ type, className }: ResourceTypeBadgeProps) {
  const config = getResourceTypeConfig(type);

  if (!config) return null;

  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium text-foreground",
        className,
      )}
    >
      <Icon
        className="size-3 shrink-0"
        style={{ color: config.colorToken }}
      />
      {config.label}
    </span>
  );
}
