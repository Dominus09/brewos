import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type PlaceholderCardProps = {
  title: string;
  className?: string;
};

export function PlaceholderCard({ title, className }: PlaceholderCardProps) {
  return (
    <Card
      className={cn(
        "border-border bg-card shadow-none",
        className,
      )}
    >
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <div className="min-h-[88px] border-t border-border/60 px-6 pb-6 pt-4">
        <div className="h-full rounded-md border border-dashed border-border/80 bg-muted/20" />
      </div>
    </Card>
  );
}
