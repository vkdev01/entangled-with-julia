# ---------------------------------------------------------------------------
# 02 · Differential equations, solved properly
#
#   julia --project=. ai-sciml/ode.jl
#
# ODEProblem → solve → algorithm choice. Requires DifferentialEquations.
# ---------------------------------------------------------------------------

using DifferentialEquations

section(t) = println("\n── ", t, " ", "─"^max(0, 58 - length(t)))

section("the problem")
f(u, p, t) = 0.5 * u
prob = ODEProblem(f, 1.0, (0.0, 4.0))
println(prob)

section("solve it")
sol = solve(prob)
println("retcode      = ", sol.retcode)
println("u(4)         = ", round(sol(4.0); digits = 4))
println("exact e^2    = ", round(exp(2.0); digits = 4))
println("steps taken  = ", length(sol.t))

section("stiffness")
f_stiff(u, p, t) = -1000.0 * (u - cos(t))
prob2 = ODEProblem(f_stiff, 0.0, (0.0, 5.0))

explicit = solve(prob2, Tsit5())
implicit = solve(prob2, Rodas5())
println("Tsit5  steps = ", length(explicit.t))
println("Rodas5 steps = ", length(implicit.t))

section("parameters")
f_param(u, p, t) = p.a * u
for a in (0.25, 0.5, 1.0)
    p = ODEProblem(f_param, 1.0, (0.0, 4.0), (a = a,))
    s = solve(p)
    println("a = ", a, "  →  u(4) = ", round(s(4.0); digits = 4))
end

println("\ndone.")
