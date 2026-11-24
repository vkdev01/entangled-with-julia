# ---------------------------------------------------------------------------
# 02 · Types are cheap, use more of them
#
#   julia --project=. basics/types.jl
#
# Abstract vs concrete types, parametric structs, dispatch on the lattice,
# and the shape of a type instability.
# ---------------------------------------------------------------------------

using InteractiveUtils

section(t) = println("\n── ", t, " ", "─"^max(0, 58 - length(t)))

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
area(shapes::AbstractVector{<:Shape}) = sum(area, shapes)

section("abstract vs concrete")
println("isconcretetype(Shape)  = ", isconcretetype(Shape))
println("isconcretetype(Circle) = ", isconcretetype(Circle))
println("Circle <: Shape        = ", Circle <: Shape)
println("supertype(Circle)      = ", supertype(Circle))
println("sizeof(Circle(1.0))    = ", sizeof(Circle(1.0)))

section("the lattice")
println("Real <: Number          = ", Real <: Number)
println("Int64 <: Integer        = ", Int64 <: Integer)
println("Int64 <: AbstractFloat  = ", Int64 <: AbstractFloat)
println("Float64 <: Real <: Number = ", Float64 <: Real <: Number)

section("parametric structs")
struct Point{T}
    x::T
    y::T
end

p = Point(1, 2)
r = Point(1, 2.0)                 # promotes
println("typeof(p) = ", typeof(p))
println("typeof(r) = ", typeof(r))
println("sizeof(p) = ", sizeof(p))

section("dispatch")
shapes = Shape[Circle(1.0), Rect(2.0, 3.0)]
println("area(all)      = ", round(area(shapes); digits = 4))
println("methods(area)  = ", length(methods(area)))

section("type stability")
unstable(x) = x > 0 ? 1 : 1.0
stable(x)   = x > 0 ? 1.0 : 1.0

println("unstable(1)      = ", unstable(1))
println("return_types     = ", Base.return_types(unstable, (Int,)))
println("stable types     = ", Base.return_types(stable, (Int,)))

section("function barrier")
asfloat(x::Int)     = Float64(x)
asfloat(x::Float64) = x

function total(xs::Vector{Any})
    acc = 0.0
    for x in xs
        acc += asfloat(x)
    end
    acc
end

println("total(Any[1, 2.0, 3]) = ", total(Any[1, 2.0, 3]))

println("\ndone.")
