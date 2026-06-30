"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getResourceTypeConfig } from "@/features/resources/config/resource-types";
import type { ResourceWizardFormData } from "@/features/resources/types/wizard";
import { cn } from "@/lib/utils";

type ResourceInformationStepProps = {
  data: ResourceWizardFormData;
  onChange: (patch: Partial<ResourceWizardFormData>) => void;
};

const UNITS = ["kg", "L", "unidad", "g", "ml", "%", "sesión"];

export function ResourceInformationStep({
  data,
  onChange,
}: ResourceInformationStepProps) {
  const typeConfig = data.type ? getResourceTypeConfig(data.type) : null;

  const toggleFlag = (
    key: keyof ResourceWizardFormData["flags"],
  ) => {
    onChange({
      flags: {
        ...data.flags,
        [key]: !data.flags[key],
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-medium">Datos del recurso</h2>
        {typeConfig ? (
          <p className="text-sm text-muted-foreground">
            Tipo seleccionado:{" "}
            <span className="text-foreground">{typeConfig.label}</span>
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Ej. Alcohol 96°"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subtype">Subtipo</Label>
          <Select
            value={data.subtype}
            onValueChange={(value) =>
              onChange({ subtype: value ?? "" })
            }
          >
            <SelectTrigger id="subtype" className="w-full">
              <SelectValue placeholder="Seleccionar subtipo" />
            </SelectTrigger>
            <SelectContent>
              {(typeConfig?.suggestedSubtypes ?? []).map((subtype) => (
                <SelectItem key={subtype} value={subtype}>
                  {subtype}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">Unidad base</Label>
          <Select
            value={data.unit}
            onValueChange={(value) => onChange({ unit: value ?? "" })}
          >
            <SelectTrigger id="unit" className="w-full">
              <SelectValue placeholder="Seleccionar unidad" />
            </SelectTrigger>
            <SelectContent>
              {UNITS.map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Descripción</Label>
          <textarea
            id="description"
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
            rows={3}
            className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            placeholder="Origen, uso o notas de manejo"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="supplier">Proveedor principal</Label>
          <Input
            id="supplier"
            value={data.supplierName}
            onChange={(e) => onChange({ supplierName: e.target.value })}
            placeholder="Opcional"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cost">Costo de compra (CLP)</Label>
          <Input
            id="cost"
            type="number"
            min={0}
            value={data.purchaseCost}
            onChange={(e) => onChange({ purchaseCost: e.target.value })}
            placeholder="Opcional"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Estado</Label>
          <Select
            value={data.status}
            onValueChange={(value) =>
              onChange({
                status: (value ?? "draft") as ResourceWizardFormData["status"],
              })
            }
          >
            <SelectTrigger id="status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Borrador</SelectItem>
              <SelectItem value="active">Activo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label>Comportamiento</Label>
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
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => toggleFlag(key)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition-colors",
                  data.flags[key]
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="notes">Notas</Label>
          <textarea
            id="notes"
            value={data.notes}
            onChange={(e) => onChange({ notes: e.target.value })}
            rows={2}
            className="flex min-h-[64px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            placeholder="Observaciones internas"
          />
        </div>
      </div>
    </div>
  );
}
