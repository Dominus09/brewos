import { SettingsSubnav } from "@/features/settings/components/settings-subnav";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

type SettingsShellProps = {
  children: React.ReactNode;
};

export function SettingsShell({ children }: SettingsShellProps) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 lg:flex-row lg:gap-8">
      {/* Mobile subnav */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger
            render={
              <Button variant="outline" size="sm">
                <Menu data-icon="inline-start" />
                Secciones
              </Button>
            }
          />
          <SheetContent side="left" className="w-full max-w-xs">
            <SheetHeader>
              <SheetTitle>Configuración</SheetTitle>
            </SheetHeader>
            <div className="px-4 pb-6">
              <SettingsSubnav />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop subnav */}
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="sticky top-4 rounded-xl border border-border bg-card/50 p-3">
          <SettingsSubnav />
        </div>
      </aside>

      {children}
    </div>
  );
}
