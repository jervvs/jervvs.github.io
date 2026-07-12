---
title: "Foundations: The Technique Stack"
date: 2026-07-12
description: "The levers of AI-assisted engineering, and when to pull each."
draft: true
series: "ai-software-engineering"
order: 10
tags: ["learning", "ai-software-engineering", "pillars"]
---

*The levers of AI-assisted engineering, and when to pull each.*

> **BLUF:** There are five levers for steering an LLM at work — context engineering, prompt/spec design, evals, fine-tuning, and RL/RLVR. For 95% of engineering tasks you only need the first three. Reach for context and retrieval before fine-tuning; reach for evals before shipping anything. Fine-tuning and training-time RL are heavy, specialist tools — most teams that think they need them actually need better context and a golden eval set. The single most important idea in this doc: **a test suite is a verifiable reward, so an agent can self-improve inside one task with no training at all.**

## 1. The decision table

> **BLUF:** Pick the cheapest lever that moves the metric. Cost and irreversibility rise as you go down this table; effectiveness-per-effort falls for anything past evals unless you have a narrow, high-volume, well-measured problem.

| Lever | Changes what | Reach for it when | When it's a trap |
|---|---|---|---|
| **Context engineering** | What the model *sees* this turn | Model lacks facts, code, or state it needs; answers are generic or stale | Stuffing everything in — a full context window degrades quality (see §2). Curate, don't dump. |
| **Prompt / spec design** | How the model *interprets* the task | Output format/scope/constraints are wrong; behavior is inconsistent | Endless prompt-tweaking to paper over a missing eval. If you can't measure it, you're guessing. |
| **Evals** | Your ability to *know if a change helped* | Always. Before any other change ships. | Skipping them "to move fast." You will silently regress and not know. There is no non-trap use of *not* having evals. |
| **RAG / retrieval** | What *knowledge* the model can pull in | You need current, private, or large-corpus knowledge | Using it for *behavior* problems. RAG adds facts, not skills or style. |
| **Fine-tuning / LoRA** | *Behavior*, format, tone, latency | Narrow high-volume task; you want a small self-hosted model to act like a big one | Using it to add knowledge (use RAG), or on a task you can't produce ~1k+ clean examples for. Every base-model upgrade invalidates it. |
| **RL / RLVR (training)** | *Policy* — how the model reasons/acts | You are training a model and have a verifiable reward signal | App teams almost never train. The app-layer analog (test-suite-as-reward, §5) gets you 90% of the benefit with zero training. |

> The meta-trap: treating "make the model better" as a model problem. It is usually a context problem, and always a measurement problem first.

## 2. LLMs for engineers

> **BLUF:** An LLM is an autoregressive next-token predictor over a fixed context window. It optimizes for *plausible*, not *correct*. Everything downstream — RAG, evals, agents — exists to constrain that gap.

| Concept | What it is | Why you care |
|---|---|---|
| **Token** | Sub-word unit (~4 chars / ~0.75 words English) (training cutoff Jan 2026 — verify live) | Billing, limits, and latency are per-token. Code and JSON tokenize less efficiently than prose. |
| **Context window** | Max tokens (prompt + output) the model attends to in one call | Hard ceiling on how much code/history/docs fit. Exceed it → truncation or error. |
| **Temperature** | Sampling randomness (0 = greedy, higher = diverse) | Low for extraction/code/classification; higher for ideation. Not a correctness dial. |
| **Autoregression** | Each token conditioned on all prior tokens | The source of fluent, confident, wrong output. |

**Why quality degrades as context fills.** A window that *fits* is not a window that *works*. As you approach the limit:

- **Lost-in-the-middle**: attention favors the start and end; facts buried mid-context get ignored.
- **Distraction**: irrelevant tokens dilute the signal — the model pattern-matches on noise.
- **Recency bias**: late instructions can silently override earlier ones.

> The trap is "it has a 200k window, so I'll paste the whole repo." A curated 8k of exactly-relevant context beats 180k of everything. Treat context as a working set, not an archive.

**The "plausible not correct" failure mode.** The model never verifies; it continues a pattern. It will invent an API that *should* exist, cite a function signature that *looks* right, and produce a proof that *reads* valid. This is not a bug you prompt away — it is the objective function. The entire discipline (retrieval for grounding, tests for verification, evals for measurement) is scaffolding around this single fact.

## 3. RAG deep dive

> **BLUF:** RAG is how you give a model knowledge it wasn't trained on — current, private, or too large to fit. For *adding knowledge*, RAG beats fine-tuning on every axis that matters. The frontier is agentic retrieval: stop pre-fetching, hand the model tools and let it go get what it needs.

**The pipeline, and where each stage fails:**

