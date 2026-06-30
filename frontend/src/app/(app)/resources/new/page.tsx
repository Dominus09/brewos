import type { Metadata } from "next";

import { ResourceWizard } from "@/features/resources/components/resource-wizard";

export const metadata: Metadata = {
  title: "Nuevo recurso",
  description: "Asistente de registro en el catálogo maestro de recursos.",
};

export default function NewResourcePage() {
  return <ResourceWizard />;
}
