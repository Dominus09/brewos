import { AppFooter } from "@/layouts/app-footer";
import { AppHeader } from "@/layouts/app-header";
import { AppSidebar } from "@/layouts/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex min-h-svh flex-col">
        <AppHeader />
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">{children}</main>
        <AppFooter />
      </SidebarInset>
    </SidebarProvider>
  );
}
