import type { Metadata } from "next";
import Link from "next/link";

import { BrewOSLogo } from "@/components/brand/brewos-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: `Acceso a ${siteConfig.name}`,
};

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="space-y-3 text-center">
            <div className="flex justify-center">
              <BrewOSLogo size="lg" />
            </div>
            <p className="text-sm text-muted-foreground">{siteConfig.tagline}</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="usuario">Usuario</Label>
                <Input
                  id="usuario"
                  name="usuario"
                  type="text"
                  placeholder="usuario@ejemplo.com"
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contrasena">Contraseña</Label>
                <Input
                  id="contrasena"
                  name="contrasena"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>

              <Button
                render={<Link href={siteConfig.defaultRoute} />}
                className="h-10 w-full"
              >
                Iniciar sesión
              </Button>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-border px-4 py-6 text-center">
        <div className="space-y-1 text-xs text-muted-foreground">
          <p>
            {siteConfig.name} · Versión {siteConfig.version}
          </p>
          <p>{siteConfig.tagline}</p>
          <p>Powered by {siteConfig.company}</p>
          <p>Crafted by {siteConfig.author}</p>
        </div>
      </footer>
    </div>
  );
}
