import { ModulePage } from "@/components/common/module-page";
import { getNavModuleById } from "@/config/navigation";

type ModulePlaceholderPageProps = {
  moduleId: Parameters<typeof getNavModuleById>[0];
};

export function ModulePlaceholderPage({ moduleId }: ModulePlaceholderPageProps) {
  const navModule = getNavModuleById(moduleId);

  if (!navModule) {
    return null;
  }

  return (
    <ModulePage
      title={navModule.label}
      description={navModule.description}
      breadcrumbs={[{ label: navModule.label }]}
    />
  );
}
