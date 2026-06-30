import type { ResourceWizardFormData } from "@/features/resources/types/wizard";
import { getResourceTypeConfig } from "@/features/resources/config/resource-types";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Tipo" },
  { id: 2, label: "Información" },
  { id: 3, label: "Archivos" },
  { id: 4, label: "Revisión" },
] as const;

type ResourceWizardProgressProps = {
  currentStep: number;
};

export function ResourceWizardProgress({
  currentStep,
}: ResourceWizardProgressProps) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((step, index) => (
        <div key={step.id} className="flex flex-1 items-center gap-2">
          <div className="flex min-w-0 flex-1 flex-col items-center gap-1">
            <span
              className={cn(
                "flex size-7 items-center justify-center rounded-full border text-xs font-medium",
                currentStep >= step.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground",
              )}
            >
              {step.id}
            </span>
            <span
              className={cn(
                "hidden text-xs sm:block",
                currentStep >= step.id
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {step.label}
            </span>
          </div>
          {index < STEPS.length - 1 ? (
            <div
              className={cn(
                "mb-5 h-px flex-1",
                currentStep > step.id ? "bg-primary" : "bg-border",
              )}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

type ResourceWizardSummaryProps = {
  data: ResourceWizardFormData & {
    type: NonNullable<ResourceWizardFormData["type"]>;
  };
};

export function ResourceWizardSummary({ data }: ResourceWizardSummaryProps) {
  const typeConfig = getResourceTypeConfig(data.type);

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h3 className="text-sm font-medium">Identidad</h3>
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Nombre</dt>
            <dd>{data.name || "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Subtipo</dt>
            <dd>{data.subtype || "—"}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-muted-foreground">Descripción</dt>
            <dd>{data.description || "—"}</dd>
          </div>
        </dl>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium">Clasificación</h3>
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Tipo</dt>
            <dd>{typeConfig?.label ?? data.type}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Unidad base</dt>
            <dd>{data.unit || "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Estado</dt>
            <dd>{data.status === "draft" ? "Borrador" : "Activo"}</dd>
          </div>
        </dl>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium">Comportamiento</h3>
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
            data.flags[key] ? (
              <span
                key={key}
                className="rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-xs"
              >
                {label}
              </span>
            ) : null,
          )}
        </div>
      </section>

      {(data.purchaseCost || data.supplierName) && (
        <section className="space-y-3">
          <h3 className="text-sm font-medium">Costos</h3>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            {data.supplierName ? (
              <div>
                <dt className="text-muted-foreground">Proveedor</dt>
                <dd>{data.supplierName}</dd>
              </div>
            ) : null}
            {data.purchaseCost ? (
              <div>
                <dt className="text-muted-foreground">Costo de compra</dt>
                <dd className="font-mono">
                  ${Number(data.purchaseCost).toLocaleString("es-CL")} CLP
                </dd>
              </div>
            ) : null}
          </dl>
        </section>
      )}

      <section className="space-y-3">
        <h3 className="text-sm font-medium">Documentos</h3>
        <p className="text-sm text-muted-foreground">
          {data.documentNames.length > 0
            ? data.documentNames.join(", ")
            : "Sin documentos adjuntos"}
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium">Fotografías</h3>
        <p className="text-sm text-muted-foreground">
          {data.photoCount > 0
            ? `${data.photoCount} archivo(s) seleccionado(s)`
            : "Sin fotografías adjuntas"}
        </p>
      </section>

      <p className="rounded-lg border border-border bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
        El código interno se asignará al guardar en el sistema definitivo.
      </p>
    </div>
  );
}
