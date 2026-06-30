"use client";

import { ResourceWizardSummary } from "@/features/resources/components/resource-wizard-shared";
import type { ResourceWizardFormData } from "@/features/resources/types/wizard";

type ResourceReviewStepProps = {
  data: ResourceWizardFormData;
};

export function ResourceReviewStep({ data }: ResourceReviewStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-medium">Revisión</h2>
        <p className="text-sm text-muted-foreground">
          Verifica los datos antes de crear el recurso en modo demostración.
        </p>
      </div>

      <ResourceWizardSummary
        data={{
          ...data,
          type: data.type!,
        }}
      />
    </div>
  );
}
