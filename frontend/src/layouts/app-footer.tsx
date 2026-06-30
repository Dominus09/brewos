import { siteConfig } from "@/config/site";

export function AppFooter() {
  return (
    <footer className="shrink-0 border-t border-border px-4 py-4 md:px-6">
      <div className="flex flex-col items-center gap-2 text-center text-xs text-muted-foreground sm:items-start sm:text-left">
        <p className="font-medium text-foreground/80">{siteConfig.name}</p>
        <p>Versión {siteConfig.version}</p>
        <p>{siteConfig.tagline}</p>
        <p>Powered by {siteConfig.company}</p>
        <p>Crafted by {siteConfig.author}</p>
      </div>
    </footer>
  );
}
