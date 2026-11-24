import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type CalloutVariant = "note" | "tip" | "warn" | "danger";

const calloutStyles: Record<CalloutVariant, { wrap: string; dot: string; label: string; text: string }> = {
  note: {
    wrap: "border-border/70 bg-muted/25",
    dot: "bg-primary",
    label: "Note",
    text: "text-muted-foreground",
  },
  tip: {
    wrap: "border-ok/25 bg-ok/[0.05]",
    dot: "bg-ok",
    label: "Tip",
    text: "text-ok",
  },
  warn: {
    wrap: "border-warn/25 bg-warn/[0.05]",
    dot: "bg-warn",
    label: "Careful",
    text: "text-warn",
  },
  danger: {
    wrap: "border-bad/25 bg-bad/[0.05]",
    dot: "bg-bad",
    label: "Footgun",
    text: "text-bad",
  },
};

export function Callout({
  variant = "note",
  title,
  children,
}: {
  variant?: CalloutVariant;
  title?: string;
  children: React.ReactNode;
}) {
  const s = calloutStyles[variant] ?? calloutStyles.note;
  return (
    <div className={cn("not-prose my-6 rounded-lg border px-4 py-3.5", s.wrap)}>
      <div className="mb-1.5 flex items-center gap-2">
        <span className={cn("size-1.5 rounded-full", s.dot)} />
        <span className={cn("label-xs", s.text)}>{title ?? s.label}</span>
      </div>
      <div className="text-prose text-foreground/80 [&_p]:m-0 [&_p+p]:mt-2">{children}</div>
    </div>
  );
}

export function KeyIdea({
  title = "Key idea",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <aside className="not-prose my-7 rounded-lg border border-border/70 border-l-primary bg-primary/[0.045] px-4 py-3.5">
      <div className="mb-1.5 label-xs label-primary">{title}</div>
      <div className="text-prose text-foreground/85 [&_p]:m-0 [&_p+p]:mt-2">{children}</div>
    </aside>
  );
}

export function Gotchas({ children }: { children: React.ReactNode }) {
  return (
    <section className="not-prose mt-12 border-t border-border/70 pt-7">
      <div className="flex items-center justify-between">
        <span className="label label-primary">Gotchas &amp; takeaways</span>
        <span className="num text-[10px] text-muted-foreground/60">end of note</span>
      </div>
      <div className="mt-3 text-prose text-foreground/80">{children}</div>
    </section>
  );
}

export function Aside({ children }: { children: React.ReactNode }) {
  return (
    <div className="not-prose my-5 border-l border-border pl-4 text-small text-muted-foreground">
      {children}
    </div>
  );
}

export function FileRef({ path, children }: { path: string; children?: React.ReactNode }) {
  return (
    <div className="not-prose my-4 flex items-center gap-2 rounded-md border border-border/70 bg-muted/25 px-3 py-2">
      <span className="label-xs text-muted-foreground/70">run</span>
      <code className="num text-[12px] text-foreground">{path}</code>
      {children ? <span className="text-[12px] text-muted-foreground">{children}</span> : null}
    </div>
  );
}

export function a({
  href = "",
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const external = /^https?:/.test(href);
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className={cn("inline-flex items-baseline gap-1", className)}
        {...props}
      />
    );
  }
  return <Link href={href} className={className} {...props} />;
}

export const mdxComponents = {
  a,
  Callout,
  KeyIdea,
  Gotchas,
  Aside,
  FileRef,
};
