import { savedData } from "./saved-data";

export type PortfolioContent = {
  navItems: Array<{
    id: string;
    label: string;
  }>;
  hero: {
    badge: string;
    name: string;
    title: string;
    about: string;
    primaryCta: string;
    secondaryCta: string;
    photoTitle: string;
    photoDescription: string;
    photoUrl: string;
    quickIntroLabel: string;
    quickIntroText: string;
    highlights: Array<{
      label: string;
      value: string;
    }>;
  };
  skillsSection: {
    eyebrow: string;
    title: string;
    technicalTitle: string;
    softTitle: string;
    technical: string[];
    soft: string[];
  };
  projectsSection: {
    eyebrow: string;
    title: string;
    demoLabel: string;
    githubLabel: string;
    items: Array<{
      screenshotLabel: string;
      title: string;
      bullets: string[];
      tech: string[];
      imageUrl: string;
      liveUrl: string;
      githubUrl: string;
    }>;
  };
  certificatesSection: {
    eyebrow: string;
    title: string;
    viewLabel: string;
    items: Array<{
      previewLabel: string;
      title: string;
      details: string;
      imageUrl: string;
      pdfUrl: string;
    }>;
  };
  resumeSection: {
    eyebrow: string;
    title: string;
    summary: string;
    highlights: string[];
    viewLabel: string;
    downloadLabel: string;
    previewLabel: string;
    previewImageUrl: string;
    pdfUrl: string;
  };
  achievementsSection: {
    eyebrow: string;
    title: string;
    items: string[];
  };
  educationSection: {
    eyebrow: string;
    title: string;
    items: Array<{
      institution: string;
      details: string;
    }>;
  };
  contactSection: {
    eyebrow: string;
    title: string;
    items: Array<{
      label: string;
      value: string;
      url: string;
    }>;
    panelTitle: string;
    panelDescription: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
};

export const createProjectItem = () => ({
  screenshotLabel: "Project Screenshot",
  title: "New Project",
  bullets: [
    "Add a short summary of this project.",
    "Mention a feature, result, or learning here.",
    "Add one more point about the build.",
  ],
  tech: ["Tech 1", "Tech 2", "Tech 3"],
  imageUrl: "",
  liveUrl: "",
  githubUrl: "",
});

export const createProjectBullet = () => "Add a bullet point for this project.";

export const createProjectTech = () => "New Tech";

export const createCertificateItem = () => ({
  previewLabel: "Certificate Preview",
  title: "New Certificate",
  details: "Add issuer, date, and a short note about this certificate.",
  imageUrl: "",
  pdfUrl: "",
});

export const createHighlightItem = () => ({
  label: "New Label",
  value: "New Value",
});

export const createSkillItem = () => "New Skill";

export const createResumeHighlight = () =>
  "Add a short resume highlight here.";

export const createAchievementItem = () =>
  "Add a new achievement, milestone, or result here.";

export const createEducationItem = () => ({
  institution: "New Institution",
  details: "Add degree, year, or academic details here.",
});

export const createContactItem = () => ({
  label: "New Contact",
  value: "Add a contact value",
  url: "",
});

export const starterPortfolioContent: PortfolioContent = {
  navItems: [
    { id: "about", label: "About Me" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "certificates", label: "Certificates" },
    { id: "resume", label: "Resume" },
    { id: "achievements", label: "Achievements" },
    { id: "education", label: "Education" },
    { id: "contact", label: "Contact" },
  ],
  hero: {
    badge: "Portfolio Layout",
    name: "Your Name",
    title: "Full Stack Developer / Designer / Student",
    about:
      "Replace this short About Me paragraph with a 20 to 100 word introduction that explains who you are, what you build, and the kind of work or opportunities you are looking for.",
    primaryCta: "View Resume",
    secondaryCta: "Contact Me",
    photoTitle: "Professional Picture",
    photoDescription:
      "Replace this polished placeholder with your portfolio photo.",
    photoUrl: "",
    quickIntroLabel: "Quick Intro",
    quickIntroText: "About me, skills, projects, certificates, and more",
    highlights: [
      { label: "Focus", value: "Modern web apps and polished UI systems" },
      { label: "Location", value: "Your city, state, or country" },
      {
        label: "Open To",
        value: "Internships, freelance work, and collaborations",
      },
    ],
  },
  skillsSection: {
    eyebrow: "02",
    title: "Skills",
    technicalTitle: "Technical Skills",
    softTitle: "Soft Skills",
    technical: [
      "HTML",
      "CSS",
      "JavaScript",
      "TypeScript",
      "React",
      "Tailwind CSS",
      "Node.js",
      "Git & GitHub",
    ],
    soft: [
      "Communication",
      "Problem Solving",
      "Teamwork",
      "Time Management",
      "Adaptability",
      "Presentation Skills",
    ],
  },
  projectsSection: {
    eyebrow: "03",
    title: "Projects",
    demoLabel: "Live Demo",
    githubLabel: "GitHub",
    items: [createProjectItem(), createProjectItem(), createProjectItem()].map(
      (item, index) => ({
        ...item,
        title: `Project Name 0${index + 1}`,
        bullets: [
          index === 0
            ? "Add a one-line summary of the problem this project solves."
            : index === 1
              ? "Describe the main user flow or business value of the project."
              : "State the project goal and who it was designed for.",
          index === 0
            ? "Mention your role, the core feature, or a technical highlight."
            : index === 1
              ? "Highlight one interaction, API, or implementation challenge."
              : "Note one standout feature or design choice you made.",
          index === 0
            ? "Call out one result, learning, or improvement from the build."
            : index === 1
              ? "Summarize what makes this project worth showing in your portfolio."
              : "Add one metric, outcome, or personal takeaway from the work.",
        ],
        tech:
          index === 0
            ? ["React", "Tailwind CSS", "Vite"]
            : index === 1
              ? ["TypeScript", "Node.js", "REST API"]
              : ["MongoDB", "Express", "Responsive Design"],
      }),
    ),
  },
  certificatesSection: {
    eyebrow: "04",
    title: "Certificates",
    viewLabel: "View Certificate",
    items: [createCertificateItem(), createCertificateItem(), createCertificateItem()].map(
      (item, index) => ({
        ...item,
        title: "Certificate Title",
        details:
          index === 0
            ? "Add the certificate issuer, date, and one short detail here."
            : index === 1
              ? "Use this slot for another certificate or course completion."
              : "Replace this placeholder with your real certification summary.",
      }),
    ),
  },
  resumeSection: {
    eyebrow: "05",
    title: "Resume",
    summary:
      "Use this section for a quick resume summary covering your experience, education, and strongest technical skills.",
    highlights: [
      "One line for your strongest domain or specialization",
      "One line for your key tools, frameworks, or technologies",
      "One line for availability, internships, or career direction",
    ],
    viewLabel: "View Resume",
    downloadLabel: "Download PDF",
    previewLabel: "Resume Preview",
    previewImageUrl: "",
    pdfUrl: "",
  },
  achievementsSection: {
    eyebrow: "06",
    title: "Achievements",
    items: [
      "Add a competition win, published work, or major milestone here.",
      "Use this slot for a leadership role, hackathon, or internship result.",
      "Mention a measurable success or something you are proud of building.",
    ],
  },
  educationSection: {
    eyebrow: "07",
    title: "Education",
    items: [
      {
        institution: "College / University Name",
        details: "Degree, branch, and graduation year",
      },
      {
        institution: "School / Intermediate",
        details: "Qualification, board, and year or percentage",
      },
    ],
  },
  contactSection: {
    eyebrow: "08",
    title: "Contact Me",
    items: [
      { label: "Email", value: "your.email@example.com", url: "" },
      { label: "Phone", value: "+91 00000 00000", url: "" },
      { label: "GitHub", value: "github.com/your-username", url: "" },
      { label: "LinkedIn", value: "linkedin.com/in/your-name", url: "" },
    ],
    panelTitle: "Ready to personalize this section",
    panelDescription:
      "Replace these placeholders with your real email, phone number, GitHub, LinkedIn, or any other preferred contact method. This section is intentionally static and does not include a backend form.",
    primaryLabel: "Email Me",
    primaryHref: "",
    secondaryLabel: "GitHub Profile",
    secondaryHref: "",
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergePortfolioContent<T>(defaults: T, incoming: unknown): T {
  if (Array.isArray(defaults)) {
    if (!Array.isArray(incoming)) {
      return defaults;
    }

    if (defaults.length === 0) {
      return incoming as T;
    }

    return incoming.map((item, index) =>
      mergePortfolioContent(defaults[index] ?? defaults[0], item),
    ) as T;
  }

  if (isRecord(defaults)) {
    if (!isRecord(incoming)) {
      return defaults;
    }

    const result: Record<string, unknown> = {};

    for (const key of Object.keys(defaults)) {
      result[key] = mergePortfolioContent(
        defaults[key as keyof typeof defaults],
        incoming[key],
      );
    }

    return result as T;
  }

  return typeof incoming === typeof defaults ? (incoming as T) : defaults;
}

function cleanPersistedUrl(value: string) {
  return value.startsWith("asset:") ? "" : value;
}

function normalizePortfolioContent(content: PortfolioContent): PortfolioContent {
  return {
    ...content,
    hero: {
      ...content.hero,
      photoUrl: cleanPersistedUrl(content.hero.photoUrl),
    },
    projectsSection: {
      ...content.projectsSection,
      items: content.projectsSection.items.map((item) => ({
        ...item,
        imageUrl: cleanPersistedUrl(item.imageUrl),
      })),
    },
    certificatesSection: {
      ...content.certificatesSection,
      items: content.certificatesSection.items.map((item) => ({
        ...item,
        imageUrl: cleanPersistedUrl(item.imageUrl),
        pdfUrl: cleanPersistedUrl(item.pdfUrl),
      })),
    },
    resumeSection: {
      ...content.resumeSection,
      previewImageUrl: cleanPersistedUrl(content.resumeSection.previewImageUrl),
      pdfUrl: cleanPersistedUrl(content.resumeSection.pdfUrl),
    },
  };
}

export const defaultPortfolioContent: PortfolioContent = normalizePortfolioContent(
  mergePortfolioContent(starterPortfolioContent, savedData),
);
