# Run every playground script in a fresh session.
#
#   julia --project=. run_all.jl

const SCRIPTS = [
    "basics/indexing_dispatch.jl",
    "basics/types.jl",
    "basics/packages.jl",
    "ai-sciml/flux_nn.jl",
    "ai-sciml/ode.jl",
    "ai-sciml/stats.jl",
    "quantum/bell_yao.jl",
    "quantum/gates.jl",
    "experiments/loop_bench.jl",
    "experiments/stability.jl",
]

const HERE = @__DIR__

for script in SCRIPTS
    path = joinpath(HERE, script)
    println("\n" * "="^64)
    println("running ", script)
    println("="^64)
    try
        run(`$(Base.julia_cmd()) --project=$(HERE) $(path)`)
    catch err
        @warn "script failed" script = script exception = err
    end
end
