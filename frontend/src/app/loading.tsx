import { Loader2 } from "lucide-react";

import { BrewOSLogo } from "@/components/brand/brewos-logo";

export default function RootLoading() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background px-4">
      <BrewOSLogo size="md" />
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin text-primary" />
        <span>Cargando BrewOS…</span>
      </div>
    </div>
  );
}
