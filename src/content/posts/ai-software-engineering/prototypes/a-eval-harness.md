---
title: "Prototype A — A Minimal Eval Harness with Verifiable Rewards"
date: 2026-07-12
description: "A miniature SWE-bench: score an LLM on code tasks where 'correct' means 'the tests pass.'"
draft: true
series: "ai-software-engineering"
order: 40
tags: ["learning", "ai-software-engineering", "prototypes"]
---

_A miniature SWE-bench: score an LLM on code tasks where "correct" means "the tests pass."_

> **BLUF:** Build a ~200-line Python harness that hands an LLM a coding task, extracts its code, runs pytest against it in a sandbox, and scores pass/fail. This teaches the single most important idea in modern AI engineering — the **verifiable reward** — plus `pass@k` and the eval flywheel. If you can measure it automatically, you can improve it automatically.

---

## 1. What you'll build (and the concept it teaches)

A command-line harness that:

1. Loads a set of coding tasks (prompt + hidden test suite).
2. Prompts an LLM to solve each one.
3. Extracts the code, runs the tests in a subprocess sandbox, and records pass/fail.
4. Aggregates into a `pass@1` / `pass@k` report.

Three concepts fall out of this:

| Concept | What it means here |
|---|---|
| **Verifiable reward** | The score is produced by a deterministic checker (pytest), not human opinion. No rater, no rubric drift — the reward is a bit: tests passed or they didn't. |
| **pass@k** | Sample `k` candidate solutions; the task counts as solved if *any* passes. Measures capability-under-retry, which is what agents actually exploit. |
| **The eval flywheel** | A cheap, automatic score lets you iterate: change the prompt/model → re-run → compare. The harness becomes the ground truth that every future change is measured against. |

> **Insight:** A verifiable reward is the seed of reinforcement learning (RLVR — RL from Verifiable Rewards). The harness you build here is the *inference-time* half of that loop. The [foundations pillar](/writing/ai-software-engineering/pillars/01-foundations/) covers the training-time half; you don't need it to get value today.

---

## 2. Architecture

```mermaid
flowchart LR
    A[Task set<br/>id, prompt, tests] --> B[Build prompt]
    B --> C["llm(prompt)"]
    C --> D[Extract code<br/>strip ```python fences]
    D --> E[Sandbox:<br/>write files + run pytest<br/>subprocess + timeout]
    E --> F[Score<br/>pass / fail]
    F --> G{More<br/>samples k?}
    G -- yes --> C
    G -- no --> H[Aggregate<br/>pass@1, pass@k]
    H --> I[Report table]
```

The core is provider-agnostic: everything downstream of `llm(prompt) -> str` is plain Python. Swapping models or providers touches exactly one function.

---

## 3. Prerequisites & layout

- Python 3.11+
- An Anthropic API key (`export ANTHROPIC_API_KEY=sk-ant-...`) for the reference `llm()`
- `pip install anthropic pytest`

```
eval-harness/
├── harness/
│   ├── __init__.py
│   ├── schema.py        # Step 1 — Task dataclass
│   ├── model.py         # Step 2 — llm() wrapper
│   ├── extract.py       # Step 3 — pull code from output
│   ├── sandbox.py       # Step 4 — run tests in subprocess
│   ├── score.py         # Step 5 — pass@1 / pass@k
│   └── run.py           # Step 6 — orchestrate + report
├── tasks/
│   └── tasks.py         # the task set
└── requirements.txt
```

```bash
mkdir -p eval-harness/harness eval-harness/tasks
cd eval-harness
python3.11 -m venv .venv && source .venv/bin/activate
pip install anthropic pytest
touch harness/__init__.py
```

---

## 4. Step 1 — Task schema

A task pairs a natural-language prompt with a **hidden** test suite. The model never sees the tests; that's what makes the reward honest.

```python
# harness/schema.py
from dataclasses import dataclass

@dataclass(frozen=True)
class Task:
    id: str
    prompt: str          # what the model is asked to implement
    entry_point: str     # the function/name the tests import
    test_src: str        # pytest file contents (kept hidden from the model)
```

```python
# tasks/tasks.py
from harness.schema import Task

