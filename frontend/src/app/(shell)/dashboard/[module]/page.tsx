import { notFound } from "next/navigation";

import { AppHeader } from "@/components/layout/app-header";
import { EmptyState } from "@/components/design-system/empty-state";
import { BREW_MODULES } from "@/lib/modules";

type ModulePageProps = {
  params: Promise<{ module: string }>;
};

export function generateStaticParams() {
  return BREW_MODULES.filter((m) => m.id !== "inicio").map((m) => ({
    module: m.id,
  }));
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { module: moduleId } = await params;
  const module = BREW_MODULES.find((m) => m.id === moduleId);

  if (!module || module.id === "inicio") {
    notFound();
  }

  const Icon = module.icon;

  return (
    <>
      <AppHeader title={module.label} description={module.description} />
      <main className="flex-1 overflow-auto">
        <EmptyState
          icon={Icon}
          title={module.label}
          description="Módulo en desarrollo. La interfaz estará disponible en próximos sprints."
        />
      </main>
    </>
  );
}
