---
title: "Quality & Testing with AI"
date: 2026-07-12
description: "Why the verification substrate is the highest-leverage place to point AI — and how to keep it honest."
draft: true
series: "ai-software-engineering"
order: 12
tags: ["learning", "ai-software-engineering", "pillars"]
---

*Why the verification substrate is the highest-leverage place to point AI — and how to keep it honest.*

> **BLUF:** Tests are the substrate every agentic loop depends on to know whether it succeeded. An agent can only self-correct against a signal it can trust — and that signal is your test suite. So AI-assisted testing has the highest *durable* ROI in the whole discipline, higher than raw code generation. Generated code is a liability until something verifies it; generated *verification* compounds. Invest here first, and grade the tests themselves — because a bad test suite doesn't just fail to help, it actively cements bugs.

The mental model: AI code generation gives you speed on the thing you were already doing. AI-assisted testing changes what's *possible* — it lets an agent operate a longer, more autonomous loop without a human in the middle grading every step. The suite is the oracle. Everything else in the agentic workflow (see [`./02-agentic-workflow.md`](/writing/ai-software-engineering/pillars/02-agentic-workflow/)) is only as good as that oracle.

---

## AI test generation: enumerate the edge cases, don't pin the bugs

**BLUF:** LLMs are exceptional at the one thing humans are worst at in testing — mechanically enumerating boundary conditions, error paths, and weird-input combinations nobody wants to type out by hand. But that strength is a loaded gun pointed at your own foot, because the naive way to generate tests captures whatever the code *currently does* and calls it correct.

Where AI test generation genuinely shines:

- **Edge-case enumeration.** Null/empty/zero/negative/overflow/unicode/timezone-boundary — the long tail humans skip out of boredom.
- **Error-path coverage.** Exceptions, timeouts, partial failures, retry exhaustion — paths that are tedious to set up manually.
- **Combinatorial input space.** Cross-products of flags, states, and modes.
- **Mechanical scaffolding.** Fixtures, mocks, table-driven test skeletons.

> **The central trap:** A test that merely pins the *current* behavior of the code is worse than no test at all. If the code has a bug, an AI that reads the code and writes tests to match will faithfully encode the bug as the expected result — and now that bug is protected by a green check. You've built a ratchet that fights every future fix. Regression tests written against buggy output don't catch regressions; they *manufacture* them into permanent requirements.

The fix is about *what you anchor the generation to*:

| Anchor | What the test asserts | Bug-cementing risk |
|---|---|---|
| The implementation ("write tests for this function") | What the code does today | **High** — bugs become expected values |
| A spec / docstring / requirement | What the code *should* do | Low — divergence surfaces as a failing test |
| Edge-case *reasoning* ("what could break here?") | Independently-derived expectations | Low — reasoning is decoupled from the impl |

Concretely: feed the generator the spec, the interface contract, and the failure modes — *not* the function body as the source of truth. Then **grade the generated tests** before trusting them: do they fail when they should? Which brings us to the next section.

---

## Grade test QUALITY, not quantity

**BLUF:** Line coverage tells you which code *ran*, not which code was *checked*. A test that executes a line but asserts nothing — or asserts something trivially true — counts toward coverage while verifying nothing. The real quality metric is **mutation kill rate**: deliberately break the code and see if a test notices. AI makes both coverage-guided generation and mutation-driven grading cheap enough to run as a gate.

Two techniques that compound:

1. **Coverage-guided generation.** Point the agent at the uncovered branches and have it write tests specifically to reach them. This closes coverage gaps directionally instead of generating a random pile of tests.
2. **Mutation testing.** Inject small faults (flip `>` to `>=`, `&&` to `||`, delete a line, swap a return). Run the suite. A test that *kills* the mutant (fails when the mutant is present) is doing real work. A mutant that *survives* is a hole your suite can't see through. Mutation score = mutants killed / total mutants.

| Metric | What it tells you | What it does NOT tell you |
|---|---|---|
| **Line/branch coverage** | This code was executed by some test | Whether any assertion would catch a fault in it |
| **Mutation score** | Faults in this code are actually detected | Whether the *right* behaviors are specified (a wrong-but-consistent spec still scores well) |

> The trap in coverage-only thinking: 100% coverage with weak assertions is a suite that turns green no matter what you break. It's a security blanket, not a safety net. Coverage is necessary but nowhere near sufficient — treat it as a *floor gate*, and treat mutation score as the *quality gate*.

Use LLMs in the loop on surviving mutants: "this mutation survived — write the test that kills it." That's a tight, high-signal generation task with an unambiguous success criterion (the mutant now dies), which is exactly the shape of task agents do well.

*Mutation testing is compute-heavy; scope it to changed files in CI rather than the whole repo per run (training cutoff Jan 2026 — verify tooling limits live).*

