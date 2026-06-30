import { BreadcrumbNav } from "@/components/common/breadcrumb-nav";
import type { SettingsNavItem } from "@/features/settings/config/settings-navigation";
import { settingsBreadcrumbs } from "@/features/settings/lib/breadcrumbs";

type SettingsSectionPageProps = {
  item: SettingsNavItem;
};

export function SettingsSectionPage({ item }: SettingsSectionPageProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-8">
      <div className="space-y-4">
        <BreadcrumbNav items={settingsBreadcrumbs(item)} />
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {item.label}
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            {item.description}
          </p>
        </div>
      </div>

      <div className="min-h-[320px] rounded-xl border border-dashed border-border bg-muted/10 p-6 md:min-h-[400px] md:p-8">
        <div className="flex h-full min-h-[280px] items-center justify-center rounded-lg border border-border/60 bg-card/50">
          <p className="text-sm text-muted-foreground">Módulo en desarrollo</p>
        </div>
      </div>
    </div>
  );
}