TASKS = [
    Task(
        id="two_sum",
        prompt=(
            "Write a Python function `two_sum(nums: list[int], target: int) -> "
            "list[int]` that returns the indices of the two numbers that add up "
            "to target. Assume exactly one solution exists."
        ),
        entry_point="two_sum",
        test_src="""
from solution import two_sum

def test_basic():
    assert sorted(two_sum([2, 7, 11, 15], 9)) == [0, 1]

def test_middle():
    assert sorted(two_sum([3, 2, 4], 6)) == [1, 2]

def test_negatives():
    assert sorted(two_sum([-1, -2, -3, -4], -6)) == [1, 3]
""",
    ),
    Task(
        id="is_palindrome",
        prompt=(
            "Write a Python function `is_palindrome(s: str) -> bool` that returns "
            "True if s reads the same forwards and backwards, ignoring case and "
            "non-alphanumeric characters."
        ),
        entry_point="is_palindrome",
        test_src="""
from solution import is_palindrome

def test_true():
    assert is_palindrome("A man, a plan, a canal: Panama") is True

def test_false():
    assert is_palindrome("race a car") is False

def test_empty():
    assert is_palindrome("") is True
""",
    ),
]
```

---

## 5. Step 2 — The `llm()` wrapper

Keep the surface tiny: one string in, one string out. This is the *only* provider-specific file.

```python
# harness/model.py
import os
from anthropic import Anthropic

_client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

# Swappable. Current alternatives: "claude-opus-4-8", "claude-haiku-4-5-20251001".
MODEL = "claude-sonnet-5"

def llm(prompt: str) -> str:
    """Provider-agnostic contract: prompt in, raw text out."""
    resp = _client.messages.create(
        model=MODEL,
        max_tokens=2048,
        messages=[{"role": "user", "content": prompt}],
    )
    return resp.content[0].text
```

> **Verify against current docs.** The Anthropic Python SDK surface (client construction, `messages.create` shape, response accessors) evolves. Confirm the import path and the `resp.content[0].text` accessor against the SDK version you install. Model ids above are (training cutoff Jan 2026 — verify live).

To go provider-agnostic, replace the body with any client that satisfies `str -> str`:

```python
# Example stub for a different provider — same contract, different guts.
def llm(prompt: str) -> str:
    return some_other_client.generate(prompt).text
```

---

## 6. Step 3 — Extract code from output

Models wrap code in Markdown fences. Pull out the first fenced block; fall back to the raw text if there are no fences.

```python
# harness/extract.py
import re

_FENCE = re.compile(r"```(?:python)?\s*\n(.*?)```", re.DOTALL)

def extract_code(text: str) -> str:
    """Return the first ```python fenced block, else the stripped raw text."""
    m = _FENCE.search(text)
    return (m.group(1) if m else text).strip()
```

> **Warning:** Do not trust the extracted string. It is untrusted, model-generated code that you are about to execute. Treat it exactly as you would a file uploaded by an anonymous stranger. See Step 4.

---

## 7. Step 4 — Sandboxed execution

Write the candidate as `solution.py` and the task's tests as `test_solution.py` into a fresh temp dir, then run pytest in a subprocess with a hard timeout.

> **SECURITY WARNING — read this before running anything.**
> Executing model-generated code is arbitrary code execution. The model can (accidentally or via prompt injection) emit `os.system("rm -rf ~")`, exfiltrate secrets, or spin forever. The subprocess-in-a-temp-dir below is the **minimum** bar — it gives you a timeout and process isolation but does **not** stop filesystem or network access. For anything beyond a personal sandbox, run inside **Docker or gVisor** with `--network none`, a read-only root FS, a non-root user, and CPU/memory caps. Also assume **prompt injection**: task prompts (and any test output you feed back to the model in Step 10) are attacker-controllable if they come from an external dataset — never let them steer the harness into running privileged commands or leaking your API key.

```python
# harness/sandbox.py
import subprocess
import sys
import tempfile
from pathlib import Path
from dataclasses import dataclass

@dataclass
class RunResult:
    passed: bool
    stdout: str
    stderr: str
    timed_out: bool

def run_tests(candidate_code: str, test_src: str, timeout: int = 30) -> RunResult:
    """Write solution + tests to a temp dir and run pytest in a subprocess.

    Minimum isolation only: temp dir + timeout. For real isolation, exec this
    inside a container with no network and a non-root user.
    """
    with tempfile.TemporaryDirectory() as tmp:
        d = Path(tmp)
        (d / "solution.py").write_text(candidate_code)
        (d / "test_solution.py").write_text(test_src)
        try:
            proc = subprocess.run(
                [sys.executable, "-m", "pytest", "-q", "test_solution.py"],
                cwd=d,
                capture_output=True,
                text=True,
                timeout=timeout,
                # Harden the child: don't inherit the parent's env (API keys!).
                env={"PATH": "/usr/bin:/bin", "PYTHONDONTWRITEBYTECODE": "1"},
            )
        except subprocess.TimeoutExpired as e:
            return RunResult(False, e.stdout or "", "TIMEOUT", timed_out=True)
        # pytest exit code 0 == all tests passed.
        return RunResult(proc.returncode == 0, proc.stdout, proc.stderr, False)
