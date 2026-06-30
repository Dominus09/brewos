"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { BreadcrumbNav } from "@/components/common/breadcrumb-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ResourceFilesStep } from "@/features/resources/components/resource-files-step";
import { ResourceInformationStep } from "@/features/resources/components/resource-information-step";
import { ResourceReviewStep } from "@/features/resources/components/resource-review-step";
import { ResourceTypeStep } from "@/features/resources/components/resource-type-step";
import {
  ResourceWizardProgress,
} from "@/features/resources/components/resource-wizard-shared";
import { getResourceTypeConfig } from "@/features/resources/config/resource-types";
import { resourcesBreadcrumbs } from "@/features/resources/lib/format";
import type { ResourceTypeId } from "@/features/resources/types";
import {
  WIZARD_DEFAULT_VALUES,
  type ResourceWizardFormData,
} from "@/features/resources/types/wizard";

export function ResourceWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<ResourceWizardFormData>(WIZARD_DEFAULT_VALUES);
  const [completed, setCompleted] = useState(false);

  const updateData = (patch: Partial<ResourceWizardFormData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  };

  const handleTypeSelect = (type: ResourceTypeId) => {
    const config = getResourceTypeConfig(type);
    setData((prev) => ({
      ...prev,
      type,
      flags: config?.defaultFlags ?? prev.flags,
      subtype: "",
    }));
  };

  const canContinue = () => {
    if (step === 1) return data.type !== null;
    if (step === 2) return data.name.trim().length > 0 && data.unit.length > 0;
    return true;
  };

  const handleNext = () => {
    if (step < 4) {
      setStep((s) => s + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  if (completed) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <BreadcrumbNav
          items={resourcesBreadcrumbs({ label: "Nuevo recurso" })}
        />
        <Card className="border-border bg-card shadow-none">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
              <span className="text-lg">✓</span>
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-semibold">
                Recurso creado en modo demostración
              </h1>
              <p className="max-w-md text-sm text-muted-foreground">
                Los datos no se guardaron en el sistema. Cuando exista el
                backend, este flujo persistirá el recurso y redirigirá al
                detalle.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                variant="outline"
                render={<Link href="/resources" />}
              >
                Volver a Recursos
              </Button>
              <Button onClick={() => router.push("/resources")}>
                Ver catálogo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div className="space-y-4">
        <BreadcrumbNav
          items={resourcesBreadcrumbs({ label: "Nuevo recurso" })}
        />
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Nuevo recurso
          </h1>
          <p className="text-sm text-muted-foreground">
            Asistente de registro en el catálogo maestro.
          </p>
        </div>
      </div>

      <ResourceWizardProgress currentStep={step} />

      <Card className="border-border bg-card shadow-none">
        <CardContent className="p-6 md:p-8">
          {step === 1 ? (
            <ResourceTypeStep
              selectedType={data.type}
              onSelect={handleTypeSelect}
            />
          ) : null}
          {step === 2 ? (
            <ResourceInformationStep data={data} onChange={updateData} />
          ) : null}
          {step === 3 ? (
            <ResourceFilesStep data={data} onChange={updateData} />
          ) : null}
          {step === 4 ? <ResourceReviewStep data={data} /> : null}
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
        <Button
          variant="outline"
          render={step === 1 ? <Link href="/resources" /> : undefined}
          onClick={step > 1 ? handleBack : undefined}
        >
          {step === 1 ? "Cancelar" : "Atrás"}
        </Button>
        <Button onClick={handleNext} disabled={!canContinue()}>
          {step === 4 ? "Crear recurso" : "Continuar"}
        </Button>
      </div>
    </div>
  );
}
