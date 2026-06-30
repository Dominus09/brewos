import { BreadcrumbNav } from "@/components/common/breadcrumb-nav";
import type { BreadcrumbItem } from "@/types/navigation";

type ModulePageProps = {
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
};

export function ModulePage({
  title,
  description,
  breadcrumbs,
}: ModulePageProps) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <div className="space-y-4">
        <BreadcrumbNav items={breadcrumbs} />
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            {description}
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
