---
title: "The Agentic Operating Model"
date: 2026-07-12
description: "Reimagining the software workflow when the unit of AI work is a task, not a keystroke"
draft: true
series: "ai-software-engineering"
order: 11
tags: ["learning", "ai-software-engineering", "pillars"]
---

*Reimagining the software workflow when the unit of AI work is a task, not a keystroke*

> **BLUF:** The unit of AI work has moved autocomplete (a line) → chat (a snippet) → **agent (a task)**. That shift changes the job. The scarce skill is no longer "prompting" — it's **context engineering, verification, and measurement**. An agent that can read files, run commands, and check its own work needs you to design its loop, its guardrails, and its success signal — not to feed it clever words. This doc is the operating model for that shift.

---

## 1. The unit of work moved — and so did your job

> **BLUF:** Each generation of AI tooling enlarged the unit of work and shrank the fraction of that unit you type by hand. At the agent level you stop being the author and become the **director + verifier**.

| Era | Unit of AI work | Human role | Scarce skill |
|---|---|---|---|
| Autocomplete | Line / token | Author (AI suggests, you type) | Knowing the API |
| Chat | Snippet / function | Author + copy-paste integrator | Prompt phrasing |
| **Agent** | **Task / feature** | **Director + verifier** | **Context engineering + verification + measurement** |

The mental upgrade: stop optimizing the *words you send* and start optimizing the *environment the agent operates in* — what it can see, what it can run, and how it knows it's done.

> The trap is treating an agent like a better chatbot. A chatbot answers and waits. An agent acts, observes, and iterates — so if you don't give it a way to observe results, it iterates blind.

---

## 2. The agentic loop

> **BLUF:** An agent runs a loop — **perceive → plan → act (tools) → observe → repeat** — until a stop condition. The entire art of agentic engineering is making each stage cheap, accurate, and bounded.

```
        ┌──────────────────────────────────────┐
        │                                       │
   perceive ──▶ plan ──▶ act (tool) ──▶ observe ┘
   (read       (decide   (edit file,    (test output,
    context)    step)     run cmd)        exit code)
                                    │
                              stop condition?
                                (done / gate met / budget spent)
```

**Chatbot vs agent:**

| | Chatbot | Agent |
|---|---|---|
| Input | Your prompt | Prompt + live file/command output |
| Action | Emits text | Reads files, runs commands, edits, retries |
| Feedback | You paste the error back | It reads the error itself |
| Failure mode | Confidently wrong, once | Confidently wrong, *in a loop* — until a gate stops it |

The loop is why verification (§4) matters more than phrasing: a wrong agent doesn't fail politely, it fails *repeatedly* against whatever signal you gave it. Give it a real signal and the loop self-corrects; give it none and the loop amplifies the mistake.

### Levels of autonomy (human-in-the-loop spectrum)

Pick the level per task by blast radius, not by vibe. Read-only research → unattended. Schema migration → approve-each.

| Level | Human involvement | Good for | Danger |
|---|---|---|---|
| **Suggest** | AI proposes, you write | High-stakes, unfamiliar code | Slow; underuses the agent |
| **Approve-each** | AI acts, you confirm every tool call | Migrations, deletes, prod-adjacent | Approval fatigue → rubber-stamping |
| **Supervised** | AI runs the loop, you watch + interrupt | Most feature work | Missed a bad step while distracted |
| **Unattended** | AI runs to a hard gate, you review the diff | Tests-as-spec, sandboxed, reversible | Silent scope creep if gate is weak |

> Autonomy is safe in exact proportion to how good your verification gate is. Unattended without a hard gate is gambling. Unattended *with* a machine-checkable gate is leverage.

---

## 3. The core workflow: Explore → Plan → Implement → Verify → Commit

> **BLUF:** The default loop for any non-trivial change is five phases. Skipping **Explore** produces plausible code that ignores existing patterns; skipping **Verify** ships it.

| Phase | Goal | Anti-pattern if skipped |
|---|---|---|
| **Explore** | Read the relevant code/tests/docs *before* proposing changes | Reinvents existing helpers, breaks conventions |
| **Plan** | Produce a written plan; get it reviewed while it's cheap to change | Large wrong diff you must unwind |
| **Implement** | Execute the plan in small, checkable steps | Big-bang change, unclear which step broke |
| **Verify** | Run the machine-checkable signal (§4) | Ships confidently-wrong code |
| **Commit** | Small, reviewable, message ties to the plan | Unreviewable mega-diff |

