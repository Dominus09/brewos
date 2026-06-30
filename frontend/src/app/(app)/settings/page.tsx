import type { Metadata } from "next";

import { SettingsOverview } from "@/features/settings/components/settings-overview";

export const metadata: Metadata = {
  title: "Configuración",
  description:
    "Administración del sistema y maestros de producción de Insular Origins.",
};

export default function SettingsPage() {
  return <SettingsOverview />;
}
