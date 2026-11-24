import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getNotesByModule, getStats } from "@/lib/notes";
import { formatDate, pad, plural } from "@/lib/utils";

export const metadata: Metadata = {
  title: "All notes",
  description:
    "Every note in the playground: Julia basics, AI & SciML, quantum circuits and benchmarks.",
};

export default function NotesIndexPage() {
  const modules = getNotesByModule();
  const stats = getStats();

  return (
    <div className="mx-auto max-w-column px-6 py-10">
      <div className="flex items-center gap-2.5">
        <span className="size-1.5 rounded-full bg-primary" />
        <span className="label">the whole shelf</span>
      </div>
      <h1 className="mt-4 text-[30px] font-semibold tracking-[-0.025em]">
        All notes
      </h1>
      <p className="mt-3 max-w-[62ch] text-prose text-foreground/70">
        {plural(stats.notes, "note")} across {plural(stats.modules, "module")} — {stats.codeCells} runnable
        Julia cells, every one with an expected output you can argue with.
      </p>

      <div className="mt-10 space-y-10">
        {modules.map(({ module, notes }) => (
          <section key={module.slug} id={module.slug}>
            <div className="flex items-baseline gap-3 border-b border-border/70 pb-2.5">
              <span className="num text-[10.5px] text-muted-foreground/70">
                {module.index}
              </span>
              <h2 className="text-[15px] font-semibold tracking-[-0.01em]">
                {module.title}
              </h2>
              <span className="num ml-auto text-[10px] text-muted-foreground/60">
                {notes.length}/{pad(notes.length)}
              </span>
            </div>

            <div className="mt-3 space-y-2">
              {notes.map((note) => (
                <Link
                  key={note.href}
                  href={note.href}
                  className="group flex items-start gap-4 rounded-lg border border-transparent px-3 py-3.5 transition-colors duration-200 hover:border-border/70 hover:bg-card"
                >
                  <span className="num mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border border-border/70 text-[10.5px] text-muted-foreground/80 transition-colors group-hover:border-primary/40 group-hover:text-primary">
                    {pad(note.number)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                      <h3 className="text-[14px] font-medium tracking-[-0.005em]">
                        {note.title}
                      </h3>
                      <span className="num text-[10px] text-muted-foreground/55">
                        {formatDate(note.date)} · {note.readingMinutes} min ·{" "}
                        {plural(note.codeCells, "cell")}
                      </span>
                    </div>
                    <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                      {note.summary}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {(note.tags ?? []).map((t) => (
                        <Badge key={t} variant="outline" className="num">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <ArrowUpRight className="mt-1 size-3.5 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-primary" />
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 flex items-center justify-between border-t border-border/70 pt-6">
        <p className="text-[13px] text-muted-foreground">
          More notes land here as the playground grows.
        </p>
        <Link
          href="/#run"
          className="inline-flex items-center gap-1.5 text-[12.5px] text-primary transition-opacity hover:opacity-80"
        >
          Run it locally <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
