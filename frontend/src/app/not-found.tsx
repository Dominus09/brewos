import Link from "next/link";

import { BrewOSLogo } from "@/components/brand/brewos-logo";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 bg-background px-4 text-center">
      <BrewOSLogo size="md" />
      <div className="space-y-2">
        <p className="font-[family-name:var(--font-jetbrains)] text-sm text-primary">
          404
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">
          Página no encontrada
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          La ruta que buscas no existe en {siteConfig.name}.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button render={<Link href={siteConfig.loginRoute} />} variant="outline">
          Ir al login
        </Button>
        <Button render={<Link href={siteConfig.defaultRoute} />}>
          Centro de Control
        </Button>
      </div>
    </div>
  );
}
