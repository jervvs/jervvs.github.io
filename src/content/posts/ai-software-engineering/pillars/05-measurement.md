---
title: "Measuring the Impact of AI on Software Engineering"
date: 2026-07-12
description: "How to know whether AI is actually helping — and not just feeling helpful"
draft: true
series: "ai-software-engineering"
order: 14
tags: ["learning", "ai-software-engineering", "pillars"]
---

*How to know whether AI is actually helping — and not just feeling helpful*

> **BLUF:** Perception is a broken sensor. Developers cannot reliably feel their own speedup — in a controlled study they were slower while believing they were faster. Measure **outcomes** through controlled rollouts (A/B, staggered diff-in-diff), track defect rate and rework alongside speed, and validate agents on **your** codebase, not on public benchmarks. Never make an adoption decision on self-reported time saved.

---

## The perception paradox

> The most important finding in AI-for-code measurement is that the people using the tools are the least reliable narrators of their own productivity.

METR ran a randomized controlled trial in early 2025 with experienced open-source developers working on repositories they knew well. The result inverted every expectation:

| Signal | Value |
|---|---|
| Expected speedup (before the study) | ~ +24% faster |
| Perceived speedup (after, self-reported) | ~ +20% faster |
| **Measured actual effect** | **~ 19% SLOWER** |

*(training cutoff Jan 2026 — verify live)* Source: METR, *Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity*.

The gap between "felt +20%" and "measured −19%" is roughly 40 points. That is the entire problem in one number: if you steer adoption by how good the tools feel, you can accelerate straight into a regression and never see it.

**Caveats — read them, they bound the claim.** This is one study, and its scope is narrow:

- **Experienced devs on mature, familiar repos.** These developers had deep context the AI lacked; the AI's suggestions often needed correction to meet repo norms. This is the *worst* case for AI assistance, not the average case.
- **Early-2025 tooling.** Models and agent harnesses have moved fast since. The specific magnitude is already stale.
- **Task mix matters.** Greenfield work, unfamiliar languages, and boilerplate likely show the opposite sign (see the covariate split below).

> **The lesson is not "AI makes you slower."** The lesson is that self-reported speedup is worthless as a metric, and that the sign of the effect flips with context. You must measure, and you must measure the right thing in the right conditions.

---

## Measurement frameworks

> Don't invent a metric program. Adopt an established framework and adapt it — DORA for delivery health, SPACE for the human/system picture, DX Core 4 for a pragmatic blend.

| Framework | What it measures | Gaming resistance | Best use |
|---|---|---|---|
| **DORA** | Delivery performance: deploy frequency, lead time for changes, change-failure rate, MTTR (failed-deployment recovery) | **High** — the four are self-balancing: pushing deploy freq while ignoring change-fail rate shows up immediately | Team/org delivery health; the throughput+stability baseline you compare against |
| **SPACE** | Multi-dimensional: **S**atisfaction, **P**erformance, **A**ctivity, **C**ommunication, **E**fficiency/flow | **High** by design — explicitly warns against single-metric use; forces triangulation across dimensions | Whole-system view; catching second-order effects (burnout, review load) a delivery metric misses |
| **DX Core 4** | Consolidated model over Speed, Effectiveness, Quality, Business impact (unifies DORA + SPACE + developer experience) | **Medium-High** — balanced scorecard, but simpler to report and therefore easier to cherry-pick | A practical starting scorecard when DORA feels too narrow and SPACE too abstract |

> DORA's genius is that the four metrics are **antagonistic**. Speed metrics (deploy freq, lead time) pull against stability metrics (change-fail, MTTR). You cannot game one without the other moving. Any AI-impact metric you add should inherit this property: pair every velocity signal with a quality signal.

---

## What to actually measure for AI adoption

> Velocity alone will mislead you, because AI's characteristic failure mode is **producing more code, faster, that costs more to maintain.** More output can look like a win in every speed metric while quietly raising defect and rework rates. Always pair speed with quality.

**Measure these:**

| Metric | What it catches | Why it matters for AI |
|---|---|---|
| **Escaped defect / change-failure rate** | Bugs reaching production; deploys needing a fix/rollback | The primary counterweight to "faster". If AI raises velocity and this too, you're shipping liabilities |
| **Rework & code churn** | Lines rewritten/deleted within N days of authoring | AI-generated code that gets torn out fast is *negative* work disguised as throughput |
| **Cycle time** | Commit → production (or PR-open → merge) | Honest end-to-end speed, including review and rework — not just how fast the first draft appeared |
| **Review latency & review load** | Time PRs sit; reviewer effort per PR | AI shifts cost from author to reviewer. If PRs get bigger/faster but reviews slow down, net flow may be worse |
| **Test coverage & mutation score** | Whether new code is actually exercised; whether tests *detect* faults | AI writes plausible tests that assert little. Mutation score is the gaming-resistant check on test quality |

**Avoid these vanity metrics:**

- ~~Lines of code produced~~ — AI trivially inflates this; more lines is a cost, not an achievement.
- ~~AI suggestion acceptance rate~~ — measures habit and UI friction, not value; accepted code that gets reworked is worse than rejected code.
- ~~Self-reported time saved~~ — the METR paradox: the sensor reads +20% while reality reads −19%.
- ~~"% of code written by AI"~~ — a provenance number with no link to outcome quality.

> Rule of thumb: if a metric goes up when a developer does something obviously unproductive (writes verbose code, accepts bad suggestions, clicks "accept" reflexively), it's a vanity metric. Cut it.

---

