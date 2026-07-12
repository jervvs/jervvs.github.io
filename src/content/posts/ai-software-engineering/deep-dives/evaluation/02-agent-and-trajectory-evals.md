---
title: "Agent & Trajectory Evals"
date: 2026-07-12
description: "Grading a single call scores a string. Grading an agent must score a path — and the path is where agents fail."
draft: true
series: "ai-software-engineering"
order: 22
tags: ["learning", "ai-software-engineering", "evaluation"]
---

*Grading a single call scores a string. Grading an agent must score a path — and the path is where agents fail.*

> **BLUF:** Evaluating one LLM call scores an output. Evaluating an agent must score a **trajectory** — the whole stochastic sequence of tool calls that produced the output. Outcome-only evals are necessary but blind to *how* the agent got there: an agent can reach the right answer via an unsafe, wasteful, or lucky path, and an outcome check gives that run a green tick. You need both axes — outcome first to know *if* it worked, trajectory second to know *whether it worked for the right reasons* and to catch the unsafe wins. And because agents are stochastic, one run is not a measurement: run N times, report the distribution, and hold yourself to a **reliability** floor (`pass^k`), not a capability ceiling.

---

## 1. Why the single-call playbook breaks

> **BLUF:** Everything in [chapter 01](/writing/ai-software-engineering/deep-dives/evaluation/01-datasets-and-graders/) — a dataset of `(input → expected)` pairs, a grader that scores the output — assumes the thing under test is a *function*: one input, one output, grade the output. An agent is not a function. It is a **process** with hidden intermediate state, non-deterministic branching, side effects on the world, and a variable-length path to the answer.

A single model call has one degree of freedom you grade: the string it emitted. An agent has many, and most of them are invisible to an outcome check:

| What you could grade | Single call | Agent |
|---|---|---|
| Final output string | yes | yes |
| Which tools it chose | n/a | **yes — and it can pick wrong ones** |
| Order of operations | n/a | **yes — read-before-write, check-before-act** |
| Number of steps / tokens / dollars | fixed | **variable — can 10x** |
| Side effects on the world | none | **writes, deletes, deploys, spend** |
| Whether evidence is real | mostly n/a | **can fabricate — cite tool output that never returned** |

The consequence: the two most dangerous agent failures are **invisible to an outcome-only eval**. A run that guessed the right answer with zero grounding passes. A run that got the right answer by force-restarting a prod service passes. Both are landmines you shipped with a green dashboard.

> **Trap:** "Our agent scores 82% on the task set" tells you almost nothing on its own. 82% *of what* — one run each? At what step/cost budget? With how many runs that succeeded only because they took an irreversible action you'd never allow in prod? An agent score without a distribution, a budget, and a safety count is a vanity metric.

---

## 2. Outcome vs. trajectory evals

> **BLUF:** These are two different questions. Outcome: *did the final state pass a verifiable check?* Trajectory: *was the path to that state correct, efficient, grounded, and safe?* Run outcome first — it's cheap, deterministic, and gates everything. Run trajectory second — it explains failures and catches the unsafe wins outcome can't see.

| Axis | Outcome eval | Trajectory eval |
|---|---|---|
| **Question** | Is the end state right? | Was the path right? |
| **What it checks** | Tests green; correct root-cause category; file has expected content; API returns 200 | Correct tools chosen; valid arguments; sane order; no wasted loops; no unsafe/irreversible action; every claim grounded in a real tool result |
| **Signal type** | Verifiable reward — a clean boolean, no rater | Mix: deterministic assertions + reference comparison + LLM-judge over the transcript |
| **Determinism** | High (if the checker is deterministic) | Assertions high; judge-scored process quality fuzzy |
| **Catches** | "Did it work?" | "Did it work *for the right reasons*?" — the lucky guess, the unsafe win, the 100-step slog |
| **Blind to** | *How* it got there; cost; safety; grounding | Whether the answer was actually correct |
| **Run order** | **First — gates the rest** | Second — explains and audits |

> **Insight:** Outcome and trajectory are not redundant, they are *orthogonal*. A run can be `outcome=PASS, trajectory=FAIL` (right answer, unsafe path) or `outcome=FAIL, trajectory=PASS` (perfect method, the environment made success impossible). You want to know which quadrant every run lands in. Collapsing to a single number throws away exactly the information that tells you whether to trust the agent in production.

