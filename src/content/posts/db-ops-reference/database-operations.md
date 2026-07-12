---
title: "Database Operations: A First-Principles Reference"
date: 2026-07-12
description: "Measuring system health, analysing incidents, and driving stability investment — from first principles."
draft: true
series: "db-ops-reference"
order: 0
tags: ["learning", "databases", "systems", "reliability"]
---

*Measuring system health, analysing incidents, and driving stability investment*

---

## 1. Why Things Break — First Principles of Failure

**Change is the primary cause of incidents.**
64% of IT outages trace to configuration or change management issues (Uptime Institute, 2023). Every schema migration, config edit, deploy, and infra change is a potential incident. Treat every change as a controlled, reversible, observable event.

**Complex systems always run in degraded mode.**
Your database fleet has latent flaws right now — individually insufficient to cause failure, collectively dangerous. Catastrophe requires multiple failures combining. There is no single "root cause." (Cook, *How Complex Systems Fail*, 1998)

**Catastrophic failures come from simple bugs, not complex ones.**
92% of catastrophic failures in distributed data systems (Cassandra, HBase, HDFS, Redis) were caused by incorrect handling of non-fatal errors explicitly signalled in software. 58% were detectable by simple testing of error handling code. (Yuan et al., USENIX OSDI'14)

**Incidents are multi-causal chains.**
Contributing condition → Trigger → Failure → Amplifier → Impact. None alone is sufficient. Track the full chain — especially amplifiers (missing circuit breakers, absent alerts, stale runbooks) — for highest-leverage fixes.

**"Human error" is a symptom, not a cause.**
58% of human-error outages occurred because staff failed to follow procedures — but that reveals procedures disconnected from reality, not negligent people. Always ask: why did the system allow this? (Cook, Principle #7; Uptime Institute 2025)

---

## 2. Measuring System Health — SLIs, SLOs, and Error Budgets

System health is measured by SLOs, not by incidents. Incidents are a learning source; SLOs are the health signal.

### The stack

| Concept | Definition | Example |
|---|---|---|
| **SLI** | Quantitative measure of service health: good events / total events | Successful queries / total queries = 99.7% |
| **SLO** | Target value for an SLI over a rolling time window. Always <100%. | 99.4% availability over 7 days |
| **Error budget** | 100% − SLO. The maximum unreliability you can afford. | 0.6% of 7 days = 60.5 min/week |
| **Burn rate** | How fast you're consuming the budget. Alert on unsustainable rates. | 14.4x burn = budget exhausted in 50 hrs |

### SLOs vs P0 monitors

**P0 monitor**: Binary threshold. Fires when something is already broken. No memory of last week. Ten 5-minute blips that self-resolve → all green.

**SLO + error budget**: Continuous health signal over a rolling window. Catches slow degradation. Ten 5-minute blips → 50 min of budget consumed. Surfaces latent risk.

### Error budget decision framework

- **>50% remaining** → Ship features, run migrations confidently
- **25–50%** → Review what's burning budget, slow risky changes
- **<25%** → Freeze features, focus only on reliability
- **Exhausted** → Full change freeze until window recovers

*References: Google SRE Workbook — Implementing SLOs (sre.google/workbook/implementing-slos); Alerting on SLOs (sre.google/workbook/alerting-on-slos); Error Budget Policy (sre.google/workbook/error-budget-policy)*

---

## 3. Analysing Incidents — What to Track Instead of MTTR

### Why MTTR is unreliable

Incident durations follow power-law distributions, making the mean statistically misleading.

- **Davidovič (Google SRE, O'Reilly 2021)**: Monte Carlo simulations show MTTR is poorly suited for decision-making or trend analysis. Even with genuine improvement, variance makes it undetectable through MTTR.
- **VOID Report (Verica, ~10,000 incidents, 600 companies)**: "Measures of central tendency like the mean aren't a good representation of positively-skewed data." Duration and severity are not correlated.
- **Allspaw (2018)**: MTTR is "shallow incident data" that "generates very little insight" about dynamic events involving people making decisions under time pressure.
- **Hochstein (2024)**: When incident durations follow power-law distributions, observed MTTR trends convey no useful information at all.

### The replacement: a three-layer measurement model

#### Layer 1: Quantitative (the numbers)

| Metric | What it tells you |
|---|---|
| Error budget consumed by failure mode | What's costing us the most reliability? |
| Incident duration percentiles (P50/P90/P99) | Typical vs tail incidents — where to improve? |
| Incident count by failure mode over time | Are specific failure categories declining? |
| Cost of coordination (people × teams × seniority) | Is our response process efficient? |
| Alert-to-incident conversion rate | Is our alerting signal clean or noisy? |

#### Layer 2: Qualitative (the stories)

| Method | What it tells you |
|---|---|
| Thematic analysis of postmortems | What systemic patterns keep appearing? |
| Action item completion rate | Is our learning loop actually closing? |
| What-went-well tracking | Where is resilience improving? |
| Near-miss documentation | What almost broke but didn't, and why? |

#### Layer 3: Primary signal (the answer)

**SLO error budget remaining per cluster** — Is the system healthy? Can we ship changes?

**Gary Klein's equation** (cited by Nora Jones): Performance improvement = error reduction + insight generation. You need both the quantitative and the qualitative. Numbers without stories are misleading; stories without numbers lack leverage.

### Cost of coordination

Dr. Laura Maguire (Ohio State / ACM Queue 2020) studied 62 incidents across 4 organisations and found that incident response often becomes mostly about managing coordination (paging, briefing, tool-switching, stakeholder updates) — not technical diagnosis and repair.

Track: number of responders, teams involved, seniority required, communication channels used, and time-to-relevant-expert. Especially critical for cross-boundary incidents (e.g., highside environments with indirect metric access).

The key insight: two incidents with identical MTTR can have radically different coordination costs. One required a single engineer for 45 minutes of diagnosis; the other required 8 people across 3 teams spending 35 minutes coordinating and 10 minutes fixing. MTTR sees them as identical. Cost of coordination reveals the real difference.

---

## 4. Products to Build — Closing the Gaps

| Product | Purpose | Key capability |
|---|---|---|
| **Database Fleet Registry** | Know your infrastructure | Every cluster as a queryable record: engine, version, cloud, region, security tier, team, topology, change history, access model. Auto-enriches alerts at triage time. |
| **Incident Classification System** | Know your failures | Structured taxonomy: failure mode (controlled vocabulary), trigger, contributing conditions, amplifiers, detection gaps. Linked to fleet registry via affected clusters. |
| **Pattern Correlation Layer** | Know your patterns | Join incidents × fleet metadata: "All affected clusters are on v4.1 + Azure." Surfaces patterns invisible to individual triage. Drives quarterly stability investment. |

### Incidents vs requests vs problems — keep them separate

ITIL v3 formalized the distinction: **Incidents** are unplanned disruptions (something broke). **Requests** are planned work (disk scaling, CVE patching, user questions). **Problems** are investigations into recurring incidents.

Mixing them in one queue with only severity to distinguish them pollutes incident metrics, prevents clean taxonomy queries, and misrepresents on-call load. Add a *type* field; keep severity within each type.

---

## Key References

- Campbell & Majors, *Database Reliability Engineering* (O'Reilly, 2017)
- Cook, *How Complex Systems Fail* (1998) — https://how.complexsystems.fail
- Yuan et al., *Simple Testing Can Prevent Most Critical Failures* (USENIX OSDI'14)
- Google SRE Workbook — https://sre.google/workbook/
- Davidovič, *Incident Metrics in SRE* (O'Reilly, 2021)
- Nash et al., *VOID Report* (Verica, 2021–22) — https://www.thevoid.community
- Maguire, *Managing the Hidden Costs of Coordination* (ACM Queue, 2020)
- Hidalgo, *Implementing Service Level Objectives* (O'Reilly, 2020)
- Jones / Learning from Incidents community — https://www.learningfromincidents.io
