import { useState, type ReactNode } from "react";
import {
  FileText,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import {
  isAssetReference,
  saveAssetFile,
  useResolvedAssetUrl,
} from "../lib/asset-store";
import { usePortfolioContent } from "../lib/content-store";
import {
  createAchievementItem,
  createCertificateItem,
  createContactItem,
  createEducationItem,
  createHighlightItem,
  createProjectBullet,
  createProjectItem,
  createProjectTech,
  createResumeHighlight,
  createSkillItem,
} from "../lib/site-data";
import { Button } from "./ui/button";

function AdminCard({
  title,
  description,
  children,
  actions,
}: {
  title: string;
  description: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-background/70 bg-background/76 p-6 backdrop-blur-xl md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="font-display text-3xl tracking-tight text-foreground">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
      <div className="mt-6 grid gap-4">{children}</div>
    </section>
  );
}

function AdminField({
  label,
  value,
  onChange,
  multiline = false,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  type?: "text" | "url";
  placeholder?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-[120px] rounded-2xl border border-border bg-background/90 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
        />
      ) : (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="rounded-2xl border border-border bg-background/90 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
        />
      )}
    </label>
  );
}

function GroupFrame({
  title,
  children,
  actions,
}: {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="rounded-[1.5rem] border border-border bg-background/82 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
      <div className="mt-4 grid gap-4">{children}</div>
    </div>
  );
}

function RemoveItemButton({
  onClick,
  label = "Remove",
}: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-9 px-3 text-muted-foreground hover:text-foreground"
      onClick={onClick}
    >
      <Trash2 className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}

function StringItemField({
  label,
  value,
  onChange,
  onRemove,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  multiline?: boolean;
}) {
  return (
    <div className="grid gap-3 rounded-[1.25rem] border border-border bg-background/90 p-4 md:grid-cols-[1fr_auto] md:items-start">
      <AdminField
        label={label}
        value={value}
        onChange={onChange}
        multiline={multiline}
      />
      <div className="md:pt-8">
        <RemoveItemButton onClick={onRemove} />
      </div>
    </div>
  );
}

function AssetField({
  label,
  value,
  accept,
  kind,
  onChange,
  onUpload,
}: {
  label: string;
  value: string;
  accept: string;
  kind: "image" | "document";
  onChange: (value: string) => void;
  onUpload: (file: File) => Promise<void>;
}) {
  const resolvedUrl = useResolvedAssetUrl(value);
  const usesUploadedFile = isAssetReference(value);

  return (
    <div className="grid gap-3 rounded-[1.5rem] border border-border bg-background/90 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {value ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-3 text-muted-foreground hover:text-foreground"
            onClick={() => onChange("")}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear
          </Button>
        ) : null}
      </div>

      <AdminField
        label="Direct URL"
        type="url"
        value={usesUploadedFile ? "" : value}
        placeholder={
          kind === "image"
            ? "Paste an image URL"
            : "Paste a PDF or file URL"
        }
        onChange={onChange}
      />

      <label className="grid gap-2">
        <span className="text-sm font-medium text-foreground">Upload File</span>
        <input
          type="file"
          accept={accept}
          onChange={async (event) => {
            const file = event.target.files?.[0];

            if (!file) {
              return;
            }

            await onUpload(file);
            event.target.value = "";
          }}
          className="rounded-2xl border border-border bg-background/90 px-4 py-3 text-sm text-foreground file:mr-4 file:rounded-full file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-medium file:text-foreground"
        />
      </label>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {usesUploadedFile
          ? "Using a file uploaded in this browser. Paste a direct URL above any time to replace it."
          : "You can paste a public URL or upload a local file here."}
      </p>

      {kind === "image" && resolvedUrl ? (
        <div className="overflow-hidden rounded-[1.25rem] border border-border bg-secondary/40">
          <img
            src={resolvedUrl}
            alt={label}
            className="h-40 w-full object-cover"
          />
        </div>
      ) : null}

      {kind === "document" && resolvedUrl ? (
        <Button asChild variant="outline" className="justify-start px-4">
          <a href={resolvedUrl} target="_blank" rel="noreferrer">
            <Upload className="mr-2 h-4 w-4" />
            Open Current File
          </a>
        </Button>
      ) : null}
    </div>
  );
}

