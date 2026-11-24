import { Diagram, type DiagramKind } from "@/components/diagrams";
import type { Metric, MetricTint } from "@/lib/notes";
import { cn } from "@/lib/utils";

const tint: Record<MetricTint, string> = {
  ok: "text-ok",
  warn: "text-warn",
  bad: "text-bad",
  neutral: "text-foreground",
};

export function DiagramCard({
  kind,
  caption,
  metrics,
  badge,
}: {
  kind: DiagramKind;
  caption: string;
  metrics: Metric[];
  badge: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border/70 bg-card">
      <div className="flex h-10 items-center justify-between border-b border-border/60 px-3.5">
        <span className="label">live diagram</span>
        <span className="num rounded-full border border-border/70 px-2 py-0.5 text-[9.5px] text-muted-foreground/80">
          {badge}
        </span>
      </div>

      <div className="px-1.5 py-2">
        <Diagram kind={kind} className="h-[288px]" />
      </div>

      <div className="border-t border-border/60 px-3.5 py-2.5">
        <p className="text-[11.5px] leading-relaxed text-muted-foreground">{caption}</p>
      </div>

      {metrics.length > 0 && (
        <div className="grid grid-cols-3 divide-x divide-border/60 border-t border-border/60">
          {metrics.slice(0, 3).map((m) => (
            <div key={m.label} className="px-3.5 py-3">
              <div className="label-xs text-muted-foreground/65">{m.label}</div>
              <div className={cn("num mt-1.5 text-[13px]", tint[m.tint ?? "neutral"])}>
                {m.value}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
