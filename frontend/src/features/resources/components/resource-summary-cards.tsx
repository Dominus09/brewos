import { getResourceTypeConfig } from "@/features/resources/config/resource-types";
import type { ResourceTypeId } from "@/features/resources/types";
import { cn } from "@/lib/utils";

type ResourceSummaryCardsProps = {
  counts: Partial<Record<ResourceTypeId, number>>;
  activeType?: ResourceTypeId | null;
  onTypeSelect: (type: ResourceTypeId | null) => void;
};

const SUMMARY_TYPES: ResourceTypeId[] = [
  "supply",
  "botanical",
  "equipment",
  "container",
  "tool",
  "finished_product",
  "service",
  "electronic_component",
  "cleaning_material",
  "packaging_material",
];

export function ResourceSummaryCards({
  counts,
  activeType,
  onTypeSelect,
}: ResourceSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {SUMMARY_TYPES.map((typeId) => {
        const config = getResourceTypeConfig(typeId);
        if (!config) return null;

        const Icon = config.icon;
        const count = counts[typeId] ?? 0;
        const isActive = activeType === typeId;

        return (
          <button
            key={typeId}
            type="button"
            onClick={() => onTypeSelect(isActive ? null : typeId)}
            className={cn(
              "flex flex-col gap-2 rounded-xl border bg-card p-4 text-left transition-colors hover:bg-muted/30",
              isActive
                ? "border-primary/50 ring-1 ring-primary/20"
                : "border-border",
            )}
          >
            <Icon
              className="size-4"
              style={{ color: config.colorToken }}
            />
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">{config.label}</p>
              <p className="font-mono text-lg font-semibold tabular-nums">
                {count}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