**When to skip planning.** One-sentence diffs — rename, add a log line, bump a constant, fix an obvious typo. If describing the change costs more than making it, just make it and verify. Planning overhead should never exceed the change it governs.

**Spec-first for larger features.** For anything spanning multiple files or sessions, separate *thinking* from *doing*:

1. **Interview** — the agent asks you clarifying questions until the requirements are unambiguous.
2. **`SPEC.md`** — write the design, constraints, and acceptance criteria to a file.
3. **Fresh session implements** — a new agent with a clean context reads `SPEC.md` and builds it.

> The spec is a context-transfer artifact, not bureaucracy. It survives context clearing (§5), lets a fresh agent start uncontaminated, and doubles as the acceptance checklist for verification.

---

## 4. Verification loops — the heart of it

> **BLUF:** The single highest-leverage move is to give the agent a **machine-checkable signal** so it closes its own loop. If *you* are the only thing that can tell whether the code works, you are the bottleneck and the agent's autonomy is fake.

Every agentic win reduces to: *what can the agent run to know it succeeded, without asking you?*

- **Tests** — the gold standard; `pytest` / `go test` exit code is unambiguous
- **Build / compile** — exit code catches whole classes of errors
- **Linter / type-checker** — cheap, fast, catches drift
- **Diff-vs-fixture** — golden-file comparison for output-shaped work
- **Screenshot / visual diff** — for UI, the agent renders and compares
- **A second-opinion subagent** — a fresh reviewer reads the diff and reports

### Soft gates vs hard gates

Soft gates *hint*; hard gates *stop*. Autonomy scales with how hard your gate is.

| Gate type | Mechanism | Strength | Failure mode |
|---|---|---|---|
| **In-prompt check** | "make sure tests pass" in the instructions | Soft | Agent claims success without running anything |
| **Goal condition** | Loop continues until `test exit == 0` | Medium | Agent games a weak/narrow test |
| **Stop-hook** | Harness blocks completion unless a command passes | Hard | Slow if the check is heavy |
| **Second-opinion subagent** | Independent agent must approve the diff | Hard | Costs a second context; reviewer collusion if same session |

> A test the agent *wrote and can edit* is a soft gate wearing a hard gate's clothes. It will "make the test pass" by changing the test. Anchor the signal to something it cannot trivially rewrite — a fixture you own, a build, a hook, or a reviewer with fresh eyes.

The design question for any task: **"How will the agent know it's done — mechanically?"** If you can't answer, you haven't finished setting up the task.

---

## 5. Context as a budget

> **BLUF:** Context is a finite, degrading resource — treat it like a memory budget, not an infinite log. Long, polluted sessions get *worse*, not smarter. Spend context deliberately; reclaim it aggressively.

Why long sessions degrade:
- **Dilution** — the relevant instruction is buried under thousands of tokens of tool output.
- **Contamination** — an early wrong turn stays in-context and keeps biasing later steps.
- **Cost & latency** — every turn re-reads the whole transcript.

Tactics:

| Tactic | What it does | When |
|---|---|---|
| **Clear between tasks** | Wipe context at task boundaries | Always, when switching to an unrelated task |
| **Compaction** | Summarize the transcript, keep the summary, drop the raw | Long single task nearing the limit |
| **Scope the investigation** | Point the agent at specific files/dirs, not "the repo" | Any search-heavy task |
| **Subagents for research** | Spawn a child with its own context; it returns a summary | Reading many files to answer one question |

> The counter-intuitive rule: a *fresh* agent that reads a tight spec usually beats a *veteran* agent that's been in-session for two hours. More history is not more understanding — often it's more noise. Clearing is not losing progress; it's discarding pollution.

Subagents are the key context primitive: the research happens in the child's budget, and only the distilled conclusion crosses back into yours. You get the answer without paying the tokens to derive it.

---

## 6. Force-multipliers

> **BLUF:** Three patterns compound the base loop. All three exploit the same lever — **isolated context** — to buy parallelism or objectivity.

