import type { Metadata } from "next";

import { ControlCenterView } from "@/features/control-center/components/control-center-view";

export const metadata: Metadata = {
  title: "Centro de Control",
};

export default function ControlCenterPage() {
  return <ControlCenterView />;
}
