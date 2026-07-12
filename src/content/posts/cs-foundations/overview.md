---
title: "CS Foundations — Ground-Up"
date: 2026-07-12
description: "A living textbook built bottom-up from physics to the shell — read standalone or in order."
draft: true
series: "cs-foundations"
order: 0
tags: ["learning", "cs-foundations", "systems"]
---

A living textbook, built bottom-up from physics to the shell and beyond. Each chapter
is standalone; read or share any one on its own. Chapters climb the abstraction stack,
so reading in order walks from transistors upward.

## Chapters

| # | Title | What it covers |
|---|-------|----------------|
| 00 | [From Physics to Bits](/writing/cs-foundations/00-physics-to-bits/) | Transistors as switches, discreteness & noise regeneration, logic gates, memory as stable state (SRAM/DRAM/flash), binary & the 2^N rule |
| 01 | [The CPU, Fetch-Execute, and the Memory Hierarchy](/writing/cs-foundations/01-cpu-and-memory-hierarchy/) | Opcode/ALU/multiplexer, the Program Counter & control flow, the fetch-execute cycle, stored-program model, the latency ladder; interview interlude on subtraction vs. comparison |
| 02 | [Hardware Troubleshooting & Monitoring](/writing/cs-foundations/02-hardware-troubleshooting/) | Two failure modes, the USE method, saturation vs. utilization, a Cassandra worked example, memory/ECC deep dive |

Alongside the chapters, the [Multi-Domain Master Curriculum](/writing/cs-foundations/master-curriculum/) is the six-volume blueprint this whole series is built from — the map for everything still to come.

## Method

- Fast, solid orientation per layer — then questions and interviewer-style checks
  before climbing higher.
- New concepts get folded back into these chapters as they come up.

## Still to come (planned)

- Rest of Chapter 2: swapping vs. OOM in depth; CPU thermal throttling & MCEs; disk
  SMART & I/O latency; network CRC/retransmits — each a full USE breakdown.
- Then upward: the OS & kernel, processes & system calls, the filesystem, the shell &
  bash, and into languages and the higher stack.
