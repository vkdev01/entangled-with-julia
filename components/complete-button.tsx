"use client";

import * as React from "react";
import { Check, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/lib/use-progress";
import { cn } from "@/lib/utils";

export function CompleteButton({ href }: { href: string }) {
  const { isDone, toggle, ready } = useProgress();
  const done = ready && isDone(href);

  return (
    <Button
      variant={done ? "outline" : "default"}
      size="sm"
      onClick={() => toggle(href)}
      className={cn("gap-2", done && "text-ok")}
      aria-pressed={done}
    >
      {done ? <Check className="size-3.5" /> : <Circle className="size-3.5" />}
      {done ? "Marked as read" : "Mark as read"}
    </Button>
  );
}