```

> **Insight:** The pass/fail bit is the *entire* reward signal. Everything else (stdout, stderr) is diagnostics for humans and for the self-repair loop in Step 10. Keep the reward a clean boolean — resist the urge to give "partial credit," which reintroduces the subjectivity you were trying to eliminate.

---

## 8. Step 5 — Scoring: pass@1 and pass@k

`pass@1` is the fraction of tasks solved on a single sample. `pass@k` estimates the probability that at least one of `k` samples passes. Use the **standard unbiased estimator** (from the Codex paper): draw `n ≥ k` samples per task, count `c` correct, then

```
pass@k = 1 − C(n − c, k) / C(n, k)
```

This avoids the high variance of naively computing `1 − (1 − p̂)^k`.

```python
# harness/score.py
from math import comb

def pass_at_k(n: int, c: int, k: int) -> float:
    """Unbiased pass@k: n samples drawn, c correct. Returns P(>=1 of k passes)."""
    if n - c < k:
        return 1.0
    return 1.0 - comb(n - c, k) / comb(n, k)

def aggregate(results: dict[str, list[bool]], k: int) -> dict:
    """results: {task_id: [pass_bool per sample]}. Returns per-task + overall."""
    per_task = {}
    for tid, samples in results.items():
        n, c = len(samples), sum(samples)
        per_task[tid] = {
            "n": n,
            "c": c,
            "pass@1": c / n if n else 0.0,
            f"pass@{k}": pass_at_k(n, c, k),
        }
    overall_p1 = sum(t["pass@1"] for t in per_task.values()) / len(per_task)
    overall_pk = sum(t[f"pass@{k}"] for t in per_task.values()) / len(per_task)
    return {"per_task": per_task, "pass@1": overall_p1, f"pass@{k}": overall_pk}
```

---

## 9. Step 6 — Run it

The orchestrator samples each task `n` times, scores every sample, and prints a report.

```python
# harness/run.py
import argparse
from harness.model import llm, MODEL
from harness.extract import extract_code
from harness.sandbox import run_tests
from harness.score import aggregate
from tasks.tasks import TASKS

PROMPT_TMPL = (
    "{task}\n\n"
    "Respond with ONLY a Python code block. No prose, no explanation."
)

def solve_once(task) -> bool:
    raw = llm(PROMPT_TMPL.format(task=task.prompt))
    code = extract_code(raw)
    return run_tests(code, task.test_src).passed

def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("-n", type=int, default=3, help="samples per task")
    ap.add_argument("-k", type=int, default=2, help="pass@k")
    args = ap.parse_args()

    results = {}
    for task in TASKS:
        samples = []
        for i in range(args.n):
            ok = solve_once(task)
            samples.append(ok)
            print(f"  {task.id} sample {i+1}/{args.n}: {'PASS' if ok else 'FAIL'}")
        results[task.id] = samples

    report = aggregate(results, args.k)
    print(f"\n=== Report ({MODEL}) ===")
    print(f"{'task':<16}{'n':>3}{'c':>3}{'pass@1':>9}{f'pass@{args.k}':>9}")
    for tid, r in report["per_task"].items():
        print(f"{tid:<16}{r['n']:>3}{r['c']:>3}{r['pass@1']:>9.2f}"
              f"{r[f'pass@{args.k}']:>9.2f}")
    print(f"{'OVERALL':<16}{'':>3}{'':>3}{report['pass@1']:>9.2f}"
          f"{report[f'pass@{args.k}']:>9.2f}")

if __name__ == "__main__":
    main()
```

Run from the project root:

```bash
python -m harness.run -n 3 -k 2
```

Sample console output:

```
  two_sum sample 1/3: PASS
  two_sum sample 2/3: PASS
  two_sum sample 3/3: PASS
  is_palindrome sample 1/3: FAIL
  is_palindrome sample 2/3: FAIL
  is_palindrome sample 3/3: PASS

