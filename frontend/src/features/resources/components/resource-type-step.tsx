"use client";

import { RESOURCE_TYPES } from "@/features/resources/config/resource-types";
import type { ResourceTypeId } from "@/features/resources/types";
import { cn } from "@/lib/utils";

type ResourceTypeStepProps = {
  selectedType: ResourceTypeId | null;
  onSelect: (type: ResourceTypeId) => void;
};

export function ResourceTypeStep({
  selectedType,
  onSelect,
}: ResourceTypeStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-medium">
          ¿Qué tipo de recurso vas a registrar?
        </h2>
        <p className="text-sm text-muted-foreground">
          El tipo define el comportamiento y los campos disponibles.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {RESOURCE_TYPES.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;

          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onSelect(type.id)}
              className={cn(
                "flex flex-col gap-3 rounded-xl border p-4 text-left transition-colors hover:bg-muted/20",
                isSelected
                  ? "border-primary/50 ring-1 ring-primary/20"
                  : "border-border",
              )}
            >
              <Icon
                className="size-5"
                style={{ color: type.colorToken }}
              />
              <div className="space-y-1">
                <p className="font-medium">{type.label}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {type.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
