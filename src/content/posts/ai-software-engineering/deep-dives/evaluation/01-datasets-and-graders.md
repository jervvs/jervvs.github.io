---
title: "Eval Datasets and Graders"
date: 2026-07-12
description: "The two things that decide whether an eval measures what you think it measures."
draft: true
series: "ai-software-engineering"
order: 21
tags: ["learning", "ai-software-engineering", "evaluation"]
---

_The two things that decide whether an eval measures what you think it measures._

> **BLUF:** An eval is only as good as (a) how representative its dataset is and (b) whether its grader actually measures the property you care about. Both fail *silently* — a green dashboard on an unrepresentative dataset or a miscalibrated grader looks identical to real progress. This chapter is the build-it detail: how to construct golden sets that grow from production failures, keep them clean of contamination, pick the strongest grader available, and — when you must use an LLM-as-judge — validate it against humans before you trust a single number it emits.

---

## 1. Why both fail silently

You cannot see a bad dataset or a bad grader from the score alone. The score is a number; it renders the same whether the underlying measurement is sound or garbage. This is the core hazard of evaluation work.

| Failure | What you see | What's actually true |
|---|---|---|
| Unrepresentative dataset | 95% pass rate | You're 95% on the easy 5% of the real distribution |
| Miscalibrated grader | Score moves +8pts | The grader rewards verbosity, not correctness |
| Contaminated dataset | SOTA on the benchmark | The model memorized the answers during training |
| Overfit-to-eval | Eval climbs, prod flat | You optimized the measure, not the target (Goodhart) |

> The trap is treating the eval score as ground truth. The score is a *claim* about reality, and like any claim it needs evidence: a representative sample and an instrument you've calibrated. Skip either and you're flying on a dashboard you never checked against the world.

Everything below is about earning the right to trust the number.

---

## 2. Building golden sets

> **BLUF:** Mine real production failures first — every bug you fix becomes a permanent regression case. Supplement with hand-authored edge cases and adversarial probes. Stratify by task type and difficulty so the aggregate score can't hide a collapse in one stratum. Start small (20–50 high-signal cases) and grow from failures. The golden set is a living asset, not a one-time deliverable.

### Sources, in priority order

| Source | How you get it | Signal quality | Note |
|---|---|---|---|
| **Production failures** | Every incident, bug report, thumbs-down, silent-wrong output → a case | Highest | These are *proven* to matter; they already broke something |
| **Hand-authored edge cases** | Domain expert enumerates boundaries: empty input, max length, unicode, ambiguous intent | High | Cheap insurance against the obvious |
| **Adversarial cases** | Deliberately try to break it: prompt injection, contradictory instructions, near-miss distractors | High | Finds the failure modes users will find for you |
| Synthetic / LLM-generated | Ask a model to generate variations | Medium | Useful for volume, but dedupe and human-spot-check; they cluster around what the generator finds easy |

The discipline that compounds: **every bug becomes a case.** When something breaks in prod, before you fix it, capture the failing input and expected output as a golden-set entry. Fix the bug. Now the eval fails → passes, and it *can never silently regress again.* This is the flywheel.

```
prod failure  →  add case (eval now RED)  →  fix  →  eval GREEN
                        │
                        └─→ permanent regression guard
```

### Stratification

A single aggregate number is a liar of omission. 90% overall can be 100% on easy cases and 40% on the hard slice that actually drives user pain. Tag every case and always report per-stratum.

- **By task type** — e.g. extraction / classification / multi-step / refusal-required. Different tasks fail differently.
- **By difficulty** — trivial / typical / hard / adversarial. Track the hard slice separately; it's where regressions hide and where model upgrades actually show up.

```yaml
- id: case-0142
  task_type: multi_step_edit
  difficulty: hard
  source: prod_incident_8891
  authored: 2026-03-14
  input: ...
  expected: ...
```

### Sizing

Start with **20–50 high-signal cases** — enough to catch obvious regressions the day you write them, small enough that you'll actually maintain them. Grow deliberately.

The real sizing question is statistical, not vibes: **you need enough cases to detect the effect size you care about.** If you want to reliably catch a 5-point regression, a 30-case set won't do it — the noise band is wider than the effect. Sizing is a power calculation, covered in depth in [chapter 03](/writing/ai-software-engineering/deep-dives/evaluation/03-eval-driven-development/). Rule of thumb (training cutoff Jan 2026 — verify live): detecting small differences (a few points) reliably wants low hundreds of cases *per stratum*; catching gross breakage needs only tens.

