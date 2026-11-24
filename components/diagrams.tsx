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
  lattice: LatticeDiagram,
  curve: CurveDiagram,
  dist: DistDiagram,
} as const;

export type DiagramKind = keyof typeof DIAGRAMS;

export function Diagram({ kind, className }: { kind: DiagramKind; className?: string }) {
  const Comp = DIAGRAMS[kind] ?? PipelineDiagram;
  return <Comp className={className} />;
}

/* ------------------------------------------------------------------ */
/* 5. type lattice                                                     */
/* ------------------------------------------------------------------ */
export function LatticeDiagram({ className, animate }: DiagramProps) {
  const reduced = useReducedMotion();
  const on = animate !== false && !reduced;

  type N = { x: number; y: number; label: string; active?: boolean };
  const nodes: N[] = [
    { x: 280, y: 34, label: "Any" },
    { x: 280, y: 96, label: "Number", active: true },
    { x: 170, y: 158, label: "Real", active: true },
    { x: 390, y: 158, label: "Integer" },
    { x: 170, y: 220, label: "AbstractFloat", active: true },
    { x: 390, y: 220, label: "Int64" },
  ];
  const edges: [number, number][] = [
    [0, 1],
    [1, 2],
    [1, 3],
    [2, 4],
    [3, 5],
  ];
  const W = 124;
  const H = 30;

  return (
    <svg viewBox="0 0 560 290" className={cn("h-full w-full", className)} role="img" aria-label="Julia's type lattice: concrete types sit under abstract types, and dispatch picks the most specific method">
      <text x="12" y="24" style={{ ...mono, fontSize: 9, letterSpacing: "0.18em" }} className="fill-muted-foreground">
        TYPE LATTICE
      </text>
      <text x="548" y="24" textAnchor="end" style={{ ...mono, fontSize: 9 }} className="fill-muted-foreground/70">
        most specific wins
      </text>

      {edges.map(([a, b]) => (
        <line
          key={`${a}-${b}`}
          x1={nodes[a].x}
          y1={nodes[a].y + H / 2}
          x2={nodes[b].x}
          y2={nodes[b].y - H / 2}
          className={nodes[a].active && nodes[b].active ? "stroke-primary/45" : "stroke-border/70"}
          strokeWidth="1"
          strokeDasharray={nodes[a].active && nodes[b].active ? undefined : "3 3"}
        />
      ))}

      {nodes.map((n) => (
        <g key={n.label}>
          <rect
            x={n.x - W / 2}
            y={n.y - H / 2}
            width={W}
            height={H}
            rx={8}
            className={n.active ? "fill-primary/[0.08] stroke-primary/50" : "fill-muted/30 stroke-border/80"}
            strokeWidth="1"
          />
          <text x={n.x} y={n.y + 4} textAnchor="middle" style={{ ...mono, fontSize: 11 }} className={n.active ? "fill-foreground" : "fill-muted-foreground"}>
            {n.label}
          </text>
        </g>
      ))}

      <text x="12" y="278" style={{ ...mono, fontSize: 9 }} className="fill-muted-foreground/70">
        dispatch walks down to the leaf, then stops
      </text>

      <SignalDot path="M 280 49 L 280 81 L 170 143 L 170 205" animate={on} dur={5} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 6. ODE solution curve                                               */
/* ------------------------------------------------------------------ */
export function CurveDiagram({ className, animate }: DiagramProps) {
  const reduced = useReducedMotion();
  const on = animate !== false && !reduced;

  // u(t) = e^{0.5t}, plotted in a 420x200 box
  const pts: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const t = (i / 40) * 4;
    const u = Math.exp(0.5 * t);
    const x = 90 + (t / 4) * 400;
    const y = 240 - ((u - 1) / (Math.exp(2) - 1)) * 170;
    pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  const curve = `M ${pts.join(" L ")}`;

  return (
    <svg viewBox="0 0 560 300" className={cn("h-full w-full", className)} role="img" aria-label="Solution curve of du/dt = 0.5u rising exponentially, with time steps marked by the solver">
      <text x="12" y="34" style={{ ...mono, fontSize: 9, letterSpacing: "0.18em" }} className="fill-muted-foreground">
        du/dt = 0.5u · u(0) = 1
      </text>
      <text x="548" y="34" textAnchor="end" style={{ ...mono, fontSize: 9 }} className="fill-muted-foreground/70">
        Tsit5
      </text>

      {/* axes */}
      <line x1="90" y1="60" x2="90" y2="240" className="stroke-border" strokeWidth="1" />
      <line x1="90" y1="240" x2="510" y2="240" className="stroke-border" strokeWidth="1" />
      <text x="82" y="66" textAnchor="end" style={{ ...mono, fontSize: 9 }} className="fill-muted-foreground/70">
        u
      </text>
      <text x="514" y="244" style={{ ...mono, fontSize: 9 }} className="fill-muted-foreground/70">
        t
      </text>

      {/* gridlines */}
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={90} y1={240 - f * 170} x2="510" y2={240 - f * 170} className="stroke-border/40" strokeWidth="1" strokeDasharray="2 4" />
      ))}

      <path d={curve} className="fill-none stroke-primary/60" strokeWidth="1.6" />

      {/* solver steps */}
      {[0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4].map((t) => {
        const u = Math.exp(0.5 * t);
        const x = 90 + (t / 4) * 400;
        const y = 240 - ((u - 1) / (Math.exp(2) - 1)) * 170;
        return <circle key={t} cx={x} cy={y} r="2.6" className="fill-card stroke-primary/70" strokeWidth="1" />;
      })}

      <text x="96" y="232" style={{ ...mono, fontSize: 9 }} className="fill-muted-foreground/70">
        1
      </text>
      <text x="494" y="232" textAnchor="end" style={{ ...mono, fontSize: 9 }} className="fill-ok">
        e² ≈ 7.39
      </text>
      <text x="12" y="282" style={{ ...mono, fontSize: 9 }} className="fill-muted-foreground/70">
        adaptive steps · error controlled per step
      </text>

      <SignalDot path={curve} animate={on} dur={6} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 7. sampling distribution                                            */
/* ------------------------------------------------------------------ */
export function DistDiagram({ className, animate }: DiagramProps) {
  const reduced = useReducedMotion();
  const on = animate !== false && !reduced;

  const bars = 26;
  const xs = Array.from({ length: bars }, (_, i) => i);
  const heights = xs.map((i) => {
    const z = (i - (bars - 1) / 2) / 3.4;
    return Math.exp(-0.5 * z * z);
  });
  const max = Math.max(...heights);
  const baseY = 232;
  const barW = 14;
  const gap = 2;
  const x0 = 84;

  return (
    <svg viewBox="0 0 560 300" className={cn("h-full w-full", className)} role="img" aria-label="A histogram of samples from a normal distribution with the density curve overlaid">
      <text x="12" y="34" style={{ ...mono, fontSize: 9, letterSpacing: "0.18em" }} className="fill-muted-foreground">
        N(μ, σ²) · 10⁵ SAMPLES
      </text>
      <text x="548" y="34" textAnchor="end" style={{ ...mono, fontSize: 9 }} className="fill-muted-foreground/70">
        Distributions.jl
      </text>

      <line x1="70" y1={baseY} x2="520" y2={baseY} className="stroke-border" strokeWidth="1" />

      {xs.map((i) => {
        const h = (heights[i] / max) * 150;
        const x = x0 + i * (barW + gap);
        const inside = Math.abs(i - (bars - 1) / 2) < 2.2;
        return (
          <rect
            key={i}
            x={x}
            y={baseY - h}
            width={barW}
            height={h}
            rx={2}
            className={inside ? "fill-primary/35 stroke-primary/40" : "fill-muted/50 stroke-border/60"}
            strokeWidth="0.8"
          />
        );
      })}

      {/* density outline */}
      <path
        d={
          "M " +
          xs
            .map((i) => {
              const h = (heights[i] / max) * 150;
              const x = x0 + i * (barW + gap) + barW / 2;
              return `${x} ${baseY - h - 4}`;
            })
            .join(" L ")
        }
        className="fill-none stroke-primary/50"
        strokeWidth="1.2"
      />

      {/* mean marker */}
      <line x1={x0 + (bars / 2) * (barW + gap)} y1={baseY - 158} x2={x0 + (bars / 2) * (barW + gap)} y2={baseY} className="stroke-signal/40" strokeWidth="1" strokeDasharray="3 3" />
      <text x={x0 + (bars / 2) * (barW + gap) + 6} y={baseY - 150} style={{ ...mono, fontSize: 9 }} className="fill-muted-foreground/70">
        μ
      </text>

      <text x="70" y="262" style={{ ...mono, fontSize: 9 }} className="fill-muted-foreground/70">
        σ = 1.0
      </text>
      <text x="520" y="262" textAnchor="end" style={{ ...mono, fontSize: 9 }} className="fill-muted-foreground/70">
        n = 100 000
      </text>
      <text x="12" y="284" style={{ ...mono, fontSize: 9 }} className="fill-muted-foreground/50">
        sample, then describe — never the other way round
      </text>

      <SignalDot
        path={`M ${x0 + 2 * (barW + gap)} ${baseY - (heights[2] / max) * 150 - 6} Q ${x0 + (bars / 2) * (barW + gap)} ${baseY - 168} ${x0 + (bars - 3) * (barW + gap)} ${baseY - (heights[bars - 3] / max) * 150 - 6}`}
        animate={on}
        dur={5.5}
      />
    </svg>
  );
}
