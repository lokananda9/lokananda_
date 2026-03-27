import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
  ImagePlus,
  Mail,
  Phone,
  Trophy,
  UserRound,
} from "lucide-react";
import { useResolvedAssetUrl } from "../lib/asset-store";
import { usePortfolioContent } from "../lib/content-store";
import { Button } from "./ui/button";

const sectionReveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
};

function SectionShell({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <motion.section
      id={id}
      className="scroll-mt-32"
      {...sectionReveal}
    >
      <div className="rounded-[2rem] border border-background/70 bg-background/72 p-6 transition-all duration-300 hover:backdrop-blur-xl md:p-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          {eyebrow}
        </p>
        <h2 className="mt-3 font-display text-4xl leading-tight tracking-tight text-foreground md:text-5xl">
          {title}
        </h2>
        <div className="mt-6">{children}</div>
      </div>
    </motion.section>
  );
}

function PlaceholderFrame({
  label,
  icon,
}: {
  label: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex aspect-[16/10] items-center justify-center rounded-[1.5rem] border border-dashed border-border bg-secondary/55 p-6 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-background text-foreground shadow-sm">
          {icon}
        </div>
        <p className="text-sm font-medium text-foreground">{label}</p>
      </div>
    </div>
  );
}

function ActionButton({
  href,
  label,
  icon,
  variant = "default",
  download = false,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  variant?: "default" | "outline";
  download?: boolean;
}) {
  const resolvedHref = useResolvedAssetUrl(href);

  if (!resolvedHref) {
    return (
      <Button variant={variant} className="px-4" disabled>
        {icon}
        {label}
      </Button>
    );
  }

  const shouldOpenInNewTab =
    !download &&
    (resolvedHref.startsWith("http") ||
      resolvedHref.startsWith("blob:") ||
      resolvedHref.startsWith("data:"));

  return (
    <Button asChild variant={variant} className="px-4">
      <a
        href={resolvedHref}
        target={shouldOpenInNewTab ? "_blank" : undefined}
        rel={shouldOpenInNewTab ? "noreferrer" : undefined}
        download={download ? true : undefined}
      >
        {icon}
        {label}
      </a>
    </Button>
  );
}

