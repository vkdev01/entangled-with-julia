# Build this environment from scratch.
#
#   julia --project=. setup.jl
#
# Resolves every dependency by name, so the UUIDs in Project.toml are always the
# ones the registry actually has.

using Pkg

Pkg.activate(@__DIR__)

const DEPS = [
    "BenchmarkTools",
    "DifferentialEquations",
    "Distributions",
    "Flux",
    "HypothesisTests",
    "Statistics",
    "Yao",
]

Pkg.add(DEPS)
Pkg.precompile()

Pkg.status()
println("\nenvironment ready — run `julia --project=. run_all.jl`")
