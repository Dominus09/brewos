"use client";

import {
  Copy,
  FilePlus,
  History,
  ImagePlus,
  Pencil,
  PackagePlus,
} from "lucide-react";
import { useState } from "react";

import { BreadcrumbNav } from "@/components/common/breadcrumb-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResourceStatusBadge } from "@/features/resources/components/resource-status-badge";
import { ResourceThumbnail } from "@/features/resources/components/resource-thumbnail";
import { ResourceTimeline } from "@/features/resources/components/resource-timeline";
import { ResourceTypeBadge } from "@/features/resources/components/resource-type-badge";
import {
  formatCurrency,
  formatDate,
  formatStock,
  resourcesBreadcrumbs,
} from "@/features/resources/lib/format";
import type { Resource } from "@/features/resources/types";
import { cn } from "@/lib/utils";

const DETAIL_TABS = [
  { id: "general", label: "General" },
  { id: "inventory", label: "Inventario" },
  { id: "costs", label: "Costos" },
  { id: "documents", label: "Documentos" },
  { id: "photos", label: "Fotografías" },
  { id: "history", label: "Historial" },
  { id: "relations", label: "Relaciones" },
] as const;

type DetailTab = (typeof DETAIL_TABS)[number]["id"];

type ResourceDetailViewProps = {
  resource: Resource;
};

