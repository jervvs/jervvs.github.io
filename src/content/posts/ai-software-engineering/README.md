---
title: "AI-Assisted Software Engineering — A Working Knowledge Base"
date: 2026-07-12
description: "Concepts, deep-dives, and buildable prototypes for AI-driven development. Pure concept — no vendor pitch, no organizational framing."
draft: true
series: "ai-software-engineering"
order: 0
tags: ["learning", "ai-software-engineering"]
---

*Concepts, deep-dives, and buildable prototypes for AI-driven development. Pure concept — no vendor pitch, no organizational framing.*

> **BLUF:** The unit of AI work moved from **autocomplete (a line)** → **chat (a snippet)** → **agent (a task)**. The scarce skill is no longer "prompting" — it's **context engineering + verification + measurement**. Engineers who create value wire AI into a loop that can *check its own work*; the rest ship plausible code fast and measure nothing.

---

## How to read this

This is a hub-and-spoke set. Start here, then read any spoke standalone — each is self-contained and cross-linked.

| Doc | What it covers | Read it when |
|---|---|---|
| **This overview** | The thesis, the three anchoring insights, the through-line | First |
| [Concept map](/writing/ai-software-engineering/concept-map/) | Every term defined + a Mermaid map of how they connect | You want the vocabulary and the wiring in one place |
| [Pillar 1 — Foundations](/writing/ai-software-engineering/pillars/01-foundations/) | LLMs, RAG, fine-tuning, RL/RLVR, evals — which lever, when | You're choosing a technique |
| [Pillar 2 — Agentic workflow](/writing/ai-software-engineering/pillars/02-agentic-workflow/) | The agentic loop, explore→plan→verify, context as a budget | You're changing *how* work gets done |
| [Pillar 3 — Quality & testing](/writing/ai-software-engineering/pillars/03-quality-and-testing/) | AI test-gen, mutation, property/differential testing, review, debugging | You care about defect escape, not just velocity |
| [Pillar 4 — Security](/writing/ai-software-engineering/pillars/04-security/) | Threat model, prompt injection, supply chain, AI-as-defender | You're putting agents near real systems |
| [Pillar 5 — Measurement](/writing/ai-software-engineering/pillars/05-measurement/) | The perception paradox, DORA/SPACE/DX, study design, benchmarks | You need to prove impact, not assert it |
| [Prototype A — Eval harness](/writing/ai-software-engineering/prototypes/a-eval-harness/) | Score an LLM on code tasks with pass/fail rewards (a mini SWE-bench) | You want the flywheel running |
| [Prototype B — Test generation](/writing/ai-software-engineering/prototypes/b-test-generation/) | Coverage/mutation-verified AI test generation | You want tests that catch regressions, not pin bugs |
| [Prototype C — Incident-triage agent](/writing/ai-software-engineering/prototypes/c-incident-triage-agent/) | An agent loop scored against replayable historical incidents | You want agentic AI applied to ops/AIOps |

---

## The three insights that anchor everything

> **1. Context is the real budget.** Model quality matters less than *what* you put in the window and *when*. Performance degrades as context fills — the model starts forgetting earlier instructions and making more mistakes. This is the skill that transfers least from traditional software engineering and matters most now. Everything in [Pillar 2](/writing/ai-software-engineering/pillars/02-agentic-workflow/) follows from this one constraint.

> **2. "Looks done" is the failure mode.** An LLM stops when its output *looks* plausible. Without a machine-checkable signal, plausibility is the only stopping criterion, and *you* become the verification loop — every mistake waits for you to notice it. Give the agent a test, a build exit code, a linter, a diff-vs-fixture, or a screenshot, and the loop closes on its own. This is why [testing](/writing/ai-software-engineering/pillars/03-quality-and-testing/) is the substrate everything else stands on.

> **3. Perception is a broken sensor.** In a 2025 randomized controlled trial, experienced developers working in repos they knew well were **~19% slower** with AI tools — while believing they were **~20% faster**, having expected **~+24%** beforehand ([METR](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/)). Self-reported speedup is the metric everyone quotes and the one to trust least. Measure *outcomes*, not sentiment — see [Pillar 5](/writing/ai-software-engineering/pillars/05-measurement/).

---

## The five pillars in one line each

| # | Pillar | The one thing to remember |
|---|---|---|
| 1 | [Foundations](/writing/ai-software-engineering/pillars/01-foundations/) | You'll reach for **context engineering + evals** ~90% of the time and fine-tune far less than the hype implies. |
| 2 | [Agentic workflow](/writing/ai-software-engineering/pillars/02-agentic-workflow/) | Treat **context like a resource you spend** and **correctness like a gate you enforce**. |
| 3 | [Quality & testing](/writing/ai-software-engineering/pillars/03-quality-and-testing/) | Grade tests by **mutation kill rate**, not count — and never let AI pin *current* (buggy) behavior. |
| 4 | [Security](/writing/ai-software-engineering/pillars/04-security/) | Agents turn a **prompt injection into code execution**; least-privilege + human gates are non-negotiable. |
| 5 | [Measurement](/writing/ai-software-engineering/pillars/05-measurement/) | If you can't measure it, you're managing a **vibe**. Run controlled rollouts on defect escape and rework. |

