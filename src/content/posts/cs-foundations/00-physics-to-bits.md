---
title: "Chapter 0 — From Physics to Bits"
date: 2026-07-12
description: "Transistors as switches, logic gates, memory as stable state, and the 2^N rule."
draft: true
series: "cs-foundations"
order: 1
tags: ["learning", "cs-foundations", "hardware"]
---

> The bottom of the abstraction stack. Everything above rests on this.

## The transistor: a controllable switch

Forget the semiconductor physics. The load-bearing mental model is:

**A transistor is a switch that another electrical signal controls.**

It has three connections: an input, an output, and a **control line**. Put voltage
on the control line and current flows input→output; remove it and flow stops. A
modern CPU has tens of billions of these switches etched into silicon.

Why does a *switch* (rather than, say, an amplifier) matter? Because switches give
us **discreteness**, and discreteness is the property that makes reliable computing
physically possible (see below).

## From voltage to truth: the bit

We agree on a convention:

- high voltage = **1**
- low voltage = **0**

Now a switch is no longer "just electricity" — it is a **bit**. Physical voltage
has become *truth value*.

## Logic gates

Wire transistors into small arrangements and you get **logic gates**:

| Gate | Output is 1 when… |
|------|-------------------|
| AND  | both inputs are 1 |
| OR   | either input is 1 |
| NOT  | input is 0 (inverts) |
| NAND | NOT(AND) |
| NOR  | NOT(OR) |
| XOR  | inputs differ |

**Every computation your machine has ever done is built from these gates.** Compose
them and you get:

- an **adder** — gates that add two binary numbers → *computation*
- a **latch / flip-flop** — gates with a feedback loop that hold a bit → *memory*

There is no deeper magic above the transistor. The entire trick of computing is:
**simple element, composed relentlessly.**

## Digital computing — definition and requirements

**Digital computing = computing over discrete symbols (0/1), not continuous
quantities.** ("Digital" ← *digit*, countable/distinct.) Its opposite is **analog**,
where information rides on a smoothly varying physical quantity (vinyl groove depth,
old radio voltages).

Four requirements make something a digital computer:

1. **Discrete states** — a finite set of distinct symbols (for us: 0 and 1), with a
   *forbidden gap* between them. Never "0.73 of the way to 1."
2. **Regeneration / noise immunity** — because states are distinct, each stage can
   *restore* a slightly-corrupted signal to the nearest clean symbol.
3. **Deterministic transformation** — same inputs always produce the same output.
4. **Composability** — simple elements combine into arbitrarily complex ones without
   the abstraction leaking.

## Why discreteness is the load-bearing property

Imagine a machine doing a billion operations in sequence, each feeding the next.

- **Analog:** every stage adds a little noise (heat, interference). Because the
  machine faithfully carries whatever value it's given, noise **accumulates**. After
  enough stages the signal is mush — and you can't distinguish "true value" from
  "value + error" because *every* value is legal.
- **Digital:** there's a forbidden gap between 0 and 1. When a clean 1 (say 5 V)
  degrades to 4.2 V by the next gate, that gate asks a yes/no question — "closer to 1
  or 0?" — **snaps it back to a pristine 5 V**, and passes it on. The error is thrown
  away *at every single step* instead of compounding.

**That is what discreteness buys: it makes long, deep, reliable computation possible.**
Analog can't do a billion sequential ops; digital does trillions.

### Why this matters in production (foreshadowing Chapter 2)

Every "errors" symptom in hardware is *this principle failing* — noise occasionally
jumps the forbidden gap and corrupts a bit:

- bit-flips in RAM → why **ECC memory** exists
- signal-integrity issues on a bus
- disk read errors, network CRC errors

Hold onto the word **discrete**. It is the through-line of the whole course.

## Memory is stable state

At the gate level, **memory = held stable state**. A 1-bit memory (latch/flip-flop)
is a circuit with **two stable states** that rests in whichever one it's in.

- **Write** = briefly *force* the loop into the other stable state.
- **Read** = observe which state it's resting in.

The feedback loop does **not** "check and flip" — it simply keeps re-asserting the
value it already holds. *Stability itself is the memory.*

Different technologies achieve "two stable states" with different physical tricks —
same abstract goal:

| Type | Where | Physical mechanism |
|------|-------|--------------------|
| **SRAM** | registers, CPU cache | self-reinforcing logic loop, ~6 transistors/bit; holds state while powered ("static") |
| **DRAM** | main memory | charge in a leaky capacitor, ~1 transistor + 1 capacitor/bit; **must be refreshed** thousands of times/sec or it forgets |
| **SSD (flash)** | persistent storage | trapped charge; persists *without* power |

## Binary and the 2^N rule

Everything is bits, so numbers are represented in **binary** (base-2). Where decimal
has ones/tens/hundreds, binary has ones/twos/fours/eights…

- 1 bit → 2 states
- **N bits → 2^N distinct values**
- 1 byte = 8 bits = 256 values

Memorize the early powers — they leak directly into storage/memory sizing:

| N | 2^N | Note |
|---|-----|------|
| 8 | 256 | one byte |
| 10 | **1024** | *not* 1000 — this is why 1 KB = 1024 bytes |
| 16 | 65,536 | |
| 20 | ~1,048,576 (~1 M) | |
| 30 | ~1,073,741,824 (~1 B) | why a "500 GB" disk shows ~465 GiB in the OS |

> **Gotcha:** 2^10 = 1024, not 1000. This single fact explains why RAM comes in
> 8/16/32 GB (never 10/20), and why disk-vendor "GB" disagrees with the OS's "GiB."

---

### Key takeaways

- A transistor is a **controllable switch**; its two clean states give us **bits**.
- **Logic gates** compose into **adders** (compute) and **latches** (remember).
- **Discreteness** — the forbidden gap between 0 and 1 — is what lets every stage
  regenerate a clean signal, making deep reliable computation possible. Its failure
  is the root of every hardware "error."
- **Memory is stable state**; SRAM/DRAM/flash are three physical tricks for the same
  goal.
- **N bits → 2^N values**; 2^10 = 1024.
