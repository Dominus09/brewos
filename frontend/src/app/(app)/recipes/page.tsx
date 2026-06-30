import type { Metadata } from "next";

import { ModulePlaceholderPage } from "@/features/shared/components/module-placeholder-page";

export const metadata: Metadata = {
  title: "Recetas",
};

export default function RecipesPage() {
  return <ModulePlaceholderPage moduleId="recipes" />;
}
