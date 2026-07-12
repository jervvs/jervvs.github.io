---
title: "Eval-Driven Development"
date: 2026-07-12
description: "TDD for probabilistic systems: an eval that doesn't gate a decision is theater"
draft: true
series: "ai-software-engineering"
order: 23
tags: ["learning", "ai-software-engineering", "evaluation"]
---

*TDD for probabilistic systems: an eval that doesn't gate a decision is theater*

> **BLUF:** An eval you look at but never act on is a dashboard, not a test. Eval-driven development (EDD) makes the eval a **first-class artifact**: you define a metric and a threshold **before** the change, baseline the current system, make the change (prompt / model / retrieval / agent), re-run the eval, compare, and **gate** the merge or deploy on the result. This is TDD's red/green loop applied to systems whose output is a distribution, not a value. The hard parts are statistical (don't declare victory on n=5) and adversarial (don't tune the prompt on the eval you gate with). Get those wrong and you ship regressions that "passed."

---

## 1. Why gating is the whole point

> The failure mode isn't "no evals." It's evals that produce a number nobody is contractually obligated to respect. A metric with no gate is a suggestion; a metric with a gate is a decision procedure.

Teams build eval harnesses, print a score, admire it, and merge anyway "because the demo looked good." That is theater. The score has to change what happens next — block the merge, hold the deploy, revert the model bump — or it is pure cost.

EDD borrows the one structural property that makes TDD work: **the test is written before the change and the change is not accepted until the test says so.** For deterministic code the test asserts an exact value. For probabilistic systems the "test" asserts a *statistic over a sample* clears a threshold. Everything hard about EDD flows from that one substitution — pass/fail becomes pass-rate, equality becomes a confidence interval, and a single run becomes a distribution.

| | TDD (deterministic) | EDD (probabilistic) |
|---|---|---|
| Unit of truth | One assertion, exact | A statistic over a golden set |
| Pass condition | `assert x == 42` | `pass_rate ≥ τ` (with a CI) |
| Re-run stability | Identical every time | Varies by seed / sampling |
| Regression signal | Test flips red | Metric drops past threshold |
| Gate | CI blocks merge | CI blocks merge **on the aggregate** |
| Danger | Brittle tests | Overfitting + false victory on noise |

---

## 2. The EDD loop

> Mirror red/green exactly: you are never allowed to make the change before the metric and threshold exist. If you define the threshold *after* seeing the result, you've already p-hacked.

```
   ┌───────────────────────────────────────────────────────────┐
   │                                                             │
   ▼                                                             │
DEFINE ─▶ BUILD ─▶ BASELINE ─▶ CHANGE ─▶ RE-RUN ─▶ COMPARE ─▶ GATE
metric+   /extend   measure     prompt/   eval on   Δ vs.      block or
threshold golden    current     model/    same set  baseline   admit;
BEFORE    set       system      retrieval  (n seeds) w/ CI     feed result
change                          /agent                          back to DEFINE
```

| Stage | Action | Skip it and… |
|---|---|---|
| **Define** | Pick the metric (pass@k, kill-rate, trajectory success, groundedness) and the threshold τ **before** touching anything | You'll rationalize whatever number you get |
| **Build/extend** | Add golden cases covering the behavior you're about to change | The eval can't see the thing you changed |
| **Baseline** | Run the *current* system on the set — this is your control | No baseline = the Δ is meaningless |
| **Change** | Make exactly one intervention (isolate the variable) | Confounded result; can't attribute the Δ |
| **Re-run** | Same set, multiple seeds, same grader | Single-seed noise masquerades as signal |
| **Compare** | Δ against baseline with a confidence interval, not point vs. point | You act on noise |
| **Gate** | Regression → block; improvement clears CI → admit | You're back to theater |

> The loop is the [measurement flywheel](/writing/ai-software-engineering/pillars/05-measurement/) (instrument → baseline → intervene → compare → decide) scoped to a single change instead of an org rollout. Same physics, tighter radius. EDD is that flywheel run per-PR.

The golden set itself is out of scope here — how you build and grade it lives in [datasets & graders](/writing/ai-software-engineering/deep-dives/evaluation/01-datasets-and-graders/); for agents, success is a *trajectory* not an output, covered in [agent & trajectory evals](/writing/ai-software-engineering/deep-dives/evaluation/02-agent-and-trajectory-evals/).

---

## 3. Offline vs. online evals — you need both

> Offline evals catch what you *anticipated*. Online evals catch the distribution shift you didn't. Ship neither alone.

The golden set is a frozen photograph of the problem. Production is a live feed. A prompt that scores 0.92 offline can crater online because real traffic contains inputs, phrasings, and adversaries your curated set never imagined. Conversely, online-only means every regression is discovered by users — the most expensive possible detector.

| Axis | Offline eval | Online eval |
|---|---|---|
| Data | Curated golden set | Real production traffic |
| When | Pre-merge / pre-deploy | Post-deploy, live |
| Speed | Seconds–minutes | Hours–days to accumulate signal |
| Determinism | High (fixed set, seeded) | Low (traffic varies) |
| Cost per run | Low | Higher (real requests, labeling) |
| Gates | CI merge gate | Canary / rollback gate |
| Catches | Known regressions, anticipated cases | **Distribution shift, novel inputs, real-world harms** |
| Blind spot | Anything not in the set | Slow, needs volume; no "before" for new behavior |

**The flywheel closes when production feeds the golden set.** Sample real traffic (especially failures, low-confidence outputs, and guardrail trips), have humans label a slice, and promote the instructive cases into the offline set. Now the next offline run defends against the exact shift that hurt you in prod. This is the single highest-leverage habit in EDD: **every production incident becomes a permanent regression test.** The golden set stops being a photograph and becomes a growing memory of every way the system has failed.

```
prod traffic ─▶ sample (failures, low-conf, guardrail trips)
             ─▶ human labels a slice
             ─▶ promote instructive cases ─▶ golden set grows
             ─▶ next offline run now defends against that shift ─▶ (loop)
```

---

## 4. CI regression gates

> The rule that keeps EDD cheap and deterministic: **generation runs offline, scoring runs in CI.** Never put a nondeterministic LLM call on the merge path if you can avoid it.

Follow [prototype B's `gate.py`](/writing/ai-software-engineering/prototypes/b-test-generation/) pattern: a script that measures the metric, compares against a per-repo threshold constant, prints the numbers, and returns a nonzero exit code on regression so CI fails the job. The gate is boring on purpose — thresholds as constants, explicit FAIL lines, exit code as the contract.

```python
# eval_gate.py — block merge on regression. Deterministic scoring only.
import json, sys

MIN_PASS_RATE = 0.85          # per-repo, committed to git, reviewed like code
MAX_REGRESSION = 0.03         # allowed drop vs. baseline before we block

def main() -> int:
    # scores.json is produced OFFLINE (LLM generation already ran; outputs frozen).
    # CI only re-scores the frozen outputs with the deterministic grader.
    cur = json.load(open("scores.json"))["pass_rate"]
    base = json.load(open("baseline.json"))["pass_rate"]
    print(f"pass_rate={cur:.3f}  baseline={base:.3f}  Δ={cur-base:+.3f}")
    ok = True
    if cur < MIN_PASS_RATE:
        print(f"FAIL: {cur:.3f} < floor {MIN_PASS_RATE}"); ok = False
    if base - cur > MAX_REGRESSION:
        print(f"FAIL: regression {base-cur:.3f} > {MAX_REGRESSION}"); ok = False
    return 0 if ok else 1

if __name__ == "__main__":
    sys.exit(main())
```

```yaml
# .github/workflows/eval-gate.yml — runs the deterministic scorer, no API key
name: eval-gate
on: [pull_request]
jobs:
  gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.11" }
      - run: pip install -r requirements-eval.txt
      - run: python eval_gate.py     # exit 1 → merge blocked
```

**Two floors, not one.** An absolute floor (`MIN_PASS_RATE`) stops slow rot where every PR shaves 0.5% and nothing ever "regresses." A relative floor (`MAX_REGRESSION`) catches a single change that tanks the score even while above the floor. You want both.

### Flaky evals (stochastic pass/fail)

The same input can pass one seed and fail the next. A naive gate on a single run will flap red/green and teams will start ignoring it — the worst outcome, because a muted gate is theater with extra steps.

| Technique | Mechanism |
|---|---|
| **Multiple seeds** | Run each case `m` times; the case's score is the mean, not a coin flip |
| **Gate on the CI lower bound** | Require the *lower* end of the confidence interval ≥ τ, not the point estimate — you're being pessimistic on purpose |
| **Aggregate over the set** | Gate on the set-level pass-rate (variance shrinks with N), not per-case |
| **Quarantine** | Move known-flaky cases to a non-gating "watch" tier; fix or delete them — never let them silently soften the gate |
| **Keep CI deterministic** | Freeze LLM outputs offline; CI re-scores with a deterministic grader → zero nondeterminism on the merge path |

> If your grader is itself an LLM (LLM-as-judge), it is a source of flakiness *and* drift. Pin the judge model+prompt, seed it, and periodically re-validate it against human labels — a grader that quietly changes its mind invalidates every historical comparison. See [datasets & graders](/writing/ai-software-engineering/deep-dives/evaluation/01-datasets-and-graders/).

---

## 5. Statistical rigor — the differentiator

> This is where most "we have evals" teams are quietly wrong. They report a point estimate on a tiny sample and call a 3-point move a win. A 3-point move on n=20 is noise wearing a suit.

**Sample size / power.** A pass-rate near 0.5 on n=5 has a 95% CI roughly ±0.44 — it tells you almost nothing. You cannot detect a small improvement without enough cases to power it. Before running, ask: *what effect size do I need to detect, and how many cases does that require?* If the answer is "more than I have," your eval can't adjudicate the change — collect more cases or expect an inconclusive result. **Never declare victory on n=5.**

**Report intervals, not points.** For a pass-rate `p̂ = c/n`, report a binomial confidence interval (Wilson is well-behaved at the extremes; normal-approximation breaks near 0 and 1).

```python
from statsmodels.stats.proportion import proportion_confint
lo, hi = proportion_confint(count=c, nobs=n, alpha=0.05, method="wilson")
# gate on `lo`, not on c/n — be pessimistic about your own win
```

**Stochastic variance.** LLM output varies by seed even at temperature 0 (batching, kernel nondeterminism). Run `m` seeds per case and treat the case score as a mean with its own spread. Report the aggregate with variance from *both* sources: sampling across cases and stochasticity within a case.

**Significance + the peeking trap.** When comparing baseline vs. change, use a paired test (each case is its own control — McNemar's for paired binary outcomes, or a bootstrap over cases). But the subtler killer is **optional stopping**: if you re-run the eval after every tweak and stop the moment it looks good, you've p-hacked. Every "peek" is another chance for noise to cross your line.

| Sin | What it looks like | Fix |
|---|---|---|
| **Peeking** | Re-running until the number crosses τ, then stopping | Fix n and the stopping rule up front |
| **Optional stopping** | "Let me add 5 more cases and check again" | Pre-register sample size; don't grow mid-experiment to chase significance |
| **p-hacking** | Trying 10 prompt variants, reporting the best, ignoring the family | Correct for multiple comparisons; hold out a final confirm set |
| **Point-estimate victory** | "0.88 > 0.85, ship it" — no interval | Gate on the CI lower bound |

**Do-it-right exemplar: the METR RCT.** METR ran a randomized controlled trial with a real control arm and measured *outcomes*, and found the finding you cannot get from vibes — developers **perceived** a ~+20% speedup while the **measured** effect was ~−19% *(training cutoff Jan 2026 — verify live)*. A ~40-point gap between felt and real. That is the entire argument for gating on measurement instead of perception, and for having a control. For **staggered rollouts** (teams onboarded over time), difference-in-differences turns rollout order into a natural experiment. The mechanics — RCT design, covariate slicing, diff-in-diff — live in the [measurement pillar](/writing/ai-software-engineering/pillars/05-measurement/); don't re-derive them here, cross-reference them.

---

## 6. Anti-Goodhart & overfitting

> "When a measure becomes a target, it ceases to be a good measure." (Goodhart's law.) The instant you optimize *against* an eval, its score decouples from the real-world quality it was proxying. EDD's gate is a target by construction — so you must defend it.

The canonical trap in this codebase is [prototype A's held-out pitfall](/writing/ai-software-engineering/prototypes/a-eval-harness/): tune a prompt against the eval set and the score climbs while real behavior doesn't. **A prompt tuned on the eval *is* the eval** — it has memorized the answer key and stopped predicting generalization.

| Trap | Mechanism | Guard |
|---|---|---|
| **Prompt tuned on the gate** | Iterating against the same cases you gate with | Held-out set the prompt has *never* seen; report both, gate on held-out |
| **Metric myopia** | Optimizing one number (pass-rate) degrades others (latency, cost, tone) | Track a **basket** — pair every quality metric with a cost/safety counterweight, DORA-style |
| **Stale set overfit** | The frozen golden set gets memorized over months of iteration | Rotate and refresh cases; retire ones everything passes |
| **Grader gaming** | Output learns to please an LLM-judge's quirks, not users | Keep humans in the loop on a sampled slice; re-validate the judge |
| **Contamination** | Public benchmark cases leak into training data | Private/novel cases; paraphrase; track authoring date |

> The deepest guard is structural: **the set you tune on and the set you gate on must be disjoint.** Three-way split (train/dev/test) is not just for model weights — it applies to prompts, retrieval configs, and agent scaffolds too. Anything you iterate against is contaminated; keep a final confirm set locked until the decision.

Public benchmarks (SWE-bench et al.) are the industry-scale version of this trap: once a benchmark is the target, harnesses overfit it and leaderboard rank stops predicting your-repo value. Use them as a capability floor for vendor comparison, never as your gate. See the measurement pillar's benchmark section.

---

## 7. Online eval mechanics

> Offline gets you to "safe to try in prod." Online tells you whether it *actually* works on real traffic — before all of it is exposed.

| Mechanism | What it does | Gates on |
|---|---|---|
| **Shadow mode** | New system runs on real traffic in parallel; output logged, **not served** | Compare shadow vs. live offline — zero user risk |
| **Canary** | New system serves a small % of traffic | Guardrail metrics on the canary slice |
| **A/B** | Randomized split, statistically compared | Primary metric + guardrails, powered test |
| **Guardrail metrics** | Bright-line signals (error rate, latency p99, refusal rate, cost/req, harmful-output rate) | **Breach → automatic rollback** |

The sequence is a ratchet: **shadow → canary → progressive rollout**, with guardrail metrics wired to auto-rollback at each stage. Shadow mode is the highest-value/lowest-risk step and the most skipped — you get a real-traffic comparison for free because nothing is served to users.

Guardrails must trigger **rollback, not an email.** A guardrail that pages a human who then decides is a slow guardrail; encode the bright line and let it revert automatically. Humans tune the thresholds; the system enforces them.

Finally, **human labeling closes the loop** (§3): sample prod traffic — weighted toward guardrail trips and low-confidence outputs — label a slice, and promote the instructive cases into the offline golden set. Online detection becomes offline prevention.

---

## 8. Operating cadence

> Eval is a **standing capability**, not a one-time study. The one-time study answers "should we adopt X?" once and rots. The standing capability answers it for every X, forever, cheaply.

Once the golden set, gate, and online harness exist, the marginal cost of evaluating a change collapses. Every new model release, harness upgrade, prompt edit, or retrieval tweak becomes a **cheap experiment** run through the exact same loop: baseline → change → compare → gate. That is the compounding payoff — you build the instrument once and every future decision rides it instead of re-litigating from scratch.

This is deliberately the same shape as the [measurement pillar's flywheel](/writing/ai-software-engineering/pillars/05-measurement/) — **instrument → baseline → intervene → compare → decide** — scoped down from org-rollout to per-change. EDD *is* that flywheel, operationalized at the granularity of a PR and wired into CI. The [quality & testing pillar](/writing/ai-software-engineering/pillars/03-quality-and-testing/) frames why this belongs next to your test suite rather than in a notebook; the [foundations pillar](/writing/ai-software-engineering/pillars/01-foundations/) covers the verifiable-reward substrate the whole thing rests on.

> Build the loop once; run every future model, prompt, and harness through it. A change that can't clear the gate doesn't merge — and a gate that never blocks anything isn't a gate, it's a decoration. If your eval has never once stopped a change, you don't yet have EDD.

---

## Related
- [Deep-dive index](/writing/ai-software-engineering/deep-dives/evaluation/README/)
- [Datasets & graders](/writing/ai-software-engineering/deep-dives/evaluation/01-datasets-and-graders/)
- [Agent & trajectory evals](/writing/ai-software-engineering/deep-dives/evaluation/02-agent-and-trajectory-evals/)
- [Overview](/writing/ai-software-engineering/README/)
- [Concept map](/writing/ai-software-engineering/concept-map/)
- [Measurement pillar](/writing/ai-software-engineering/pillars/05-measurement/)
- [Quality & testing pillar](/writing/ai-software-engineering/pillars/03-quality-and-testing/)
- [Foundations pillar](/writing/ai-software-engineering/pillars/01-foundations/)
- [Prototype A — eval harness](/writing/ai-software-engineering/prototypes/a-eval-harness/)
- [Prototype B — test generation & the CI gate](/writing/ai-software-engineering/prototypes/b-test-generation/)

## Sources
- METR — *Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity* (RCT with controls; the perceived-+20% vs. measured-−19% gap): https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/
- Anthropic — agentic coding best practices: https://code.claude.com/docs/en/best-practices
- SWE-bench (benchmark overfitting as the industry-scale Goodhart trap): https://www.swebench.com/
