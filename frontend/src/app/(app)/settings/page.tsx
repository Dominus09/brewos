import type { Metadata } from "next";

import { ModulePlaceholderPage } from "@/features/shared/components/module-placeholder-page";

export const metadata: Metadata = {
  title: "Configuración",
};

export default function SettingsPage() {
  return <ModulePlaceholderPage moduleId="settings" />;
}
