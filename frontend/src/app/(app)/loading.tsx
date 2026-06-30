import { Loader2 } from "lucide-react";

export default function AppLoading() {
  return (
    <div className="flex flex-1 items-center justify-center py-24">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin text-primary" />
        <span>Cargando…</span>
      </div>
    </div>
  );
}
