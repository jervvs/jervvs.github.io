---
title: "Deep Dive — Evaluation"
date: 2026-07-12
description: "The spine of the whole knowledge base, expanded into a build-it playbook. If you only master one discipline in AI-assisted engineering, master this one."
draft: true
series: "ai-software-engineering"
order: 20
tags: ["learning", "ai-software-engineering", "evaluation"]
---

*The spine of the whole knowledge base, expanded into a build-it playbook. If you only master one discipline in AI-assisted engineering, master this one.*

> **BLUF:** Every pillar quietly depends on evaluation — the agentic loop needs a grader to self-correct, quality gates need trustworthy metrics, security needs proof that a model is "good enough," and measurement needs internal evals because benchmarks don't transfer. This sub-tree goes past the [Foundations §6 overview](/writing/ai-software-engineering/pillars/01-foundations/) and the [Measurement pillar](/writing/ai-software-engineering/pillars/05-measurement/) into *how to actually build, trust, and operationalize evals* — with the hard case front and center: **evaluating agents, not just single model calls.**

---

## Why this exists

The core set treats evals as one section (Foundations §6) and a theme (Measurement). That undersells them. Evals are the load-bearing discipline: they turn "the output looks plausible" into "the output is correct," and they're the only measurement that survives contact with your own codebase. This deep-dive is the playbook the overview points at but doesn't unpack.

It's also the thing you need to trust any agent you build. An agent that diagnoses incidents or writes tests is only as good as your ability to *prove* it works — repeatedly, safely, and cheaply. That proof is an eval.

---

## The eval stack

Evaluation happens at several layers. Each answers a different question with a different grader.

| Layer | Question it answers | Grader | Covered in |
|---|---|---|---|
| **Unit / output** | Is this single model output correct? | Programmatic (tests, exact match, schema) or LLM-judge | [Ch. 1](/writing/ai-software-engineering/deep-dives/evaluation/01-datasets-and-graders/) |
| **Agent / trajectory** | Did the agent reach the goal — and *how*? | Outcome check + trajectory assertions + judge | [Ch. 2](/writing/ai-software-engineering/deep-dives/evaluation/02-agent-and-trajectory-evals/) |
| **System / online** | Is it working on real traffic, over time? | Guardrail metrics, canary, human-labeled samples | [Ch. 3](/writing/ai-software-engineering/deep-dives/evaluation/03-eval-driven-development/) |
| **Program / decision** | Should we adopt this change at all? | Controlled rollout, statistical comparison | [Ch. 3](/writing/ai-software-engineering/deep-dives/evaluation/03-eval-driven-development/) + [Measurement](/writing/ai-software-engineering/pillars/05-measurement/) |

---

## Read the chapters

| Chapter | What it gives you | Read it when |
|---|---|---|
| **[1 — Datasets & graders](/writing/ai-software-engineering/deep-dives/evaluation/01-datasets-and-graders/)** | How to build a golden set that's representative and a grader that measures what you think — including LLM-as-judge calibration and the meta-evaluation you can't skip | You're standing up any eval |
| **[2 — Agent & trajectory evals](/writing/ai-software-engineering/deep-dives/evaluation/02-agent-and-trajectory-evals/)** | How to grade a stochastic trajectory of tool calls: outcome vs trajectory, `pass^k` reliability, tool-use/safety/cost/grounding, and the non-determinism problem | You're building an agent (codegen, incident triage, ops automation) |
| **[3 — Eval-driven development](/writing/ai-software-engineering/deep-dives/evaluation/03-eval-driven-development/)** | How to make evals *gate decisions*: the EDD loop, CI regression gates, offline vs online, statistical rigor, and anti-Goodhart guards | You're operationalizing evals in a real pipeline |

---

## When you need which kind of eval

> Don't build the heavy machinery before you need it. Match the eval to the decision it informs.

| Situation | Minimum viable eval |
|---|---|
| Tweaking a prompt for a single-shot task | A 20-case golden set + a programmatic grader ([Ch. 1](/writing/ai-software-engineering/deep-dives/evaluation/01-datasets-and-graders/)) |
| Choosing between two models | Same golden set run on both; compare with a confidence interval, not a single number ([Ch. 3](/writing/ai-software-engineering/deep-dives/evaluation/03-eval-driven-development/)) |
| Shipping an agent to production | Trajectory eval with `pass^k` reliability + safety + cost gates, run N times ([Ch. 2](/writing/ai-software-engineering/deep-dives/evaluation/02-agent-and-trajectory-evals/)) |
| Deciding whether AI adoption helped a team | Controlled rollout, outcome metrics, sliced by context ([Measurement](/writing/ai-software-engineering/pillars/05-measurement/)) |

---

## The one rule

> **Find or build the grader *first*.** Before adopting AI for any task, identify the automatic check that says "correct" or "not." If the task has no ground-truth oracle, constructing one is the first work item, not the last. No grader → no eval → no flywheel → the effort stalls on vibes. This is the [verifiable-reward spine](/writing/ai-software-engineering/concept-map/) restated as a work order.

---

## How this connects to the rest

- Extends: [Foundations §6 — evals](/writing/ai-software-engineering/pillars/01-foundations/) and [Measurement](/writing/ai-software-engineering/pillars/05-measurement/)
- Feeds: [Quality & testing](/writing/ai-software-engineering/pillars/03-quality-and-testing/) (the metrics that gate the pipeline) and [Security](/writing/ai-software-engineering/pillars/04-security/) (proving a self-hosted model meets bar)
- Built concretely in: [Prototype A — eval harness](/writing/ai-software-engineering/prototypes/a-eval-harness/) (output evals) and [Prototype C — incident-triage agent](/writing/ai-software-engineering/prototypes/c-incident-triage-agent/) (agent/trajectory evals)

## Sources

- METR RCT on AI & developer productivity — https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/
- Anthropic — Best practices for agentic coding — https://code.claude.com/docs/en/best-practices
- SWE-bench — https://www.swebench.com/
