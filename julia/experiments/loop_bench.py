"""The same loop, in Python, for comparison with loop_bench.jl.

    python3 experiments/loop_bench.py
"""

import time


def sumsq(n):
    s = 0.0
    for i in range(1, n + 1):
        s += float(i) * float(i)
    return s


if __name__ == "__main__":
    print("sumsq(10) =", sumsq(10))          # 385.0

    start = time.perf_counter()
    total = sumsq(10_000_000)
    elapsed = (time.perf_counter() - start) * 1000

    print(total)
    print(f"{elapsed:.1f} ms")