## Study design

> Treat AI rollout as an experiment, not a rollout. Without a control you cannot separate the tool's effect from seasonality, team changes, or the codebase getting easier/harder.

**Designs, strongest first:**

| Design | How it works | When to use |
|---|---|---|
| **Randomized A/B** | Randomly assign developers or tasks to AI / no-AI arms | Gold standard; needs enough participants and comparable tasks to power it |
| **Staggered rollout + difference-in-differences** | Enable AI team-by-team over time; compare each team's before/after *against* not-yet-enabled teams | Realistic for orgs — you're deploying anyway; the rollout order becomes your natural experiment |
| **Interrupted time series** | Track metrics across a single hard cutover date | Weakest — no control group; vulnerable to anything else that changed that week |

**Control for these covariates or your result is noise:**

- **Task type** — bug fix vs. feature vs. refactor vs. boilerplate. Effects differ by kind and sign.
- **Developer experience** — with the language, the repo, and with AI tooling itself. METR's slowdown came from high-context experts; novices on the same task may show the opposite.
- **The greenfield/familiar split — the single most important covariate:**

| Context | Likely AI effect | Why |
|---|---|---|
| **Greenfield / unfamiliar** codebase or language | Often strongly **positive** | AI supplies context and idioms the developer lacks; low bar to clear |
| **Mature / familiar** codebase (the METR condition) | Neutral to **negative** | Developer already holds the context; AI adds correction overhead and repo-norm mismatches |

> Report AI impact *sliced by this split*, never as a single blended number. A pooled average hides two opposite effects and gives you a meaningless middle.

---

## Benchmarks: useful signal, dangerous proxy

> **SWE-bench Verified** is the standard yardstick for agentic coding — real GitHub issues an agent must resolve with a passing test. Top systems reached roughly **70–80%** by late 2025 *(training cutoff Jan 2026 — verify live at https://www.swebench.com/)*. Treat it as a capability floor for vendor comparison, never as a prediction of performance on your code.

**The limits are structural, not fixable:**

- **Contamination.** Benchmark issues and their fixes are public and in training data. High scores may reflect memorization, not reasoning.
- **Gaming / overfitting.** Once a benchmark is the target, harnesses get tuned to it. Leaderboard position optimizes for the leaderboard.
- **Benchmark ≠ your repo.** Public issues are curated and self-contained. Your codebase has private context, tribal conventions, undocumented coupling, and messy history that no public benchmark captures.

> A model at 75% on SWE-bench Verified tells you it *can* do agentic coding. It tells you almost nothing about whether it will succeed in your service mesh, your database migration, or your CI. The correlation between benchmark rank and internal value is loose.

**Conclusion — internal evals beat public benchmarks.** Build an eval harness over *your own* codebases: representative tasks, real acceptance criteria, your test suite as the oracle. This is the only measurement that survives contact with your reality. See [foundations → evals](/writing/ai-software-engineering/pillars/01-foundations/), the [evaluation deep-dive](/writing/ai-software-engineering/deep-dives/evaluation/README/), and the [eval-harness prototype](/writing/ai-software-engineering/prototypes/a-eval-harness/).

---

## Building the measurement flywheel

> Measurement is not a one-time study; it's a loop you keep running as tools and models change under you.

```
   ┌──────────────────────────────────────────────┐
   │                                                │
   ▼                                                │
INSTRUMENT ─▶ BASELINE ─▶ INTERVENE ─▶ COMPARE ─▶ DECIDE
   │             │            │           │          │
   │             │            │           │          └─ adopt / roll back /
   │             │            │           │             re-scope; feed the
   │             │            │           │             decision back in
   │             │            │           └─ diff-in-diff vs. control;
   │             │            │              slice by task & experience
   │             │            └─ enable AI for one arm / staggered cohort
   │             └─ capture ≥1 cycle of DORA + quality metrics, no AI
   └─ wire up cycle time, change-fail, churn, review latency, mutation score
```

| Stage | Do this | Failure if skipped |
|---|---|---|
| **Instrument** | Pipe delivery + quality metrics from CI/VCS/incident tooling into one place | No data = opinions win arguments |
| **Baseline** | Measure at least one full cycle *before* AI | No baseline = every later number is unanchored |
| **Intervene** | Roll out to one arm/cohort, keep a control | No control = can't attribute the change |
| **Compare** | Diff-in-diff; slice by task type and dev experience | Blended averages hide opposite-signed effects |
| **Decide** | Adopt, roll back, or re-scope; then loop | Measuring without deciding is theater |

> The flywheel's real payoff is compounding: once instrumented and baselined, every new model, agent harness, or workflow change becomes a cheap experiment instead of a leap of faith. Build the loop once; run every future decision through it.

---

## Related
- [Overview](/writing/ai-software-engineering/README/)
- [Concept map](/writing/ai-software-engineering/concept-map/)
- [Foundations](/writing/ai-software-engineering/pillars/01-foundations/)
- [Agentic workflow](/writing/ai-software-engineering/pillars/02-agentic-workflow/)
- [Quality and testing](/writing/ai-software-engineering/pillars/03-quality-and-testing/)
- [Security](/writing/ai-software-engineering/pillars/04-security/)
- [Prototype A — eval harness](/writing/ai-software-engineering/prototypes/a-eval-harness/)

## Sources
- METR — *Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity* (2025 RCT): https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/
- SWE-bench (Verified leaderboard): https://www.swebench.com/
- Anthropic — Claude Code agentic-coding best practices: https://code.claude.com/docs/en/best-practices