---

## The three prototypes

All three are **buildable in an afternoon** and share one design idea (below). Each guide is step-by-step with runnable code, a Mermaid architecture diagram, extensions, and pitfalls.

| Prototype | Builds | Concept it makes concrete |
|---|---|---|
| [A — Eval harness](/writing/ai-software-engineering/prototypes/a-eval-harness/) | An LLM scored on code tasks by running their tests | **Verifiable reward** + the eval flywheel |
| [B — Test generation](/writing/ai-software-engineering/prototypes/b-test-generation/) | AI-generated tests graded by mutation testing | Test *quality* ≠ test *quantity* |
| [C — Incident-triage agent](/writing/ai-software-engineering/prototypes/c-incident-triage-agent/) | A tool-using agent diagnosing replayed incidents | The agentic loop + verifiable rewards for ops |

---

## The through-line: verifiable rewards

One idea unifies this whole set. A **verifiable reward** is an outcome a machine can grade automatically — code either compiles and passes tests, or it doesn't. No human labels needed.

```
RLVR (train the model)  ─┐
Verification loops       ├─  same idea: "did it pass an automatic check?"
Mutation testing         │   applied at four different layers
Incident replay scoring ─┘
```

- At the **model layer**, verifiable rewards are why reasoning/coding models leapt forward — this is RLVR ([Pillar 1](/writing/ai-software-engineering/pillars/01-foundations/)).
- At the **workflow layer**, the same signal lets an agent self-correct *within a single task* with no training ([Pillar 2](/writing/ai-software-engineering/pillars/02-agentic-workflow/)).
- At the **quality layer**, mutation testing turns "are these tests any good?" into a pass/fail number ([Pillar 3](/writing/ai-software-engineering/pillars/03-quality-and-testing/)).
- At the **evaluation layer**, it's how you score any change — model, prompt, or agent (Prototypes [A](/writing/ai-software-engineering/prototypes/a-eval-harness/) and [C](/writing/ai-software-engineering/prototypes/c-incident-triage-agent/)).

> **If a task has no automatic grader, that's the first thing to build — not the last.** Domains without a ground-truth oracle are where AI projects quietly die.

---

## How to apply it (sequencing, concept-level)

Most AI-tooling efforts fail because they ship the flashy code-gen demo first and the measurement never. Invert that:

| Phase | Do | Why this order |
|---|---|---|
| **1. Prove** | Build the [eval + measurement harness](/writing/ai-software-engineering/prototypes/a-eval-harness/) first | Nothing downstream is trustworthy without a grader. Makes every later bet falsifiable. |
| **2. Productize** | [AI-assisted testing & review](/writing/ai-software-engineering/prototypes/b-test-generation/), gated on security | Highest durable ROI; it hardens the verification substrate itself. |
| **3. Beachhead** | An [agentic prototype](/writing/ai-software-engineering/prototypes/c-incident-triage-agent/) in a domain with clean verifiable rewards | Proves value on a checkable task before betting on fuzzy ones. |
| **4. Scale** | Rollout on rails (shared configs, sandboxed permissions), [measured](/writing/ai-software-engineering/pillars/05-measurement/) | Target adoption where AI actually helps — unfamiliar/greenfield — per the METR split. |

---

## Deep dives

Extended, build-it-yourself treatments of a single topic, going past the pillar overview.

| Deep dive | What it adds |
|---|---|
| [Evaluation](/writing/ai-software-engineering/deep-dives/evaluation/README/) | The spine, expanded: dataset & grader design, **agent/trajectory evals** (`pass^k`, tool-use/safety/cost, non-determinism), and eval-driven development (CI gates, statistical rigor, anti-Goodhart). Extends [Foundations §6](/writing/ai-software-engineering/pillars/01-foundations/) and [Measurement](/writing/ai-software-engineering/pillars/05-measurement/). |
| [Security](/writing/ai-software-engineering/deep-dives/security/README/) | The defenses, mechanized: prompt-injection defenses (spotlighting, dual-LLM, capability/CFI), sandboxing & least privilege (blast-radius engineering), and closing the damage channels (supply chain, secrets, exfiltration). Extends [Security pillar](/writing/ai-software-engineering/pillars/04-security/). |

## Provenance

- **Fetched live this session:** [METR RCT](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/), [Anthropic — Best practices for agentic coding](https://code.claude.com/docs/en/best-practices), [SWE-bench](https://www.swebench.com/).
- **Everything else** is from training knowledge to **January 2026**. Specific quantitative claims (benchmark scores, vulnerability rates) are flagged inline as *"(training cutoff Jan 2026 — verify live)"* and should be re-checked against a current source before you cite them.
