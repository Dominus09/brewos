import type { Metadata } from "next";

import { ModulePlaceholderPage } from "@/features/shared/components/module-placeholder-page";

export const metadata: Metadata = {
  title: "Laboratorio",
};

export default function LaboratoryPage() {
  return <ModulePlaceholderPage moduleId="laboratory" />;
}
