---
title: "Sandboxing and Least Privilege"
date: 2026-07-12
description: "Containment engineering: make a fully compromised agent survivable, because you cannot make it uncompromisable."
draft: true
series: "ai-software-engineering"
order: 32
tags: ["learning", "ai-software-engineering", "security"]
---

*Containment engineering: make a fully compromised agent survivable, because you cannot make it uncompromisable.*

> **BLUF:** Chapter 01 established that prompt injection cannot be fully prevented — untrusted content will eventually talk the model into doing something you didn't intend. So stop trying to win that fight and change the objective: engineer the system so a **fully compromised agent is a survivable event**. Assume breach. Minimize blast radius. Your security comes from what the agent *can* do — the capabilities the surrounding system grants it — not from what you *tell* it to do in a prompt. The enforcement hierarchy is fixed: **isolation first, deterministic gates second, prompt instructions last.** A guardrail the model can argue its way out of is not a guardrail; it's a suggestion.

---

## 1. The containment mindset and the enforcement hierarchy

> **Insight:** Treat the model as a hostile actor you are forced to run code on behalf of. This is not paranoia — it is the only assumption that survives contact with indirect injection. Once you internalize "the model *will* be adversarial for some inputs," every design question reduces to: *what happens when it turns on me, and is that acceptable?*

The single most common security mistake is spending the entire budget on the wrong layer — hardening the prompt ("you must never run destructive commands") while granting the agent an unrestricted shell. The prompt is the weakest possible enforcement surface: it is exactly the channel the attacker is injecting into. Put your effort where the model has no vote.

| Layer | Enforcement | Can the model bypass it? | Where your effort belongs |
|---|---|---|---|
| **Isolation** (sandbox, network boundary, ephemeral FS) | OS / hypervisor / kernel | No — it's below the model | **Most.** This is the floor under everything else. |
| **Deterministic gates** (hooks, allowlists, approval prompts) | Code that runs before the tool executes | No — runs regardless of model output | **Second.** Catches what isolation lets through. |
| **Prompt instructions** ("don't do X", "be careful with Y") | The model's cooperation | **Yes, trivially** — this is the injection channel | **Least.** Useful for behavior shaping, worthless as a security control. |

Read the table top-to-bottom as a spending order. If you have not saturated isolation and deterministic gates, adding more prompt rules is theater. Anthropic's agentic-coding guidance leans the same way: constrain what the tool *can* do rather than relying on what you tell it.

---

## 2. Least privilege and capability-scoped tools

> **BLUF:** Blast radius equals the union of permissions you granted. The lever is not "trust the agent more" — it's "grant it less." Default to read-only, grant write/execute per task, deny everything unlisted, and never expose a general-purpose escape hatch.

The tool surface *is* the attack surface. Every capability you hand the agent is a capability an injected instruction inherits. Design tools the way you'd design a privilege-separated daemon: narrow, purpose-built, and impossible to repurpose.

| Principle | What it means | Anti-pattern it kills |
|---|---|---|
| **Read-only by default** | Observation tools carry no mutation power | An agent that reads logs cannot also delete them |
| **Task-scoped grants** | Write/network capability is issued for *this* task and expires | A long-lived agent accumulating standing power |
| **Deny-by-default** | Anything not explicitly allowed is refused | Blocklists that are always one bypass behind |
| **No ambient authority** | No inherited shell, no default network, no free filesystem | The `run_bash` god-tool (below) |
| **Capability tokens per tool** | Each tool holds only the credential it needs, scoped to what it needs | One agent-wide credential that every tool can reach |

**The decisive contrast — broad vs. narrow tools:**

```text
# BROAD: one tool, unbounded authority. An injection that reaches this
# tool reaches the entire host. There is no worst case you can bound.
run_bash(command: string) -> string        # can rm -rf, curl | sh, cat ~/.ssh/*, ...

# NARROW: purpose-built, each with a bounded worst case you can reason about.
read_file(path: string)                     # read-only; path confined to /workspace
list_deploys(service: string, since: date)  # read-only; hits internal API, no writes
run_tests()                                  # spawns the test runner ONLY; no arg passthrough
open_pr(branch, title, body)                 # creates a PR; CANNOT push to protected refs
```

