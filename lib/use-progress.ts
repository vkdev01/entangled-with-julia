"use client";

import * as React from "react";

const KEY = "jp:completed:v1";
const EVENT = "jp:progress";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function useProgress() {
  const [completed, setCompleted] = React.useState<string[]>([]);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    setCompleted(read());
    setReady(true);
    const sync = () => setCompleted(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = React.useCallback((href: string) => {
    const current = read();
    const next = current.includes(href)
      ? current.filter((h) => h !== href)
      : [...current, href];
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage disabled — keep the UI working anyway */
    }
    setCompleted(next);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  const isDone = React.useCallback((href: string) => completed.includes(href), [completed]);

  return { completed, isDone, toggle, ready };
}
