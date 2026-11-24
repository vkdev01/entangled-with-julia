# ---------------------------------------------------------------------------
# 03 · Your project is a folder
#
#   julia --project=. basics/packages.jl
#
# Reads the active environment and reports it. Does not install anything —
# mutating an environment from a teaching script is rude.
# ---------------------------------------------------------------------------

using Pkg

section(t) = println("\n── ", t, " ", "─"^max(0, 58 - length(t)))

section("active environment")
println("project = ", Base.active_project())
println("depot   = ", first(DEPOT_PATH))

section("status")
Pkg.status(; mode = PKGMODE_PROJECT)

section("manifest")
Pkg.status(; mode = PKGMODE_MANIFEST)

section("what to commit")
println("applications  → Project.toml + Manifest.toml")
println("libraries     → Project.toml only")
println("this repo     → Project.toml (scripts, not a published package)")

println("\ndone.")