`run_bash` fails the containment test on contact: you cannot answer "what is the worst thing this does if the model is adversarial?" because the answer is "anything." Every narrow tool has a *provable* ceiling. The narrow set is also more legible to a human reviewer and to the deterministic gates in §5 — an allowlist over `read_file`/`run_tests` is trivial; an allowlist over the contents of a `command` string is a losing regex arms race.

> **Trap:** A "safe" narrow tool that takes a free-form string argument (`run_query(sql)`, `fetch(url)`, `run_bash` in a trench coat) has quietly re-created the god-tool. If the argument is a language, the tool is as powerful as that language. Constrain arguments to enums, IDs, and validated structured values — not prose.

---

## 3. Sandboxing layers

> **BLUF:** Isolation is a spectrum, not a switch. Pick the weakest layer whose worst-case containment you'd accept for the credentials and data in scope. For anything touching production adjacency, "subprocess with a timeout" is not enough.

Each layer contains a strictly larger failure than the one above it, at strictly higher cost. Match the layer to the blast radius you're trying to bound.

| Layer | Isolation strength | Overhead | What it actually stops | When to use |
|---|---|---|---|---|
| **Process** (subprocess + timeout + stripped env) | Weak | Negligible | Runaway loops (timeout), env-var leakage (stripped `PATH`/secrets), obvious accidents | Trusted code, local dev, the innermost layer of a defense stack — never the only layer |
| **Container** (Docker: non-root, read-only rootfs, dropped caps, resource limits) | Medium | Low (ms–s startup) | Filesystem tampering (RO rootfs), privilege escalation (non-root + dropped `CAP_*`), fork bombs / memory exhaustion (cgroups), host FS access (no bind mounts) | Default for running model-generated or untrusted code |
| **Kernel-hardened** (gVisor, seccomp/AppArmor profiles) | Strong | Medium | Kernel-syscall attack surface — a container escape via a kernel bug. seccomp allowlists the syscalls the workload actually needs; gVisor interposes a userspace kernel | Untrusted code that shares a host with other tenants; you don't trust the container boundary alone |
| **microVM** (Firecracker, Kata) | Strongest | Higher (VM boot, ~100s ms) | Full hardware-virtualization boundary; a guest-kernel compromise does not reach the host kernel | Multi-tenant execution of arbitrary code; the strongest isolation short of separate hardware |
| **Network egress control** (no network by default; egress allowlist) | Orthogonal — apply at every layer | Low | **Exfiltration and command-and-control.** The backstop when everything above fails: even a fully compromised agent with host access cannot phone home | **Always.** Default-deny egress; allowlist the specific hosts the task needs |

**Concrete container baseline (the medium tier, done right):**

```yaml
# The point is what's turned OFF. Each line removes a capability an
# injected instruction would otherwise inherit.
run:
  user: 10001:10001          # non-root; a container-breakout lands as nobody
  read_only_root_fs: true    # cannot tamper with binaries/config; scratch dir only
  cap_drop: [ALL]            # drop every Linux capability; add back none
  no_new_privileges: true    # setuid binaries cannot escalate
  network: none              # NO network unless the task provably needs it
  pids_limit: 256            # fork-bomb ceiling
  mem_limit: 2g              # OOM the container, not the host
  tmpfs: /workspace          # ephemeral; destroyed on exit, no persistence
  seccomp: ./profile.json    # syscall allowlist (promotes to the kernel-hardened tier)
```

> **Trap:** Containers are a resource and namespace boundary, not a hard security boundary. A container running as root with default capabilities is one kernel bug away from the host — and it shares the host kernel by design. If you're executing genuinely arbitrary attacker-influenced code, the honest boundary is a microVM or separate hardware, not `docker run`. The layers above are cumulative, not alternatives: run the subprocess *inside* the container *inside* the microVM, with egress denied at each.