The canonical unsafe win: an incident agent asked to *diagnose* a latency spike concludes "the pod is wedged," and — because it had a `restart_pod` tool — restarts it. Latency recovers. Outcome check: latency healthy → **PASS**. Trajectory check: agent took a write action during a read-only diagnosis task → **SAFETY VIOLATION**. Ship on the outcome number and you've certified an agent that reboots prod on a hunch. This is exactly why [prototype C](/writing/ai-software-engineering/prototypes/c-incident-triage-agent/) keeps its tools read-only and routes `proposed_action` through a human gate — the safety property is enforced by the harness, and the eval asserts it was never breached.

---

## 3. The metrics that matter for agents

> **BLUF:** Task success rate is the headline, but it is the *least* discriminating number you have. The metrics that separate a demo from a production agent are **reliability** (`pass^k`), **tool-use correctness**, **efficiency**, **safety**, **grounding**, and **calibration**. Track all of them per run; aggregate to distributions.

| Metric | Definition | Why it matters | How to measure |
|---|---|---|---|
| **Task success rate** | Fraction of tasks where the outcome check passes, over N runs | The headline — but a point estimate hides variance | Outcome checker; report mean ± spread across N |
| **`pass@k`** | Task counts as solved if **≥1 of k** attempts passes | **Capability ceiling** — what the agent *can* do with retries | Sample k, OR the booleans |
| **`pass^k`** | Task counts as solved only if **ALL k** attempts pass | **Reliability floor** — what the agent does *every time*. This is the production bar | Sample k, AND the booleans |
| **Tool-use correctness** | Right tool selected; arguments valid against schema; errors handled not ignored | Wrong tool / malformed args is the #1 agent failure mode | Assertions on the tool-call log |
| **Efficiency** | Steps, tokens, wall-clock, $ per successful task | A correct answer at 100 steps / $2 / 5 min can still fail the real bar | Instrument the loop; see §6 |
| **Safety** | Stayed within permissions; attempted no irreversible/unsafe action | The unsafe win must fail even when the outcome passes | Allowlist assertion on every tool call |
| **Grounding / faithfulness** | Every claim in the answer is backed by a real tool output; no fabricated evidence | Ungrounded correctness is a coin flip that landed heads | Cross-check cited evidence against the tool-result log |
| **Calibration** | Stated confidence tracks actual correctness | Overconfidence is the trait that makes an agent dangerous to automate | Bin by confidence, plot accuracy per bin |

### `pass@k` vs. `pass^k` — get this right or you'll ship the wrong agent

This is the single most important distinction in agent evaluation, and the two symbols look almost identical.

```
Given k independent attempts at one task, each succeeding with prob p:

  pass@k  =  P(at least one succeeds)  =  1 − (1 − p)^k     ← rises with k
  pass^k  =  P(all k succeed)          =  p^k               ← falls with k
```

They move in **opposite directions** as you add attempts, and they answer opposite questions:

| | `pass@k` | `pass^k` |
|---|---|---|
| Reads as | "pass *at* k" | "pass *to the power of* k" |
| Succeeds when | ANY attempt passes | EVERY attempt passes |
| As k grows | → 1.0 (looks better) | → 0.0 (looks worse) |
| Measures | **Capability** — can it ever? | **Reliability** — does it always? |
| Honest for | Research ceilings, retry-tolerant offline work | **Production agents users depend on** |
| Gameable by | Cranking retries | Nothing — it punishes variance |

> **Insight:** `pass@k` is the number vendors quote because it flatters. A `pass@10` of 0.95 can hide a per-attempt `p` of just 0.26 — an agent that fails three of four times but occasionally gets lucky. `pass^k` is the number your users experience, because in production an agent doesn't get 10 tries and a human picking the winner — it acts once, and its worst run is your incident. **Report `pass^k`. If a stakeholder only wants one number for a production agent, give them `pass^k`, not `pass@k`.**

Worked contrast: an agent with per-task `p = 0.9`.

| Metric | k=1 | k=3 | k=5 |
|---|---|---|---|
| `pass@k` (capability) | 0.90 | 0.999 | 0.99999 |
| `pass^k` (reliability) | 0.90 | 0.729 | 0.590 |

The same agent looks near-perfect on `pass@k` and barely-better-than-a-coin-flip-over-five-runs on `pass^k`. Both are true. Only one predicts how a user's Tuesday goes.

---

## 4. The non-determinism problem

> **BLUF:** An agent is stochastic — sampling temperature, tool-result timing, and model-version drift all fork the trajectory. **A single run is not a measurement, it's an anecdote.** Run each task N times, report the *distribution* (success rate + variance), gate on `pass^k`, and freeze everything you're not deliberately measuring so a regression is attributable to the agent — not to drifting data.

The discipline, in order of leverage:

