"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type DiagramProps = {
  className?: string;
  animate?: boolean;
};

const mono = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" } as const;

function useReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/** The single piece of motion in the whole app: one dot on the highlighted path. */
function SignalDot({
  path,
  dur = 5.5,
  animate = true,
  delay = 0,
}: {
  path: string;
  dur?: number;
  animate?: boolean;
  delay?: number;
}) {
  return (
    <g>
      <circle r="9" className="fill-signal/15" cx={0} cy={0} opacity={animate ? 1 : 0}>
        {animate && (
          <animateMotion
            dur={`${dur}s`}
            begin={`${delay}s`}
            repeatCount="indefinite"
            path={path}
            keyPoints="0;1"
            keyTimes="0;1"
            calcMode="linear"
          />
        )}
      </circle>
      <circle r="4" className="fill-signal" cx={0} cy={0}>
        {animate && (
          <animateMotion
            dur={`${dur}s`}
            begin={`${delay}s`}
            repeatCount="indefinite"
            path={path}
            keyPoints="0;1"
            keyTimes="0;1"
            calcMode="linear"
          />
        )}
      </circle>
    </g>
  );
}

function Node({
  x,
  y,
  w = 96,
  h = 58,
  label,
  sub,
  active = false,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  label: string;
  sub: string;
  active?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={10}
        strokeWidth={1}
        className={cn(
          active
            ? "fill-primary/[0.07] stroke-primary/50"
            : "fill-muted/30 stroke-border/80",
        )}
      />
      <text
        x={x + w / 2}
        y={y + 25}
        textAnchor="middle"
        style={{ ...mono, fontSize: 11.5 }}
        className="fill-foreground"
      >
        {label}
      </text>
      <text
        x={x + w / 2}
        y={y + 40}
        textAnchor="middle"
        style={{ ...mono, fontSize: 9 }}
        className="fill-muted-foreground"
      >
        {sub}
      </text>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 1. execution pipeline                                               */
/* ------------------------------------------------------------------ */
export function PipelineDiagram({ className, animate }: DiagramProps) {
  const reduced = useReducedMotion();
  const on = animate !== false && !reduced;
  const nodes = [
    { label: "a.jl", sub: "source" },
    { label: "lowering", sub: "surface → IR" },
    { label: "inference", sub: "types" },
    { label: "LLVM", sub: "optimise" },
    { label: "native", sub: "run" },
  ];

  return (
    <svg viewBox="0 0 560 300" className={cn("h-full w-full", className)} role="img" aria-label="Julia execution pipeline: source, lowering, type inference, LLVM, native code">
      <text x="12" y="34" style={{ ...mono, fontSize: 9, letterSpacing: "0.18em" }} className="fill-muted-foreground">
        EXECUTION PIPELINE
      </text>
      <text x="548" y="34" textAnchor="end" style={{ ...mono, fontSize: 9 }} className="fill-muted-foreground/70">
        first call
      </text>

      {/* the highlighted path */}
      <line x1="12" y1="153" x2="548" y2="153" className="stroke-primary/25" strokeWidth="1" />

      {nodes.map((n, i) => (
        <Node key={n.label} x={12 + i * 110} y={124} label={n.label} sub={n.sub} active={i === 2} />
      ))}

      {/* connectors */}
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1={12 + i * 110 + 96}
          y1={153}
          x2={12 + (i + 1) * 110}
          y2={153}
          className="stroke-border"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
      ))}

      {/* compiled-method cache branch */}
      <path d="M 280 182 V 236 H 352" className="fill-none stroke-border" strokeWidth="1" strokeDasharray="3 3" />
      <rect x="352" y="214" width="150" height="44" rx="10" className="fill-muted/30 stroke-border/80" strokeWidth="1" />
      <text x="427" y="232" textAnchor="middle" style={{ ...mono, fontSize: 10.5 }} className="fill-foreground">
        method cache
      </text>
      <text x="427" y="246" textAnchor="middle" style={{ ...mono, fontSize: 9 }} className="fill-ok">
        hit · ~0.2 µs
      </text>

      <text x="12" y="284" style={{ ...mono, fontSize: 9 }} className="fill-muted-foreground/70">
        compile once per type signature, reuse forever
      </text>

      <SignalDot path="M 12 153 H 548" animate={on} dur={6} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 2. neural network forward pass                                      */
/* ------------------------------------------------------------------ */
export function NetworkDiagram({ className, animate }: DiagramProps) {
  const reduced = useReducedMotion();
  const on = animate !== false && !reduced;

  const layers = [
    [70, [80, 140, 200, 260]],
    [250, [95, 170, 245]],
    [430, [120, 220]],
  ] as const;

  const activePath = "M 70 140 L 250 170 L 430 120";

  return (
    <svg viewBox="0 0 560 300" className={cn("h-full w-full", className)} role="img" aria-label="A small neural network: four inputs, three hidden units, two outputs, with one highlighted forward path">
      <text x="12" y="34" style={{ ...mono, fontSize: 9, letterSpacing: "0.18em" }} className="fill-muted-foreground">
        FORWARD PASS · FLUX.CHAIN
      </text>
      <text x="548" y="34" textAnchor="end" style={{ ...mono, fontSize: 9 }} className="fill-muted-foreground/70">
        4 → 3 → 2
      </text>

      {/* edges */}
      {layers[0][1].map((y0) =>
        layers[1][1].map((y1) => (
          <line key={`a${y0}-${y1}`} x1={70} y1={y0} x2={250} y2={y1} className="stroke-border/70" strokeWidth="0.8" />
        )),
      )}
      {layers[1][1].map((y1) =>
        layers[2][1].map((y2) => (
          <line key={`b${y1}-${y2}`} x1={250} y1={y1} x2={430} y2={y2} className="stroke-border/70" strokeWidth="0.8" />
        )),
      )}

      {/* highlighted path */}
      <path d={activePath} className="fill-none stroke-primary/40" strokeWidth="1.2" strokeDasharray="4 3" />

      {/* nodes */}
      {layers[0][1].map((y, i) => (
        <g key={`l0-${y}`}>
          <circle cx={70} cy={y} r={i === 1 ? 8 : 6} className={i === 1 ? "fill-primary/20 stroke-primary/70" : "fill-card stroke-border"} strokeWidth="1" />
          <text x={40} y={y + 3.5} textAnchor="middle" style={{ ...mono, fontSize: 9.5 }} className="fill-muted-foreground">
            x{i + 1}
          </text>
        </g>
      ))}
      {layers[1][1].map((y, i) => (
        <g key={`l1-${y}`}>
          <circle cx={250} cy={y} r={i === 1 ? 8 : 6} className={i === 1 ? "fill-primary/20 stroke-primary/70" : "fill-card stroke-border"} strokeWidth="1" />
          <text x={250} y={y - 16} textAnchor="middle" style={{ ...mono, fontSize: 9 }} className="fill-muted-foreground/70">
            h{i + 1}
          </text>
        </g>
      ))}
      {layers[2][1].map((y, i) => (
        <g key={`l2-${y}`}>
          <circle cx={430} cy={y} r={i === 0 ? 8 : 6} className={i === 0 ? "fill-primary/20 stroke-primary/70" : "fill-card stroke-border"} strokeWidth="1" />
          <text x={462} y={y + 3.5} textAnchor="middle" style={{ ...mono, fontSize: 9.5 }} className="fill-muted-foreground">
            ŷ{i + 1}
          </text>
        </g>
      ))}

      {/* layer captions */}
      {[
        { x: 70, t: "input" },
        { x: 250, t: "dense · relu" },
        { x: 430, t: "dense" },
      ].map((l) => (
        <text key={l.t} x={l.x} y={282} textAnchor="middle" style={{ ...mono, fontSize: 9 }} className="fill-muted-foreground/70">
          {l.t}
        </text>
      ))}

      <line x1="12" y1="262" x2="548" y2="262" className="stroke-border/50" strokeWidth="1" />

      <SignalDot path={activePath} animate={on} dur={4.5} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Bell-state circuit                                               */
/* ------------------------------------------------------------------ */
export function CircuitDiagram({ className, animate }: DiagramProps) {
  const reduced = useReducedMotion();
  const on = animate !== false && !reduced;

  return (
    <svg viewBox="0 0 560 300" className={cn("h-full w-full", className)} role="img" aria-label="Two-qubit circuit: Hadamard on the first qubit, then a controlled NOT, producing a Bell state">
      <text x="12" y="34" style={{ ...mono, fontSize: 9, letterSpacing: "0.18em" }} className="fill-muted-foreground">
        BELL CIRCUIT · YAO.JL
      </text>
      <text x="548" y="34" textAnchor="end" style={{ ...mono, fontSize: 9 }} className="fill-muted-foreground/70">
        2 qubits
      </text>

      {/* wires */}
      <line x1="62" y1="120" x2="520" y2="120" className="stroke-border" strokeWidth="1" />
      <line x1="62" y1="200" x2="520" y2="200" className="stroke-border" strokeWidth="1" />

      {/* kets */}
      <text x="50" y="124" textAnchor="end" style={{ ...mono, fontSize: 11 }} className="fill-foreground">
        |0⟩
      </text>
      <text x="50" y="204" textAnchor="end" style={{ ...mono, fontSize: 11 }} className="fill-foreground">
        |0⟩
      </text>

      {/* H gate */}
      <rect x="140" y="100" width="46" height="40" rx="6" className="fill-primary/[0.07] stroke-primary/50" strokeWidth="1" />
      <text x="163" y="125" textAnchor="middle" style={{ ...mono, fontSize: 12 }} className="fill-foreground">
        H
      </text>

      {/* CNOT */}
      <line x1="270" y1="120" x2="270" y2="200" className="stroke-primary/60" strokeWidth="1" />
      <circle cx="270" cy="120" r="4.5" className="fill-primary" />
      <rect x="247" y="180" width="46" height="40" rx="6" className="fill-primary/[0.07] stroke-primary/50" strokeWidth="1" />
      <text x="270" y="205" textAnchor="middle" style={{ ...mono, fontSize: 12 }} className="fill-foreground">
        X
      </text>

      {/* measure */}
      <rect x="380" y="100" width="46" height="40" rx="6" className="fill-muted/40 stroke-border" strokeWidth="1" />
      <text x="403" y="125" textAnchor="middle" style={{ ...mono, fontSize: 11 }} className="fill-foreground">
        M
      </text>
      <rect x="380" y="180" width="46" height="40" rx="6" className="fill-muted/40 stroke-border" strokeWidth="1" />
      <text x="403" y="205" textAnchor="middle" style={{ ...mono, fontSize: 11 }} className="fill-foreground">
        M
      </text>

      {/* outcome annotation */}
      <text x="520" y="124" textAnchor="end" style={{ ...mono, fontSize: 9.5 }} className="fill-ok">
        00 / 11
      </text>

      <line x1="12" y1="252" x2="548" y2="252" className="stroke-border/50" strokeWidth="1" />
      <text x="12" y="278" style={{ ...mono, fontSize: 9 }} className="fill-muted-foreground/70">
        amplitudes: (|00⟩ + |11⟩) / √2
      </text>

      <SignalDot path="M 62 120 H 520" animate={on} dur={5} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 4. loop benchmark                                                   */
/* ------------------------------------------------------------------ */
export function BenchmarkDiagram({ className, animate }: DiagramProps) {
  const reduced = useReducedMotion();
  const on = animate !== false && !reduced;

  return (
    <svg viewBox="0 0 560 300" className={cn("h-full w-full", className)} role="img" aria-label="Bar comparison of the same loop in Julia and Python: Julia finishes far sooner">
      <text x="12" y="34" style={{ ...mono, fontSize: 9, letterSpacing: "0.18em" }} className="fill-muted-foreground">
        SAME LOOP · 10⁷ ITERATIONS
      </text>
      <text x="548" y="34" textAnchor="end" style={{ ...mono, fontSize: 9 }} className="fill-muted-foreground/70">
        wall clock
      </text>

      <line x1="120" y1="86" x2="120" y2="238" className="stroke-border" strokeWidth="1" />

      {/* julia */}
      <text x="108" y="122" textAnchor="end" style={{ ...mono, fontSize: 11 }} className="fill-foreground">
        julia
      </text>
      <rect x="120" y="104" width="52" height="26" rx="4" className="fill-primary/25 stroke-primary/60" strokeWidth="1" />
      <text x="186" y="122" style={{ ...mono, fontSize: 11 }} className="fill-ok">
        ~15 ms
      </text>

      {/* python */}
      <text x="108" y="182" textAnchor="end" style={{ ...mono, fontSize: 11 }} className="fill-foreground">
        python
      </text>
      <rect x="120" y="164" width="392" height="26" rx="4" className="fill-muted/50 stroke-border" strokeWidth="1" />
      <text x="524" y="182" textAnchor="end" style={{ ...mono, fontSize: 11 }} className="fill-warn">
        2.53 s
      </text>

      <line x1="12" y1="238" x2="548" y2="238" className="stroke-border/60" strokeWidth="1" />

      <text x="12" y="266" style={{ ...mono, fontSize: 9 }} className="fill-muted-foreground/70">
        ratio ≈ 170× — one container, one loop, no tricks
      </text>
      <text x="12" y="282" style={{ ...mono, fontSize: 9 }} className="fill-muted-foreground/50">
        numbers move; the gap does not
      </text>

      <SignalDot path="M 120 104 H 172" animate={on} dur={2.6} />
    </svg>
  );
}

export const DIAGRAMS = {
  pipeline: PipelineDiagram,
  network: NetworkDiagram,
  circuit: CircuitDiagram,
  benchmark: BenchmarkDiagram,
} as const;

export type DiagramKind = keyof typeof DIAGRAMS;

export function Diagram({ kind, className }: { kind: DiagramKind; className?: string }) {
  const Comp = DIAGRAMS[kind] ?? PipelineDiagram;
  return <Comp className={className} />;
}
