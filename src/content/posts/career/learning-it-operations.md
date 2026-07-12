---
title: "Learning Plan — IT Operations Engineer"
date: 2026-07-12
description: "Medium: a strong automation-for-IT-ops story, weaker on classic SaaS-admin and Windows endpoint support."
draft: true
series: "career"
order: 6
tags: ["learning", "career", "it-operations"]
---

## Fit summary
**Medium fit — a strong "automation engineer for IT operations" story, weaker on classic help-desk / SaaS-admin.** The role explicitly wants someone who codes away recurring IT toil and drives issues to root cause; that is Jervis's genuine edge (Python automation, fleet-wide campaigns, runbook-validation automation, AI-assisted ops tooling, alert/monitor tuning, incident pattern-detection). Git, CI/CD, Linux depth, on-call, and operational documentation are all real and evidenced.

Three honest gaps keep this from being a High fit:
1. **Tenure.** The JD asks for **5+ years IT support**. Jervis has roughly two years of professional engineering (Marshall Wace, Jun 2023–Jun 2025) plus his current Palantir role — this does not meet the bar and should not be claimed. Position on depth of automation/root-cause, not years.
2. **Hands-on SaaS administration.** No direct admin experience with Okta, Google Workspace, Jira, Microsoft 365, Slack, or Zoom. This is a core JD requirement and the biggest single gap.
3. **Windows endpoint troubleshooting.** Strength is Linux and infrastructure automation, not dedicated Windows-endpoint support (performance/driver/app diagnosis). macOS/Windows are day-to-day use only.

## Gap analysis
| JD requirement | Your evidence | Gap severity |
|---|---|---|
| Design/build automations with code to reduce IT toil | Python fleet automation, fleet-wide campaigns, runbook-validation via Confluence API + Airflow, an AI ops agent | Strong |
| Strong root-cause / pattern detection | Alert/monitor tuning, LLM incident-grouping, production support | Strong |
| Familiarity with Git and CI/CD tooling / developer workflows | Daily Git + code review; CI/CD in practices; operator/Helm contributions | Strong |
| On-call rotation | On-call for four data stores across 200+ environments; MW live-trading support | Strong |
| Maintain internal documentation | Runbook automation; SOP/runbook contribution culture | Strong |
| Proficiency across Linux | Deep Linux/Kubernetes/infra experience | Strong |
| Responsive in-depth technical support & escalation | Production support + escalation at Palantir and MW | Partial (infra/data support, not end-user endpoint helpdesk) |
| Proficiency across macOS and Windows | Day-to-day use only | Partial |
| Diagnose Windows perf/driver/app issues | None | Gap |
| Hands-on SaaS admin (Okta, Google Workspace, Jira, Slack, Zoom, M365) | None | Gap |
| IT asset lifecycle / compliance, procurement partnership | None (adjacent: AWS security/compliance benchmarks) | Gap |
| Onboarding (accounts + hardware), on-site workstation/hardware support, cable management | None | Gap |
| 5+ years IT support | ~2 yrs professional + current role | Gap |

## Priority objectives
1. **SaaS administration** — Okta (identity/SSO), Google Workspace admin, Jira, Slack, Zoom, Microsoft 365. Highest priority; core to the day job and the clearest gap.
2. **Windows endpoint troubleshooting** — performance, drivers, application issues; Windows admin fundamentals.
3. **ITSM / IT support fundamentals** — ticketing/escalation practice, asset lifecycle and compliance, onboarding/offboarding workflows.
4. **Endpoint management basics** — MDM concepts and device provisioning to connect automation strengths to endpoint fleets.

## Roadmap

### Phase 1 (Weeks 1–3) — Identity & SaaS core
- Resources: Okta certification path (Certified Professional), Google Workspace Administrator fundamentals.
- Hands-on: Stand up a free Okta developer org and a Google Workspace trial; configure SSO/SAML between them, create users/groups, and enforce an MFA policy.
- Milestone: A working Okta ↔ Google Workspace SSO lab with users, groups, and MFA documented.

### Phase 2 (Weeks 4–6) — SaaS breadth + automation bridge
- Resources: Atlassian Jira administration basics; Slack and Zoom admin console guides; Microsoft 365 admin fundamentals.
- Hands-on: Script user provisioning/deprovisioning against the Okta and Google Workspace APIs in Python — turning your automation strength directly onto SaaS admin toil.
- Milestone: A Python onboarding/offboarding script that creates and disables accounts across two SaaS platforms from one command.

### Phase 3 (Weeks 7–9) — Windows endpoint depth
- Resources: Windows client administration fundamentals; guided practice diagnosing performance, driver, and application issues (Event Viewer, Task/Resource Monitor, Reliability Monitor).
- Hands-on: Build a Windows VM, reproduce and diagnose a performance/driver problem end-to-end, and write a triage runbook.
- Milestone: A documented Windows endpoint triage runbook with a decision tree.

### Phase 4 (Weeks 10–12) — ITSM, assets & consolidation
- Resources: ITSM/ticketing and IT asset-lifecycle/compliance basics; MDM/endpoint-management overview.
- Hands-on: Design a mock onboarding workflow (account creation across SaaS + hardware asset assignment + compliance checklist) and automate the account-creation portion.
- Milestone: A complete onboarding playbook with the automatable steps scripted.

## Proof artifacts to build
- **SaaS admin lab writeup** — Okta ↔ Google Workspace SSO/MFA, with screenshots and a short README.
- **IT-automation script portfolio** — Python onboarding/offboarding across SaaS APIs; a small "codes away IT toil" repo mirroring the JD's core responsibility.
- **Windows endpoint triage runbook** — reproduced problem, diagnosis steps, decision tree.
- **Onboarding playbook** — accounts + hardware + compliance, with automatable steps implemented.

## Interview prep
- **Lead with the automation/root-cause story.** Concrete narratives: automating runbook validation (Confluence API + Airflow), tuning alerts/monitors to cut on-call toil, building an AI ops agent and the incident-grouping system to detect recurring patterns. This is exactly the "reduce manual toil with code" mandate — make it the spine of the interview.
- **Address the tenure gap head-on.** Do not claim 5+ years. Say plainly: roughly two years professional plus current role; frame the differentiator as the depth of automation and root-cause work, and point to production support / on-call as evidence you operate under pressure.
- **Address the SaaS gap honestly with a plan.** "I have not administered Okta/Workspace/Jira in production, but here is my SSO/MFA lab and a Python script that provisions users across two of them — I bring the automation skill the role wants and I am closing the tooling gap fast."
- **Reframe Linux depth as an asset, not a mismatch.** Position cross-OS support as a strength-plus-growth: strong Linux/infra, day-to-day macOS/Windows, actively building Windows endpoint diagnosis.
- **Use Git/CI/CD fluency to bond with developer users.** The role supports engineers; emphasize you live in their workflows daily.

## Timeline & success metrics
- **12 weeks** to interview-ready on the gaps.
- Success metrics:
  - Okta certification (or equivalent) attempted/passed; Google Workspace admin fundamentals complete.
  - Two published proof artifacts minimum (SaaS SSO lab + IT-automation script portfolio).
  - One Windows endpoint triage runbook and one onboarding playbook completed.
  - Able to speak fluently to SaaS admin concepts and demo the provisioning script live.