Egress control is called out separately because it is the layer that pays off *after* every other layer has failed. Isolation limits what the agent can *do* to the host; egress control limits what it can *send* to the world. The high-severity incident chain from the security pillar — `indirect injection → tool overreach → exfiltration` — is severed at the last arrow by a default-deny egress policy, regardless of how thoroughly the first two arrows landed.

---

## 4. Human-in-the-loop approval gates

> **BLUF:** Some actions are irreversible or prod-adjacent enough that no amount of isolation substitutes for a human decision. Gate those — but gate *rarely and hard*, because a gate that fires constantly gets rubber-stamped, and a rubber-stamped gate is worse than none (it launders a machine decision as a human one).

Isolation bounds accidental and injected damage inside the sandbox. But some tools must, by definition, reach outside it — push to a remote, deploy, spend money. For those, the deterministic control is a human `y/n` in the loop.

**Actions that MUST gate — the irreversibility test:** anything you cannot cheaply undo, or that crosses into production/spend/credentials.

| Action | Why it gates |
|---|---|
| `git push` / merge to a protected branch | Escapes the sandbox into shared history |
| Deploy / release / infra apply | Directly touches production |
| Delete (data, resources, records) | Often irreversible; backups may not cover it |
| Install / add a dependency | Supply-chain entry point (see chapter 03) |
| Credential use (read a secret, assume a role, sign) | The keys to everything else |
| Outbound spend (API calls that bill, provisioning) | Financial blast radius |
| Any outbound network write to a non-allowlisted host | Exfiltration path |

**The approval-fatigue failure mode.** Humans habituate. Prompt someone twenty times an hour and by the twenty-first they are pressing `y` before reading. At that point the gate is *negative* value: it consumes attention and produces a false audit trail ("a human approved this"). Fight it deliberately:

- **Gate rarely.** If a gate fires on routine, safe operations, the tool is scoped wrong — narrow the tool (§2) so the safe path needs no approval and only the genuinely dangerous path prompts.
- **Gate hard.** When it does fire, make refusal the easy default and require an affirmative, specific confirmation — not a bare `y`.
- **Make the diff legible.** The human can only add value if they can *see* what they're approving in seconds: the exact command, the exact files, the exact destination host, the exact resources deleted. An approval prompt that says "the agent wants to run a deploy" with no diff is a rubber stamp by construction. Show `git diff --stat`, the target environment, and the blast radius in the prompt itself.

> **Insight:** The quality of a human gate is set entirely by the legibility of what's shown, not by the human's diligence. Diligence does not scale; legibility does. Invest in making the diff self-evident, not in reminding the human to be careful.

---

## 5. Deterministic guardrails (hooks) vs. advisory instructions

> **BLUF:** A pre-tool-use hook is code that runs *before* a tool executes and can hard-block it, regardless of what the prompt said or what the model decided. This beats prompt rules for one reason: the model has no vote. The prompt is advisory; the hook is load-bearing.

A prompt rule ("never delete production data") is enforced by the model's cooperation — the exact thing injection subverts. A hook is enforced by your code, which the model cannot see, edit, or reason its way past. Same intent, categorically different guarantee.

