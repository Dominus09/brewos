import type { Metadata } from "next";

import { ModulePlaceholderPage } from "@/features/shared/components/module-placeholder-page";

export const metadata: Metadata = {
  title: "Jardín Botánico",
};

export default function BotanicalGardenPage() {
  return <ModulePlaceholderPage moduleId="botanical-garden" />;
}
