---
title: "Chapter 2 — Hardware Troubleshooting & Monitoring"
date: 2026-07-12
description: "The two failure modes, the USE method, saturation vs. utilization, and an ECC deep dive."
draft: true
series: "cs-foundations"
order: 3
tags: ["learning", "cs-foundations", "troubleshooting", "systems"]
---

> How failing silicon shows up in the metrics and logs you already live in.
> Builds on Chapter 0 (discreteness) and Chapter 1 (the latency ladder).

## The two master failure modes

Every hardware problem reduces to one of two things:

- **A. Something got SLOWER** — it fell down a rung of the latency ladder
  (Chapter 1).
- **B. Something became UNRELIABLE** — the discreteness guarantee broke
  (Chapter 0): a bit that should have been a stable 0/1 came back wrong.

That's the whole taxonomy. CPU, memory, disk, network, thermal — every symptom is a
flavor of *slower* or *unreliable*.

## The USE method (Brendan Gregg)

The discipline that separates systematic diagnosis from flailing. For **every
resource** (CPU, memory, disk, network), check three things:

- **U**tilization — how busy is it? (% of time in use)
- **S**aturation — how much work is **queued and waiting** because the resource can't
  keep up?
- **E**rrors — is it reporting faults?

### The key insight: saturation beats utilization as an early warning

Distinguish three things people routinely conflate:

| Term | Meaning |
|------|---------|
| **traffic / load** | how much work is *arriving* (req/s) |
| **utilization** | fraction of time the resource is *busy* |
| **saturation** | work that arrived but *can't be serviced yet* — the **backlog/queue** |

- **Utilization is a bounded percentage** (0–100%). It *saturates at 100%* and then
  **can't tell you how bad things are** — 100% looks the same whether the queue is 2
  deep or 2000 deep.
- **Saturation is an unbounded length** (a queue). A queue starts forming the moment
  arrival rate *briefly* exceeds service rate — **before** utilization pins at 100%.
  So it catches problems **on the way up**, and it reflects true severity.

> Every item in a queue is a request **accruing latency while it waits its turn**.
> That's why the *felt* problem is slowness, and why saturation is the leading signal.

## Mapping each resource to the foundation

| Resource | "Slower" (saturation) | "Unreliable" (errors) | Foundation link |
|----------|-----------------------|------------------------|-----------------|
| **CPU** | run-queue depth, load average climbing, thermal throttling | machine-check exceptions (MCEs) | fetch-execute rung |
| **Memory** | swapping/paging to disk, OOM kills | ECC corrected/uncorrectable errors | DRAM leaks + discreteness |
| **Disk** | I/O wait, queue depth, rising latency | SMART failures, read/write errors | bottom rungs of the ladder |
| **Network** | dropped packets, retransmits, ring-buffer overruns | CRC/frame errors on the NIC | discreteness on the wire |

**The entire "errors" column is the same phenomenon:** the discreteness guarantee
failing — a bit that should have been a clean 0/1 came back ambiguous or wrong. ECC
errors, disk read errors, network CRC errors are all Chapter 0's principle showing up
as a production symptom.

## Worked example — Cassandra node with high latency, CPU at 60%

*On-call scenario: a node reports high latency, but CPU utilization is a calm 60%.*

**Why "60% CPU" does NOT clear the CPU:** 60% is *utilization*. A CPU at 60% util can
still have a **run queue** — threads *ready* but *waiting* for a core. If request
threads spend time queued for CPU, latency climbs while utilization looks fine. Check
the CPU **saturation** signals instead:

- **load average vs. core count** (load 12 on an 8-core box = ~4 threads perpetually
  waiting)
- **run-queue depth** — the `r` column in `vmstat`

**Then sweep ALL FOUR resources** — don't tunnel on one:

- **Memory:** is the box **swapping**? Even light swap murders latency — memory
  accesses fall from the ~100 ns RAM rung to the ~100 µs–10 ms disk rung (latency
  ladder again). Is the JVM in **GC pause**? A stop-the-world pause shows as latency
  with *low* CPU because app threads are frozen. *(This is why GC pauses are so
  deceptive — the box looks idle.)*
- **Disk:** where tombstones and compaction actually bite. Check **I/O wait** and
  **queue depth / `await`** via `iostat`. Heavy tombstone reads and compaction are
  disk-saturation events.
- **Network:** any **retransmits / dropped packets** between coordinator and replicas?
  Cross-node latency inflates client-observed latency even when the local node is fine.

**The scaffolding under the intuition:** every Cassandra symptom maps to a USE cell on
some resource —

