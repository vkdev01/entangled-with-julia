"use client";

import * as React from "react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn, pad } from "@/lib/utils";

export function TocRail({
  steps,
  runtime,
  moduleLabel,
  tags,
}: {
  steps: string[];
  runtime: string;
  moduleLabel: string;
  tags: string[];
}) {
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    const heads = Array.from(
      document.querySelectorAll<HTMLElement>("[data-note-body] h2"),
    );
    if (heads.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          const idx = heads.indexOf(visible[0].target as HTMLElement);
          if (idx >= 0) setActive(idx);
        }
      },
      { rootMargin: "-88px 0px -60% 0px", threshold: [0, 1] },
    );

    heads.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, []);

  const go = (i: number) => {
    const heads = Array.from(
      document.querySelectorAll<HTMLElement>("[data-note-body] h2"),
    );
    heads[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="sticky top-[76px]">
      {steps.length > 0 && (
        <>
          <div className="label px-2">in this note</div>
          <ol className="mt-2.5">
            {steps.map((step, i) => (
              <li key={step}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  className={cn(
                    "group relative flex w-full items-baseline gap-2.5 rounded-md py-1.5 pl-2 pr-1 text-left transition-colors",
                    active === i
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground/80",
                  )}
                >
                  <span
                    className={cn(
                      "absolute left-0 top-1.5 h-[calc(100%-12px)] w-px transition-colors",
                      active === i ? "bg-primary" : "bg-transparent",
                    )}
                  />
                  <span className="num w-[14px] shrink-0 text-[9.5px] text-muted-foreground/55">
                    {pad(i + 1)}
                  </span>
                  <span className="text-[12px] leading-snug">{step}</span>
                </button>
              </li>
            ))}
          </ol>
        </>
      )}

      <Separator className="my-4" />

      <div className="space-y-2 px-2">
        <div className="flex items-baseline justify-between gap-2">
          <span className="label-xs text-muted-foreground/55">runtime</span>
          <span className="num text-right text-[10px] text-foreground/70">{runtime}</span>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <span className="label-xs text-muted-foreground/55">module</span>
          <span className="num text-right text-[10px] text-foreground/70">{moduleLabel}</span>
        </div>
      </div>

      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5 px-2">
          {tags.map((t) => (
            <Badge key={t} variant="outline" className="num text-[9.5px]">
              {t}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
