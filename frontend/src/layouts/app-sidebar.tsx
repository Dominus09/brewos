"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { isNavItemActive, MAIN_NAVIGATION } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { BrewOSLogo } from "@/components/brand/brewos-logo";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-3">
        <Link
          href={siteConfig.defaultRoute}
          className="flex items-center px-1 group-data-[collapsible=icon]:justify-center"
        >
          <BrewOSLogo size="sm" showWordmark={false} />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Módulos</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MAIN_NAVIGATION.map((module) => (
                <SidebarMenuItem key={module.id}>
                  <SidebarMenuButton
                    render={<Link href={module.href} />}
                    isActive={isNavItemActive(pathname, module.href)}
                    tooltip={module.label}
                  >
                    <module.icon />
                    <span>{module.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <p className="truncate px-2 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
          {siteConfig.company}
        </p>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