---

## Property-based test synthesis: assert invariants, let the fuzzer hunt

**BLUF:** Example-based tests check specific input→output pairs you thought of. Property-based tests assert *invariants that must hold for all inputs*, then a fuzzer generates thousands of cases trying to break them — including the pathological ones you'd never write. LLMs are good at the hard part (proposing the properties); the engine is good at the other hard part (exploring the space and shrinking failures to a minimal counterexample).

The division of labor:

- **LLM proposes properties.** Round-trip (`decode(encode(x)) == x`), idempotence (`f(f(x)) == f(x)`), invariants (`sort(x)` is a permutation of `x` and is ordered), commutativity, monotonicity, conservation ("total after == total before").
- **Fuzzer explores + shrinks.** Generates inputs, finds a violation, then minimizes it to the smallest reproducer.

| | Example-based | Property-based |
|---|---|---|
| Inputs | Hand-picked, finite | Generated, effectively unbounded |
| Catches | Regressions on known cases | Unknown-unknown edge cases |
| Failure output | "expected X got Y" | Minimal shrunk counterexample |
| Human effort | Writing every case | Stating the invariant once |
| LLM leverage | Enumerate more cases | **Discover the right invariants** |

> The insight: the invariant *is* a partial spec. Getting the LLM to articulate "what must always be true of this function's output" often surfaces requirements ambiguities before a single test runs. The property is more valuable than any individual example because it constrains infinite inputs.

The catch: a wrong property is a false alarm generator. Grade proposed properties by running them against the known-good implementation — a property that flags correct code is noise, discard it.

---

## Differential & metamorphic testing: verification without an oracle

