import type { Metadata } from "next";

import { ModulePlaceholderPage } from "@/features/shared/components/module-placeholder-page";

export const metadata: Metadata = {
  title: "Producción",
};

export default function ProductionPage() {
  return <ModulePlaceholderPage moduleId="production" />;
}
