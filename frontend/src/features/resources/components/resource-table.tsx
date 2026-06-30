"use client";

import { useRouter } from "next/navigation";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ResourceStatusBadge } from "@/features/resources/components/resource-status-badge";
import { ResourceThumbnail } from "@/features/resources/components/resource-thumbnail";
import { ResourceTypeBadge } from "@/features/resources/components/resource-type-badge";
import {
  formatCurrency,
  formatRelativeDate,
  formatStock,
} from "@/features/resources/lib/format";
import type { Resource } from "@/features/resources/types";

type ResourceTableProps = {
  resources: Resource[];
};

export function ResourceTable({ resources }: ResourceTableProps) {
  const router = useRouter();

  return (
    <div className="rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[100px]">Código</TableHead>
            <TableHead className="w-[48px]">Imagen</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead className="hidden lg:table-cell">Tipo</TableHead>
            <TableHead className="hidden xl:table-cell">Subtipo</TableHead>
            <TableHead className="hidden md:table-cell">Unidad</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="hidden lg:table-cell">Costo</TableHead>
            <TableHead className="hidden md:table-cell">Stock</TableHead>
            <TableHead className="hidden xl:table-cell">Proveedor</TableHead>
            <TableHead className="hidden sm:table-cell">Modificación</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resources.map((resource) => {
            const cost =
              resource.cost.purchaseCost ??
              resource.cost.averageCost ??
              resource.cost.estimatedValue;

            return (
              <TableRow
                key={resource.id}
                className="cursor-pointer"
                onClick={() => router.push(`/resources/${resource.id}`)}
              >
                <TableCell className="font-mono text-xs">
                  {resource.internalCode}
                </TableCell>
                <TableCell>
                  <ResourceThumbnail resource={resource} />
                </TableCell>
                <TableCell>
                  <div className="min-w-[140px]">
                    <p className="font-medium">{resource.name}</p>
                    <p className="text-xs text-muted-foreground lg:hidden">
                      {resource.subtype}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <ResourceTypeBadge type={resource.type} />
                </TableCell>
                <TableCell className="hidden text-muted-foreground xl:table-cell">
                  {resource.subtype}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {resource.unit}
                </TableCell>
                <TableCell>
                  <ResourceStatusBadge status={resource.status} />
                </TableCell>
                <TableCell className="hidden font-mono text-xs lg:table-cell">
                  {formatCurrency(cost, resource.cost.currency)}
                </TableCell>
                <TableCell className="hidden font-mono text-xs md:table-cell">
                  {formatStock(
                    resource.stock,
                    resource.unit,
                    resource.flags.inventariable,
                  )}
                </TableCell>
                <TableCell className="hidden max-w-[140px] truncate text-muted-foreground xl:table-cell">
                  {resource.supplier?.name ?? "—"}
                </TableCell>
                <TableCell
                  className="hidden text-xs text-muted-foreground sm:table-cell"
                  title={resource.updatedAt}
                >
                  {formatRelativeDate(resource.updatedAt)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