| Stage | What it does | Where it goes wrong |
|---|---|---|
| **Chunking** | Split source into retrievable units | Fixed-size splits cut mid-thought; a chunk answers half the question. Chunk on structure (headings, functions), not byte counts. |
| **Embedding** | Map chunk → vector | Generic embeddings miss domain jargon; the nearest vector isn't the right answer. |
| **Vector store + top-k** | Return k nearest chunks | Naive top-k returns the *similar*, not the *relevant*. High recall, poor precision. |
| **Reranking** | Re-score candidates with a stronger model | Skipped for latency — then the good chunk sits at rank 8 and never reaches the prompt. |

**Naive top-k vs structured retrieval.**

| | Naive top-k | Structured / agentic retrieval |
|---|---|---|
| Query | One embedding lookup | Model decomposes, filters by metadata, issues multiple queries |
| Precision | Low — semantic neighbors | High — uses structure (dates, authors, types, joins) |
| Multi-hop questions | Fails (needs chained facts) | Works — model iterates, refines, follows references |
| Cost/latency | Cheap, one shot | Higher, several calls |
| Best for | FAQ, single-fact lookup | Real engineering questions over messy corpora |

**Agentic retrieval** is the important shift: instead of guessing what to prepend, expose search/grep/DB/API as *tools* and let the model fetch iteratively — exactly how an engineer explores an unfamiliar codebase. It self-corrects (bad result → refine query) and does multi-hop naturally. Cost is more calls; the win is precision and far less brittle chunking.

**RAG vs fine-tuning for adding knowledge — RAG wins:**

| Dimension | RAG | Fine-tuning |
|---|---|---|
| Add/change a fact | Update the index (seconds) | Retrain (hours–days) |
| Freshness | Real-time | Frozen at train time |
| Attribution | Cites source chunk | Opaque; can't point to why |
| Hallucination | Grounded in retrieved text | Confidently makes things up |
| Access control | Filter at retrieval | Baked in; can't un-teach easily |
| Cost to maintain | Low | High, recurring |

> The trap is fine-tuning to "teach the model our docs." Fine-tuning does not reliably store facts, and the ones it stores go stale and can't be cited. Use RAG for knowledge, full stop.

## 4. Fine-tuning & adapters (LoRA / QLoRA)

> **BLUF:** Fine-tuning changes *behavior* — format, tone, structure, task-specific reflexes — not knowledge. It is justified for narrow, high-volume tasks where you want a small self-hosted model to reliably behave like a big one. For everything else it's premature.

**What it actually changes.** Fine-tuning shifts the model's *default behavior* toward your examples: always emit this JSON shape, always adopt this terse style, always classify into these labels. It does **not** durably install facts — that's RAG's job.

**LoRA / QLoRA** train small low-rank adapter matrices instead of all weights (QLoRA adds quantization to fit on modest GPUs). Cheaper, faster, swappable per task — but they change behavior, not knowledge, same as full fine-tuning.

| Requirement | Reality |
|---|---|
| **Data** | Hundreds to thousands of clean, consistent, correctly-formatted examples. Quality dominates quantity; garbage in, confidently-wrong out. |
| **Maintenance** | Every base-model upgrade can invalidate the tune. You own a retraining pipeline forever. |
| **Eval** | You cannot tell if a tune helped without a golden set (§6). Non-negotiable. |

**When it's genuinely justified:**

- **Narrow + high-volume**: one task, millions of calls — a tuned small model cuts cost/latency hugely.
- **On-prem / self-hosted control**: data can't leave your boundary; you must run a small model well.
- **Behavior a prompt can't hold**: format/style must be exact across every call and prompting keeps drifting.

> ~~Fine-tune first~~. Order of attack: prompt → context/RAG → *then* consider fine-tuning, and only with an eval set already in place. Most "we need to fine-tune" instincts dissolve once context and retrieval are done properly.

## 5. RL & RLVR end-to-end

> **BLUF:** RL trains a model against a reward. When the reward is *automatically verifiable* (RLVR), you don't need human labels — and **code is the cleanest verifiable domain there is: it compiles or it doesn't; tests pass or they don't.** The training-time version produced the reasoning-model leap. The app-layer version — a test suite as an in-loop reward — lets an agent self-improve *within a single task, with no training at all.* That connection is the whole point.

**Reward models vs verifiable rewards:**

| | Reward model (RLHF) | Verifiable reward (RLVR) |
|---|---|---|
| Reward source | A learned model of human preference | A deterministic checker (compiler, tests, exact match) |
| Noise | Subjective, gameable, expensive to label | Objective, cheap, hard to game |
| Best domains | Open-ended tone/helpfulness | Code, math, anything with a ground-truth check |

**Why code is a clean RL domain.** Most tasks need a human to say "good answer." Code doesn't: `does it compile?` and `do the tests pass?` are free, instant, objective reward signals. No labeling bottleneck → generate attempts at scale, reward the ones that pass, reinforce. This is a major driver of the recent leap in coding and reasoning models (training cutoff Jan 2026 — verify live).

**The reasoning-model leap.** Rewarding *verified final answers* (not imitated steps) taught models to spend more compute thinking before answering — longer, self-correcting chains — because longer reasoning empirically earned more reward.