| | Advisory prompt rule | Deterministic hook |
|---|---|---|
| Enforced by | Model cooperation | Your code, pre-execution |
| Bypassable by injection | Yes | No |
| Visible to the model | Yes (it's in context) | No |
| Failure mode | Silent — you learn it failed after the fact | Loud — the call is blocked and logged |
| Right role | Behavior shaping, UX | The actual security boundary |

**Pre-tool-use hook — allowlist-and-hard-block pseudocode:**

```python
# Runs on EVERY tool call, before the tool executes. Deny-by-default.
# The model never sees this logic and cannot edit it. Returns ALLOW or BLOCK;
# BLOCK aborts the call and surfaces the reason to the audit log.

ALLOWED_COMMANDS = {"pytest", "ruff", "mypy", "git"}      # exact binaries
ALLOWED_GIT_SUBCMDS = {"status", "diff", "add", "commit"}  # NOT push/reset --hard
WRITABLE_ROOT = "/workspace"                               # confined FS root
EGRESS_ALLOWLIST = {"api.internal.example", "pypi.org"}   # exact hosts

def pre_tool_use(tool, args):
    if tool == "run_command":
        binary = args.argv[0]
        if binary not in ALLOWED_COMMANDS:
            return BLOCK(f"command '{binary}' not on allowlist")
        if binary == "git" and args.argv[1] not in ALLOWED_GIT_SUBCMDS:
            return BLOCK(f"git subcommand '{args.argv[1]}' not permitted")

    if tool in ("write_file", "delete_file"):
        real = os.path.realpath(args.path)               # resolve symlinks first
        if not real.startswith(WRITABLE_ROOT + os.sep):
            return BLOCK(f"path '{real}' escapes {WRITABLE_ROOT}")

    if tool == "fetch":
        host = urlparse(args.url).hostname
        if host not in EGRESS_ALLOWLIST:
            return BLOCK(f"egress to '{host}' denied")

    return ALLOW
```

> **Trap:** Two classic hook bypasses. (1) **Path traversal / symlink** — check `os.path.realpath` *after* resolving symlinks, or `/workspace/link → /etc` sails through a naive `startswith`. (2) **Blocklists instead of allowlists** — a hook that blocks `rm -rf` misses `find … -delete`, `> file`, `python -c "shutil.rmtree(...)"`. Enumerate what's *allowed* and refuse the rest; the blocklist is always one creative phrasing behind.

The hook is where §2 (narrow tools), §3 (egress control), and §4 (approval gates) become *enforced* rather than *intended*. A gate you documented is a wish; a gate in the pre-tool-use hook is a control.

---

## 6. Blast-radius engineering: the worksheet

> **BLUF:** For every tool the agent holds, answer one question: *if the model were fully adversarial, what is the worst outcome?* If that worst case is unacceptable, the grant is wrong — narrow the tool, sandbox it harder, or gate it — until the worst case is something you'd accept happening. This is the whole discipline in one loop.

Do this per tool, adversarially, assuming the injection already succeeded:

1. **Enumerate** every tool and its arguments.
2. **Assume compromise** — the model will call this tool with the worst possible arguments an attacker could induce.
3. **Name the worst case** in concrete terms (not "bad things" — *which* data, *which* system, reversible or not).
4. **Check acceptability.** Would you accept that outcome occurring unattended?
5. **If no, contain** — swap the broad tool for a narrow one, drop it into a stronger sandbox, add an egress rule, or add a human gate — and re-run step 3.

You are done when every tool's worst case is one you could live with. That is a *far* stronger property than "we told it to be careful."

| Tool | Worst case if compromised | Containment that makes it acceptable |
|---|---|---|
| `run_bash(cmd)` | Arbitrary host code exec, secret theft, C2 | **Delete it.** Replace with narrow tools; no bounded worst case exists |
| `read_file(path)` | Reads secrets/keys outside the workspace | Confine `realpath` to `/workspace`; keep secrets out of that tree (§7) |
| `fetch(url)` | Exfiltrates context to an attacker host | Default-deny egress; allowlist exact hosts (§3, §5) |
| `open_pr(...)` | Injects malicious code into a PR | Acceptable: PR is *proposed*, not merged — human review + branch protection catch it |
| `deploy(service)` | Ships attacker code to production | Human approval gate with legible diff (§4); never unattended |
| `db_query(sql)` | Reads/exfiltrates or destroys data | Replace free-form SQL with parameterized, read-only, row-scoped queries |

> **Insight:** Notice that `open_pr` is *acceptable while fully compromised* — the worst case (a malicious PR) is already caught by an existing downstream control (review + protected branches). That's the goal state: tools whose worst case lands on a control you already trust. You don't have to make every tool safe in isolation; you have to make every tool's failure land somewhere caught.

---

## 7. Secrets and egress — the two backstops (preview)

**Secrets — keep them out of the agent's reach entirely.** The containment principle applied to credentials: an agent cannot leak what it cannot read. Do not put secrets in environment variables the agent's process inherits, in files under its workspace, or in its context window. Broker credentials through a separate process the agent calls but cannot read from — the tool holds the key, the model holds only a handle. If a secret is never agent-readable, no injection can exfiltrate it. Full treatment in [chapter 03](/writing/ai-software-engineering/deep-dives/security/03-supply-chain-secrets-and-exfiltration/).

**Egress — the last line when everything else fails.** Every layer above can be defeated by a sufficiently clever injection plus a sufficiently bad bug. Egress control is what remains: if the agent has no network path to an attacker-controlled host, a total compromise still cannot *send* your data or code anywhere. Default-deny outbound, allowlist the specific hosts the task needs, and log every attempt. This is the backstop that turns "catastrophic breach" into "contained incident." Full treatment — including DNS-based and timing-based exfiltration channels the naive allowlist misses — in [chapter 03](/writing/ai-software-engineering/deep-dives/security/03-supply-chain-secrets-and-exfiltration/).

---

## 8. Close: containment is what makes autonomy safe

The two hands-on prototypes in this knowledge base are, at their core, containment designs:

- **[Prototype C — incident-triage agent](/writing/ai-software-engineering/prototypes/c-incident-triage-agent/)** is the *read-only tools + human gate* safety model in the flesh. The agent reads a frozen snapshot through tools that carry zero mutation power, and the only path to action (a fix PR) is proposed for human review, never applied. Its worst case while fully compromised is a bad diagnosis and a reviewable PR — which is exactly why you can let it run.
- **[Prototype A — eval harness](/writing/ai-software-engineering/prototypes/a-eval-harness/)** is *sandboxed subprocess execution of model-generated code*. It runs arbitrary LLM-authored code — the definitionally-untrusted case — inside a subprocess with a timeout and a stripped environment (§3, innermost tier), so a malicious or broken generation harms nothing but its own run.

> **The through-line:** autonomy is safe in exact proportion to how small you've made the blast radius. The [autonomy spectrum](/writing/ai-software-engineering/pillars/02-agentic-workflow/#levels-of-autonomy-human-in-the-loop-spectrum) — from suggest, to act-with-approval, to unattended — is not a measure of how much you trust the model. It's a measure of how thoroughly you've contained it. You earn the right to move up the spectrum by engineering the worst case down, not by hoping the model behaves. Containment is the enabling condition for every gain agents offer; without it, more autonomy is just more exposure.

---

## Related

- [Deep-dive index](/writing/ai-software-engineering/deep-dives/security/README/)
- [Chapter 01 — Prompt-injection defenses](/writing/ai-software-engineering/deep-dives/security/01-prompt-injection-defenses/)
- [Chapter 03 — Supply chain, secrets, and exfiltration](/writing/ai-software-engineering/deep-dives/security/03-supply-chain-secrets-and-exfiltration/)
- [Overview](/writing/ai-software-engineering/README/)
- [Concept map](/writing/ai-software-engineering/concept-map/)
- [Security pillar](/writing/ai-software-engineering/pillars/04-security/)
- [Agentic workflow pillar](/writing/ai-software-engineering/pillars/02-agentic-workflow/)
- [Prototype C — incident-triage agent](/writing/ai-software-engineering/prototypes/c-incident-triage-agent/)
- [Prototype A — eval harness](/writing/ai-software-engineering/prototypes/a-eval-harness/)

## Sources

- Anthropic — agentic coding best practices: https://code.claude.com/docs/en/best-practices
- Quantitative claims flagged inline (training cutoff Jan 2026 — verify live).
