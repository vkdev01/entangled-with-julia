import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";
import { PipelineDiagram } from "@/components/diagrams";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getNotesByModule, getStats } from "@/lib/notes";
import { pad } from "@/lib/utils";

const setupLines: { text: string; comment?: string }[] = [
  { text: "juliaup add release", comment: "install julia 1.10+" },
  { text: "git clone https://github.com/vkdev01/entangled-with-julia" },
  { text: "cd entangled-with-julia/julia" },
  { text: "julia --project=. -e 'using Pkg; Pkg.instantiate()'", comment: "deps" },
  { text: "julia --project=. basics/indexing_dispatch.jl" },
  { text: "npm install && npm run dev", comment: "this site" },
];

export default function HomePage() {
  const modules = getNotesByModule();
  const stats = getStats();

  return (
    <main>
      {/* ---------------------------------------------------------- hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="eng-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -left-40 -top-32 size-[560px] rounded-full bg-primary/[0.18] blur-[120px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-24 top-[18%] size-[440px] rounded-full bg-signal/[0.10] blur-[120px]"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-column px-6 pb-14 pt-16 sm:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_1fr] lg:gap-14">
            {/* copy */}
            <div>
              <div className="flex items-center gap-2.5">
                <span className="size-1.5 rounded-full bg-primary" />
                <span className="label">julia · notes · experiments</span>
              </div>

              <h1 className="mt-5 text-balance text-[34px] font-semibold leading-[1.12] tracking-[-0.028em] sm:text-[40px]">
                Julia, from{" "}
                <span className="num text-primary">1</span> to a Bell state.
              </h1>

              <p className="mt-4 max-w-[46ch] text-pretty text-prose text-foreground/70">
                A runnable lab of notes, tutorials and experiments — indexing that starts
                at one, dispatch that picks the right method, Flux models that train, Yao
                circuits that entangle, and benchmarks that survive a stopwatch.
              </p>

              <p className="mt-3 max-w-[46ch] text-[13px] text-muted-foreground">
                Every snippet is a real file in the repo. Every block has an expected
                output. Every output has a gotcha.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button asChild size="lg">
                  <Link href="/notes/basics/indexing-and-dispatch">
                    Start with the basics
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/notes">Browse all notes</Link>
                </Button>
              </div>

              <div className="mt-7 flex items-center gap-2 font-mono text-[11.5px] text-muted-foreground">
                <Terminal className="size-3.5 text-primary/70" />
                <span>
                  <span className="text-primary/80">julia&gt;</span> 1 == 1.0
                </span>
                <span className="text-ok/80">true</span>
                <span className="text-muted-foreground/50"># still 1-based</span>
              </div>
            </div>

            {/* live diagram in browser chrome */}
            <div>
              <div className="overflow-hidden rounded-lg border border-border/70 bg-card/70 backdrop-blur-sm">
                <div className="flex h-9 items-center gap-2 border-b border-border/60 bg-muted/30 px-3">
                  <span className="size-2 rounded-full bg-border" />
                  <span className="size-2 rounded-full bg-border" />
                  <span className="size-2 rounded-full bg-border" />
                  <div className="ml-2 flex h-5 flex-1 items-center rounded-[5px] border border-border/60 bg-background/60 px-2">
                    <span className="num truncate text-[10px] text-muted-foreground/80">
                      julia-playground/notes/basics
                    </span>
                  </div>
                  <span className="label-xs flex items-center gap-1 text-muted-foreground/70">
                    <span className="size-1 rounded-full bg-signal" />
                    live
                  </span>
                </div>
                <div className="p-2">
                  <PipelineDiagram className="h-[268px]" />
                </div>
                <div className="flex items-center justify-between border-t border-border/60 px-3 py-2">
                  <span className="label-xs text-muted-foreground/70">
                    fig. 01 — compile once, run forever
                  </span>
                  <span className="num text-[10px] text-muted-foreground/60">julia 1.10</span>
                </div>
              </div>
            </div>
          </div>

          {/* stats row */}
          <div className="mt-14 grid grid-cols-3 gap-6 border-t border-border/60 pt-6">
            {[
              { value: pad(stats.modules), label: "modules" },
              { value: pad(stats.notes), label: "notes" },
              { value: pad(stats.codeCells), label: "runnable cells" },
            ].map((s) => (
              <div key={s.label}>
                <div className="num text-[22px] leading-none text-foreground">{s.value}</div>
                <div className="label mt-2">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- modules */}
      <section id="modules" className="mx-auto max-w-column px-6 py-16">
        <div className="flex items-end justify-between">
          <div>
            <span className="label">the syllabus</span>
            <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.02em]">
              Four modules, one language
            </h2>
          </div>
          <Link
            href="/notes"
            className="hidden items-center gap-1.5 text-[12.5px] text-muted-foreground transition-colors hover:text-foreground sm:flex"
          >
            All notes <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {modules.map(({ module, notes }) => (
            <Link
              key={module.slug}
              href={notes[0]?.href ?? "/notes"}
              className="group relative overflow-hidden rounded-lg border border-border/70 bg-card p-5 transition-colors duration-200 hover:border-primary/40 hover:bg-primary/[0.03]"
            >
              <div className="flex items-start justify-between">
                <span className="num text-[10.5px] text-muted-foreground/70">
                  {module.index}
                </span>
                <span className="num text-[10.5px] text-muted-foreground/60">
                  {notes.length} note{notes.length === 1 ? "" : "s"} ·{" "}
                  {notes.reduce((n, x) => n + x.codeCells, 0)} cells
                </span>
              </div>
              <h3 className="mt-3 text-[15px] font-semibold tracking-[-0.01em]">
                {module.title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                {module.blurb}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {(notes[0]?.tags ?? []).slice(0, 4).map((t) => (
                  <Badge key={t} variant="outline" className="num">
                    {t}
                  </Badge>
                ))}
              </div>
              <ArrowRight className="absolute bottom-5 right-5 size-4 -translate-x-1 text-primary opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------------- run */}
      <section id="run" className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto grid max-w-column gap-10 px-6 py-16 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <span className="label">setup &amp; build</span>
            <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.02em]">
              Two runtimes, one repo
            </h2>
            <p className="mt-3 max-w-[46ch] text-prose text-foreground/70">
              The <code className="num text-[12.5px]">julia/</code> folder is a real Julia
              project — <code className="num text-[12.5px]">Project.toml</code>, pinned
              deps, scripts that run standalone. The Next.js app reads the same examples
              out of <code className="num text-[12.5px]">content/</code> as MDX.
            </p>
            <ul className="mt-5 space-y-2.5 text-[13px] text-muted-foreground">
              {[
                "Scripts run on Julia 1.10+ with no global installs",
                "Every note maps to a .jl file you can open and run",
                "Benchmarks use BenchmarkTools, not vibes",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5">
                  <span className="mt-[7px] size-1 shrink-0 rounded-full bg-primary" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="overflow-hidden rounded-lg border border-border/70 bg-card">
            <div className="flex h-9 items-center gap-2 border-b border-border/60 bg-muted/30 px-3">
              <span className="size-2 rounded-full bg-border" />
              <span className="size-2 rounded-full bg-border" />
              <span className="size-2 rounded-full bg-border" />
              <span className="num ml-2 text-[10px] text-muted-foreground/80">
                zsh — julia-playground
              </span>
            </div>
            <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[12px] leading-[1.9]">
              {setupLines.map((l) => (
                <div key={l.text} className="whitespace-pre">
                  <span className="select-none text-primary/60">$ </span>
                  <span className="text-foreground/85">{l.text}</span>
                  {l.comment ? (
                    <span className="text-muted-foreground/45">{"  # " + l.comment}</span>
                  ) : null}
                </div>
              ))}
            </pre>
          </div>
        </div>
      </section>
    </main>
  );
}
