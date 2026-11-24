# ---------------------------------------------------------------------------
# 04 · The loop, timed
#
#   julia --project=. experiments/loop_bench.jl
#
# Sums the squares of the first 10^7 integers. Compare with loop_bench.py.
# Requires: BenchmarkTools.
# ---------------------------------------------------------------------------

using BenchmarkTools

section(t) = println("\n── ", t, " ", "─"^max(0, 58 - length(t)))

function sumsq(n)
    s = 0.0
    for i in 1:n
        s += float(i) * float(i)
    end
    return s
end

section("sanity")
println("sumsq(10) = ", sumsq(10))     # 385.0

section("timing")
sumsq(10^7)                          # warm up: compile before you measure

println("@time:")
@time sumsq(10^7)

println("\n@btime:")
@btime sumsq(10^7)

section("why it is fast")
println("allocations: 0 — the loop touches registers and the stack only.")
println("type-stable? ")
@code_warntype sumsq(10)

println("\ndone.")
