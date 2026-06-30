"use client";

import { User } from "lucide-react";

import { BrewOSLogo } from "@/components/brand/brewos-logo";
import { ThemeToggle } from "@/providers/theme-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { siteConfig } from "@/config/site";

export function AppHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur-sm md:px-6">
      <SidebarTrigger className="-ml-1" />

      <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-4">
        <BrewOSLogo size="sm" className="hidden sm:flex" />
        <Separator orientation="vertical" className="hidden h-5 sm:block" />
        <p className="hidden truncate text-sm text-muted-foreground md:block">
          {siteConfig.tagline}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground"
          disabled
        >
          <span className="flex size-7 items-center justify-center rounded-full border border-border bg-muted/50">
            <User className="size-3.5" />
          </span>
          <span className="hidden sm:inline">Usuario</span>
        </Button>
      </div>
    </header>
  );
}
