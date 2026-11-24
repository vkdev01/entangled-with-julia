import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Mdx } from "@/lib/mdx";
import { CompleteButton } from "@/components/complete-button";
import { DiagramCard } from "@/components/diagram-card";
import { StepRail } from "@/components/step-rail";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
    <div className="mx-auto max-w-column px-6 py-9">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_540px] lg:gap-10">
        {/* ------------------------------------------------ left column */}
        <div className="min-w-0">
          {/* breadcrumb */}
          <nav className="flex items-center gap-2 text-[11px] text-muted-foreground/70">
            <Link href="/notes" className="transition-colors hover:text-foreground">
              notes
            </Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="num">{mod?.index ?? "--"}</span>
            <span>{mod?.title}</span>
          </nav>

          <h1 className="mt-4 text-balance text-[29px] font-semibold leading-[1.16] tracking-[-0.026em]">
            {note.title}
          </h1>

          <p className="mt-3.5 max-w-[58ch] text-pretty text-prose text-foreground/70">
            {note.summary}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] text-muted-foreground/70">
            <span className="num">{formatDate(note.date)}</span>
            <span className="text-muted-foreground/30">·</span>
            <span className="num">{note.readingMinutes} min read</span>
            <span className="text-muted-foreground/30">·</span>
            <span className="num">{note.codeCells} julia cells</span>
            {note.level && (
              <>
                <span className="text-muted-foreground/30">·</span>
                <span className="num">{note.level}</span>
              </>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {(note.tags ?? []).map((t) => (
              <Badge key={t} variant="outline" className="num">
                {t}
              </Badge>
            ))}
          </div>

          {/* numbered step chips */}
          <StepRail steps={note.steps ?? []} />

          {/* mobile diagram */}
          <div className="mt-8 lg:hidden">
            <DiagramCard
              kind={note.diagram ?? "pipeline"}
              caption={note.caption ?? note.summary}
              metrics={note.metrics ?? []}
              badge={note.category}
            />
          </div>

          {/* body */}
          <article
            data-note-body
            className="prose mt-9 max-w-[64ch]"
          >
            <Mdx source={note.body} />
          </article>

          <div className="mt-8 flex items-center justify-between gap-4 border-t border-border/70 pt-5">
            <CompleteButton href={note.href} />
            <span className="num text-[10px] text-muted-foreground/60">
              {mod?.index}.{pad(note.number)}
            </span>
          </div>

          {/* prev / next */}
          <nav className="mt-6 grid gap-2 sm:grid-cols-2">
            {previous ? (
              <Link
                href={previous.href}
                className="group rounded-lg border border-border/70 px-3.5 py-3 transition-colors hover:border-primary/40 hover:bg-primary/[0.03]"
              >
                <span className="label-xs flex items-center gap-1.5 text-muted-foreground/70">
                  <ArrowLeft className="size-3" /> previous
                </span>
                <span className="mt-1.5 block truncate text-[13px] text-foreground/85">
                  {previous.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
            {next && (
              <Link
                href={next.href}
                className="group rounded-lg border border-border/70 px-3.5 py-3 text-right transition-colors hover:border-primary/40 hover:bg-primary/[0.03]"
              >
                <span className="label-xs flex items-center justify-end gap-1.5 text-muted-foreground/70">
                  next <ArrowRight className="size-3" />
                </span>
                <span className="mt-1.5 block truncate text-[13px] text-foreground/85">
                  {next.title}
                </span>
              </Link>
            )}
          </nav>
        </div>

        {/* ----------------------------------------------- right column */}
        <div className="hidden lg:block">
          <div className="sticky top-[72px] space-y-3">
            <DiagramCard
              kind={note.diagram ?? "pipeline"}
              caption={note.caption ?? note.summary}
              metrics={note.metrics ?? []}
              badge={note.category}
            />
            <div className="rounded-lg border border-border/70 bg-card px-3.5 py-3">
              <div className="flex items-center justify-between">
                <span className="label-xs text-muted-foreground/65">runtime</span>
                <span className="num text-[10.5px] text-foreground/80">
                  {note.runtime ?? "julia 1.10+"}
                </span>
              </div>
              <Separator className="my-2.5" />
              <div className="flex items-center justify-between">
                <span className="label-xs text-muted-foreground/65">module</span>
                <span className="num text-[10.5px] text-foreground/80">
                  {mod?.index} · {mod?.title}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
