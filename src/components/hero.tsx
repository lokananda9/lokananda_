import { motion } from "framer-motion";
import { ArrowDownRight, ImagePlus, Mail, FileText } from "lucide-react";
import { usePortfolioContent } from "../lib/content-store";
import { getRenderableUrl, shouldOpenInNewTab } from "../lib/url-utils";
import { Button } from "./ui/button";

const reveal = (y: number, duration: number, delay = 0) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { duration, delay, ease: [0.16, 1, 0.3, 1] as const },
});

export function Hero() {
  const { content } = usePortfolioContent();
  const { contactSection, hero, resumeSection } = content;
  const resumeUrl = getRenderableUrl(resumeSection.pdfUrl);
  const photoUrl = getRenderableUrl(hero.photoUrl);
  const primaryHref = resumeUrl || "#resume";
  const primaryTarget = shouldOpenInNewTab(resumeUrl) ? "_blank" : undefined;
  const secondaryHref = getRenderableUrl(contactSection.primaryHref) || "#contact";
  const secondaryTarget = shouldOpenInNewTab(secondaryHref) ? "_blank" : undefined;

  return (
    <section
      id="about"
      className="px-6 pb-6 pt-6 scroll-mt-32 md:px-12 md:pt-8 lg:px-20"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-8 rounded-[2rem] border border-background/70 bg-background/72 p-6 shadow-dashboard transition-all duration-300 hover:backdrop-blur-xl md:grid-cols-[1.15fr_0.85fr] md:p-10 lg:min-h-[calc(100vh-10rem)] lg:gap-10">
        <div>
          <motion.div
            {...reveal(10, 0.45)}
            className="inline-flex items-center rounded-full border border-border bg-background px-4 py-1.5 text-sm text-muted-foreground"
          >
            {hero.badge}
          </motion.div>

          <motion.h1
            {...reveal(16, 0.6, 0.1)}
            className="mt-5 max-w-2xl font-display text-5xl leading-[0.95] tracking-tight text-foreground md:text-6xl lg:text-[5rem]"
          >
            {hero.name}
          </motion.h1>

          <motion.p
            {...reveal(16, 0.6, 0.2)}
            className="mt-3 max-w-2xl text-lg font-medium text-foreground/80"
          >
            {hero.title}
          </motion.p>

          <motion.div
            {...reveal(16, 0.6, 0.2)}
            className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            {hero.about}
          </motion.div>

          <motion.div
            {...reveal(16, 0.6, 0.3)}
            className="mt-6 flex flex-wrap items-center gap-3"
          >
            <Button asChild className="px-6">
              <a
                href={primaryHref}
                target={primaryTarget}
                rel={primaryTarget ? "noreferrer" : undefined}
              >
                <FileText className="mr-2 h-4 w-4" />
                {hero.primaryCta}
              </a>
            </Button>
            <Button asChild variant="outline" className="px-6">
              <a
                href={secondaryHref}
                target={secondaryTarget}
                rel={secondaryTarget ? "noreferrer" : undefined}
              >
                <Mail className="mr-2 h-4 w-4" />
                {hero.secondaryCta}
              </a>
            </Button>
          </motion.div>

          <motion.div
            {...reveal(22, 0.6, 0.35)}
            className="mt-8 grid gap-3 sm:grid-cols-3"
          >
            {hero.highlights.map((item) => (
              <div
                key={`${item.label}-${item.value}`}
                className="rounded-2xl border border-border bg-background/80 p-4 transition-all duration-300 hover:backdrop-blur-md"
              >
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-2 text-sm font-medium text-foreground">
                  {item.value}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          {...reveal(30, 0.8, 0.45)}
          className="relative flex h-full min-h-[340px] items-center justify-center"
        >
          <div className="relative w-full overflow-hidden rounded-[2rem] border border-background/80 bg-background/76 p-4 shadow-dashboard transition-all duration-300 hover:backdrop-blur-xl">
            <div className="aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-dashed border-border bg-secondary/55">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={hero.photoTitle}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-background text-foreground shadow-sm">
                    <ImagePlus className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground">
                      {hero.photoTitle}
                    </p>
                    <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                      {hero.photoDescription}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
