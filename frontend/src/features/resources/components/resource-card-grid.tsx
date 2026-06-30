"use client";

import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ResourceStatusBadge } from "@/features/resources/components/resource-status-badge";
import { ResourceThumbnail } from "@/features/resources/components/resource-thumbnail";
import { ResourceTypeBadge } from "@/features/resources/components/resource-type-badge";
import {
  formatCurrency,
  formatRelativeDate,
  formatStock,
} from "@/features/resources/lib/format";
import type { Resource } from "@/features/resources/types";

type ResourceCardGridProps = {
  resources: Resource[];
};

export function ResourceCardGrid({ resources }: ResourceCardGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {resources.map((resource) => {
        const cost =
          resource.cost.purchaseCost ??
          resource.cost.averageCost ??
          resource.cost.estimatedValue;

        return (
          <Link key={resource.id} href={`/resources/${resource.id}`}>
            <Card className="h-full border-border bg-card shadow-none transition-colors hover:bg-muted/20">
              <CardHeader className="flex flex-row items-start gap-3 space-y-0 pb-3">
                <ResourceThumbnail resource={resource} size="md" />
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="font-mono text-xs text-muted-foreground">
                    {resource.internalCode}
                  </p>
                  <p className="truncate font-medium">{resource.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {resource.subtype}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="flex flex-wrap items-center gap-2">
                  <ResourceTypeBadge type={resource.type} />
                  <ResourceStatusBadge status={resource.status} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Costo</p>
                    <p className="font-mono">
                      {formatCurrency(cost, resource.cost.currency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Stock</p>
                    <p className="font-mono">
                      {formatStock(
                        resource.stock,
                        resource.unit,
                        resource.flags.inventariable,
                      )}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {resource.supplier?.name ?? "Sin proveedor"} ·{" "}
                  {formatRelativeDate(resource.updatedAt)}
                </p>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
