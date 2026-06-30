import type { Metadata } from "next";

import { ModulePlaceholderPage } from "@/features/shared/components/module-placeholder-page";

export const metadata: Metadata = {
  title: "Inventario",
};

export default function InventoryPage() {
  return <ModulePlaceholderPage moduleId="inventory" />;
}