=== Report (claude-sonnet-5) ===
task              n  c   pass@1   pass@2
two_sum           3  3     1.00     1.00
is_palindrome     3  1     0.33     0.67
OVERALL                    0.67     0.83
```

Note how `pass@2` (0.83) exceeds `pass@1` (0.67): a second attempt rescues tasks the model flubs once. That lift is exactly the capability-under-retry that agents exploit — and why the [reliability metric `pass^k`](/writing/ai-software-engineering/deep-dives/evaluation/02-agent-and-trajectory-evals/) (all k must pass) is the stricter bar for production.

You now have a number that goes up when the model or prompt gets better. That number is the flywheel.

---

## 10. Extensions

| Extension | What to add | Why it matters |
|---|---|---|
| **Self-repair loop** | On failure, re-prompt with the pytest stderr appended ("Your solution failed these tests: …fix it"). Cap at `max_attempts`. | This is the inference-time analog of RLVR: the verifiable reward becomes a feedback signal the model iterates against. Watch pass@1 jump. |
| **Regression tracking** | Persist each run's report keyed by `(model, prompt_version, git_sha)` to JSON/SQLite; diff against the previous run. | Catches silent regressions when you "improve" a prompt or bump a model. |
| **LLM-as-judge** | For tasks with no verifiable checker (docstrings, refactors), have a second `llm()` call grade the output against a rubric. | Extends coverage to non-verifiable tasks — but see the [measurement pillar](/writing/ai-software-engineering/pillars/05-measurement/) for judge-calibration pitfalls. |
| **Grow the dataset** | Add tasks whenever the model fails a real-world case; mine failures from production. | The eval is only as good as its coverage. A growing task set is the flywheel's flywheel. |

Sketch of the self-repair loop:

```python
def solve_with_repair(task, max_attempts=3) -> bool:
    prompt = PROMPT_TMPL.format(task=task.prompt)
    for _ in range(max_attempts):
        code = extract_code(llm(prompt))
        res = run_tests(code, task.test_src)
        if res.passed:
            return True
        prompt = (
            f"{prompt}\n\nYour previous solution failed:\n"
            f"```\n{res.stdout[-1500:]}\n```\nFix it. Return only a code block."
        )
    return False
```

> **Warning:** In the self-repair loop you are feeding test output back into the prompt. If any task data is externally sourced, that output is an injection vector — a malicious test could print instructions the model then "obeys." Truncate, and never execute anything the loop produces outside the sandbox.

---

## 11. Pitfalls

| Pitfall | Symptom | Mitigation |
|---|---|---|
| **Data contamination** | Suspiciously high scores on well-known problems (LeetCode classics). | The model memorized the answer during training. Use novel/private tasks; paraphrase; track when a task was authored. |
| **Flaky tests** | Same code passes then fails across samples. | Ban wall-clock, randomness without seeds, and network in tests. Make the checker deterministic — flakiness poisons the reward. |
| **Arbitrary code execution** | Harness deletes files, leaks keys, hangs. | Subprocess + timeout is the floor; container + no-network + non-root + resource caps for anything shared. Strip the child's env. |
| **Prompt injection** | Task/test data steers the model or harness. | Treat all task data as untrusted. Truncate fed-back output. Never interpolate task data into privileged commands. |
| **Over-fitting the prompt to the eval** | Score climbs but real-world behavior doesn't. | Hold out a private task set the prompt was never tuned against; report both. A prompt tuned on the eval *is* the eval — it stops predicting generalization. |

---

## Related

- [Overview](/writing/ai-software-engineering/README/) — the knowledge base entry point
- [Concept map](/writing/ai-software-engineering/concept-map/) — how these ideas connect
- [Foundations: evals & RLVR](/writing/ai-software-engineering/pillars/01-foundations/) — the training-time half of the verifiable-reward loop
- [Measurement](/writing/ai-software-engineering/pillars/05-measurement/) — pass@k, judge calibration, regression tracking in depth
- [Prototype B — test generation](/writing/ai-software-engineering/prototypes/b-test-generation/) — flip it around: the model writes the tests
- [Prototype C — incident triage agent](/writing/ai-software-engineering/prototypes/c-incident-triage-agent/) — verifiable rewards in an agentic setting

## Sources

- SWE-bench — the real-world benchmark this prototype miniaturizes: https://www.swebench.com/
- Anthropic, agentic coding best practices: https://code.claude.com/docs/en/best-practices
