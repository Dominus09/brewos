import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ResourceDetailView } from "@/features/resources/components/resource-detail-view";
import { getResourceById } from "@/features/resources/services/resource-service";

type ResourceDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: ResourceDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const resource = getResourceById(id);

  return {
    title: resource?.name ?? "Recurso",
    description: resource?.description,
  };
}

export default async function ResourceDetailPage({
  params,
}: ResourceDetailPageProps) {
  const { id } = await params;
  const resource = getResourceById(id);

  if (!resource) {
    notFound();
  }

  return <ResourceDetailView resource={resource} />;
}