| Cassandra symptom | Resource | U/S/E |
|-------------------|----------|-------|
| pending compactions / pending task queue | disk (and CPU) | **S**aturation |
| tombstones-per-read high | disk | **S**aturation (work before data) |
| read/write timeouts | (the *consequence*) | **E**rror surfacing saturation |
| GC pause time | memory/CPU | **S**aturation (threads frozen) |

Naming the **resource** + whether it's a **U/S/E** signal is what makes diagnosis
systematic and communicable to teammates.

## Memory deep dive — the reliability side (ECC)

Recall Chapter 0: DRAM stores each bit as **charge in a leaky capacitor**. That
fragility is the root of memory errors. A bit that should read 1 reads 0 → a **bit
flip** → the exact moment discreteness fails (noise jumped the forbidden gap).

Two kinds — the distinction is operationally critical:

- **Soft errors** — *transient*. Cosmic ray / stray alpha particle / electrical noise
  flips a bit, but the cell is fine; rewrite and it's correct. Rare per cell, but at
  datacenter scale (thousands of DIMMs) they happen constantly in aggregate.
- **Hard errors** — a *physically failing cell*. Flips repeatedly, often at the same
  address. This is a DIMM dying.

**ECC (Error-Correcting Code) memory** is the discreteness principle rebuilt one layer
up: every 64 data bits get 8 redundant bits (Hamming code), letting the memory
controller:

- **SEC — Single Error Correct:** detect *and fix* any single-bit error on the fly.
  System keeps running; the read is clean.
- **DED — Double Error Detect:** detect (but *not* fix) a double-bit error. It knows
  the data is bad → typically a **machine-check exception (MCE)** and often a crash,
  because computing on known-corrupt memory is worse than halting.

### Operational gold

**Corrected (single-bit) ECC errors are your early warning for a failing DIMM.**

- Occasional corrected soft errors = normal background.
- A **rising rate of corrected errors at the same DIMM/rank/address** = a hard error
  developing. That DIMM will eventually throw an *uncorrectable* error and crash the
  box. Catch it at "corrected, climbing" and swap during a maintenance window — not at
  3am when it panics.

Where to see it:

- **`dmesg`** / kernel log — EDAC subsystem + `mce` messages
- **`edac-util`** — corrected (CE) / uncorrectable (UE) counts per controller/DIMM
- **`rasdaemon`** — modern tool; accumulates machine-check/ECC events into a queryable
  DB (per-DIMM trend over time)
- **IPMI / BMC / vendor tools** (iDRAC, iLO) — out-of-band; often logs ECC events even
  when the OS can't

### The philosophy, full circle

Chapter 0: "digital works because every gate snaps noise back to a clean bit." ECC is
that same move at the module level — redundancy that lets you *detect the snap
failing* and often fix it. When ECC *can't* fix it, the machine chooses to **die
rather than compute on corrupted bits**.

### Why "correct 1 bit" but only "detect 2"? (Hamming distance)

The ruler is **Hamming distance** — the number of bit positions in which two
codewords differ. Key move: **only some bit patterns are "legal" codewords**; the
redundant bits are chosen so legal codewords sit *far apart*, with forbidden patterns
in the gaps. Picture legal codewords as stars with empty space between them:

