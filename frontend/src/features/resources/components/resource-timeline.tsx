import {
  formatDate,
  formatRelativeDate,
} from "@/features/resources/lib/format";
import type { ResourceTimelineEvent } from "@/features/resources/types";
import { cn } from "@/lib/utils";

type ResourceTimelineProps = {
  events: ResourceTimelineEvent[];
  className?: string;
};

export function ResourceTimeline({ events, className }: ResourceTimelineProps) {
  const sorted = [...events].sort(
    (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return (
    <div className={cn("space-y-0", className)}>
      {sorted.map((event, index) => (
        <div key={event.id} className="relative flex gap-4 pb-8 last:pb-0">
          {index < sorted.length - 1 ? (
            <span
              className="absolute top-3 left-[5px] h-full w-px bg-border"
              aria-hidden
            />
          ) : null}
          <span className="relative z-10 mt-1.5 size-2.5 shrink-0 rounded-full border-2 border-primary bg-background" />
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <p className="text-sm font-medium">{event.title}</p>
              <time
                className="text-xs text-muted-foreground"
                dateTime={event.timestamp}
                title={formatDate(event.timestamp)}
              >
                {formatRelativeDate(event.timestamp)}
              </time>
            </div>
            {event.description ? (
              <p className="text-sm text-muted-foreground">
                {event.description}
              </p>
            ) : null}
            {event.user ? (
              <p className="text-xs text-muted-foreground">{event.user}</p>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
