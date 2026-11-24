"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Check } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { useProgress } from "@/lib/use-progress";
import { cn, pad } from "@/lib/utils";

export type NavNote = { href: string; title: string; number: number };
export type NavModule = {
  slug: string;
  title: string;
  index: string;
  notes: NavNote[];
};

export function SideNav({ modules }: { modules: NavModule[] }) {
  const pathname = usePathname();
  const { isDone, completed, ready } = useProgress();

  const total = modules.reduce((n, m) => n + m.notes.length, 0);
  const done = modules.reduce(
    (n, m) => n + m.notes.filter((note) => isDone(note.href)).length,
    0,
  );
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-72 shrink-0 flex-col border-r border-border/60 lg:flex">
      {/* progress pinned at the top */}
      <div className="border-b border-border/60 px-4 pb-3.5 pt-4">
        <div className="flex items-baseline justify-between">
          <span className="label">course progress</span>
          <span className="num text-[11px] text-foreground/80">
            {pad(ready ? done : 0)}
            <span className="text-muted-foreground/60">/{pad(total)}</span>
          </span>
        </div>
        <Progress value={ready ? pct : 0} className="mt-2.5 h-[3px]" />
      </div>

      <nav className="rail-scroll flex-1 overflow-y-auto px-2 py-2.5">
        {modules.map((mod) => {
          const modDone = mod.notes.filter((n) => isDone(n.href)).length;
          const isCurrentModule = pathname.startsWith(`/notes/${mod.slug}`);
          return (
            <Collapsible key={mod.slug} defaultOpen className="group/mod">
              <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left transition-colors hover:bg-accent/50">
                <ChevronRight className="size-3 shrink-0 text-muted-foreground/60 transition-transform duration-200 group-data-[state=open]/mod:rotate-90" />
                <span className="num text-[10px] text-muted-foreground/70">{mod.index}</span>
                <span className="truncate text-[12.5px] font-medium text-foreground/85">
                  {mod.title}
                </span>
                <span className="num ml-auto text-[10px] text-muted-foreground/60">
                  {pad(modDone)}/{pad(mod.notes.length)}
                </span>
              </CollapsibleTrigger>
              <CollapsibleContent className="overflow-hidden">
                <ul className="mb-1 ml-[13px] border-l border-border/60 pl-1.5">
                  {mod.notes.map((note) => {
                    const active = pathname === note.href;
                    const complete = isDone(note.href);
                    return (
                      <li key={note.href}>
                        <Link
                          href={note.href}
                          className={cn(
                            "group/link relative -ml-1.5 flex items-start gap-2 rounded-md py-1.5 pl-1.5 pr-2 transition-colors",
                            active
                              ? "bg-primary/[0.09] text-foreground"
                              : "text-muted-foreground hover:bg-accent/40 hover:text-foreground/90",
                          )}
                        >
                          {active && (
                            <span className="absolute left-0 top-1.5 h-[calc(100%-12px)] w-px bg-primary" />
                          )}
                          <span
                            className={cn(
                              "num mt-[1px] flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border text-[9.5px]",
                              active
                                ? "border-primary/40 text-primary"
                                : "border-border/70 text-muted-foreground/70",
                            )}
                          >
                            {complete ? <Check className="size-2.5" /> : pad(note.number)}
                          </span>
                          <span className="text-[12.5px] leading-snug">{note.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </nav>

      <div className="border-t border-border/60 px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="label-xs text-muted-foreground/60">runtime</span>
          <span className="num text-[10px] text-muted-foreground/70">julia 1.10+</span>
        </div>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="label-xs text-muted-foreground/60">notes read</span>
          <span className="num text-[10px] text-muted-foreground/70">
            {ready ? completed.length : 0}
          </span>
        </div>
      </div>
    </aside>
  );
}
