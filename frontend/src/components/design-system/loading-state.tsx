import { Loader2 } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

type LoadingStateProps = {
  variant?: "spinner" | "skeleton";
  label?: string;
};

export function LoadingState({
  variant = "spinner",
  label = "Cargando…",
}: LoadingStateProps) {
  if (variant === "skeleton") {
    return (
      <div className="space-y-3 p-4">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-2/3" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
      <Loader2 className="size-5 animate-spin text-primary" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
