import type { Metadata } from "next";

import { ModulePlaceholderPage } from "@/features/shared/components/module-placeholder-page";

export const metadata: Metadata = {
  title: "Reportes",
};

export default function ReportsPage() {
  return <ModulePlaceholderPage moduleId="reports" />;
}
