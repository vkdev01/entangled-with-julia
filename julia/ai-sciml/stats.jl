# ---------------------------------------------------------------------------
# 03 · Coin flips, honestly
#
#   julia --project=. ai-sciml/stats.jl
#
# Distributions as values, sampling, the CLT, and a hypothesis test you
# already know the answer to. Requires Distributions, HypothesisTests.
# ---------------------------------------------------------------------------

using Distributions, Statistics, Random, HypothesisTests

Random.seed!(7)
section(t) = println("\n── ", t, " ", "─"^max(0, 58 - length(t)))

section("distributions are objects")
d = Normal(0, 1)
println("mean/std   = ", mean(d), " / ", std(d))
println("cdf(0)     = ", cdf(d, 0.0))
println("q(0.975)   = ", round(quantile(d, 0.975); digits = 3))

b = Binomial(10, 0.5)
println("pdf(b, 5)  = ", pdf(b, 5))
println("mean/var   = ", mean(b), " / ", var(b))

section("sample, then describe")
draws = rand(d, 100_000)
println("mean       = ", round(mean(draws); digits = 3))
println("std        = ", round(std(draws); digits = 3))
println("std error  = ", round(std(draws) / sqrt(length(draws)); digits = 4))

section("the CLT, simulated")
source = Exponential(1.0)
means = [mean(rand(source, 30)) for _ in 1:10_000]
println("mean of means = ", round(mean(means); digits = 3))
println("spread        = ", round(std(means); digits = 3))
println("theory σ/√n   = ", round(1 / sqrt(30); digits = 3))

section("test a claim")
sample = rand(Normal(0.5, 1.0), 200)
t1 = OneSampleTTest(sample, 0.5)
println("p (true H0)   = ", round(pvalue(t1); digits = 3))
ci = confint(t1)
println("95% CI        = ", round(ci[1]; digits = 3), " .. ", round(ci[2]; digits = 3))

t2 = OneSampleTTest(sample, 1.5)
println("p (false H0)  = ", round(pvalue(t2); sigdigits = 3))

println("\ndone.")