1. **Run N times, report the distribution.** Never a point estimate. `success = 6/8, variance visible` beats `success = 75%`. A task at 8/8 and a task at 4/8-±-huge-spread are wildly different production risks that average to the same headline.
2. **Gate on `pass^k`, not the mean.** The mean rewards an agent that's brilliant half the time. Production wants the floor.
3. **Pin the sources of drift you're not testing.** Model version (exact id, not a moving alias), temperature, system prompt version, tool schema, and dataset snapshot. Any unpinned variable turns a regression hunt into a ghost hunt.
4. **Deterministic replay of the environment.** This is the one people skip and regret. If the agent's tools hit *live* logs, metrics, or APIs, the ground under the eval moves between runs — yesterday's incident looks different today, and you can no longer tell whether a score drop is *your agent regressing* or *the world changing*. Freeze the environment: recorded tool responses, frozen data snapshots, a fixed clock.

> **Insight:** Determinism is a *spectrum you engineer*, not a property you're given. You will never make the LLM deterministic (and low temperature only narrows the spread, it doesn't eliminate it). But you *can* make everything else deterministic — the environment, the data, the tool responses, the clock — so that the only remaining source of variance is the model itself. Then N runs measure the agent's intrinsic reliability instead of a convolution of agent noise and world noise.

[Prototype C](/writing/ai-software-engineering/prototypes/c-incident-triage-agent/) is the reference implementation of this idea: every incident is a `{alert, frozen snapshot, root-cause label}` triple, and its tools (`search_logs`, `query_metric`, `get_recent_deploys`) read **only** from the frozen snapshot. Replay the same incident a thousand times and the *evidence* is byte-identical every time — so any variance in the score is the agent's, and a regression is attributable to a prompt/model/tool change, not to log rotation. That frozen snapshot is what converts "flaky demo" into "regression-trackable eval."

---

## 5. Trajectory scoring methods

> **BLUF:** Score the transcript three ways, in descending order of trust: **assertions** (deterministic, cheap, unambiguous — use for everything you can express as a rule), **reference-trajectory comparison** (for tasks with a canonical path), and **LLM-judge over the transcript** (only for fuzzy process quality, with all the judge caveats from chapter 01). Prefer assertions; reach for the judge last.

| Method | How it works | Best for | Cost | Trust |
|---|---|---|---|---|
| **Assertion-based** | Rules over the tool-call log: `assert called("read_file") before called("write_file")`; `assert never_called_write_tool()`; `assert all_args_valid_against_schema()`; `assert step_count <= 20` | Order constraints, safety invariants, budgets, argument validity — **anything expressible as a rule** | Trivial | **Highest — deterministic, no rater** |
| **Reference-trajectory comparison** | Compare the observed tool sequence against a golden path; score by edit distance / set overlap of `(tool, key-args)` | Tasks with a canonical method; catching "wandered off the known-good path" | Low | High, but brittle — punishes valid alternative paths |
| **LLM-judge over transcript** | Feed the full transcript to a judge model, score against a rubric ("Was investigation systematic? Did it stop once it had enough evidence? Any wasted loops?") | Fuzzy *process quality* that resists rules — coherence, efficiency-of-reasoning, whether it gave up too early | High (a full extra model call per run, long context) | Lowest — inherits every judge pitfall |

Assertions carry the load. Most of what you care about *is* a rule:

```
def score_trajectory(trace) -> TrajectoryResult:
    tool_calls = [s for s in trace.steps if s.type == "tool_call"]

    return TrajectoryResult(
        # SAFETY — hard fail, dominates outcome
        safety_ok      = all(c.name in ALLOWED_TOOLS for c in tool_calls)
                         and not any(c.name in WRITE_TOOLS for c in tool_calls),
        # ORDER — read before any write; check before act
        order_ok       = index_of("read") < index_of("write") if has("write") else True,
        # VALIDITY — every argument type-checks against the tool schema
        args_valid     = all(validate(c.name, c.args) for c in tool_calls),
        # EFFICIENCY — inside the step budget, no repeated identical calls
        no_wasted_steps= len(tool_calls) <= STEP_BUDGET
                         and no_duplicate_calls(tool_calls),
        # GROUNDING — every cited evidence line traces to a real tool result
        grounded       = all(ev in observed_tool_outputs(trace)
                             for ev in trace.final_answer.evidence),
    )
```

> **Trap:** Reference-trajectory comparison feels rigorous and is quietly brittle. There is usually more than one correct path — an agent that queried metrics *before* logs (equally valid) scores as a deviation against a logs-first golden path, and you spend a week "fixing" an agent that was never broken. Use reference comparison to flag *large* divergences for review, never as a pass/fail gate. Assert the *invariants* that must hold on every valid path (safety, order, grounding), not the *specific path* one human happened to take.

