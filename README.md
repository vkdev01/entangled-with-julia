# entangled-with-julia

> A runnable Julia lab — notes, tutorials and experiments — wrapped in a technical
> reading UI built with Next.js, Tailwind and shadcn/ui. The site calls itself
> **julia/playground**; the repo is the pun. The site calls itself
> **julia/playground**; the repo is the pun.

Every snippet in this repo is a real file you can run. Every code block in the notes
has an expected output. Every expected output has a gotcha.

```
basics → dispatch → Flux → Yao → benchmarks
```

---

## What's inside

Four modules, four starter notes. Each note has frontmatter, a witty intro, runnable
Julia with comments, the output you should see, and a **Gotchas & takeaways** section.

| Module | Note | What it teaches |
| --- | --- | --- |
| `01` basics | [Everything Starts at One](content/basics/indexing-and-dispatch.mdx) | 1-based indexing, `begin`/`end`, column-major order, multiple dispatch |
| `02` ai-sciml | [A Neural Net You Can Actually Read](content/ai-sciml/flux-neural-net.mdx) | a 321-parameter MLP in Flux, `gradient` + `update!`, Neural ODEs |
| `03` quantum | [Two Qubits, One Promise](content/quantum/bell-state-yao.mdx) | a Bell state in Yao.jl, amplitudes, measurement, GHZ |
| `04` experiments | [The Loop, Timed](content/experiments/julia-vs-python.mdx) | a Julia loop vs a Python loop, with the honest caveats |

## Repository layout

```
.
├── app/                      # Next.js App Router
│   ├── page.tsx              # hero + module grid + setup
│   ├── notes/
│   │   ├── page.tsx          # the shelf: every note
│   │   └── [module]/[slug]/  # the reader (two columns, step rail, diagram card)
│   └── globals.css           # design tokens + prose + code-block styling
├── components/
│   ├── ui/                   # shadcn/ui primitives (button, badge, collapsible, …)
│   ├── diagrams.tsx          # the four SVG diagrams + the travelling signal dot
│   ├── side-nav.tsx          # 288px sticky nav, module counters, progress
│   ├── step-rail.tsx         # numbered step chips with scroll-spy
│   ├── diagram-card.tsx      # sticky 540px card + metrics strip
│   └── mdx-components.tsx    # <Callout> <KeyIdea> <Gotchas> <FileRef>
├── content/                  # ← the course itself, one folder per module
│   ├── basics/               # 1-based indexing & multiple dispatch
│   ├── ai-sciml/             # Flux neural network / SciML
│   ├── quantum/              # Yao.jl Bell state
│   └── experiments/          # benchmark: Julia loop vs Python
├── julia/                    # a real Julia project, mirroring the notes
│   ├── Project.toml
│   ├── run_all.jl
│   ├── basics/indexing_dispatch.jl
│   ├── ai-sciml/flux_nn.jl
│   ├── quantum/bell_yao.jl
│   └── experiments/loop_bench.{jl,py}
└── lib/                      # content loading, MDX pipeline, progress hook
```

## Quickstart

### 1. The site

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static build; every note is pre-rendered
```

Node 20+. The site reads `content/**/*.mdx` at build time — no database, no CMS.

### 2. The Julia side

```bash
juliaup add release                 # Julia 1.10+
cd julia
julia --project=. -e 'using Pkg; Pkg.instantiate()'
julia --project=. basics/indexing_dispatch.jl
```

`Project.toml` pins Flux, Yao, DifferentialEquations and BenchmarkTools. The first
`instantiate` downloads a few hundred MB — that is the price of a real numerical stack.

Run everything in sequence:

```bash
julia --project=. run_all.jl
```

Only the basics script needs nothing but the standard library, which is why CI runs it
without instantiating the heavy project.

## Writing a note

Drop a `.mdx` file into one of the four `content/` folders. The filename becomes the
slug. Frontmatter is required:

```yaml
---
title: "Everything Starts at One"
date: "2026-11-24"
category: "basics"
tags: ["indexing", "multiple-dispatch"]
summary: "One or two sentences shown on cards and in search results."
caption: "Optional — the line under the diagram."
level: "beginner"          # optional
runtime: "julia 1.10+"     # optional, shown in the sidebar card
steps: ["Step one", "Step two"]   # the numbered chips; one per h2, in order
diagram: "pipeline"        # pipeline | network | circuit | benchmark
metrics:                   # the 3-cell strip on the diagram card
  - { label: "first index", value: "1", tint: "ok" }
  - { label: "dispatch cost", value: "0 ns", tint: "ok" }
  - { label: "python habits", value: "3", tint: "warn" }
