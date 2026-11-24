# ---------------------------------------------------------------------------
# 02 · A neural net you can actually read
#
#   julia --project=. ai-sciml/flux_nn.jl
#
# Fits y = 0.5x + 0.2 sin(3x) with a 1-16-16-1 MLP, then solves an ODE with
# the same machinery. Requires: Flux, DifferentialEquations.
# ---------------------------------------------------------------------------

using Flux
using Random

Random.seed!(42)

section(t) = println("\n── ", t, " ", "─"^max(0, 58 - length(t)))

# --- data -------------------------------------------------------------------
section("data")
xs = Float32.(reshape(range(-2.0f0, 2.0f0; length = 64), 1, :))   # features × batch
ys = @. 0.5f0 * xs + 0.2f0 * sin(3f0 * xs)

println("size(xs) = ", size(xs))
println("size(ys) = ", size(ys))

# --- model ------------------------------------------------------------------
section("model")
model = Chain(
    Dense(1 => 16, relu),
    Dense(16 => 16, relu),
    Dense(16 => 1),
)

loss(m, x, y) = Flux.mse(m(x), y)

println(model)
println("parameters: ", sum(length, Flux.trainables(model)))

# --- training ---------------------------------------------------------------
section("training")
opt_state = Flux.setup(Adam(0.01), model)

before = loss(model, xs, ys)
println("loss before: ", round(before; digits = 4))

for _ in 1:200
    grads = Flux.gradient(m -> loss(m, xs, ys), model)
    Flux.update!(opt_state, model, grads[1])
end

after = loss(model, xs, ys)
println("loss after:  ", round(after; digits = 4))
println("prediction at x = 1.5: ", model(Float32[1.5]))
println("true value:            ", 0.5f0 * 1.5f0 + 0.2f0 * sin(3f0 * 1.5f0))

# --- the same machinery on an ODE -------------------------------------------
section("from net to ODE")

try
    using DifferentialEquations

    f(u, p, t) = 0.5 * u
    prob = ODEProblem(f, 1.0, (0.0, 4.0))
    sol = solve(prob)

    println("u(4) from solver = ", round(sol(4.0); digits = 4))
    println("e^2              = ", round(exp(2.0); digits = 4))

    # a neural network as the vector field: the forward pass is `solve`
    net = Chain(Dense(1 => 16, tanh), Dense(16 => 1))
    nn_ode(u, p, t) = net(u)
    nnprob = ODEProblem(nn_ode, [1.0f0], (0.0f0, 1.0f0), net)
    pred = solve(nnprob, Tsit5(), saveat = 0.1)
    println("neural ODE points = ", length(pred.u))
catch err
    @warn "DifferentialEquations.jl not installed — skipping ODE section" exception = err
end

println("\ndone.")
