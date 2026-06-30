import { getResourceTypeConfig } from "@/features/resources/config/resource-types";
import type { Resource } from "@/features/resources/types";
import { cn } from "@/lib/utils";

type ResourceThumbnailProps = {
  resource: Resource;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZE_CLASSES = {
  sm: "size-8",
  md: "size-10",
  lg: "size-24 md:size-28",
};

export function ResourceThumbnail({
  resource,
  size = "sm",
  className,
}: ResourceThumbnailProps) {
  const config = getResourceTypeConfig(resource.type);
  const Icon = config?.icon;
  const primaryPhoto = resource.photos.find((p) => p.isPrimary);

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/30",
        SIZE_CLASSES[size],
        className,
      )}
    >
      {primaryPhoto?.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={primaryPhoto.url}
          alt={primaryPhoto.alt}
          className="size-full object-cover"
        />
      ) : Icon ? (
        <Icon
          className={cn(size === "lg" ? "size-8" : "size-4")}
          style={{ color: config?.colorToken }}
        />
      ) : null}
    </div>
  );
}