export function ResourceDetailView({ resource }: ResourceDetailViewProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>("general");

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <BreadcrumbNav
        items={resourcesBreadcrumbs({ label: resource.name })}
      />

      {/* Hero */}
      <div className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6 md:flex-row md:items-start">
        <ResourceThumbnail resource={resource} size="lg" className="mx-auto md:mx-0" />
        <div className="min-w-0 flex-1 space-y-4">
          <div className="space-y-2 text-center md:text-left">
            <p className="font-mono text-sm text-muted-foreground">
              {resource.internalCode}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              {resource.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <ResourceTypeBadge type={resource.type} />
              <Badge variant="outline">{resource.subtype}</Badge>
              <ResourceStatusBadge status={resource.status} />
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-muted-foreground">Unidad</dt>
              <dd>{resource.unit}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Proveedor</dt>
              <dd>{resource.supplier?.name ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Última modificación</dt>
              <dd>{formatDate(resource.updatedAt)}</dd>
            </div>
          </dl>

          <div className="flex flex-wrap justify-center gap-2 md:justify-start">
            <Button variant="outline" size="sm" disabled>
              <Pencil data-icon="inline-start" />
              Editar
            </Button>
            <Button variant="ghost" size="sm" disabled>
              <Copy data-icon="inline-start" />
              Duplicar
            </Button>
            <Button variant="ghost" size="sm" disabled>
              <PackagePlus data-icon="inline-start" />
              Crear movimiento
            </Button>
            <Button variant="ghost" size="sm" disabled>
              <FilePlus data-icon="inline-start" />
              Agregar documento
            </Button>
            <Button variant="ghost" size="sm" disabled>
              <ImagePlus data-icon="inline-start" />
              Agregar fotografía
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab("history")}
            >
              <History data-icon="inline-start" />
              Ver historial
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-border pb-px">
        {DETAIL_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "shrink-0 border-b-2 px-3 py-2 text-sm transition-colors",
              activeTab === tab.id
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "general" ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-border shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Identificación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Código interno</p>
                <p className="font-mono">{resource.internalCode}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Nombre</p>
                <p>{resource.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Descripción</p>
                <p>{resource.description ?? "—"}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Clasificación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex flex-wrap gap-2">
                <ResourceTypeBadge type={resource.type} />
                <Badge variant="outline">{resource.subtype}</Badge>
              </div>
              {resource.category ? (
                <div>
                  <p className="text-muted-foreground">Categoría</p>
                  <p>{resource.category}</p>
                </div>
              ) : null}
              {resource.tags && resource.tags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {resource.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className="border-border shadow-none md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Comportamiento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["inventariable", "Inventariable"],
                    ["consumible", "Consumible"],
                    ["cultivable", "Cultivable"],
                    ["vendible", "Vendible"],
                    ["trazable", "Trazable"],
                    ["equipamiento", "Equipamiento"],
                  ] as const
                ).map(([key, label]) =>
                  resource.flags[key] ? (
                    <span
                      key={key}
                      className="rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-xs"
                    >
                      {label}
                    </span>
                  ) : null,
                )}
              </div>
            </CardContent>
          </Card>

          {resource.notes ? (
            <Card className="border-border shadow-none md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Notas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{resource.notes}</p>
              </CardContent>
            </Card>
          ) : null}
        </div>
      ) : null}

      {activeTab === "inventory" ? (
        <Card className="border-border shadow-none">
          <CardContent className="py-8">
            {resource.flags.inventariable ? (
              <dl className="grid gap-4 sm:grid-cols-3">
                <div>
                  <dt className="text-sm text-muted-foreground">Stock actual</dt>
                  <dd className="font-mono text-lg">
                    {formatStock(
                      resource.stock,
                      resource.unit,
                      resource.flags.inventariable,
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Stock mínimo</dt>
                  <dd className="font-mono text-lg">
                    {resource.stockMinimum ?? "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Unidad</dt>
                  <dd>{resource.unit}</dd>
                </div>
              </dl>
            ) : (
              <p className="text-center text-sm text-muted-foreground">
                Este recurso no es inventariable.
              </p>
            )}
          </CardContent>
        </Card>
      ) : null}

      {activeTab === "costs" ? (
        <Card className="border-border shadow-none">
          <CardContent className="py-8">
            <dl className="grid gap-4 sm:grid-cols-3">
              <div>
                <dt className="text-sm text-muted-foreground">
                  Costo de compra
                </dt>
                <dd className="font-mono text-lg">
                  {formatCurrency(
                    resource.cost.purchaseCost,
                    resource.cost.currency,
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">
                  Costo promedio
                </dt>
                <dd className="font-mono text-lg">
                  {formatCurrency(
                    resource.cost.averageCost,
                    resource.cost.currency,
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">
                  Valor estimado
                </dt>
                <dd className="font-mono text-lg">
                  {formatCurrency(
                    resource.cost.estimatedValue,
                    resource.cost.currency,
                  )}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      ) : null}

      {activeTab === "documents" ? (
        <Card className="border-border shadow-none">
          <CardContent className="py-6">
            {resource.documents.length > 0 ? (
              <ul className="divide-y divide-border">
                {resource.documents.map((doc) => (
                  <li
                    key={doc.id}
                    className="flex items-center justify-between py-3 text-sm"
                  >
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.type} · {formatDate(doc.uploadedAt)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-sm text-muted-foreground">
                Sin documentos adjuntos.
              </p>
            )}
          </CardContent>
        </Card>
      ) : null}

      {activeTab === "photos" ? (
        <Card className="border-border shadow-none">
          <CardContent className="py-6">
            {resource.photos.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {resource.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="flex aspect-square items-center justify-center rounded-lg border border-border bg-muted/20"
                  >
                    <ResourceThumbnail resource={resource} size="lg" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground">
                Sin fotografías adjuntas.
              </p>
            )}
          </CardContent>
        </Card>
      ) : null}

      {activeTab === "history" ? (
        <Card className="border-border shadow-none">
          <CardContent className="py-6">
            <ResourceTimeline events={resource.timeline} />
          </CardContent>
        </Card>
      ) : null}

      {activeTab === "relations" ? (
        <Card className="border-border shadow-none">
          <CardContent className="py-6">
            {resource.relations.length > 0 ? (
              <ul className="divide-y divide-border">
                {resource.relations.map((rel) => (
                  <li key={rel.id} className="py-3 text-sm">
                    <p className="font-medium">{rel.targetName}</p>
                    <p className="text-xs text-muted-foreground">
                      {rel.description ?? rel.type}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-sm text-muted-foreground">
                Sin relaciones registradas.
              </p>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