export function AdminPage() {
  const { content, updateField, addItem, removeItem, resetContent } =
    usePortfolioContent();
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveToCodebase = async () => {
    try {
      setIsSaving(true);
      
      // Prevent making requests to local-only API in production (avoids 405 error)
      if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        window.alert('Saving to your codebase is only supported when running the local dev server. On the live site, changes apply temporarily for testing!');
        return;
      }

      const res = await fetch('/api/save-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      });
      if (!res.ok) throw new Error('Save failed');
      window.alert('Content successfully saved to codebase!');
    } catch (e) {
      window.alert('Failed to save to codebase. Is the dev server running?');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAssetUpload = async (path: string, file: File) => {
    try {
      const assetReference = await saveAssetFile(file);
      updateField(path, assetReference);
    } catch {
      window.alert(
        "This file could not be saved. Please try again or paste a direct URL instead.",
      );
    }
  };

  return (
    <div className="relative z-10 px-6 py-6 md:px-12 lg:px-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="rounded-[2rem] border border-background/70 bg-background/76 p-6 backdrop-blur-xl md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Admin Page
              </p>
              <h1 className="mt-3 font-display text-4xl tracking-tight text-foreground md:text-5xl">
                Manage every word, link, image, and PDF
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                Changes save automatically in this browser. You can now add new
                skills, projects, certificates, achievements, education
                records, contact cards, and upload portfolio assets directly
                from this editor.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" className="px-5">
                <a href="/">
                  <FileText className="mr-2 h-4 w-4" />
                  Back To Portfolio
                </a>
              </Button>
              <Button 
                variant="default" 
                className="px-5 bg-green-600 hover:bg-green-700 text-white" 
                onClick={handleSaveToCodebase}
                disabled={isSaving}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save to Codebase"}
              </Button>
              <Button variant="secondary" className="px-5" onClick={resetContent}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset Content
              </Button>
            </div>
          </div>
        </section>

        <AdminCard
          title="Navigation"
          description="These labels control the anchor menu on the public portfolio."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {content.navItems.map((item, index) => (
              <AdminField
                key={item.id}
                label={`Nav Item ${index + 1}`}
                value={item.label}
                onChange={(value) => updateField(`navItems.${index}.label`, value)}
              />
            ))}
          </div>
        </AdminCard>

        <AdminCard
          title="Landing / About Me"
          description="Edit the main introduction, button labels, highlights, and professional photo."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField
              label="Badge"
              value={content.hero.badge}
              onChange={(value) => updateField("hero.badge", value)}
            />
            <AdminField
              label="Name"
              value={content.hero.name}
              onChange={(value) => updateField("hero.name", value)}
            />
          </div>
          <AdminField
            label="Title"
            value={content.hero.title}
            onChange={(value) => updateField("hero.title", value)}
          />
          <AdminField
            label="About Paragraph"
            value={content.hero.about}
            onChange={(value) => updateField("hero.about", value)}
            multiline
          />
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField
              label="Primary Button"
              value={content.hero.primaryCta}
              onChange={(value) => updateField("hero.primaryCta", value)}
            />
            <AdminField
              label="Secondary Button"
              value={content.hero.secondaryCta}
              onChange={(value) => updateField("hero.secondaryCta", value)}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField
              label="Photo Placeholder Title"
              value={content.hero.photoTitle}
              onChange={(value) => updateField("hero.photoTitle", value)}
            />
            <AdminField
              label="Quick Intro Label"
              value={content.hero.quickIntroLabel}
              onChange={(value) => updateField("hero.quickIntroLabel", value)}
            />
          </div>
          <AdminField
            label="Photo Placeholder Description"
            value={content.hero.photoDescription}
            onChange={(value) => updateField("hero.photoDescription", value)}
            multiline
          />
          <AdminField
            label="Quick Intro Text"
            value={content.hero.quickIntroText}
            onChange={(value) => updateField("hero.quickIntroText", value)}
          />
          <AssetField
            label="Professional Photo"
            value={content.hero.photoUrl}
            accept="image/*"
            kind="image"
            onChange={(value) => updateField("hero.photoUrl", value)}
            onUpload={(file) => handleAssetUpload("hero.photoUrl", file)}
          />
          <GroupFrame
            title="Highlights"
            actions={
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4"
                onClick={() => addItem("hero.highlights", createHighlightItem())}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Highlight
              </Button>
            }
          >
            {content.hero.highlights.map((item, index) => (
              <div
                key={`hero-highlight-${index}`}
                className="rounded-[1.25rem] border border-border bg-background/90 p-4"
              >
                <div className="mb-4 flex justify-end">
                  <RemoveItemButton
                    onClick={() => removeItem("hero.highlights", index)}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <AdminField
                    label={`Highlight ${index + 1} Label`}
                    value={item.label}
                    onChange={(value) =>
                      updateField(`hero.highlights.${index}.label`, value)
                    }
                  />
                  <AdminField
                    label={`Highlight ${index + 1} Value`}
                    value={item.value}
                    onChange={(value) =>
                      updateField(`hero.highlights.${index}.value`, value)
                    }
                  />
                </div>
              </div>
            ))}
          </GroupFrame>
        </AdminCard>

        <AdminCard
          title="Skills"
          description="Add or remove technical and soft skills from here."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField
              label="Eyebrow"
              value={content.skillsSection.eyebrow}
              onChange={(value) => updateField("skillsSection.eyebrow", value)}
            />
            <AdminField
              label="Section Title"
              value={content.skillsSection.title}
              onChange={(value) => updateField("skillsSection.title", value)}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField
              label="Technical Skills Heading"
              value={content.skillsSection.technicalTitle}
              onChange={(value) =>
                updateField("skillsSection.technicalTitle", value)
              }
            />
            <AdminField
              label="Soft Skills Heading"
              value={content.skillsSection.softTitle}
              onChange={(value) => updateField("skillsSection.softTitle", value)}
            />
          </div>
          <GroupFrame
            title="Technical Skills"
            actions={
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4"
                onClick={() =>
                  addItem("skillsSection.technical", createSkillItem())
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Skill
              </Button>
            }
          >
            {content.skillsSection.technical.map((skill, index) => (
              <StringItemField
                key={`technical-skill-${index}`}
                label={`Technical Skill ${index + 1}`}
                value={skill}
                onChange={(value) =>
                  updateField(`skillsSection.technical.${index}`, value)
                }
                onRemove={() => removeItem("skillsSection.technical", index)}
              />
            ))}
          </GroupFrame>
          <GroupFrame
            title="Soft Skills"
            actions={
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4"
                onClick={() => addItem("skillsSection.soft", createSkillItem())}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Skill
              </Button>
            }
          >
            {content.skillsSection.soft.map((skill, index) => (
              <StringItemField
                key={`soft-skill-${index}`}
                label={`Soft Skill ${index + 1}`}
                value={skill}
                onChange={(value) =>
                  updateField(`skillsSection.soft.${index}`, value)
                }
                onRemove={() => removeItem("skillsSection.soft", index)}
              />
            ))}
          </GroupFrame>
        </AdminCard>

        <AdminCard
          title="Projects"
          description="Create new projects, upload screenshots, and manage live and GitHub links."
          actions={
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-4"
              onClick={() => addItem("projectsSection.items", createProjectItem())}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField
              label="Eyebrow"
              value={content.projectsSection.eyebrow}
              onChange={(value) => updateField("projectsSection.eyebrow", value)}
            />
            <AdminField
              label="Section Title"
              value={content.projectsSection.title}
              onChange={(value) => updateField("projectsSection.title", value)}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField
              label="Demo Button"
              value={content.projectsSection.demoLabel}
              onChange={(value) => updateField("projectsSection.demoLabel", value)}
            />
            <AdminField
              label="GitHub Button"
              value={content.projectsSection.githubLabel}
              onChange={(value) =>
                updateField("projectsSection.githubLabel", value)
              }
            />
          </div>
          {content.projectsSection.items.map((project, projectIndex) => (
            <GroupFrame
              key={`project-${projectIndex}`}
              title={`Project ${projectIndex + 1}`}
              actions={
                <RemoveItemButton
                  onClick={() => removeItem("projectsSection.items", projectIndex)}
                  label="Remove Project"
                />
              }
            >
              <div className="grid gap-4 md:grid-cols-2">
                <AdminField
                  label="Screenshot Label"
                  value={project.screenshotLabel}
                  onChange={(value) =>
                    updateField(
                      `projectsSection.items.${projectIndex}.screenshotLabel`,
                      value,
                    )
                  }
                />
                <AdminField
                  label="Project Title"
                  value={project.title}
                  onChange={(value) =>
                    updateField(`projectsSection.items.${projectIndex}.title`, value)
                  }
                />
              </div>

              <AssetField
                label="Project Screenshot"
                value={project.imageUrl}
                accept="image/*"
                kind="image"
                onChange={(value) =>
                  updateField(`projectsSection.items.${projectIndex}.imageUrl`, value)
                }
                onUpload={(file) =>
                  handleAssetUpload(
                    `projectsSection.items.${projectIndex}.imageUrl`,
                    file,
                  )
                }
              />

              <div className="grid gap-4 md:grid-cols-2">
                <AdminField
                  label="Live Demo URL"
                  type="url"
                  value={project.liveUrl}
                  placeholder="https://your-live-demo.com"
                  onChange={(value) =>
                    updateField(`projectsSection.items.${projectIndex}.liveUrl`, value)
                  }
                />
                <AdminField
                  label="GitHub URL"
                  type="url"
                  value={project.githubUrl}
                  placeholder="https://github.com/your-name/project"
                  onChange={(value) =>
                    updateField(
                      `projectsSection.items.${projectIndex}.githubUrl`,
                      value,
                    )
                  }
                />
              </div>

              <GroupFrame
                title="Project Bullet Points"
                actions={
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-4"
                    onClick={() =>
                      addItem(
                        `projectsSection.items.${projectIndex}.bullets`,
                        createProjectBullet(),
                      )
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Bullet
                  </Button>
                }
              >
                {project.bullets.map((bullet, bulletIndex) => (
                  <StringItemField
                    key={`project-${projectIndex}-bullet-${bulletIndex}`}
                    label={`Bullet ${bulletIndex + 1}`}
                    value={bullet}
                    onChange={(value) =>
                      updateField(
                        `projectsSection.items.${projectIndex}.bullets.${bulletIndex}`,
                        value,
                      )
                    }
                    onRemove={() =>
                      removeItem(
                        `projectsSection.items.${projectIndex}.bullets`,
                        bulletIndex,
                      )
                    }
                    multiline
                  />
                ))}
              </GroupFrame>

              <GroupFrame
                title="Tech Stack"
                actions={
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-4"
                    onClick={() =>
                      addItem(
                        `projectsSection.items.${projectIndex}.tech`,
                        createProjectTech(),
                      )
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Tech
                  </Button>
                }
              >
                {project.tech.map((tech, techIndex) => (
                  <StringItemField
                    key={`project-${projectIndex}-tech-${techIndex}`}
                    label={`Tech ${techIndex + 1}`}
                    value={tech}
                    onChange={(value) =>
                      updateField(
                        `projectsSection.items.${projectIndex}.tech.${techIndex}`,
                        value,
                      )
                    }
                    onRemove={() =>
                      removeItem(
                        `projectsSection.items.${projectIndex}.tech`,
                        techIndex,
                      )
                    }
                  />
                ))}
              </GroupFrame>
            </GroupFrame>
          ))}
        </AdminCard>

        <AdminCard
          title="Certificates"
          description="Add certificate cards, upload preview images, and attach certificate PDFs."
          actions={
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-4"
              onClick={() =>
                addItem("certificatesSection.items", createCertificateItem())
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Certificate
            </Button>
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField
              label="Eyebrow"
              value={content.certificatesSection.eyebrow}
              onChange={(value) =>
                updateField("certificatesSection.eyebrow", value)
              }
            />
            <AdminField
              label="Section Title"
              value={content.certificatesSection.title}
              onChange={(value) =>
                updateField("certificatesSection.title", value)
              }
            />
          </div>
          <AdminField
            label="View Button"
            value={content.certificatesSection.viewLabel}
            onChange={(value) => updateField("certificatesSection.viewLabel", value)}
          />
          {content.certificatesSection.items.map((certificate, index) => (
            <GroupFrame
              key={`certificate-${index}`}
              title={`Certificate ${index + 1}`}
              actions={
                <RemoveItemButton
                  onClick={() => removeItem("certificatesSection.items", index)}
                  label="Remove Certificate"
                />
              }
            >
              <div className="grid gap-4 md:grid-cols-2">
                <AdminField
                  label="Preview Label"
                  value={certificate.previewLabel}
                  onChange={(value) =>
                    updateField(
                      `certificatesSection.items.${index}.previewLabel`,
                      value,
                    )
                  }
                />
                <AdminField
                  label="Title"
                  value={certificate.title}
                  onChange={(value) =>
                    updateField(`certificatesSection.items.${index}.title`, value)
                  }
                />
              </div>
              <AdminField
                label="Details"
                value={certificate.details}
                onChange={(value) =>
                  updateField(`certificatesSection.items.${index}.details`, value)
                }
                multiline
              />
              <div className="grid gap-4 md:grid-cols-2">
                <AssetField
                  label="Certificate Image"
                  value={certificate.imageUrl}
                  accept="image/*"
                  kind="image"
                  onChange={(value) =>
                    updateField(`certificatesSection.items.${index}.imageUrl`, value)
                  }
                  onUpload={(file) =>
                    handleAssetUpload(
                      `certificatesSection.items.${index}.imageUrl`,
                      file,
                    )
                  }
                />
                <AssetField
                  label="Certificate PDF"
                  value={certificate.pdfUrl}
                  accept=".pdf,application/pdf"
                  kind="document"
                  onChange={(value) =>
                    updateField(`certificatesSection.items.${index}.pdfUrl`, value)
                  }
                  onUpload={(file) =>
                    handleAssetUpload(
                      `certificatesSection.items.${index}.pdfUrl`,
                      file,
                    )
                  }
                />
              </div>
            </GroupFrame>
          ))}
        </AdminCard>

        <AdminCard
          title="Resume"
          description="Upload a resume PDF, optional preview image, and edit the section copy."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField
              label="Eyebrow"
              value={content.resumeSection.eyebrow}
              onChange={(value) => updateField("resumeSection.eyebrow", value)}
            />
            <AdminField
              label="Section Title"
              value={content.resumeSection.title}
              onChange={(value) => updateField("resumeSection.title", value)}
            />
          </div>
          <AdminField
            label="Summary"
            value={content.resumeSection.summary}
            onChange={(value) => updateField("resumeSection.summary", value)}
            multiline
          />
          <div className="grid gap-4 md:grid-cols-3">
            <AdminField
              label="View Button"
              value={content.resumeSection.viewLabel}
              onChange={(value) => updateField("resumeSection.viewLabel", value)}
            />
            <AdminField
              label="Download Button"
              value={content.resumeSection.downloadLabel}
              onChange={(value) =>
                updateField("resumeSection.downloadLabel", value)
              }
            />
            <AdminField
              label="Preview Label"
              value={content.resumeSection.previewLabel}
              onChange={(value) =>
                updateField("resumeSection.previewLabel", value)
              }
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <AssetField
              label="Resume Preview Image"
              value={content.resumeSection.previewImageUrl}
              accept="image/*"
              kind="image"
              onChange={(value) =>
                updateField("resumeSection.previewImageUrl", value)
              }
              onUpload={(file) =>
                handleAssetUpload("resumeSection.previewImageUrl", file)
              }
            />
            <AssetField
              label="Resume PDF"
              value={content.resumeSection.pdfUrl}
              accept=".pdf,application/pdf"
              kind="document"
              onChange={(value) => updateField("resumeSection.pdfUrl", value)}
              onUpload={(file) => handleAssetUpload("resumeSection.pdfUrl", file)}
            />
          </div>
          <GroupFrame
            title="Resume Highlights"
            actions={
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4"
                onClick={() =>
                  addItem("resumeSection.highlights", createResumeHighlight())
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Highlight
              </Button>
            }
          >
            {content.resumeSection.highlights.map((item, index) => (
              <StringItemField
                key={`resume-highlight-${index}`}
                label={`Highlight ${index + 1}`}
                value={item}
                onChange={(value) =>
                  updateField(`resumeSection.highlights.${index}`, value)
                }
                onRemove={() => removeItem("resumeSection.highlights", index)}
              />
            ))}
          </GroupFrame>
        </AdminCard>

        <AdminCard
          title="Achievements"
          description="Add or remove achievements, wins, milestones, and recognitions."
          actions={
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-4"
              onClick={() =>
                addItem("achievementsSection.items", createAchievementItem())
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Achievement
            </Button>
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField
              label="Eyebrow"
              value={content.achievementsSection.eyebrow}
              onChange={(value) =>
                updateField("achievementsSection.eyebrow", value)
              }
            />
            <AdminField
              label="Section Title"
              value={content.achievementsSection.title}
              onChange={(value) =>
                updateField("achievementsSection.title", value)
              }
            />
          </div>
          {content.achievementsSection.items.map((item, index) => (
            <StringItemField
              key={`achievement-${index}`}
              label={`Achievement ${index + 1}`}
              value={item}
              onChange={(value) =>
                updateField(`achievementsSection.items.${index}`, value)
              }
              onRemove={() => removeItem("achievementsSection.items", index)}
              multiline
            />
          ))}
        </AdminCard>

        <AdminCard
          title="Education"
          description="Add new education entries and edit every institution and detail."
          actions={
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-4"
              onClick={() => addItem("educationSection.items", createEducationItem())}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Education
            </Button>
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField
              label="Eyebrow"
              value={content.educationSection.eyebrow}
              onChange={(value) => updateField("educationSection.eyebrow", value)}
            />
            <AdminField
              label="Section Title"
              value={content.educationSection.title}
              onChange={(value) => updateField("educationSection.title", value)}
            />
          </div>
          {content.educationSection.items.map((item, index) => (
            <GroupFrame
              key={`education-${index}`}
              title={`Education ${index + 1}`}
              actions={
                <RemoveItemButton
                  onClick={() => removeItem("educationSection.items", index)}
                  label="Remove Education"
                />
              }
            >
              <AdminField
                label="Institution"
                value={item.institution}
                onChange={(value) =>
                  updateField(`educationSection.items.${index}.institution`, value)
                }
              />
              <AdminField
                label="Details"
                value={item.details}
                onChange={(value) =>
                  updateField(`educationSection.items.${index}.details`, value)
                }
                multiline
              />
            </GroupFrame>
          ))}
        </AdminCard>

        <AdminCard
          title="Contact"
          description="Manage contact cards, button text, and working email, GitHub, LinkedIn, or other links."
          actions={
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-4"
              onClick={() => addItem("contactSection.items", createContactItem())}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Contact Card
            </Button>
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField
              label="Eyebrow"
              value={content.contactSection.eyebrow}
              onChange={(value) => updateField("contactSection.eyebrow", value)}
            />
            <AdminField
              label="Section Title"
              value={content.contactSection.title}
              onChange={(value) => updateField("contactSection.title", value)}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField
              label="Panel Title"
              value={content.contactSection.panelTitle}
              onChange={(value) => updateField("contactSection.panelTitle", value)}
            />
            <AdminField
              label="Primary Button"
              value={content.contactSection.primaryLabel}
              onChange={(value) => updateField("contactSection.primaryLabel", value)}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField
              label="Primary Button URL"
              type="url"
              value={content.contactSection.primaryHref}
              placeholder="mailto:you@example.com"
              onChange={(value) => updateField("contactSection.primaryHref", value)}
            />
            <AdminField
              label="Secondary Button"
              value={content.contactSection.secondaryLabel}
              onChange={(value) =>
                updateField("contactSection.secondaryLabel", value)
              }
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField
              label="Secondary Button URL"
              type="url"
              value={content.contactSection.secondaryHref}
              placeholder="https://github.com/your-name"
              onChange={(value) =>
                updateField("contactSection.secondaryHref", value)
              }
            />
          </div>
          <AdminField
            label="Panel Description"
            value={content.contactSection.panelDescription}
            onChange={(value) =>
              updateField("contactSection.panelDescription", value)
            }
            multiline
          />
          <GroupFrame title="Contact Cards">
            {content.contactSection.items.map((item, index) => (
              <div
                key={`contact-card-${index}`}
                className="rounded-[1.25rem] border border-border bg-background/90 p-4"
              >
                <div className="mb-4 flex justify-end">
                  <RemoveItemButton
                    onClick={() => removeItem("contactSection.items", index)}
                    label="Remove Card"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <AdminField
                    label={`Card ${index + 1} Label`}
                    value={item.label}
                    onChange={(value) =>
                      updateField(`contactSection.items.${index}.label`, value)
                    }
                  />
                  <AdminField
                    label={`Card ${index + 1} Value`}
                    value={item.value}
                    onChange={(value) =>
                      updateField(`contactSection.items.${index}.value`, value)
                    }
                  />
                  <AdminField
                    label={`Card ${index + 1} URL`}
                    type="url"
                    value={item.url}
                    placeholder="mailto:, tel:, or https://"
                    onChange={(value) =>
                      updateField(`contactSection.items.${index}.url`, value)
                    }
                  />
                </div>
              </div>
            ))}
          </GroupFrame>
        </AdminCard>
      </div>
    </div>
  );
}