> Two small, sharp, well-stratified sets beat one big noisy one. A 300-case blob with no strata tells you less than 4×40 cases tagged by difficulty, because the blob can't tell you *where* you regressed.

### Freshness and growth discipline

The golden set is never "done." It grows monotonically from failures and gets pruned only when a case becomes genuinely obsolete (the feature was removed). Treat "we haven't added a case in a month despite shipping" as a smell — either nothing broke (unlikely) or you're not capturing what broke.

---

## 3. Dataset hygiene

> **BLUF:** Version the dataset like code. Keep a held-out split you *never* look at during tuning. Assume public benchmark data has leaked into training and defend with private, freshly-authored tasks that record their authoring date. The moment a prompt or model is tuned against a set, that set stops predicting generalization.

### Versioning

The dataset is an artifact with a version, a changelog, and provenance. A score is meaningless without knowing which dataset version produced it. When you add cases, bump the version; when comparing runs, compare on the same version. Store it in git (or a dataset registry) next to the harness — see [../../prototypes/a-eval-harness.md](/writing/ai-software-engineering/prototypes/a-eval-harness/).

### The held-out split

Split your cases into **dev** (you iterate against this, look at it constantly) and **held-out** (you run it rarely, never tune against it). The held-out split is your only honest estimate of generalization, precisely because it hasn't been contaminated by your own optimization. The instant you start eyeballing held-out failures to tweak a prompt, it becomes a dev set and you've lost your unbiased estimate. Discipline here is the whole point.

### Contamination

Public benchmarks leak into training corpora. A model scoring well on a well-known public benchmark may have *memorized* it, not solved it. You cannot tell the difference from the score — this is the silent failure again.

| Defense | Why it works |
|---|---|
| **Private tasks** | Never published → can't be in a training set |
| **Freshly-authored tasks** | Authored after the model's training cutoff → provably unseen |
| **Record authoring date** | Lets you filter to "cases newer than model cutoff" and re-check leakage as models update |
| Perturb public cases | Rename variables, change numbers — weakens memorization, but weakly; prefer private |

> Record an `authored:` date on every case. It is the single cheapest contamination defense: when a new model ships with cutoff X, you can instantly slice your set to cases authored after X and see whether the "improvement" survives.

### Why tuning on the eval breaks it (Goodhart preview)

When you tune a prompt or fine-tune a model against a fixed eval set, you optimize for *that set's idiosyncrasies*, not the underlying capability. The eval score climbs; generalization does not. The set was a proxy for real-world performance; the moment it becomes the optimization target, it stops being a faithful proxy. This is Goodhart's law and it's the throughline of §7 — the held-out split and dataset rotation exist specifically to fight it.

---

## 4. Grader taxonomy

> **BLUF:** Reach for a programmatic grader before an LLM judge, every single time. Verifiable checks are cheap, deterministic, and un-gameable. Reference-based similarity metrics are weak for anything with multiple correct answers — use them sparingly. Judges and humans are the fallback, not the default.

| Grader type | How it works | Cost | Reliability | When to use |
|---|---|---|---|---|
| **Programmatic / verifiable** | Exact match, tests pass, compiles, schema-valid, regex, numeric tolerance | ~free | Highest (deterministic) | Whenever the property is checkable. **Default.** |
| Reference-based similarity | Embedding cosine, edit distance, BLEU/ROUGE vs a reference answer | Low | Low–medium; brittle | ~~Code, reasoning, open-ended gen~~ — avoid. OK for tight paraphrase/translation checks only |
| **LLM-as-judge** | A model scores the output against a rubric | Medium (API $ + latency) | Medium, *only if validated* | Subjective/open-ended quality where no verifier exists |
| **Human labels** | Expert rates outputs | Highest | Gold standard | Meta-eval (validating judges), final acceptance, ambiguous ground truth |

### Programmatic graders are the spine

