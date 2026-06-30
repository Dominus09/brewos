import type { Metadata } from "next";

import { ModulePlaceholderPage } from "@/features/shared/components/module-placeholder-page";

export const metadata: Metadata = {
  title: "Recursos",
};

export default function ResourcesPage() {
  return <ModulePlaceholderPage moduleId="resources" />;
}