The judge caveats from [chapter 01](/writing/ai-software-engineering/deep-dives/evaluation/01-datasets-and-graders/) apply in full and then some: transcripts are long (position bias and cost both scale with length), the judge can be fooled by an agent that *narrates* confidently while doing the wrong thing, and a judge scoring "process quality" is even fuzzier than one scoring a final answer. Pin the judge model version, force structured `{score, reason}` output, and spot-check judge scores against human review on a sample — the same way you'd calibrate any other grader.

---

## 6. Cost & latency are eval axes, not footnotes

> **BLUF:** A correct answer that took 100 steps, $2, and five minutes can still fail the real bar. Cost and latency are not reporting-time trivia you glance at after — they are **pass/fail axes**. Put explicit budgets in the eval and fail runs that blow them, even when the outcome is correct.

The reason is economic and behavioral, not aesthetic:

- **Cost compounds at scale.** $0.50 per task in the eval is $50k across 100k production runs. An agent that's 3% more accurate but 4x more expensive is often the wrong trade — and you can only see that trade if cost is *in* the score.
- **Latency is a correctness property for interactive agents.** A triage agent that's right after five minutes is wrong, because the human already escalated. The deadline is part of the spec.
- **Unbudgeted evals reward pathological behavior.** Without a step cap, an agent "succeeds" by brute-forcing 60 tool calls until something sticks — a trajectory that would time out, rate-limit, or bankrupt you in prod. The eval blessed it because the outcome bit was green.

Encode budgets as first-class failure conditions:

```
BUDGETS = {"max_steps": 20, "max_tokens": 40_000, "max_usd": 0.25, "max_seconds": 90}

def run_passes(run) -> bool:
    return (run.outcome_ok
            and run.safety_ok
            and run.steps   <= BUDGETS["max_steps"]
            and run.tokens  <= BUDGETS["max_tokens"]
            and run.usd     <= BUDGETS["max_usd"]
            and run.seconds <= BUDGETS["max_seconds"])
```

> **Insight:** Make budget breach a **distinct** failure category, not a silent merge into `FAIL`. "Correct but over-budget" and "wrong answer" demand different fixes — the first is a prompt/tooling efficiency problem, the second is a capability problem. Bucketing them together hides which one you actually have. A useful report shows the split: `PASS / FAIL-wrong / FAIL-unsafe / FAIL-over-budget`.

---

## 7. A worked agent-eval harness

> **BLUF:** Run each task N times against a **frozen** environment; per run record `(success, steps, tokens, usd, safety_violations, grounded, seconds)`; aggregate to a success-rate distribution, `pass^k`, and mean cost. This is the outcome check from [prototype A](/writing/ai-software-engineering/prototypes/a-eval-harness/) plus the trajectory and cost axes this chapter adds.

```python
from math import comb
from statistics import mean, pstdev
from dataclasses import dataclass

@dataclass
class RunRecord:
    success: bool            # outcome check passed
    safety_ok: bool          # no unsafe/irreversible action attempted
    grounded: bool           # every claim backed by a real tool result
    steps: int
    tokens: int
    usd: float
    seconds: float

def pass_hat_k(samples: list[bool], k: int) -> float:
    """pass^k over the empirical results: P(all of k independent draws pass).
    Unbiased over n draws with c successes: C(c, k) / C(n, k)."""
    n, c = len(samples), sum(samples)
    return comb(c, k) / comb(n, k) if c >= k else 0.0

def eval_agent(tasks, agent, N=8, k=5, budgets=BUDGETS):
    report = {}
    for task in tasks:
        runs: list[RunRecord] = []
        for _ in range(N):
            env   = task.frozen_env()          # deterministic replay — §4
            trace = agent.run(task.prompt, env) # one full trajectory
            traj  = score_trajectory(trace)     # §5 assertions
            rec = RunRecord(
                success   = task.outcome_check(env.final_state) and traj.safety_ok,
                safety_ok = traj.safety_ok,
                grounded  = traj.grounded,
                steps     = trace.steps_used,
                tokens    = trace.tokens_used,
                usd       = trace.usd_used,
                seconds   = trace.wall_seconds,
            )
            runs.append(rec)

        # A run only "passes" if it is correct AND safe AND within budget.
        passes = [
            r.success and r.usd <= budgets["max_usd"]
            and r.steps <= budgets["max_steps"]
            and r.seconds <= budgets["max_seconds"]
            for r in runs
        ]
        report[task.id] = {
            "success_rate":  mean(passes),                 # distribution, not a point
            "success_stdev": pstdev(passes),               # variance is the risk signal
            f"pass^{k}":     pass_hat_k(passes, k),         # RELIABILITY floor — the bar
            "safety_fails":  sum(not r.safety_ok for r in runs),   # must be 0 to ship
            "ungrounded":    sum(not r.grounded for r in runs),
            "mean_usd":      round(mean(r.usd for r in runs), 4),
            "mean_steps":    round(mean(r.steps for r in runs), 1),
            "p95_seconds":   sorted(r.seconds for r in runs)[int(0.95 * (N - 1))],
        }
    return report
```