If you can express correctness as code, do. This is the **verifiable-reward** principle that underpins the strongest agent training and evaluation: a check the system cannot argue with. "Do the tests pass?" has no position bias, no verbosity bias, no self-preference, costs nothing, and runs a thousand times a second. [SWE-bench](https://www.swebench.com/) is the canonical example — it grades code changes by *running the repo's real test suite*, not by asking a model if the diff looks good. Design your tasks so the answer is verifiable wherever you can:

```python
def grade(output, case):
    if case.task_type == "json_extract":
        return validate_schema(output, case.schema)      # schema-valid?
    if case.task_type == "code_fix":
        return run_tests(apply_patch(output))             # tests pass?
    if case.task_type == "numeric":
        return abs(parse(output) - case.expected) < case.tol
    # ...fall through to a judge ONLY if no verifier exists
```

### Why reference-based similarity is weak

BLEU/ROUGE/embedding similarity ask "how close is this string to the reference?" But for code and reasoning there are infinitely many correct answers that are lexically distant from any single reference, and infinitely many wrong answers that are lexically close. High similarity ≠ correct; low similarity ≠ wrong. ~~Using ROUGE to grade a code fix or a multi-step plan~~ is measuring the wrong thing with confidence. Reserve these for narrow paraphrase/translation tasks where the reference space is genuinely tight.

---

## 5. LLM-as-judge, in depth

> **BLUF:** When you must use a judge, prefer **pairwise** over pointwise, force **reason-then-score** on a constrained scale, actively defend against the known biases (position, verbosity, self-preference, sycophancy), and — non-negotiable — **meta-evaluate** the judge against human labels before trusting it. An unvalidated judge is an unmeasured instrument.

### Pointwise vs pairwise

| Mode | Judge is asked | Reliability | Cost |
|---|---|---|---|
| Pointwise | "Score this output 1–5" | Lower — anchors drift, scales are inconsistent run-to-run | 1 call/output |
| **Pairwise** | "Is A or B better?" | Higher — relative judgment is more stable than absolute | 1 call/pair |

Pairwise wins because models (like people) are far better at *relative* comparison than at *absolute* calibration. "Which is better, A or B?" is a cleaner cognitive task than "assign this a number on a scale you're holding in your head." Pairwise pairs naturally into an Elo/Bradley-Terry ranking when you're comparing many candidates. The cost is combinatorial (pairs, not points), so use it where ranking matters — model/prompt selection — and reserve pointwise for cheap regression gates.

### Rubric design

- **Reason then score, always.** Make the judge write its reasoning *before* emitting the verdict. A score-first rubric lets the model rationalize backwards; reasoning-first forces the evidence to constrain the score. (This is the same mechanism as chain-of-thought — the reasoning does real work only when it precedes the answer.)
- **Constrain the scale.** Binary (pass/fail) or a short ordinal (1–4, no neutral midpoint) beats 1–10. Fine-grained scales manufacture false precision the judge can't actually resolve.
- **Give concrete anchors.** Define what each level *means* with an example, or the judge invents its own drifting definition per call.
- **One property per rubric.** Don't ask one judge call to rate correctness AND style AND safety — you'll get a mush. Separate calls, separate scores.

### Known biases and mitigations

| Bias | Symptom | Mitigation |
|---|---|---|
| **Position / order** | Judge favors whichever answer is shown first (or second) | Randomize order; **swap and average** — run both (A,B) and (B,A), only count as a win if it wins both, or average the two |
| **Verbosity** | Longer answer scores higher regardless of quality | Rubric explicitly says length ≠ quality; control for length; penalize padding |
| **Self-preference** | A model rates *its own* outputs higher | Use a *different* model family as judge than the one under test; confirm with human meta-eval |
| **Sycophancy** | Judge agrees with assertions in the prompt / flatters | Neutral framing; don't reveal which system produced which output; don't leak "the correct answer is…" into the judge prompt |

> Position bias is the one everyone forgets and it's the most corrosive in pairwise setups. If you don't swap-and-average, you may be measuring "which slot won," not "which answer won." Swap-and-average is a two-line change and it's mandatory.

### Meta-evaluation — the non-negotiable

A judge is an instrument, and you do not trust an instrument you haven't calibrated. **Before** a judge gates anything, validate it against human labels:

1. Take a sample (50–100+) of cases with **human** verdicts (your gold standard).
2. Run the judge on the same sample.
3. Report agreement — **Cohen's κ** (corrects for chance) or, if you must, raw % agreement.
4. Decide the bar. Rough guide (training cutoff Jan 2026 — verify live): κ < 0.4 = don't ship it; 0.4–0.6 = usable with caution; > 0.6 = decent; > 0.8 = strong. Raw agreement is inflated when classes are imbalanced — prefer κ.

If the judge disagrees with humans, you don't have a measurement — you have a random number generator with good PR. Re-validate whenever you change the rubric, the judge model, or the task distribution. The human sample you use for meta-eval is exactly what §4 reserved humans for.

---

## 6. Worked example: pairwise judge with order-swap + reason-then-score

```python
JUDGE_RUBRIC = """You are comparing two answers to the same task.
First, in <reasoning>, analyze correctness, completeness, and whether
either answer is padded with irrelevant text. Length does NOT imply quality.
Then in <verdict> output exactly one of: A, B, TIE.

TASK:
{task}

ANSWER A:
{a}

ANSWER B:
{b}

Respond as:
<reasoning>...</reasoning>
<verdict>A|B|TIE</verdict>"""

def judge_once(task, a, b):
    resp = judge_model(JUDGE_RUBRIC.format(task=task, a=a, b=b))
    return parse_verdict(resp)   # -> "A" | "B" | "TIE"

def pairwise(task, out_x, out_y):
    """Order-swapped, bias-resistant comparison of out_x vs out_y."""
    # Round 1: x in slot A, y in slot B
    v1 = judge_once(task, out_x, out_y)
    # Round 2: swap slots to cancel position bias
    v2 = judge_once(task, out_y, out_x)   # now x is in slot B

    x_wins  = (v1 == "A") + (v2 == "B")
    y_wins  = (v1 == "B") + (v2 == "A")

    if x_wins > y_wins: return "X"
    if y_wins > x_wins: return "Y"
    return "TIE"          # disagreement across orders => genuine tie / too close

# Only trust this AFTER meta-eval:
#   assert cohen_kappa(pairwise_on_sample, human_labels) > 0.6
```

The swap is the load-bearing part. A judge that flips its verdict when you flip the order was measuring position, not quality — and this harness correctly collapses that to TIE instead of laundering it into a fake win.

---

## 7. Anti-Goodhart close

> **BLUF:** When a measure becomes a target, it stops being a good measure. Your eval set is a proxy; protect it from becoming the thing you optimize, or it will decay into a number that climbs while reality flatlines.

Every technique in this chapter is, at bottom, a defense against Goodhart:

- **Held-out split** — an estimate you never optimized against, so it still predicts generalization.
- **Rotate / refresh data** — retire cases the model has effectively memorized through repeated iteration; add fresh ones. A static set gets gamed by your own tuning loop over time.
- **Freshly-authored, private cases** — un-memorizable by construction.
- **Humans on a sample, forever** — an automated grader can be gamed by a system that learns its quirks; a rotating human spot-check is the ground truth the automated layer is calibrated against, and the thing Goodhart can't quietly defeat.

The uncomfortable implication: a rising eval score is necessary but not sufficient evidence of real improvement. Corroborate with a signal the optimization loop *couldn't* have touched — held-out performance, fresh cases, human review, or a real-world outcome metric (see [../../pillars/05-measurement.md](/writing/ai-software-engineering/pillars/05-measurement/)). Note that even large field studies find measured productivity effects can invert expectations ([METR's 2025 RCT](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) found experienced devs were *slower* with AI tooling despite feeling faster) — which is exactly why you anchor on outcomes the measure can't game, not on the measure itself.

