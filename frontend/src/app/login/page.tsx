import Link from "next/link";

import { BrewOSLogo } from "@/components/brand/brewos-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-col bg-background">
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="space-y-3 text-center">
            <div className="flex justify-center">
              <BrewOSLogo size="lg" />
            </div>
            <p className="text-sm text-muted-foreground">
              Sistema de Gestión de Producción Artesanal
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
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

              <Button render={<Link href="/dashboard" />} className="h-10 w-full">
                Iniciar sesión
              </Button>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-border px-4 py-6 text-center">
        <div className="space-y-1 text-xs text-muted-foreground">
          <p>Versión 0.1.0 Alpha</p>
          <p>Powered by Insular Origins</p>
          <p>Crafted by Carlos Romero Ramírez</p>
        </div>
      </footer>
    </div>
  );
}
