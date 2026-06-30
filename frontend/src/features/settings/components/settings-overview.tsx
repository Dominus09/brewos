import Link from "next/link";

import { BreadcrumbNav } from "@/components/common/breadcrumb-nav";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  SETTINGS_NAVIGATION,
} from "@/features/settings/config/settings-navigation";
import { settingsBreadcrumbs } from "@/features/settings/lib/breadcrumbs";

export function SettingsOverview() {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-8">
      <div className="space-y-4">
        <BreadcrumbNav items={settingsBreadcrumbs()} />
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Configuración
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Administración del sistema, parámetros globales y maestros de
            producción de Insular Origins.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {SETTINGS_NAVIGATION.map((group) => (
          <section key={group.id} className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {group.label}
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {group.items.map((item) => (
                <Link key={item.id} href={item.href}>
                  <Card className="h-full border-border bg-card shadow-none transition-colors hover:bg-muted/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-medium">
                        {item.label}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
