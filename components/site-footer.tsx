import Link from "next/link";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-column flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Logo className="size-5 opacity-80" />
          <div>
            <p className="text-[13px] text-foreground/80">
              A playground for people who like their types inferred.
            </p>
            <p className="num mt-0.5 text-[10.5px] text-muted-foreground/70">
              MIT · julia 1.10+ · built with next.js + mdx
            </p>
          </div>
        </div>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-muted-foreground">
          <Link href="/notes" className="transition-colors hover:text-foreground">
            All notes
          </Link>
          <Link href="/#run" className="transition-colors hover:text-foreground">
            Run locally
          </Link>
          <a
            href="https://docs.julialang.org"
            target="_blank"
            rel="noreferrer noopener"
            className="transition-colors hover:text-foreground"
          >
            Julia docs
          </a>
          <a
            href="https://github.com/vkdev01/julia-playground"
            target="_blank"
            rel="noreferrer noopener"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
