import { PlaceholderCard } from "@/components/common/placeholder-card";
import { BreadcrumbNav } from "@/components/common/breadcrumb-nav";

const MODULE_CARDS = [
  "Recursos",
  "Inventario",
  "Recetas",
  "Producción",
  "Trazabilidad",
  "Jardín Botánico",
  "Laboratorio",
  "Reportes",
  "Configuración",
] as const;

const PANEL_CARDS = [
  "Actividad reciente",
  "Alertas",
  "Accesos rápidos",
] as const;

export function ControlCenterView() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <div className="space-y-4">
        <BreadcrumbNav items={[{ label: "Centro de Control" }]} />
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Bienvenido a BrewOS
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Centro de Control — vista operativa del sistema.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODULE_CARDS.map((title) => (
          <PlaceholderCard key={title} title={title} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <PlaceholderCard title={PANEL_CARDS[0]} className="lg:col-span-3" />
        <PlaceholderCard title={PANEL_CARDS[1]} />
        <PlaceholderCard title={PANEL_CARDS[2]} className="lg:col-span-2" />
      </div>
    </div>
  );
}
