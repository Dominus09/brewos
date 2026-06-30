import { Package, Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type ResourceEmptyStateProps = {
  hasFilters?: boolean;
  onClearFilters?: () => void;
};

export function ResourceEmptyState({
  hasFilters = false,
  onClearFilters,
}: ResourceEmptyStateProps) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-muted/10 px-6 py-12 text-center">
      <div className="flex size-12 items-center justify-center rounded-full border border-border bg-card">
        <Package className="size-5 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">
          {hasFilters
            ? "No hay recursos que coincidan con los filtros"
            : "Aún no hay recursos registrados"}
        </p>
        <p className="max-w-sm text-sm text-muted-foreground">
          {hasFilters
            ? "Prueba ajustando la búsqueda o limpiando los filtros activos."
            : "Comienza registrando el primer recurso del catálogo maestro."}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {hasFilters && onClearFilters ? (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Limpiar filtros
          </Button>
        ) : null}
        <Button size="sm" render={<Link href="/resources/new" />}>
          <Plus data-icon="inline-start" />
          Nuevo recurso
        </Button>
      </div>
    </div>
  );
}
