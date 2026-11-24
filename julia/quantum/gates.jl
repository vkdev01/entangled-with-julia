# ---------------------------------------------------------------------------
# 02 · The gate zoo, mapped
#
#   julia --project=. quantum/gates.jl
#
# Every gate as a matrix, unitarity checks, composition order, and why
# relative phase decides the answer. Requires Yao, LinearAlgebra.
# ---------------------------------------------------------------------------

using Yao, LinearAlgebra

section(t) = println("\n── ", t, " ", "─"^max(0, 58 - length(t)))

section("gates are matrices")
println("X = ", mat(X))
println("Z = ", mat(Z))
println("H = ", round.(real.(mat(H)); digits = 4))

section("unitarity")
I2 = Matrix{ComplexF64}(I, 2, 2)
for (name, g) in [("X", X), ("Y", Y), ("Z", Z), ("H", H), ("S", S), ("T", T)]
    U = mat(g)
    println(name, "  U†U = I : ", isapprox(U' * U, I2; atol = 1e-12))
end

section("compose")
bell = chain(2, put(1 => H), control(1, 2 => X))
U = mat(bell)
println("size(mat(bell)) = ", size(U))
println("amplitudes      = ", round.(abs.(statevec(zero_state(2) |> bell)); digits = 3))

section("order matters")
a = zero_state(1) |> chain(1, put(1 => H), put(1 => Z))
b = zero_state(1) |> chain(1, put(1 => Z), put(1 => H))
println("H then Z = ", round.(real.(statevec(a)); digits = 3))
println("Z then H = ", round.(real.(statevec(b)); digits = 3))

section("relative phase is the computation")
plus  = zero_state(1) |> put(1 => H)
minus = zero_state(1) |> chain(1, put(1 => H), put(1 => Z))
println("plus     = ", round.(real.(statevec(plus)); digits = 3))
println("minus    = ", round.(real.(statevec(minus)); digits = 3))
println("H on plus  = ", round.(abs2.(statevec(plus  |> put(1 => H))); digits = 3))
println("H on minus = ", round.(abs2.(statevec(minus |> put(1 => H))); digits = 3))

section("rotations reproduce the Paulis")
println("Rx(π) ≈ -i X : ", isapprox(mat(Rx(π)), -im * mat(X); atol = 1e-12))
println("Rz(π) ≈ -i Z : ", isapprox(mat(Rz(π)), -im * mat(Z); atol = 1e-12))

println("\ndone.")