---
```

`tint` is one of `ok`, `warn`, `bad`, `neutral` — and those tints are only ever used on
numbers, by design.

### Code blocks

````mdx
```julia title="basics/matrices.jl"
A = reshape(1:9, 3, 3)
println(A[1, 3])   # 7
```
````

`title="…"` renders the header row. Use ` ```text title="expected output" ` for outputs —
those blocks get a dashed border, a green dot and a `›` gutter instead of line numbers.

### Components available in MDX

```mdx
<KeyIdea>A violet-bordered callout for the one thing to remember.</KeyIdea>

<Callout variant="warn" title="Column-major is not a detail">…</Callout>
<Callout variant="tip">…</Callout>
<Callout variant="danger">…</Callout>

<Gotchas>
- Bullet one.
- Bullet two.
</Gotchas>

<FileRef path="julia/basics/indexing_dispatch.jl" />
```

Inline `$math$` is rendered with KaTeX, tables with GFM.

## Design system

Dark first. Light mode is warm paper, never grey.

| Token | Dark | Light |
| --- | --- | --- |
| background | `hsl(231 26% 7%)` | `hsl(40 33% 97%)` |
| card | `hsl(230 22% 10%)` | `hsl(40 30% 99.5%)` |
| border | `hsl(230 14% 27%)`, used at 60–70% opacity | `hsl(36 14% 80%)` |
| primary | `hsl(259 90% 68%)` | `hsl(259 90% 58%)` |
| signal | `hsl(24 94% 50%)` — **only** for motion and active paths | same |
| ok / warn / bad | numbers only | numbers only |

- **Type:** system sans at 13.5–15px for prose. Every number, unit and counter is
  monospace with tabular figures (`.num`). Section labels are 10–11px, uppercase,
  `0.16em` tracking, medium weight — never bold.
- **Shape:** `0.8rem` radius, 1px borders, no drop shadows. The only shadow is a soft
  glow ring of 4px at 14% primary on the active element.
- **Shell:** 56px sticky blurred header, 288px sticky left nav with collapsible module
  groups (each with an `x/y` mono counter and a thin progress bar pinned to the top),
  main column capped at 1120px.
- **Motion:** one dot travelling along the highlighted path in each diagram. Nothing
  else animates, and it respects `prefers-reduced-motion`.

Progress (`x/y` in the nav, "mark as read") is stored in `localStorage` — the site is
fully static and has no backend.

## Honest benchmarks

The benchmark note compares a Julia `for` loop against an identical Python loop. The
Python number in it (≈2.53 s for 10⁷ iterations) was measured on a 2-vCPU container.
The Julia figure (≈15 ms) is a typical laptop-class result, not a measurement taken on
the same machine — the note says so, in the note. Re-run both scripts and trust your
own numbers:

```bash
cd julia
julia --project=. experiments/loop_bench.jl
python3 experiments/loop_bench.py
```

## Roadmap

- [ ] statistics & probability: `Distributions.jl`, `StatsBase`, resampling
- [ ] scientific computing: `ModelingToolkit`, units, `Plots`/`Makie`
- [ ] deep learning: convolutions, `Optimisers`, training loops that scale
- [ ] quantum: Grover, QAOA, noise models with `YaoExtensions`
- [ ] experiments: `@turbo` vs plain loops, GPU vs CPU with `CUDA.jl`

## License

MIT — see [LICENSE](LICENSE).