**BLUF:** The hardest testing problem is the *oracle problem* — you can't assert `output == expected` when you don't know the expected output (complex computations, ML inference, optimizers, anything where the right answer is what you're trying to produce). Two techniques sidestep it entirely, and LLMs make both practical to set up.

**Differential testing** — run two implementations on the same input; they must agree.

- New optimized rewrite vs. the old obviously-correct implementation.
- Your parser vs. a reference parser.
- The same query across two database engines.
- Fast path vs. slow path of the same algorithm.

Any divergence is a bug in one of them. You never needed to know the "right" answer — only that they must match. LLMs are useful for generating the diverse input corpus and for writing the reference ("obviously correct, don't care about speed") implementation to diff against.

**Metamorphic testing** — you don't know the output, but you know how *changing the input* must change the output.

- Search: adding a filter must return a subset of the unfiltered results.
- ML classifier: rotating/cropping an image slightly should not flip the label (robustness).
- Numerical: `f(2x)` relates to `f(x)` by a known factor.
- Shortest path: adding an edge can only keep the distance the same or shorten it, never lengthen it.

> The reframe: you're testing *relationships between runs* instead of absolute values. This is often the only viable verification for systems where the correct output is unknown or non-deterministic — which is exactly where naive assertion-based testing gives up. LLMs are good at proposing candidate metamorphic relations from a description of the system's semantics.

---

## AI code review: fresh eyes, tuned for correctness

**BLUF:** AI review catches a real and useful class of defects — but its failure mode is the **plausible finding**: confidently-worded feedback that is subtly wrong, irrelevant, or a matter of taste dressed up as a bug. The two things that make AI review actually work are (1) **fresh context** — a reviewer that did not write the code, so it can't rationalize its own choices — and (2) **tuning to correctness and requirements** rather than to generic "best practices," which otherwise drives relentless over-engineering.

What AI review reliably catches:

- Null derefs, unhandled errors, resource leaks, off-by-one, swapped arguments.
- Missing edge cases relative to a stated spec.
- Security smells (injection, secrets, unsafe deserialization — see [`./04-security.md`](/writing/ai-software-engineering/pillars/04-security/)).
- Inconsistencies between code and its own comments/docs.

What it does badly (the plausible-finding problem):

- Inventing "issues" that don't exist because a pattern *looks* risky.
- Style/taste opinions asserted as correctness bugs.
- "Add validation / add a config option / extract an abstraction" — over-engineering pressure with no requirement behind it.

| | Bad review setup | Good review setup |
|---|---|---|
| Reviewer context | Same agent/session that wrote the code | **Fresh-context** reviewer, no memory of authoring rationale |
| Instruction | "Find problems" (open-ended) | "Does this meet *this spec*? Any correctness bugs?" |
| Tuning | Generic best-practices checklist | Correctness + requirements; suppress taste |
| Output handling | Auto-apply every finding | Findings triaged; each needs evidence |
| Net effect | Over-engineering + noise | Real bugs surfaced, low false-positive drag |

> The self-grading trap: an agent reviewing its own work grades its own homework. It shares the blind spots that produced the bug and will defend its own choices. Always review with a separate invocation that sees only the diff and the spec — not the reasoning that led to the code. The writer must not be the grader.

Anthropic's agentic-coding guidance leans hard on this separation-of-roles pattern — using an independent pass to verify rather than trusting a single agent's self-assessment.

---

## Intelligent debugging: hypothesis loop, not guess-and-check

**BLUF:** The difference between fast debugging and thrashing is method, not intelligence. LLMs pointed at a bug default to plausible-looking guess-and-check — try a fix, see if it helps, try another. The durable win is forcing the **systematic loop** and fixing the *root cause*, not the symptom.

The loop, made explicit:

```
hypothesis  → state what you think is wrong and WHY (must be falsifiable)
instrument  → add logging/asserts/tracing to observe the actual state
reproduce   → get a reliable, minimal repro (deterministic if possible)
bisect      → narrow: git bisect, binary-search the input, disable half
fix         → change the ROOT CAUSE
verify      → repro is gone AND a regression test now guards it
```

| | Guess-and-check | Systematic loop |
|---|---|---|
| Starting move | Propose a fix | Propose a *hypothesis* |
| Evidence | "Seems better now" | Observed state before/after |
| Termination | Symptom disappears | Root cause fixed + test added |
| Failure mode | Whack-a-mole, silent breakage elsewhere | Slower start, converges |

> The trap: "the symptom went away" is not "the bug is fixed." A retry that masks a race, a null-check that hides why the value was null, a bumped timeout — these move the bug, they don't kill it. Root-cause discipline means you can *explain* why the bug happened, not just that it stopped reproducing. If you can't explain it, you didn't fix it.

Two force-multipliers for agents here: make the repro deterministic before touching the fix (a flaky repro makes every "fix" unfalsifiable), and always land a regression test as part of the fix — that's the loop feeding back into the substrate. See the broader debugging discipline in [`./02-agentic-workflow.md`](/writing/ai-software-engineering/pillars/02-agentic-workflow/).

---

## Putting it together: the quality-gate pipeline

**BLUF:** Chain the techniques into an ordered pipeline where each stage has a metric that gates promotion to the next. Cheap, high-signal gates first; expensive gates last. The point is that AI *generates* the artifacts and the *metrics* decide — no stage advances on vibes.

| Stage | AI does | Gate metric | Fail action |
|---|---|---|---|
| 1. Generate | Synthesize tests from spec + edge-case reasoning + properties | Tests compile & run; fail-when-they-should check | Regenerate against spec, not impl |
| 2. Coverage gate | Coverage-guided generation for uncovered branches | Branch coverage ≥ floor | Generate targeted tests for gaps |
| 3. Mutation gate | Kill surviving mutants | Mutation score ≥ threshold | Write tests that kill survivors |
| 4. AI review | Fresh-context reviewer vs. spec | No unresolved correctness findings | Triage + fix real findings |
| 5. Security gate | Vuln/secret/dependency scan | No high-severity findings | Remediate ([`./04-security.md`](/writing/ai-software-engineering/pillars/04-security/)) |

> The ordering is load-bearing: coverage before mutation (no point mutating unexecuted code), mutation before review (don't spend a review pass on code the suite can't verify), review before security (correctness and security findings need different lenses). A stage that can't be measured can't be a gate — it's a suggestion.

This pipeline is only worth building if you can trust the metrics driving it, which is the subject of the measurement pillar — see [`./05-measurement.md`](/writing/ai-software-engineering/pillars/05-measurement/). And the pipeline itself is the reference architecture for [prototype B](/writing/ai-software-engineering/prototypes/b-test-generation/), which builds the generate→coverage→mutation loop end-to-end; the eval-harness in [prototype A](/writing/ai-software-engineering/prototypes/a-eval-harness/) is how you validate that the generators and reviewers are actually good.

---

## Related

- [Overview](/writing/ai-software-engineering/README/)
- [Concept map](/writing/ai-software-engineering/concept-map/)
- [01 · Foundations](/writing/ai-software-engineering/pillars/01-foundations/)
- [02 · Agentic workflow](/writing/ai-software-engineering/pillars/02-agentic-workflow/)
- [04 · Security](/writing/ai-software-engineering/pillars/04-security/)
- [05 · Measurement](/writing/ai-software-engineering/pillars/05-measurement/)
- [Prototype B · Test generation](/writing/ai-software-engineering/prototypes/b-test-generation/)
- [Prototype A · Eval harness](/writing/ai-software-engineering/prototypes/a-eval-harness/)

## Sources

- Anthropic — Claude Code / agentic coding best practices: https://code.claude.com/docs/en/best-practices
- SWE-bench (agentic software-engineering benchmark): https://www.swebench.com/