Keep the flywheel turning (§2), keep the instrument calibrated (§5), and keep a human in the loop on a sample. That's the whole discipline.

---

## Related

- [Deep-dive index](/writing/ai-software-engineering/deep-dives/evaluation/README/)
- [Agent and trajectory evals](/writing/ai-software-engineering/deep-dives/evaluation/02-agent-and-trajectory-evals/) — grading *how* an agent got there, not just the final answer
- [Eval-driven development](/writing/ai-software-engineering/deep-dives/evaluation/03-eval-driven-development/) — statistical power, sizing, and the eval-first loop
- [AI SWE overview](/writing/ai-software-engineering/README/)
- [Concept map](/writing/ai-software-engineering/concept-map/)
- [Foundations](/writing/ai-software-engineering/pillars/01-foundations/) — §6 evals overview (start here if you haven't)
- [Measurement](/writing/ai-software-engineering/pillars/05-measurement/) — outcome metrics the eval can't game
- [Eval-harness prototype](/writing/ai-software-engineering/prototypes/a-eval-harness/) — a runnable harness that versions datasets and plugs in graders

## Sources

- SWE-bench — verifiable, test-suite-based code grading — https://www.swebench.com/
- Anthropic, agentic coding best practices — https://code.claude.com/docs/en/best-practices
- METR, early-2025 RCT on experienced OS devs — https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/
