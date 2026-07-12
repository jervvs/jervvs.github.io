---
title: "Deep Dive — Security"
date: 2026-07-12
description: "The security pillar names the threats. This sub-tree gives you the mechanized defenses — and the one reframe that changes everything."
draft: true
series: "ai-software-engineering"
order: 30
tags: ["learning", "ai-software-engineering", "security"]
---

*The [security pillar](/writing/ai-software-engineering/pillars/04-security/) names the threats. This sub-tree gives you the mechanized defenses — and the one reframe that changes everything.*

> **BLUF:** Prompt injection is a **systems-security problem, not a prompting problem**. You cannot instruct your way out of it — every prompt-only defense has been bypassed. So the winning posture is not a cleverer system prompt; it is **defense-in-depth plus assume-breach blast-radius engineering**. This deep-dive covers the three layers that actually hold: defending the input boundary, containing a compromised agent, and closing the channels damage flows through.

---

## Why this exists

The core security pillar is a threat model — it tells you *what can go wrong*. This sub-tree is the defense manual — *what to build so it doesn't, and what limits the damage when it does anyway.* It exists because the single most common mistake in agent security is treating injection as something you fix with wording, when it's something you survive with architecture.

The mental model shift, stated once: **assume every byte your agent reads from the outside world is hostile instruction, and assume the agent will eventually be compromised. Then design so that's survivable.**

---

## The defense stack

Three layers, each a chapter. They are cumulative — you need all three, because each fails in ways the next catches.

| Layer | Defends | The core question | Chapter |
|---|---|---|---|
| **Input boundary** | The model getting hijacked by untrusted content | Can adversarial data reach the part of the system that acts? | [1 — Prompt-injection defenses](/writing/ai-software-engineering/deep-dives/security/01-prompt-injection-defenses/) |
| **Containment** | A compromised agent doing damage | If the model were fully adversarial, what's the worst it could do? | [2 — Sandboxing & least privilege](/writing/ai-software-engineering/deep-dives/security/02-sandboxing-and-least-privilege/) |
| **Channels** | Damage flowing out (deps, secrets, data) | Through what paths can a compromise become real harm? | [3 — Supply chain, secrets & exfiltration](/writing/ai-software-engineering/deep-dives/security/03-supply-chain-secrets-and-exfiltration/) |

> **The layers assume each other's failure.** Chapter 1's structural defenses (dual-LLM, capability enforcement) are strong but not perfect, so Chapter 2 assumes injection succeeds and caps the blast radius. Chapter 2's sandbox is strong but not perfect, so Chapter 3 closes the specific channels — dependencies, secrets, egress — through which a contained-but-compromised agent still leaks. Defense in depth is not redundancy; it's each layer covering the one below's residual risk.

---

## Read the chapters

| Chapter | What it gives you | Read it when |
|---|---|---|
| **[1 — Prompt-injection defenses](/writing/ai-software-engineering/deep-dives/security/01-prompt-injection-defenses/)** | The concrete techniques ranked by what they *guarantee*: spotlighting, instruction hierarchy, classifiers (probabilistic) vs dual-LLM and capability/control-flow-integrity approaches (structural) — plus red-teaming injection as a gated eval | You're deciding how to feed untrusted content to an agent |
| **[2 — Sandboxing & least privilege](/writing/ai-software-engineering/deep-dives/security/02-sandboxing-and-least-privilege/)** | Blast-radius engineering: capability-scoped tools, sandbox layers (process → container → microVM), human gates, and deterministic hooks that beat prompt rules | You're giving an agent tools that touch real systems |
| **[3 — Supply chain, secrets & exfiltration](/writing/ai-software-engineering/deep-dives/security/03-supply-chain-secrets-and-exfiltration/)** | Closing the damage channels: slopsquatting/dependency provenance, secret handling, and the exfiltration paths (including markdown-image leaks) most teams miss | You're letting an agent install things, hold credentials, or emit output that gets rendered/fetched |

---

## The one rule

> **Assume the agent is compromised, and make that survivable.** The security of an agent is defined by what it *can* do when fully adversarial, not by what you *told* it to do. Every design decision — tool grants, sandbox boundaries, egress rules, approval gates — should be evaluated against a single question: *"if the model were the attacker, would this still be safe?"* If the answer depends on the model behaving, it isn't a control.

---

## How this connects

- Extends: [Security pillar](/writing/ai-software-engineering/pillars/04-security/) (the threat model)
- Depends on: [Agentic workflow → autonomy spectrum](/writing/ai-software-engineering/pillars/02-agentic-workflow/) (autonomy is safe only in proportion to containment) and [Evaluation → agent evals](/writing/ai-software-engineering/deep-dives/evaluation/02-agent-and-trajectory-evals/) (safety is a first-class, tested metric — injection-resistance and "no unsafe action" are gated eval criteria)
- Shows up concretely in: [Prototype C](/writing/ai-software-engineering/prototypes/c-incident-triage-agent/) (read-only tools + human gate + untrusted-log handling) and [Prototype A](/writing/ai-software-engineering/prototypes/a-eval-harness/) (sandboxed execution of model-generated code)

## Sources

- Anthropic — Best practices for agentic coding — https://code.claude.com/docs/en/best-practices
- Named techniques (spotlighting, dual-LLM, CaMeL, instruction hierarchy) attributed inline and flagged *(training cutoff Jan 2026 — verify live)*.
