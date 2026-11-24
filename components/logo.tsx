import { cn } from "@/lib/utils";

/** Three dots, a nod to the Julia mark — drawn in our palette, not copied. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-[22px]", className)}
      aria-hidden="true"
      fill="none"
    >
      <circle cx="12" cy="7" r="3.1" className="fill-primary" />
      <circle cx="7.1" cy="15.6" r="3.1" className="fill-primary/55" />
      <circle cx="16.9" cy="15.6" r="3.1" className="fill-signal/80" />
    </svg>
  );
}