**PPO / GRPO — conceptual only.** Both are recipes for "increase the probability of action sequences that earned high reward, decrease the rest, without lurching too far from the current policy." PPO uses a separate value estimate to judge each step; GRPO drops it and compares a *group* of sampled answers against each other, which suits verifiable rewards well. You don't need the math to use the idea.

**The crucial app-layer analog — make this connection explicit:**

The exact mechanism that trains a model — *generate → verify against tests → keep what passes* — is available to you at runtime **without any training**:

```
Agent writes code
      │
      ▼
Run the test suite  ──►  automatic, objective reward
      │
  pass? ──yes──► done
      │
      no
      ▼
Feed failures back into context ──► agent revises ──► loop
```

> A test suite is a verifiable reward function. Put it *inside the agent's loop* and the agent does its own RLVR-in-miniature — trying, checking, correcting — converging on a passing solution in a single task. No gradient updates, no labels, no GPUs. This is why "give the agent a way to run the tests" is the highest-leverage thing you can do, and why a task with strong tests is dramatically more automatable than one without.

The implication for how you set up work: **the reward signal is the tests.** Weak tests → the agent optimizes toward a weak, gameable target and confidently declares success. Strong tests → the agent is pulled toward genuinely correct code. Invest in the checker.

## 6. Evals — the flywheel

> **BLUF:** Evals are the measurement layer, and they must exist *before* you ship any change to a prompt, model, retrieval setup, or agent. Without them you are tuning blind: you cannot distinguish improvement from regression, and you will ship both.

**The core assets:**

| Asset | What it is | Discipline |
|---|---|---|
| **Golden set** | Curated input→expected-output pairs that encode "correct" | Grow it from real failures. Every prod bug becomes a permanent test case. |
| **Offline eval** | Run candidate change against the golden set pre-deploy | Gate: no merge if it regresses the set. |
| **Online eval** | Measure real traffic in production | Catches the distribution shift your golden set didn't. |
| **Regression gate** | CI check that fails on eval drop | Makes "don't regress" mechanical, not a matter of memory. |

**LLM-as-judge and its pitfalls.** Using a strong model to score outputs scales past what humans can grade by hand — but the judge is itself a fallible LLM:

- **Bias**: favors longer answers, its own style, the first option shown, sycophantic agreement.
- **Needs its own validation**: a judge you haven't checked against human labels is an unmeasured instrument. Validate the judge before you trust its verdicts.
- **Not a substitute for verifiable checks**: where a deterministic check exists (compiles, tests pass, exact match), use it — it's cheaper and unbiased. Save the judge for genuinely subjective quality.

> The trap is trusting the judge because it's convenient. An unvalidated LLM judge feels like measurement while quietly encoding the same biases you're trying to catch.

**Why evals come first.** Every other lever in this doc — a new prompt, a fine-tune, a retrieval change, an agent tweak — is a hypothesis. Evals are how you test it. Ship a change without them and you're substituting vibes for evidence. Build the golden set first; it pays back on every subsequent change.

> **Go deeper:** the [evaluation deep-dive](/writing/ai-software-engineering/deep-dives/evaluation/README/) turns this section into a build-it playbook — dataset & grader design, agent/trajectory evals, and eval-driven development (CI gates, statistical rigor).

## 7. How these compose

These levers stack, they don't compete. **Context** decides what the model sees; **RAG** feeds context with grounded knowledge; **prompt/spec** shapes interpretation; **fine-tuning** biases default behavior for narrow high-volume cases; **RL/RLVR** (or its runtime analog, the test-in-the-loop) drives an agent toward *verified* correctness; and **evals** sit underneath all of it as the flywheel that tells you whether any change actually helped. The default engineering stack is: strong context + retrieval + a golden eval set, with an agent that can run tests as its reward signal — reserve fine-tuning and training-time RL for the narrow cases that truly earn them. See the [concept map](/writing/ai-software-engineering/concept-map/) for how these wire together end to end.

## Related
- [Overview](/writing/ai-software-engineering/README/)
- [Concept map](/writing/ai-software-engineering/concept-map/)
- [02 — Agentic workflow](/writing/ai-software-engineering/pillars/02-agentic-workflow/)
- [03 — Quality and testing](/writing/ai-software-engineering/pillars/03-quality-and-testing/)
- [04 — Security](/writing/ai-software-engineering/pillars/04-security/)
- [05 — Measurement](/writing/ai-software-engineering/pillars/05-measurement/)
- [Prototype A — Eval harness](/writing/ai-software-engineering/prototypes/a-eval-harness/)
- [Prototype B — Test generation](/writing/ai-software-engineering/prototypes/b-test-generation/)
- [Prototype C — Incident triage agent](/writing/ai-software-engineering/prototypes/c-incident-triage-agent/)

## Sources
- SWE-bench — https://www.swebench.com/
- Anthropic, agentic coding best practices — https://code.claude.com/docs/en/best-practices
- METR, early-2025 AI RCT on experienced OSS developers — https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/
