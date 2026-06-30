"use client";

import { LayoutGrid, Plus, Table2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { BreadcrumbNav } from "@/components/common/breadcrumb-nav";
import { Button } from "@/components/ui/button";
import { ResourceCardGrid } from "@/features/resources/components/resource-card-grid";
import { ResourceEmptyState } from "@/features/resources/components/resource-empty-state";
import { ResourceFiltersBar } from "@/features/resources/components/resource-filters";
import { ResourceSummaryCards } from "@/features/resources/components/resource-summary-cards";
import { ResourceTable } from "@/features/resources/components/resource-table";
import { getResourceTypeLabel } from "@/features/resources/config/resource-types";
import { resourcesBreadcrumbs } from "@/features/resources/lib/format";
import {
  countResourcesByType,
  filterResources,
  getResources,
} from "@/features/resources/services/resource-service";
import type {
  ResourceFilters,
  ResourceTypeId,
  ResourceViewMode,
} from "@/features/resources/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const DEFAULT_FILTERS: ResourceFilters = {
  search: "",
  types: [],
  statuses: [],
  inventariable: null,
  consumible: null,
  cultivable: null,
  vendible: null,
};

type ResourcesViewProps = {
  initialType?: ResourceTypeId | null;
};

export function ResourcesView({ initialType = null }: ResourcesViewProps) {
  const isMobile = useIsMobile();
  const allResources = useMemo(() => getResources(), []);

  const [filters, setFilters] = useState<ResourceFilters>(() => ({
    ...DEFAULT_FILTERS,
    types: initialType ? [initialType] : [],
  }));

  const [viewMode, setViewMode] = useState<ResourceViewMode>("table");
  const [activeSummaryType, setActiveSummaryType] = useState<
    ResourceTypeId | null
  >(initialType);

  useEffect(() => {
    if (isMobile) {
      setViewMode("cards");
    }
  }, [isMobile]);

  const filteredResources = useMemo(
    () => filterResources(allResources, filters),
    [allResources, filters],
  );

  const typeCounts = useMemo(
    () => countResourcesByType(allResources),
    [allResources],
  );

  const handleTypeSelect = useCallback((type: ResourceTypeId | null) => {
    setActiveSummaryType(type);
    setFilters((prev) => ({
      ...prev,
      types: type ? [type] : [],
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setActiveSummaryType(null);
    setFilters(DEFAULT_FILTERS);
  }, []);

  const hasActiveFilters =
    filters.search.length > 0 ||
    filters.types.length > 0 ||
    filters.statuses.length > 0 ||
    filters.inventariable !== null ||
    filters.consumible !== null ||
    filters.cultivable !== null ||
    filters.vendible !== null;

  const breadcrumbTrail =
    activeSummaryType && filters.types.length === 1
      ? [{ label: getResourceTypeLabel(activeSummaryType) }]
      : [];

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-4">
          <BreadcrumbNav items={resourcesBreadcrumbs(...breadcrumbTrail)} />
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Recursos</h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Catálogo maestro de insumos, equipos, envases y materiales de
              Insular Origins.
            </p>
          </div>
        </div>
        <Button
          render={<Link href="/resources/new" />}
          className="shrink-0 self-start"
        >
          <Plus data-icon="inline-start" />
          Nuevo recurso
        </Button>
      </div>

      <ResourceSummaryCards
        counts={typeCounts}
        activeType={activeSummaryType}
        onTypeSelect={handleTypeSelect}
      />

      <ResourceFiltersBar
        filters={filters}
        onFiltersChange={setFilters}
        onClear={handleClearFilters}
      />

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {filteredResources.length} recurso
          {filteredResources.length !== 1 ? "s" : ""}
        </p>
        {!isMobile ? (
          <div className="flex items-center gap-1 rounded-lg border border-border p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs transition-colors",
                viewMode === "table"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Table2 className="size-3.5" />
              Tabla
            </button>
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs transition-colors",
                viewMode === "cards"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <LayoutGrid className="size-3.5" />
              Cards
            </button>
          </div>
        ) : null}
      </div>

      {filteredResources.length === 0 ? (
        <ResourceEmptyState
          hasFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />
      ) : viewMode === "table" && !isMobile ? (
        <ResourceTable resources={filteredResources} />
      ) : (
        <ResourceCardGrid resources={filteredResources} />
      )}
    </div>
  );
}
