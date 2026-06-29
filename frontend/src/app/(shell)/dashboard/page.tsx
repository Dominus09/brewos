import { AppHeader } from "@/components/layout/app-header";
import { ModuleCard } from "@/components/dashboard/module-card";
import { BREW_MODULES } from "@/lib/modules";

export default function DashboardPage() {
  const modules = BREW_MODULES.filter((m) => m.id !== "inicio");

  return (
    <>
      <AppHeader
        title="Centro de Control"
        description="Acceso a los módulos del sistema"
      />
      <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="space-y-1">
            <h2 className="text-sm font-medium text-muted-foreground">
              Módulos
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {modules.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