function AssetPreview({
  reference,
  label,
  icon,
}: {
  reference: string;
  label: string;
  icon: ReactNode;
}) {
  const resolvedUrl = useResolvedAssetUrl(reference);

  if (!resolvedUrl) {
    return <PlaceholderFrame label={label} icon={icon} />;
  }

  return (
    <div className="aspect-[16/10] overflow-hidden rounded-[1.5rem] border border-border bg-secondary/55">
      <img
        src={resolvedUrl}
        alt={label}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

function ContactValue({
  value,
  href,
}: {
  value: string;
  href: string;
}) {
  const resolvedHref = useResolvedAssetUrl(href);
  const shouldOpenInNewTab =
    resolvedHref.startsWith("http") ||
    resolvedHref.startsWith("blob:") ||
    resolvedHref.startsWith("data:");

  if (!resolvedHref) {
    return <p className="mt-2 text-sm font-medium text-foreground">{value}</p>;
  }

  return (
    <a
      href={resolvedHref}
      target={shouldOpenInNewTab ? "_blank" : undefined}
      rel={shouldOpenInNewTab ? "noreferrer" : undefined}
      className="mt-2 block text-sm font-medium text-foreground transition-colors hover:text-accent"
    >
      {value}
    </a>
  );
}

export function PortfolioSections() {
  const { content } = usePortfolioContent();
  const {
    achievementsSection,
    certificatesSection,
    contactSection,
    educationSection,
    projectsSection,
    resumeSection,
    skillsSection,
  } = content;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 pb-16 md:px-12 lg:px-20">
      <SectionShell
        id="skills"
        eyebrow={skillsSection.eyebrow}
        title={skillsSection.title}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[1.5rem] border border-border bg-background/80 p-5 transition-all duration-300 hover:backdrop-blur-md">
            <h3 className="text-lg font-semibold text-foreground">
              {skillsSection.technicalTitle}
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {skillsSection.technical.map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="rounded-full border border-border bg-secondary px-3 py-2 text-sm text-foreground"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-border bg-background/80 p-5 transition-all duration-300 hover:backdrop-blur-md">
            <h3 className="text-lg font-semibold text-foreground">
              {skillsSection.softTitle}
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {skillsSection.soft.map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="rounded-full border border-border bg-secondary px-3 py-2 text-sm text-foreground"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell
        id="projects"
        eyebrow={projectsSection.eyebrow}
        title={projectsSection.title}
      >
        <div className="grid gap-4 xl:grid-cols-3 md:grid-cols-2">
          {projectsSection.items.map((project, projectIndex) => (
            <div
              key={`${project.title}-${projectIndex}`}
              className="rounded-[1.75rem] border border-border bg-background/80 p-5 transition-all duration-300 hover:backdrop-blur-md"
            >
              <AssetPreview
                reference={project.imageUrl}
                label={project.screenshotLabel}
                icon={<ImagePlus className="h-6 w-6" />}
              />
              <div className="mt-5">
                <h3 className="text-xl font-semibold text-foreground">{project.title}</h3>
                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
                  {project.bullets.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.tech.map((item, techIndex) => (
                  <span
                    key={`${item}-${techIndex}`}
                    className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <ActionButton
                  href={project.liveUrl}
                  label={projectsSection.demoLabel}
                  icon={<ExternalLink className="mr-2 h-4 w-4" />}
                />
                <ActionButton
                  href={project.githubUrl}
                  label={projectsSection.githubLabel}
                  icon={<ExternalLink className="mr-2 h-4 w-4" />}
                  variant="outline"
                />
              </div>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        id="certificates"
        eyebrow={certificatesSection.eyebrow}
        title={certificatesSection.title}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {certificatesSection.items.map((certificate, index) => (
            <div
              key={`${certificate.title}-${index}`}
              className="rounded-[1.75rem] border border-border bg-background/80 p-5"
            >
              <AssetPreview
                reference={certificate.imageUrl}
                label={certificate.previewLabel}
                icon={<Award className="h-6 w-6" />}
              />
              <h3 className="mt-5 text-xl font-semibold text-foreground">
                {certificate.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {certificate.details}
              </p>
              <div className="mt-5">
                <ActionButton
                  href={certificate.pdfUrl}
                  label={certificatesSection.viewLabel}
                  icon={<ExternalLink className="mr-2 h-4 w-4" />}
                  variant="outline"
                />
              </div>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        id="resume"
        eyebrow={resumeSection.eyebrow}
        title={resumeSection.title}
      >
        <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[1.75rem] border border-border bg-background/80 p-6 transition-all duration-300 hover:backdrop-blur-md">
            <p className="text-base leading-relaxed text-muted-foreground">
              {resumeSection.summary}
            </p>
            <div className="mt-5 space-y-3">
              {resumeSection.highlights.map((item, index) => (
                <div key={`${item}-${index}`} className="flex gap-3 text-sm text-foreground">
                  <FileText className="mt-0.5 h-4 w-4 text-accent" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <ActionButton
                href={resumeSection.pdfUrl}
                label={resumeSection.viewLabel}
                icon={<FileText className="mr-2 h-4 w-4" />}
              />
              <ActionButton
                href={resumeSection.pdfUrl}
                label={resumeSection.downloadLabel}
                icon={<Download className="mr-2 h-4 w-4" />}
                variant="outline"
                download
              />
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-border bg-background/80 p-5">
            <AssetPreview
              reference={resumeSection.previewImageUrl}
              label={resumeSection.previewLabel}
              icon={<FileText className="h-6 w-6" />}
            />
          </div>
        </div>
      </SectionShell>

      <SectionShell
        id="achievements"
        eyebrow={achievementsSection.eyebrow}
        title={achievementsSection.title}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {achievementsSection.items.map((achievement, index) => (
            <div
              key={`${achievement}-${index}`}
              className="rounded-[1.5rem] border border-border bg-background/80 p-5 transition-all duration-300 hover:backdrop-blur-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-accent">
                <Trophy className="h-5 w-5" />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-foreground">
                {achievement}
              </p>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        id="education"
        eyebrow={educationSection.eyebrow}
        title={educationSection.title}
      >
        <div className="grid gap-4 md:grid-cols-2">
          {educationSection.items.map((item, index) => (
            <div
              key={`${item.institution}-${index}`}
              className="rounded-[1.5rem] border border-border bg-background/80 p-5 transition-all duration-300 hover:backdrop-blur-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-accent">
                <GraduationCap className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {item.institution}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.details}
              </p>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        id="contact"
        eyebrow={contactSection.eyebrow}
        title={contactSection.title}
      >
        <div className="grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {contactSection.items.map((item, index) => (
              <div
                key={`${item.label}-${index}`}
                className="rounded-[1.5rem] border border-border bg-background/80 p-5 transition-all duration-300 hover:backdrop-blur-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-accent">
                  {item.label === "Email" ? (
                    <Mail className="h-4 w-4" />
                  ) : item.label === "Phone" ? (
                    <Phone className="h-4 w-4" />
                  ) : (
                    <UserRound className="h-4 w-4" />
                  )}
                </div>
                <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {item.label}
                </p>
                <ContactValue value={item.value} href={item.url} />
              </div>
            ))}
          </div>

          <div className="rounded-[1.75rem] border border-border bg-background/80 p-6 transition-all duration-300 hover:backdrop-blur-md">
            <h3 className="text-xl font-semibold text-foreground">
              {contactSection.panelTitle}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {contactSection.panelDescription}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ActionButton
                href={contactSection.primaryHref}
                label={contactSection.primaryLabel}
                icon={<Mail className="mr-2 h-4 w-4" />}
              />
              <ActionButton
                href={contactSection.secondaryHref}
                label={contactSection.secondaryLabel}
                icon={<ExternalLink className="mr-2 h-4 w-4" />}
                variant="outline"
              />
            </div>
          </div>
        </div>
      </SectionShell>
    </div>
  );
}
