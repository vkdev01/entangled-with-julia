import { Diagram, type DiagramKind } from "@/components/diagrams";
import type { Metric, MetricTint } from "@/lib/notes";
import { cn } from "@/lib/utils";

const tint: Record<MetricTint, string> = {
  ok: "text-ok",
  warn: "text-warn",
  bad: "text-bad",
  neutral: "text-foreground",
};

const DIAGRAM_LABEL: Record<DiagramKind, string> = {
  pipeline: "execution pipeline",
  network: "forward pass",
  circuit: "circuit",
  benchmark: "wall clock",
  lattice: "type lattice",
  curve: "solution curve",
  dist: "sampling distribution",
};

export function NoteFigure({
  kind,
  caption,
  metrics,
  fig = "01",
}: {
  kind: DiagramKind;
  caption: string;
  metrics: Metric[];
  fig?: string;
}) {
  return (
    <figure className="mt-9 overflow-hidden rounded-lg border border-border/70 bg-card">
      <div className="flex h-9 items-center justify-between border-b border-border/60 px-4">
        <span className="label">
          fig. {fig} <span className="text-muted-foreground/40">—</span>{" "}
          <span className="text-muted-foreground/70">{DIAGRAM_LABEL[kind]}</span>
        </span>
        <span className="num flex items-center gap-1.5 text-[9.5px] text-muted-foreground/60">
          <span className="size-1 rounded-full bg-signal" />
          live
        </span>
      </div>

      <div className="px-3 py-3 sm:px-5 sm:py-4">
        <Diagram kind={kind} className="h-auto w-full" />
      </div>

      <figcaption className="border-t border-border/60 px-4 py-2.5 text-[11.5px] leading-relaxed text-muted-foreground">
        {caption}
      </figcaption>

      {metrics.length > 0 && (
        <div className="grid grid-cols-3 divide-x divide-border/60 border-t border-border/60">
          {metrics.slice(0, 3).map((m) => (
            <div key={m.label} className="px-4 py-3">
              <div className="label-xs text-muted-foreground/60">{m.label}</div>
              <div className={cn("num mt-1.5 text-[13.5px]", tint[m.tint ?? "neutral"])}>
                {m.value}
              </div>
            </div>
          ))}
        </div>
      )}
    </figure>
  );
}
