---
title: "Learning Plan — AI for Software Engineering"
date: 2026-07-12
description: "Strong fit — my most differentiated track: an applied-LLM practitioner deliberately closing the formal-ML gap."
draft: true
series: "career"
order: 3
tags: ["learning", "career", "ai-swe"]
---

## Fit summary
**Strong fit — this is your most differentiated track.** You are already an applied-AI practitioner: you built an AI ops agent, designed and iterated an LLM-assisted incident-grouping system (embeddings + LLM calls, v1→v3), and use AI coding assistants daily. You pair that with proven full-stack software development (C# services, gRPC, Kafka, Python), strong CI/CD and cloud/DevOps chops (AWS + 5 certs), and observability depth — exactly the "reimagine the SWE lifecycle with AI and measure the impact" mandate. The honest gap is **formal AI/ML foundations**: your LLM work is applied, not research; you have not done hands-on fine-tuning or built production RAG (Retrieval-Augmented Generation). That gap is bridgeable and is where this plan concentrates.

**The ask:** interviewers should see a builder who already ships applied-LLM systems and is deliberately closing the formal-ML gap — not someone claiming ML-research credentials.

## Gap analysis
| JD requirement | Your evidence | Gap severity |
|---|---|---|
| Interest in AI-driven development; stays current on LLMs / AI coding assistants | Daily AI-assisted dev (Claude Code); built an AI ops agent + incident-grouping | **Strong** |
| Proven software development across the stack | C# gRPC/Kafka services, TMS, Python pipelines (Marshall Wace); Meta full-stack | **Strong** |
| CI/CD, cloud, DevOps | Automated fleet-wide campaigns, Kubernetes/Helm, AWS + Terraform, 5 AWS certs | **Strong** |
| Applying LLMs / AI-powered automation to real problems | Incident-grouping (embeddings + LLM), an AI ops agent | **Strong** |
| Software testing / QA background | Unit tests, runbook-validation automation, production support | **Partial** — general SWE testing, not AI-driven test generation |
| Public-sector impact motivation | No public-sector role yet; genuine interest | **Partial** — frame via mission alignment |
| RAG (Retrieval-Augmented Generation), hands-on | None built end-to-end | **Gap** |
| Fine-tuning / model training | None; explicitly not claimed | **Gap** |
| Reinforcement learning (RL) for AI techniques | None | **Gap** |
| AI for automated testing, code review, intelligent debugging | Not yet built these specific tools | **Gap** |
| Measuring impact of AI dev tools (efficiency/quality metrics) | Adjacent (observability, toil reduction) but no formal AI-tool eval | **Partial → Gap** |
| Front-end depth (React/Node) | Meta + AWS prototypes only (light) | **Partial** — sufficient for prototyping |

## Priority objectives
Ranked by interview leverage for this JD:

1. **Build a RAG-over-codebase demo** — highest-signal missing artifact; directly maps to "AI-assisted debugging / code understanding."
2. **Learn to measure AI-tool impact** — define and run an evaluation of an AI coding assistant (efficiency + quality metrics). This is the JD's explicit success criterion.
3. **AI for automated testing & code review** — prototype AI-powered test generation and an AI code-review assistant.
4. **LLM evaluation & benchmarking** — how to judge model/tool quality rigorously (eval harnesses, LLM-as-judge, regression sets).
5. **Fine-tuning basics + RL/RLHF literacy** — enough hands-on and conceptual depth to speak credibly (not to claim expertise).

## Roadmap

### Phase 1 (Weeks 1–3): RAG + evaluation foundations
- **Learn:** DeepLearning.AI short courses — "Building & Evaluating Advanced RAG", "LangChain: Chat with Your Data"; Anthropic + OpenAI cookbooks on retrieval and tool use.
- **Build:** RAG-over-codebase assistant — index one of your repos (e.g. a public mirror or a sample codebase) with embeddings + a vector store, answer "where/why" questions and cite files. Reuse your incident-grouping embeddings experience.
- **Milestone:** working demo that answers codebase questions with source citations; short README explaining architecture and retrieval choices.

### Phase 2 (Weeks 4–6): AI-driven testing, code review & debugging
- **Learn:** survey of AI test-generation and code-review tooling (GitHub Copilot / Copilot Workspace, Cursor, CodiumAI/Qodo, Diffblue, SWE-bench and SWE-bench Verified as the benchmark to know).
- **Build:** an AI-powered test-generation prototype (LLM writes unit tests for a target module) **and** a lightweight AI code-review bot that comments on a pull request in CI (e.g. a GitHub Actions job calling an LLM on the diff).
- **Milestone:** both tools running in a CI pipeline on a real repo; note failure modes and where a human must stay in the loop.

### Phase 3 (Weeks 7–9): Measuring impact
- **Learn:** developer-productivity frameworks (DORA metrics, SPACE framework); read the empirical studies on AI coding-assistant productivity (GitHub/MSR Copilot studies; DX/Faros write-ups) — learn to critique their methodology.
- **Build:** a small controlled experiment — measure task completion time, PR cycle time, and defect/test-pass rate with vs. without an AI assistant on comparable tasks; write it up honestly (including where the effect was null or negative).
- **Milestone:** a public write-up: "Measuring the impact of an AI coding assistant — method, data, caveats."

### Phase 4 (Weeks 10–12): Fine-tuning + RL literacy
- **Learn:** Hugging Face LLM course (fine-tuning, PEFT/LoRA); conceptual RLHF/RLAIF and DPO reading (Anthropic Constitutional AI paper, InstructGPT paper). Goal is credible conversation, not claimed expertise.
- **Build:** one hands-on PEFT/LoRA fine-tune of a small open model on a narrow task (e.g. classifying or summarizing incident text — reuse your ops data domain), documented end-to-end.
- **Milestone:** a notebook + write-up you can walk an interviewer through, stating clearly what fine-tuning does and does not solve.

## Proof artifacts to build
- **RAG-over-codebase demo** (Phase 1) — open-source repo + README.
- **AI test-generation + AI code-review CI bot** (Phase 2) — running in GitHub Actions.
- **"Measuring AI coding-assistant impact" write-up** (Phase 3) — blog post / internal-style report with method and honest caveats.
- **PEFT/LoRA fine-tuning notebook** (Phase 4) — small, documented, reproducible.
- **Optional:** a short tech-talk deck ("Reimagining the SWE lifecycle with AI") — leans on your existing internal tech-sharing habit and the JD's "advocate adoption" theme.

## Interview prep
**Tell the story as "applied-LLM ops engineer → AI-for-SWE".** Lead with what you have actually shipped:
- "I designed an LLM-assisted incident-grouping system — embeddings plus LLM calls to cluster incidents by root cause, iterated v1 to v3 with a human-in-the-loop. It surfaced fleet-wide reliability trends per-incident triage missed." (Concrete, honest, shows iteration and evaluation instinct.)
- "I built an AI ops agent to automate investigation toil, and I use AI coding assistants daily — so I have a practitioner's view of where these tools help and where they break."
- Then bridge: "I want to take that applied instinct and generalize it across the software-development lifecycle — test generation, code review, debugging — and rigorously measure the impact, which is what this role is."

**Be honest about gaps, framed as trajectory:** "My LLM work is applied, not ML research — I haven't shipped production RAG or fine-tuned models in a work setting. I'm actively closing that: here's a RAG-over-codebase demo I built and a LoRA fine-tune I ran." Turning a gap into a demonstrated artifact is stronger than overclaiming.

**Public-sector angle:** connect reliability/toil-reduction work to citizen-facing service quality; express genuine interest in AI raising the baseline for an entire government engineering org, not one team.

**Stay current on:** SWE-bench / SWE-bench Verified, agentic coding tools (Claude Code, Cursor, Copilot Workspace, Devin-style agents), RAG evaluation techniques, DORA/SPACE productivity metrics, and the live debate on measured productivity gains vs. code-quality/security risks of AI-generated code.

## Timeline & success metrics
- **12 weeks**, ~6–8 hrs/week alongside work.
- **Success = four public proof artifacts** (RAG demo, AI test/review CI bot, impact write-up, fine-tuning notebook) and a rehearsed 3-minute narrative connecting applied-LLM ops to AI-for-SWE.
- **Checkpoint at week 6:** RAG demo + testing/review prototypes done — enough to apply and interview credibly even if Phases 3–4 are still in progress.
- **Leading indicator:** can you explain, with your own artifact as evidence, how you would evaluate whether an AI coding tool actually improves developer efficiency and software quality? When yes, you are interview-ready.