| Pattern | How it works | Why it multiplies | Watch out |
|---|---|---|---|
| **Subagents / fan-out** | One child per hypothesis or per file, run in parallel | N investigations in the wall-clock time of one; each stays focused | Merging conflicting reports is on you |
| **Writer/reviewer adversarial review** | One agent writes; a **fresh-context** agent reviews the diff | Reviewer isn't anchored to the author's assumptions | Same-session review = collusion; must be fresh |
| **Spec-first** | Interview → `SPEC.md` → fresh session implements | Decouples thinking from doing; spec survives clears | Stale spec silently misguides the build |

The unifying insight: **objectivity requires a fresh context.** An agent cannot truly review its own work in the same session — it shares the blind spots that produced the bug. Fan-out and adversarial review both work by refusing to let one context do everything.

---

## 7. Common failure patterns + fixes

> **BLUF:** Nearly every agentic failure traces to one of five patterns — and each has a mechanical fix, not a "prompt better" fix.

| Failure | Symptom | Root cause | Fix |
|---|---|---|---|
| **Kitchen-sink session** | Quality decays over a long chat | Context pollution (§5) | Clear between tasks; one session per task |
| **Correcting over and over** | You nudge, it drifts, you nudge again | No machine-checkable gate (§4) | Replace nudging with a test/build the agent runs itself |
| **Trust-then-verify gap** | "Done!" but it never ran anything | Soft gate mistaken for hard | Stop-hook or goal condition, not an in-prompt "please check" |
| **Infinite exploration** | Reads forever, never proposes | Scope unbounded | Constrain to specific files; set a plan deadline |
| **Over-stuffed instruction files** | Agent ignores half its own rules | Instruction file too long → diluted | Trim to load-bearing rules; move detail to referenced docs |

> The meta-fix behind all five: **if you find yourself repeating an instruction, stop repeating and start enforcing.** Turn the correction into a gate, a scope constraint, or a shorter instruction file. Repetition is a design smell.

---

## 8. A grounded nuance: the setting decides the workflow

> **BLUF:** AI assistance is not uniformly positive. Evidence shows it helps most on **unfamiliar or greenfield** code and can *hurt* experienced developers working in **mature, familiar** repositories. Your workflow choice must match the setting.

A randomized controlled trial by METR found that experienced open-source developers were **~19% slower** when using early-2025 AI tools on their own mature repositories — despite *believing* they were faster (training cutoff Jan 2026 — verify live; see Sources). The gap between perceived and actual speedup is itself the warning.

Why the setting flips the sign:

| Setting | Why AI helps / hurts | Workflow implication |
|---|---|---|
| **Greenfield / unfamiliar** | No existing context to hold in your head; agent bootstraps fast | Lean into autonomy; spec-first; let it explore |
| **Mature / deeply familiar** | You already hold the model; reviewing agent output costs more than typing | Narrow, surgical use; suggest-level; strong gates |

> The honest read: agentic workflows are a force-multiplier for the *unknown* and can be a tax on the *known*. The skill is knowing which situation you're in — and dialing autonomy, planning depth, and verification accordingly. Benchmarks like SWE-bench measure capability on isolated tasks; they do not measure the review-overhead cost in a codebase you already understand. Measure your own setting (see [`../pillars/05-measurement.md`](/writing/ai-software-engineering/pillars/05-measurement/)) rather than assuming the benchmark transfers.

---

## Related

- [Overview](/writing/ai-software-engineering/README/)
- [Concept map](/writing/ai-software-engineering/concept-map/)
- [01 — Foundations](/writing/ai-software-engineering/pillars/01-foundations/)
- [03 — Quality and testing](/writing/ai-software-engineering/pillars/03-quality-and-testing/)
- [04 — Security](/writing/ai-software-engineering/pillars/04-security/)
- [05 — Measurement](/writing/ai-software-engineering/pillars/05-measurement/)
- Prototypes: [Eval harness](/writing/ai-software-engineering/prototypes/a-eval-harness/) · [Test generation](/writing/ai-software-engineering/prototypes/b-test-generation/) · [Incident triage agent](/writing/ai-software-engineering/prototypes/c-incident-triage-agent/)

## Sources

- Anthropic — Agentic coding best practices: https://code.claude.com/docs/en/best-practices
- METR — Measuring the impact of early-2025 AI on experienced open-source developer productivity (RCT): https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/
- SWE-bench — benchmark for resolving real GitHub issues: https://www.swebench.com/
