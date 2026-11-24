# ---------------------------------------------------------------------------
# 03 · Two qubits, one promise
#
#   julia --project=. quantum/bell_yao.jl
#
# Builds a Bell state with Yao.jl, prints amplitudes, measures 1000 shots,
# then generalises to an n-qubit GHZ state.
# ---------------------------------------------------------------------------

using Yao

section(t) = println("\n── ", t, " ", "─"^max(0, 58 - length(t)))

# --- circuit ----------------------------------------------------------------
section("bell circuit")

circuit = chain(2, put(1 => H), control(1, 2 => X))   # H on q1, then CNOT(1 → 2)
state = zero_state(2) |> circuit

println(state)

ψ = statevec(state)
println("amplitudes:    ", round.(ψ; digits = 4))
println("probabilities: ", round.(abs2.(ψ); digits = 3))

# ordering: index 1 = |00⟩, index 4 = |11⟩ (qubit 1 is the most significant bit)
println("norm:          ", round(sum(abs2, ψ); digits = 6))

# --- separable vs entangled -------------------------------------------------
section("separable vs entangled")

separable = zero_state(2) |> chain(2, put(1 => H))
println("separable: ", round.(abs2.(statevec(separable)); digits = 3))

phased = zero_state(2) |> chain(2, put(1 => H), put(1 => Z))
println("phased:    ", round.(real.(statevec(phased)); digits = 3))

# --- measurement ------------------------------------------------------------
section("measurement (1000 shots)")

results = measure(state; nshots = 1000)

counts = Dict{Int, Int}()
for r in results
    counts[r] = get(counts, r, 0) + 1
end

println(sort(collect(counts)))          # 0b00 = 0, 0b11 = 3
println("distinct outcomes: ", length(counts))

# --- GHZ --------------------------------------------------------------------
section("GHZ state")

ghz(n) = chain(n, put(1 => H), [control(1, i => X) for i in 2:n]...)

ψ3 = statevec(zero_state(3) |> ghz(3))
println("nonzero amplitudes: ", count(!iszero, ψ3))
println("p(|000⟩): ", round(abs2(ψ3[1]); digits = 3))
println("p(|111⟩): ", round(abs2(ψ3[end]); digits = 3))

println("\ndone.")
