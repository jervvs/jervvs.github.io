---
title: "Chapter 1 — The CPU, Fetch-Execute, and the Memory Hierarchy"
date: 2026-07-12
description: "ALU and control flow, the fetch-execute cycle, the stored-program model, and the latency ladder."
draft: true
series: "cs-foundations"
order: 2
tags: ["learning", "cs-foundations", "cpu", "memory"]
---

> How a pile of gates becomes a machine that runs *programs*.
> Builds directly on Chapter 0 (bits, gates, memory, binary).

## How one piece of hardware does many operations

A CPU must add, subtract, compare, move data — not one fixed thing. The mechanism:

Alongside the **data**, the CPU is fed an **instruction**, whose **opcode** bits act
as *selector lines*.

- The **ALU** (Arithmetic Logic Unit) physically computes *many* results at once —
  add, subtract, AND, OR, compare — in parallel.
- A **multiplexer** (a gate-built "selector switch") uses the opcode bits to choose
  *which* of those results actually comes out.

So operations are **not rewired** each cycle. **All of them exist in silicon
simultaneously; the instruction selects which one you see.** (`0001` → route the
adder's output; `0110` → route the comparator's output, etc.)

## The Program Counter

If a program is a list of instructions in memory, the CPU needs to know *which is
next*. That's the **Program Counter (PC)** — on x86, the **instruction pointer
(RIP/EIP)**. It holds the **memory address** of the next instruction.

**All control flow is just writing to the PC:**

| Construct | What happens to the PC |
|-----------|------------------------|
| straight-line code | auto-increments to the next instruction |
| loop | an instruction sets PC *back* to an earlier address |
| `if` | *conditionally* set PC (jump to else-branch, or fall through) |
| function call | save the **return address** (PC to resume at) onto the **stack**, then jump |
| `return` | restore PC from the saved return address |

Every `if`/`for`/`while`/call/return in every language compiles down to PC
manipulation. Saving return addresses on the stack is the **seed of the call stack** —
and of the stack traces you read when debugging.

## The fetch-execute cycle — the CPU's heartbeat

Everything the CPU does is this loop, billions of times per second:

1. **Fetch** — read the instruction at the address in the PC (from cache, usually).
2. **Decode** — interpret the opcode; identify operation + operands (the multiplexer
   selection).
3. **Execute** — the ALU / memory unit / branch unit does the work.
4. **Writeback** — store the result to a register or memory.
5. **Advance the PC** — normally +1 instruction; on a branch/jump, set PC to target.

A "3 GHz CPU" runs this ~3 billion times/second. Two speedups layer on top:

- **Pipelining** — stages 1–5 overlap across many instructions, like an assembly
  line. This is *why branch mispredictions hurt* (see interlude).
- **Cache hierarchy** — small fast memory near the CPU, because RAM is ~100× slower
  than the CPU and would otherwise starve it.

## The stored-program (von Neumann) model

**A program is physically just a pattern of bits sitting in memory.** Some bit
patterns are instructions; the CPU points its PC at them and runs fetch-execute.
"Running the program" = the PC walking through those addresses while registers and
memory change along the way.

The profound part: **instructions and data are the same kind of thing (bits) in the
same memory.** Nothing intrinsically marks a byte as "code" — it's code *because the
PC points at it and the CPU decodes it*. Consequences:

- a **compiler** (a program) can write another program
- **buffer overflows** can turn attacker-supplied *data* into *executed code*
- "everything is just bits in memory" is the sentence the whole stack rests on

## The memory / latency hierarchy

You **cannot** have "big AND fast." Two independent reasons:

1. **Cost/density.** Fast SRAM is ~6 transistors/bit; DRAM is ~1 transistor +
   capacitor/bit. DRAM packs far more bits per dollar and per mm². All-SRAM main
   memory would be enormous and absurdly expensive.
2. **Physics (the real kicker).** Signals travel ~30 cm/ns. At multi-GHz clocks a
   signal crosses only a few cm per cycle. A physically large memory has far corners
   that are simply *farther away* → **bigger = farther = slower**, unavoidably.

So designers keep **L1 tiny (~32–64 KB) on purpose** (a bigger L1 would be a slower
L1) and grow the lower, slower levels. The result is a **latency ladder**, each rung
~10× slower and ~10× bigger than the one above:

```
registers → L1 → L2 → L3 → RAM → SSD → disk → network
```

Rough latencies worth memorizing:

| Level | Latency | Ratio |
|-------|---------|-------|
| L1 cache | ~1 ns | 1 |
| RAM | ~100 ns | 100 |
| SSD | ~100 µs | 100,000 |
| spinning disk | ~10 ms | 10,000,000 |

Caching works because of **locality**: if you touched some data, you'll likely touch
it (or its neighbors) again soon, so the small fast pool captures most accesses.

> **The single most useful debugging lens in this whole course:**
> "Why is this slow?" almost always resolves to **"did something fall down a rung of
> this ladder?"** (e.g., memory access that now hits swap → fell from ~100 ns to
> ~10 ms).

## Interlude — a real interview question: subtraction vs. comparison

*Claim heard in an HFT interview: "subtraction is faster than comparison"
(a date-comparison question).* The precise truth:

- **At the ALU, a comparison IS a subtraction.** `CMP a, b` subtracts, discards the
  numeric result, and keeps only the **flags** (zero? negative? carry?). So `CMP` and
  `SUB` cost essentially the same — comparison is **not** inherently slower.
- **The real cost is the BRANCH that usually follows a comparison.** Because the CPU
  is **pipelined**, it runs ahead and must **predict** which way a branch goes
  (**branch prediction**). A **misprediction** flushes the pipeline: **~15–20 cycles**.
- **Branchless** code replaces a comparing-branch with arithmetic that yields the
  answer directly — no branch to mispredict.
- **The date example:** comparing dates *field by field* (year, then month, then day)
  is *multiple* branches with poor, data-dependent prediction. Encode each date as a
  **single integer** (`days-since-epoch`, or `year*10000 + month*100 + day`) and the
  comparison collapses to **one branchless integer subtraction**. That's the actual
  speedup — and it's about **data representation** as much as the ALU.

**Model answer:** *"A compare is a subtract that keeps only the flags, so it's not
slower. The cost is the branch after it — a mispredict flushes the pipeline for ~15+
cycles. Encoding a date as one integer replaces a field-by-field, branch-heavy
comparison with a single branchless subtraction, which is why it's faster."*

---

### Key takeaways

- The **opcode** selects, via a **multiplexer**, which of the ALU's parallel results
  emerges — the CPU doesn't rewire itself.
- The **Program Counter** holds the address of the next instruction; **all control
  flow is writing the PC**; call/return use the **stack**.
- **Fetch → Decode → Execute → Writeback → Advance PC**, billions of times/sec, with
  **pipelining** and **caching** layered on.
- **Stored-program model:** code and data are both just bits in the same memory.
- **You can't have big+fast** (cost *and* speed-of-light), so memory is a **latency
  ladder**; most "why slow?" bugs are "fell down a rung."
