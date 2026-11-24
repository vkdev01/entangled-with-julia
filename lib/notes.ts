import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export const MODULES = [
  {
    slug: "basics",
    title: "Julia Basics",
    index: "01",
    blurb:
      "Indexing from one, the type lattice, multiple dispatch, and an environment you can actually reproduce.",
    accent: "primary" as const,
  },
  {
    slug: "ai-sciml",
    title: "AI & SciML",
    index: "02",
    blurb:
      "Neural networks in Flux, differential equations that solve themselves, and statistics you can simulate instead of memorise.",
    accent: "primary" as const,
  },
  {
    slug: "quantum",
    title: "Quantum",
    index: "03",
    blurb:
      "Circuits, gates and measurement with Yao.jl. Entanglement you can print to the terminal in nine lines.",
    accent: "primary" as const,
  },
  {
    slug: "experiments",
    title: "Experiments",
    index: "04",
    blurb:
      "Benchmarks, type stability and honest measurements. Where the speed claims meet a stopwatch.",
    accent: "primary" as const,
  },
] as const;

export type ModuleSlug = (typeof MODULES)[number]["slug"];

export type MetricTint = "ok" | "warn" | "bad" | "neutral";

export type Metric = { label: string; value: string; tint?: MetricTint };

export type NoteFrontmatter = {
  title: string;
  date: string;
  category: string;
  tags: string[];
  summary: string;
  caption?: string;
  steps?: string[];
  metrics?: Metric[];
  diagram?:
    | "pipeline"
    | "network"
    | "circuit"
    | "benchmark"
    | "lattice"
    | "curve"
    | "dist";
  level?: string;
  runtime?: string;
  order?: number;
};

export type Note = NoteFrontmatter & {
  slug: string;
  module: ModuleSlug;
  moduleTitle: string;
  moduleIndex: string;
  href: string;
  number: number;
  readingMinutes: number;
  codeCells: number;
  body: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content");

function readModule(moduleSlug: ModuleSlug): Note[] {
  const dir = path.join(CONTENT_DIR, moduleSlug);
  if (!fs.existsSync(dir)) return [];
  const mod = MODULES.find((m) => m.slug === moduleSlug)!;

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"));

  const parsed = files.map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      return { file, fm: data as NoteFrontmatter, content };
  });

  parsed.sort(
    (a, b) => (a.fm.order ?? 999) - (b.fm.order ?? 999) || a.file.localeCompare(b.file),
  );

  return parsed
    .map(({ file, fm, content }, i) => {
      const words = content.split(/\s+/).filter(Boolean).length;
      const codeCells = (content.match(/^```julia/gm) ?? []).length;
      const slug = file.replace(/\.mdx$/, "");

      return {
        ...fm,
        slug,
        module: moduleSlug,
        moduleTitle: mod.title,
        moduleIndex: mod.index,
        href: `/notes/${moduleSlug}/${slug}`,
        number: i + 1,
        readingMinutes: Math.max(1, Math.round(words / 190)),
        codeCells,
        body: content,
      };
    });
}

export function getAllNotes(): Note[] {
  return MODULES.flatMap((m) => readModule(m.slug));
}

export function getNotesByModule(): { module: (typeof MODULES)[number]; notes: Note[] }[] {
  return MODULES.map((module) => ({ module, notes: readModule(module.slug) }));
}

export function getNote(moduleSlug: string, slug: string): Note | undefined {
  if (!MODULES.some((m) => m.slug === moduleSlug)) return undefined;
  return readModule(moduleSlug as ModuleSlug).find((n) => n.slug === slug);
}

export function getNeighbours(moduleSlug: string, slug: string) {
  const flat = getAllNotes();
  const idx = flat.findIndex((n) => n.module === moduleSlug && n.slug === slug);
  return {
    previous: idx > 0 ? flat[idx - 1] : undefined,
    next: idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : undefined,
  };
}

export function getStats() {
  const notes = getAllNotes();
  return {
    notes: notes.length,
    modules: MODULES.length,
    codeCells: notes.reduce((sum, n) => sum + n.codeCells, 0),
    tags: new Set(notes.flatMap((n) => n.tags ?? [])).size,
    minutes: notes.reduce((sum, n) => sum + n.readingMinutes, 0),
  };
}
