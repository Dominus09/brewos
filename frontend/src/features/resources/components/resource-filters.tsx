"use client";

import { Filter, Search, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { RESOURCE_TYPES } from "@/features/resources/config/resource-types";
import type { ResourceFilters, ResourceStatus } from "@/features/resources/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS: { value: ResourceStatus; label: string }[] = [
  { value: "draft", label: "Borrador" },
  { value: "active", label: "Activo" },
  { value: "inactive", label: "Inactivo" },
  { value: "archived", label: "Archivado" },
];

type ResourceFiltersBarProps = {
  filters: ResourceFilters;
  onFiltersChange: (filters: ResourceFilters) => void;
  onClear: () => void;
};

function FilterPanel({
  filters,
  onFiltersChange,
  onClear,
  className,
}: ResourceFiltersBarProps & { className?: string }) {
  const hasActive =
    filters.types.length > 0 ||
    filters.statuses.length > 0 ||
    filters.inventariable !== null ||
    filters.consumible !== null ||
    filters.cultivable !== null ||
    filters.vendible !== null;

  const toggleType = (typeId: (typeof RESOURCE_TYPES)[number]["id"]) => {
    const types = filters.types.includes(typeId)
      ? filters.types.filter((t) => t !== typeId)
      : [...filters.types, typeId];
    onFiltersChange({ ...filters, types });
  };

  const toggleStatus = (status: ResourceStatus) => {
    const statuses = filters.statuses.includes(status)
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status];
    onFiltersChange({ ...filters, statuses });
  };

  const toggleFlag = (
    key: "inventariable" | "consumible" | "cultivable" | "vendible",
  ) => {
    const current = filters[key];
    const next = current === true ? null : current === null ? true : null;
    onFiltersChange({ ...filters, [key]: next });
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Tipo</p>
        <div className="flex flex-wrap gap-1.5">
          {RESOURCE_TYPES.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => toggleType(type.id)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs transition-colors",
                filters.types.includes(type.id)
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Estado</p>
        <div className="flex flex-wrap gap-1.5">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggleStatus(opt.value)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs transition-colors",
                filters.statuses.includes(opt.value)
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          Comportamiento
        </p>
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              ["inventariable", "Inventariable"],
              ["consumible", "Consumible"],
              ["cultivable", "Cultivable"],
              ["vendible", "Vendible"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => toggleFlag(key)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs transition-colors",
                filters[key] === true
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {hasActive ? (
        <Button variant="outline" size="sm" onClick={onClear}>
          Limpiar filtros
        </Button>
      ) : null}
    </div>
  );
}

export function ResourceFiltersBar({
  filters,
  onFiltersChange,
  onClear,
}: ResourceFiltersBarProps) {
  const isMobile = useIsMobile();

  const activeChips: { label: string; onRemove: () => void }[] = [];

  filters.types.forEach((typeId) => {
    const type = RESOURCE_TYPES.find((t) => t.id === typeId);
    if (type) {
      activeChips.push({
        label: type.label,
        onRemove: () =>
          onFiltersChange({
            ...filters,
            types: filters.types.filter((t) => t !== typeId),
          }),
      });
    }
  });

  filters.statuses.forEach((status) => {
    const opt = STATUS_OPTIONS.find((o) => o.value === status);
    if (opt) {
      activeChips.push({
        label: opt.label,
        onRemove: () =>
          onFiltersChange({
            ...filters,
            statuses: filters.statuses.filter((s) => s !== status),
          }),
      });
    }
  });

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, código o proveedor…"
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            className="pl-9 pr-9"
          />
          {filters.search ? (
            <button
              type="button"
              onClick={() => onFiltersChange({ ...filters, search: "" })}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Limpiar búsqueda"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>

        {isMobile ? (
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="outline" className="shrink-0">
                  <Filter data-icon="inline-start" />
                  Filtros
                </Button>
              }
            />
            <SheetContent side="right" className="w-full sm:max-w-sm">
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
              </SheetHeader>
              <FilterPanel
                filters={filters}
                onFiltersChange={onFiltersChange}
                onClear={onClear}
                className="px-4 pb-6"
              />
            </SheetContent>
          </Sheet>
        ) : null}
      </div>

      {!isMobile ? (
        <FilterPanel
          filters={filters}
          onFiltersChange={onFiltersChange}
          onClear={onClear}
          className="rounded-xl border border-border bg-card/50 p-4"
        />
      ) : null}

      {activeChips.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          {activeChips.map((chip) => (
            <Badge key={chip.label} variant="secondary" className="gap-1">
              {chip.label}
              <button
                type="button"
                onClick={chip.onRemove}
                className="ml-0.5 rounded-full hover:bg-muted"
                aria-label={`Quitar filtro ${chip.label}`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={onClear}>
            Limpiar todo
          </Button>
        </div>
      ) : null}
    </div>
  );
}