What the report makes impossible to miss:

- **Distribution, not a point** — `success_rate` next to `success_stdev`. High mean + high variance is a *reliability* problem hiding behind a decent average.
- **`pass^k` is the gate** — the reliability floor, not the flattering ceiling.
- **`safety_fails` must be zero** — a non-zero count blocks promotion regardless of success rate. This is the unsafe-win tripwire from §2.
- **Cost and latency sit beside accuracy** — so the "correct but too slow / too expensive" trade is visible at decision time, not discovered in the prod bill.

---

## 8. Where this lands

> **BLUF:** The two prototypes in this knowledge base *are* the two halves of this chapter. Prototype A's self-repair loop is already a trajectory; prototype C is already frozen-replay trajectory scoring. And the number that clears an agent for production is your **internal** eval on *your* tasks — never a public benchmark.

- **[Prototype A](/writing/ai-software-engineering/prototypes/a-eval-harness/) — the self-repair loop is a trajectory.** The moment the harness re-prompts with failing test output and loops, "did the tests pass" stops being a single-call check and becomes "did this *sequence* of attempts converge." Every axis here applies: how many repair attempts (efficiency), did feeding test output back open an injection path (safety), did the fix address the failure or thrash (grounding). A self-repair loop that succeeds on attempt 4 of 4 is a *different* production risk than one that succeeds on attempt 1 — and only a trajectory view sees the difference.
- **[Prototype C](/writing/ai-software-engineering/prototypes/c-incident-triage-agent/) — frozen replay + category/judge scoring, end to end.** Read-only tools over a frozen snapshot (deterministic replay, §4), category match by exact assertion + free-text by bounded LLM-judge (two of the three scoring methods, §5), structural answer-leakage prevention, and `mean_confidence` tracked beside accuracy (calibration, §3). It is this chapter as running code.

> **Insight:** SWE-bench and its kin are useful *capability* signals and nothing more. They tell you an agent *can* do a class of task; they cannot tell you it does *your* task, on *your* codebase, within *your* budget, without touching *your* prod. Public benchmarks are also the most contaminated data on the internet — a high score can be memorization, not skill. **Internal agent evals — built from your real tasks, scored on outcome + trajectory + cost, gated on `pass^k` and zero safety violations — are what decide production-readiness. The benchmark gets the agent in the door; your eval decides if it ships.**

---

## Related

- [Deep-dive index](/writing/ai-software-engineering/deep-dives/evaluation/README/) — the evaluation chapter set
- [Chapter 01 — Datasets & graders](/writing/ai-software-engineering/deep-dives/evaluation/01-datasets-and-graders/) — the single-call foundation this chapter extends; judge caveats live here
- [Chapter 03 — Eval-driven development](/writing/ai-software-engineering/deep-dives/evaluation/03-eval-driven-development/) — turning these evals into the loop you build against
- [Overview](/writing/ai-software-engineering/README/) — knowledge base entry point
- [Concept map](/writing/ai-software-engineering/concept-map/) — how these ideas connect
- [Pillar 02 — Agentic workflow](/writing/ai-software-engineering/pillars/02-agentic-workflow/) — the perceive→plan→act→observe loop being graded
- [Pillar 05 — Measurement](/writing/ai-software-engineering/pillars/05-measurement/) — pass@k, calibration, and regression tracking in depth
- [Prototype A — Eval harness](/writing/ai-software-engineering/prototypes/a-eval-harness/) — verifiable rewards; the self-repair trajectory
- [Prototype C — Incident-triage agent](/writing/ai-software-engineering/prototypes/c-incident-triage-agent/) — frozen replay + trajectory scoring in code

## Sources

- Anthropic — Agentic coding best practices: https://code.claude.com/docs/en/best-practices
- SWE-bench — real-world agentic coding benchmark (capability signal, not a production gate): https://www.swebench.com/
- `pass@k` unbiased estimator (Codex paper) and `pass^k` reliability framing: verify formulas and current usage live *(training cutoff Jan 2026)*.
