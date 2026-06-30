import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SettingsSectionPage } from "@/features/settings/components/settings-section-page";
import { getSettingsNavItemByPath } from "@/features/settings/config/settings-navigation";

type SettingsCatchAllPageProps = {
  params: Promise<{ path: string[] }>;
};

export async function generateMetadata({
  params,
}: SettingsCatchAllPageProps): Promise<Metadata> {
  const { path } = await params;
  const item = getSettingsNavItemByPath(path);

  return {
    title: item?.label ?? "Configuración",
    description: item?.description,
  };
}

export default async function SettingsCatchAllPage({
  params,
}: SettingsCatchAllPageProps) {
  const { path } = await params;
  const item = getSettingsNavItemByPath(path);

  if (!item) {
    notFound();
  }

  return <SettingsSectionPage item={item} />;
}
