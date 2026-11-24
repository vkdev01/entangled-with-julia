# ---------------------------------------------------------------------------
# 02 · The 100× bug you can't see
#
#   julia --project=. experiments/stability.jl
#
# One reassignment, two orders of magnitude. Requires BenchmarkTools.
# ---------------------------------------------------------------------------

using BenchmarkTools, InteractiveUtils

section(t) = println("\n── ", t, " ", "─"^max(0, 58 - length(t)))

# the bug: s is Int, then Float64
function bad(n)
    s = 0
    for i in 1:n
        s += i * 0.5
    end
    return s
end

# the fix: one character
function good(n)
    s = 0.0
    for i in 1:n
        s += i * 0.5
    end
    return s
end

section("same answer")
println("bad(10)  = ", bad(10))
println("good(10) = ", good(10))

section("diagnose")
println("return_types(bad)  = ", Base.return_types(bad, (Int,)))
println("return_types(good) = ", Base.return_types(good, (Int,)))

section("measure")
println("@btime bad(10_000)")
@btime bad(10_000)
println("\n@btime good(10_000)")
@btime good(10_000)

section("function barrier")
asfloat(x::Int)     = Float64(x)
asfloat(x::Float64) = x

function total(xs)
    acc = 0.0
    for x in xs
        acc += asfloat(x)
    end
    acc
end

println("total(Any[1, 2.0, 3]) = ", total(Any[1, 2.0, 3]))
xs = rand(10_000)
println("@btime on a Float64 vector:")
@btime sum(x -> x^2, $xs)

println("\ndone.")
