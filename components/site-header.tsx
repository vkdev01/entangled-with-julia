import Link from "next/link";
import { Github } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";

const links = [
  { href: "/notes", label: "Notes" },
  { href: "/#modules", label: "Modules" },
  { href: "/#run", label: "Setup" },
];

export function SiteHeader() {
  return (
    <TooltipProvider delayDuration={200}>
      <header className="sticky top-0 z-50 h-14 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-full max-w-[1440px] items-center gap-3 px-4 sm:px-6">
          <Link href="/" className="group flex items-center gap-2.5">
            <Logo className="transition-transform duration-300 group-hover:scale-105" />
            <span className="text-[13.5px] font-semibold tracking-tight">
              julia<span className="text-muted-foreground">/</span>playground
            </span>
            <span className="num hidden rounded-full border border-border/70 px-1.5 py-0.5 text-[9.5px] text-muted-foreground sm:inline">
              v0.1
            </span>
          </Link>

          <nav className="ml-4 hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-md px-2.5 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <a
              href="https://github.com/vkdev01/julia-playground"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Repository on GitHub"
              className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
            >
              <Github className="size-4" />
            </a>
            <ThemeToggle />
            <Button asChild size="sm" className="ml-1 hidden sm:inline-flex">
              <Link href="/notes/basics/indexing-and-dispatch">Start here</Link>
            </Button>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
}
