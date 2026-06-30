"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  isSettingsNavActive,
  SETTINGS_NAVIGATION,
} from "@/features/settings/config/settings-navigation";
import { cn } from "@/lib/utils";

export function SettingsSubnav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Configuración"
      className="flex flex-col gap-6"
    >
      {SETTINGS_NAVIGATION.map((group) => (
        <div key={group.id} className="space-y-2">
          <p className="px-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {group.label}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = isSettingsNavActive(pathname, item.href);

              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block rounded-lg px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
