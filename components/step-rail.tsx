"use client";

import * as React from "react";
import { cn, pad } from "@/lib/utils";

export function StepRail({ steps }: { steps: string[] }) {
  const [active, setActive] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);

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
      { rootMargin: "-84px 0px -62% 0px", threshold: [0, 1] },
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

  if (steps.length === 0) return null;

  return (
    <div
      ref={ref}
      className="rail-scroll -mx-1 mt-6 flex gap-2 overflow-x-auto px-1 pb-1"
      role="tablist"
      aria-label="Steps in this note"
    >
      {steps.map((step, i) => (
        <button
          key={step}
          type="button"
          role="tab"
          aria-selected={active === i}
          data-active={active === i}
          onClick={() => go(i)}
          className="step-chip"
        >
          <span className="step-chip-num num text-[10px] text-muted-foreground/70">
            {pad(i + 1)}
          </span>
          <span className="whitespace-nowrap">{step}</span>
        </button>
      ))}
    </div>
  );
}
