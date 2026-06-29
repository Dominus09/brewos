import { cn } from "@/lib/utils";

type BrewOSLogoProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-3xl",
};

export function BrewOSLogo({ className, size = "md" }: BrewOSLogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-accent"
        aria-hidden
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="size-4 text-primary"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="2" />
          <line x1="12" y1="4" x2="12" y2="8" />
          <line x1="12" y1="16" x2="12" y2="20" />
          <line x1="4" y1="12" x2="8" y2="12" />
          <line x1="16" y1="12" x2="20" y2="12" />
        </svg>
      </div>
      <span className={cn("font-[family-name:var(--font-jakarta)] font-bold tracking-tight", sizeClasses[size])}>
        <span className="text-foreground">Brew</span>
        <span className="text-primary">OS</span>
      </span>
    </div>
  );
}
