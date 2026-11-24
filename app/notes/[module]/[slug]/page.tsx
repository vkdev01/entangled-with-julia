import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Mdx } from "@/lib/mdx";
import { CompleteButton } from "@/components/complete-button";
import { NoteFigure } from "@/components/note-figure";
import { TocRail } from "@/components/toc-rail";
import { getAllNotes, getNeighbours, getNote, MODULES } from "@/lib/notes";
import { formatDate, pad } from "@/lib/utils";

type Params = { module: string; slug: string };

export function generateStaticParams() {
  return getAllNotes().map((n) => ({ module: n.module, slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { module, slug } = await params;
  const note = getNote(module, slug);
  if (!note) return { title: "Not found" };
  return {
    title: note.title,
    description: note.summary,
    openGraph: { title: note.title, description: note.summary, type: "article" },
  };
}

export default async function NotePage({ params }: { params: Promise<Params> }) {
  const { module: moduleSlug, slug } = await params;
  const note = getNote(moduleSlug, slug);
  if (!note) notFound();

  const { previous, next } = getNeighbours(moduleSlug, slug);
  const mod = MODULES.find((m) => m.slug === note.module);

  return (
    <div className="mx-auto max-w-column px-6 py-10">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,660px)_236px] lg:justify-between lg:gap-10">
        {/* ------------------------------------------------ reading column */}
        <div className="min-w-0">
          <nav className="flex items-center gap-2 text-[11px] text-muted-foreground/60">
            <Link href="/notes" className="transition-colors hover:text-foreground">
              notes
            </Link>
            <span className="text-muted-foreground/30">/</span>
            <span className="num">{mod?.index}</span>
            <span className="text-muted-foreground/70">{mod?.title}</span>
          </nav>

          <h1 className="mt-3 text-balance text-[31px] font-semibold leading-[1.15] tracking-[-0.028em]">
            {note.title}
          </h1>

          <p className="mt-3.5 max-w-[60ch] text-pretty text-prose text-foreground/70">
            {note.summary}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[11px] text-muted-foreground/60">
            <span className="num">{formatDate(note.date)}</span>
            <span className="text-muted-foreground/25">·</span>
            <span className="num">{note.readingMinutes} min</span>
            <span className="text-muted-foreground/25">·</span>
            <span className="num">{note.codeCells} julia cells</span>
            {note.level && (
              <>
                <span className="text-muted-foreground/25">·</span>
                <span className="num">{note.level}</span>
              </>
            )}
          </div>

          <NoteFigure
            kind={note.diagram ?? "pipeline"}
            caption={note.caption ?? note.summary}
            metrics={note.metrics ?? []}
          />

          <article data-note-body className="prose mt-10">
            <Mdx source={note.body} />
          </article>

          <div className="mt-10 flex items-center justify-between gap-4 border-t border-border/70 pt-5">
            <CompleteButton href={note.href} />
            <span className="num text-[10px] text-muted-foreground/50">
              {mod?.index}.{pad(note.number)}
            </span>
          </div>

          <nav className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {previous ? (
              <Link
                href={previous.href}
                className="group rounded-lg border border-border/70 px-4 py-3 transition-colors hover:border-primary/40 hover:bg-primary/[0.03]"
              >
                <span className="label-xs flex items-center gap-1.5 text-muted-foreground/60">
                  <ArrowLeft className="size-3" /> previous
                </span>
                <span className="mt-1.5 block truncate text-[13px] text-foreground/85">
                  {previous.title}
                </span>
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}
            {next && (
              <Link
                href={next.href}
                className="group rounded-lg border border-border/70 px-4 py-3 text-right transition-colors hover:border-primary/40 hover:bg-primary/[0.03]"
              >
                <span className="label-xs flex items-center justify-end gap-1.5 text-muted-foreground/60">
                  next <ArrowRight className="size-3" />
                </span>
                <span className="mt-1.5 block truncate text-[13px] text-foreground/85">
                  {next.title}
                </span>
              </Link>
            )}
          </nav>
        </div>

        {/* -------------------------------------------------------- side rail */}
        <aside className="hidden lg:block">
          <TocRail
            steps={note.steps ?? []}
            runtime={note.runtime ?? "julia 1.10+"}
            moduleLabel={`${mod?.index} · ${mod?.title}`}
            tags={note.tags ?? []}
          />
        </aside>
      </div>
    </div>
  );
}