- **Detect** an error → legal codewords must be **≥ 2 apart**. A single flip lands on
  an *illegal* pattern (you know something's wrong), but it might be equidistant
  between two legal codewords → **can't correct**.
- **Correct** a single error → legal codewords must be **≥ 3 apart**. A single flip
  lands on a point **unambiguously nearest to exactly one** legal codeword → snap to
  it. *(This is literally Chapter 0's "snap to the nearest clean value," lifted from a
  single voltage into multi-bit code space.)*
- A **double** flip in a distance-3 code can travel *past* the midpoint → now closer
  to a *different* legal codeword → "snap to nearest" would snap to the **wrong** one,
  **confidently and silently**. Standard SEC-DED is engineered so a double error lands
  on a still-recognizably-illegal point: it can **detect** but **refuses to correct**,
  because silently producing wrong data is worse than crashing.

General rule: **detect = distance ≥ 2; correct *t* bits = distance ≥ 2t + 1.**
Correction is strictly harder than detection because it's a claim about *which* legal
value was meant — and every extra flip lets you drift toward a wrong neighbor.

## Memory deep dive — the performance side

The reliability side is about bits coming back *wrong*. This side is about memory
access getting *slow* — falling down the latency ladder.

### Virtual memory & paging

Each process gets a **virtual address space**; the kernel maps virtual **pages**
(typically 4 KB) to physical RAM frames. This indirection lets processes coexist and
makes swapping possible.

**Swapping/paging:** when RAM fills, the kernel writes least-recently-used pages out
to disk (swap), freeing frames. Later, touching a swapped-out page raises a **page
fault**; the kernel reads it back from disk before the access can complete.

In latency-ladder terms: RAM ~100 ns vs. swapped page ~100 µs (SSD) to ~10 ms (disk)
— the ~100,000× cliff. So the first touch of a swapped page is catastrophic. **This is
the classic "box isn't pegged at 100% CPU but everything crawls"** — the CPU is idle,
*waiting on disk I/O for page faults*.

**Thrashing:** memory pressure so high the kernel constantly swaps pages out and
immediately faults them back in — nearly all its time spent moving pages, throughput
near zero. **Watch the *rate*, not the amount:** `si`/`so` (swap-in/swap-out) columns
in `vmstat`. Swap *full but quiet* = harmless (stale parked pages). Swap *actively
churning* = emergency.

### The page cache — why low `free` is normal

`free -h` showing almost no "free" memory is **usually fine**. Reading disk is slow,
so Linux keeps recently-read file data in spare RAM (the **page cache**); a re-read is
served from RAM (~100 ns) not disk (~10 ms). Empty RAM is wasted RAM. Crucially, **page
cache is instantly reclaimable** — clean cache pages are just copies of disk data, so
the kernel drops them and hands over frames the instant a process needs memory, no
disk write required.

> **The number that matters is `available`, not `free`.** `available` estimates what a
> new process could get *including* reclaimable cache. 200 MB free + 12 GB available =
> healthy. Low *available* + active swap churn = trouble.

### The OOM killer

When RAM is full, swap is full/absent, and nothing is reclaimable, the kernel can't
satisfy a memory request. The **OOM (Out Of Memory) killer** picks a victim process
and `SIGKILL`s it to keep the system alive. It scores processes (`oom_score`) roughly
by memory use — so it often kills **the biggest user**, which on a DB box is
frequently *the database/JVM itself*. Consequences:

- abrupt `SIGKILL` — no clean shutdown, no flush; the process just vanishes
- logged in **`dmesg`/kernel log** ("Out of memory: Killed process …" + a per-process
  memory table), **not** the app log

> **On-call misdirection:** "the database died for no reason and the app log is
> empty." Prime suspect = OOM killer; evidence is in `dmesg`. Contain it with cgroup
> memory limits and `oom_score_adj` for critical processes; the real fix is more RAM,
> less usage, or predictable limits.

### iowait — the true signature of thrashing

When a thread faults on a swapped page it **blocks**; the kernel issues the disk read
and **context-switches to another runnable thread** if one exists. Under heavy
thrashing, *everything* is faulting, so often nothing is runnable and the CPU truly
stalls. That stalled-on-disk time is accounted as **`iowait`** (the `wa` column in
`top`/`vmstat`): "CPU idle, but only because it's waiting on outstanding disk I/O."

> **Signature: low user/system CPU + high `iowait` + churning `si`/`so` = memory-
> pressure thrashing.** The CPU is "busy waiting" in the accounting sense, not
> spinning. Saying "the CPU is idle" is imprecise — it's *blocked on I/O*, and it runs
> other work if any is runnable.

---

### Key takeaways

- Two failure modes: **slower** (fell down the latency ladder) or **unreliable**
  (discreteness broke).
- **USE method:** for every resource check **U**tilization, **S**aturation, **E**rrors.
- **Saturation (a queue) is the leading indicator**; utilization is bounded at 100%
  and hides severity.
- **"60% CPU" never clears the CPU** — check run-queue/load average, then sweep all
  four resources.
- Every hardware **error** is Chapter 0's **discreteness failing**; ECC is "snap to
  nearest legal codeword." **Detect ≥ dist 2, correct 1 bit ≥ dist 3.**
- **Corrected ECC errors trending up at one DIMM = swap it before it crashes the box.**
- Memory *performance*: alert on **`available`** (not `free`) and the **`si`/`so`
  rate** (not swap amount). **Low CPU + high `iowait` + swap churn = thrashing.** OOM
  kills show up in **`dmesg`**, often killing your database.

---

*Next in this chapter (to be written): CPU (thermal throttling, load average vs. core
count, MCEs), disk (SMART, I/O latency), and network (CRC/retransmits) — each as a
full USE breakdown.*
