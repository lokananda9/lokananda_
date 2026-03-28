import { Button } from "./ui/button";
import { usePortfolioContent } from "../lib/content-store";
import { getRenderableUrl, shouldOpenInNewTab } from "../lib/url-utils";

export function Navbar() {
  const { content } = usePortfolioContent();
  const { navItems, hero, resumeSection } = content;
  const resumeUrl = getRenderableUrl(resumeSection.pdfUrl);
  const primaryHref = resumeUrl || "#resume";
  const primaryTarget = shouldOpenInNewTab(resumeUrl) ? "_blank" : undefined;

  return (
    <header className="sticky top-0 z-30">
      <nav className="border-b border-background/70 bg-background/52 px-6 py-5 transition-all duration-300 hover:backdrop-blur-xl md:px-12 lg:px-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <a
              href="#about"
              className="text-xl font-semibold tracking-tight text-foreground"
              aria-label={hero.name}
            >
              ✦ {hero.name}
            </a>

            <Button asChild className="px-5 text-sm font-medium">
              <a
                href={primaryHref}
                target={primaryTarget}
                rel={primaryTarget ? "noreferrer" : undefined}
              >
                {hero.primaryCta}
              </a>
            </Button>
          </div>

          <div className="-mx-2 overflow-x-auto pb-1">
            <div className="flex min-w-max items-center gap-3 px-2 md:gap-6">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
