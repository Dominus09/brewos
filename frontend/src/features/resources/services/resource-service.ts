import { MOCK_RESOURCES } from "@/features/resources/data/mock-resources";
import type {
  Resource,
  ResourceFilters,
  ResourceTypeId,
} from "@/features/resources/types";

/**
 * Capa de acceso a datos de recursos.
 * Reemplazar implementaciones mock por llamadas API en el futuro.
 */
export function getResources(): Resource[] {
  return MOCK_RESOURCES;
}

export function getResourceById(id: string): Resource | undefined {
  return MOCK_RESOURCES.find((r) => r.id === id);
}

export function filterResources(
  resources: Resource[],
  filters: ResourceFilters,
): Resource[] {
  const query = filters.search.trim().toLowerCase();

  return resources.filter((resource) => {
    if (query) {
      const haystack = [
        resource.name,
        resource.internalCode,
        resource.subtype,
        resource.supplier?.name ?? "",
        ...(resource.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(query)) return false;
    }

    if (
      filters.types.length > 0 &&
      !filters.types.includes(resource.type)
    ) {
      return false;
    }

    if (
      filters.statuses.length > 0 &&
      !filters.statuses.includes(resource.status)
    ) {
      return false;
    }

    if (
      filters.inventariable !== null &&
      filters.inventariable !== undefined &&
      resource.flags.inventariable !== filters.inventariable
    ) {
      return false;
    }

    if (
      filters.consumible !== null &&
      filters.consumible !== undefined &&
      resource.flags.consumible !== filters.consumible
    ) {
      return false;
    }

    if (
      filters.cultivable !== null &&
      filters.cultivable !== undefined &&
      resource.flags.cultivable !== filters.cultivable
    ) {
      return false;
    }

    if (
      filters.vendible !== null &&
      filters.vendible !== undefined &&
      resource.flags.vendible !== filters.vendible
    ) {
      return false;
    }

    return true;
  });
}

export function countResourcesByType(
  resources: Resource[],
): Record<ResourceTypeId, number> {
  const counts = {} as Record<ResourceTypeId, number>;

  for (const resource of resources) {
    counts[resource.type] = (counts[resource.type] ?? 0) + 1;
  }

  return counts;
}
