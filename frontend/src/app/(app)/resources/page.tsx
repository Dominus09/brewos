import type { Metadata } from "next";

import { ResourcesView } from "@/features/resources/components/resources-view";
import type { ResourceTypeId } from "@/features/resources/types";
import { RESOURCE_TYPES } from "@/features/resources/config/resource-types";

export const metadata: Metadata = {
  title: "Recursos",
  description:
    "Catálogo maestro de insumos, equipos, envases y materiales de Insular Origins.",
};

type ResourcesPageProps = {
  searchParams: Promise<{ type?: string }>;
};

function parseTypeParam(type?: string): ResourceTypeId | null {
  if (!type) return null;
  return RESOURCE_TYPES.some((t) => t.id === type)
    ? (type as ResourceTypeId)
    : null;
}

export default async function ResourcesPage({
  searchParams,
}: ResourcesPageProps) {
  const { type } = await searchParams;

  return <ResourcesView initialType={parseTypeParam(type)} />;
}
