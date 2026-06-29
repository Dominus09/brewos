import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { BrewModule } from "@/lib/modules";
import { cn } from "@/lib/utils";

type ModuleCardProps = {
  module: BrewModule;
  className?: string;
};

export function ModuleCard({ module, className }: ModuleCardProps) {
  const Icon = module.icon;

  return (
    <Link href={module.href} className={cn("group block", className)}>
      <Card className="flex h-full flex-col gap-4 border-border bg-card p-5 transition-colors hover:border-primary/30 hover:bg-accent/40 md:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-background text-primary">
            <Icon className="size-5" strokeWidth={1.5} />
          </div>
          <ChevronRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-semibold">{module.label}</h2>
          <p className="text-sm text-muted-foreground">{module.description}</p>
        </div>
      </Card>
    </Link>
  );
}
