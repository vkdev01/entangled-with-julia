# ---------------------------------------------------------------------------
# 01 · Everything starts at one
#
#   julia --project=. basics/indexing_dispatch.jl
#
# Covers: 1-based indexing, begin/end, column-major order, multiple dispatch.
# ---------------------------------------------------------------------------

using InteractiveUtils

section(t) = println("\n── ", t, " ", "─"^max(0, 58 - length(t)))

# --- indexing ---------------------------------------------------------------
section("indexing starts at one")

v = [10, 20, 30]
println("v          = ", v)
println("v[1]       = ", v[1])       # first, not zeroth
println("v[end]     = ", v[end])     # symbolic last index
println("v[2:3]     = ", v[2:3])     # ranges are inclusive
println("eachindex  = ", eachindex(v))

# out of bounds is a diagnosis, not a mystery
try
    v[0]
catch err
    println("v[0]       → ", typeof(err))
end

# --- matrices ---------------------------------------------------------------
section("column-major matrices")

A = reshape(1:9, 3, 3)              # filled column by column
println("A          = ", A)
println("A[1, 3]    = ", A[1, 3])   # 7 — top of the third column
println("A[3, 1]    = ", A[3, 1])   # 3 — bottom of the first
println("A[2, :]    = ", A[2, :])   # whole row
println("size(A)    = ", size(A))

# --- multiple dispatch ------------------------------------------------------
section("multiple dispatch")

abstract type Shape end

struct Circle <: Shape
    r::Float64
end

struct Rect <: Shape
    w::Float64
    h::Float64
end

area(c::Circle) = π * c.r^2
area(r::Rect)   = r.w * r.h
area(shapes::Vector{<:Shape}) = sum(area, shapes)

shapes = Shape[Circle(1.0), Rect(2.0, 3.0)]

println("area(circle)   = ", round(area(shapes[1]); digits = 4))
println("area(rect)     = ", area(shapes[2]))
println("area(all)      = ", round(area(shapes); digits = 4))
println("methods(area)  → ", length(methods(area)), " methods, one name")

# which method did the compiler pick?
println("@which         → ", @which area(Circle(1.0)))

# --- specialisation ---------------------------------------------------------
section("one method, many native versions")

f(x) = x^2 + 1
println("f(3)       = ", f(3))
println("f(3.0)     = ", f(3.0))
println("f(3 // 1)  = ", f(3 // 1))
println("methods(f) = ", length(methods(f)), " (three compiled specialisations)")

println("\ndone.")
