---
title: "Learning Plan — Platform Engineer (Backstage IDP)"
date: 2026-07-12
description: "Strong-to-partial: the platform/automation philosophy is already how I work; Backstage and front-end depth are the gaps to build."
draft: true
series: "career"
order: 4
tags: ["learning", "career", "platform-engineering"]
---

## Fit summary

**Overall: strong-to-partial fit for a senior platform engineer moving into IDP work.**

The role's *philosophy* is already how Jervis works: build platform/automation
for other engineers, "you build it, you own it", systems thinking (architecture
+ performance + operations in design), observability, reliability/scalability at
200+ environment scale, RFC-driven design, and applied AI for the platform. That
is genuine platform engineering and toil reduction — the strongest angle.

The *specific technical surface* has two honest gaps: **Backstage** (no direct
experience) and **deep front-end React / TypeScript / Node.js** (front-end depth
is light — Meta and AWS prototypes only). Backend automation and plugin-style
architecture are credible from operator/Helm/microservice work; the front-end
plugin layer is the real thing to build. Both are closable in a focused
8–12 week push because the systems foundation is already there.

## Gap analysis

| JD requirement | Your evidence | Gap severity |
|---|---|---|
| Build internal developer platforms / drive DevEx via platform design & automation | Operators, Helm, fleet-wide automation, an AI ops agent, FIX-log DevEx microservice, PostgreSQL→Helm migration | **Strong** |
| Reliability, performance, monitoring, scalability | 200+ env stateful reliability; Grafana/Loki/Mimir observability; alert tuning; ES autoscaling RFC; dedicated instance groups | **Strong** |
| "You build it, you own it" / outcomes over output / public impact | On-call ownership to root cause; design→operate→tune loop; RFC-driven | **Strong** |
| Systems thinking — architecture, system design, operations in design | Autoscaling RFC, instance-group rollout, incident-grouping system design | **Strong** |
| CI/CD, automation, testing culture | fleet-wide campaigns, automated runbook validation, CI/CD practice, unit tests (Mercari) | **Strong / Partial** (test-first for app code less evidenced) |
| Observability | Grafana, Prometheus/Mimir, Loki, Elasticsearch — built and operated | **Strong** |
| Leverage AI for the IDP | an AI ops agent; LLM incident-grouping (applied) | **Strong** (applied, not research) |
| Mentoring / tech-sharing / give-receive feedback | Cross-team coordination; growth area actively worked | **Partial** (do it; document examples) |
| Plugin / API architecture | Kubernetes operators, gRPC microservices, controllers (backend patterns) | **Partial** (backend yes; Backstage plugin model no) |
| Node.js backend services | Java/Python/C# backend; no Node.js production work | **Partial / Gap** |
| Deep React, TypeScript (frontend plugins) | React prototypes (Meta, AWS); TS depth light | **Gap** |
| Backstage specifically | None yet | **Gap** |
| Open-source interest/contribution | Not yet evidenced | **Partial / Gap** |

## Priority objectives

Ranked by leverage for this JD:

1. **Backstage — stand up a real instance and build a working plugin** (both a
   backend plugin and a frontend plugin). This is the single highest-signal gap
   to close; everything else supports it.
2. **React + TypeScript depth** — enough to build and test a Backstage frontend
   plugin idiomatically (hooks, component patterns, typed props, testing).
3. **Node.js backend services** — Backstage backend is Node/Express-style; build
   a typed Node service and a Backstage backend plugin.
4. **Plugin / API architecture** — design a clean plugin with a documented API,
   mirroring the operator/controller patterns already known.
5. **DevEx metrics & testing/CI culture for app code** — instrument the platform
   (adoption, lead time), write tested code, wire CI/CD.

## Roadmap

**Phase 0 — Framing (week 1, part-time)**
- Read the Backstage docs top to bottom (architecture, plugins, software
  catalog, TechDocs, Software Templates/Scaffolder, backend system).
- Write a one-page "infra-platform → developer-platform" positioning note (feeds
  the interview story below).
- Milestone: can explain Backstage's architecture (catalog, plugins,
  frontend/backend split) and where it sits in a public-sector IDP.

**Phase 1 — Run Backstage + TS/React fundamentals (weeks 2–4)**
- Resource: official Backstage docs `backstage.io/docs` + "Getting Started";
  React docs `react.dev/learn`; a focused TypeScript course (e.g. Total
  TypeScript / "TypeScript Handbook").
- Hands-on: scaffold a local Backstage app (`npx @backstage/create-app`), run it,
  register components in the software catalog, enable TechDocs.
- Milestone: local Backstage running with a populated catalog and docs; can read
  and modify existing plugin code confidently.

**Phase 2 — Build a frontend plugin (weeks 4–7)**
- Resource: Backstage "Create a Frontend Plugin" guide; React Testing Library docs.
- Hands-on: build a frontend plugin solving a real DevEx pain point Jervis knows
  — e.g. a plugin surfacing service reliability/on-call/observability status
  (Grafana/Loki-backed) directly in the catalog entity page. Plays to existing
  strengths.
- Include: typed props, component tests, loading/error states.
- Milestone: working, tested frontend plugin demoable end-to-end.

**Phase 3 — Build a backend plugin + Node service (weeks 6–9, overlaps)**
- Resource: Backstage "Backend System" + "Create a Backend Plugin"; Node.js +
  Express fundamentals.
- Hands-on: build a backend plugin exposing a clean API the frontend plugin
  consumes (e.g. aggregating monitor/alert state per service). Document the API.
- Milestone: full-stack plugin (frontend + backend) with a documented API and
  tests, wired into CI.

**Phase 4 — Productionize + DevEx + open source (weeks 9–12)**
- Add CI/CD (GitHub Actions), linting, test coverage gates; instrument DevEx
  metrics (adoption, time-to-onboard-a-service).
- Write a Software Template (Scaffolder) that lets a team onboard a new service
  with observability wired in by default — direct DevEx/automation signal.
- Make one small open-source contribution to Backstage or a community plugin
  (docs fix, bug, small feature) to evidence OSS interest.
- Milestone: published plugin + template + one merged/opened OSS PR.

## Proof artifacts to build

- **A published Backstage plugin (full-stack)** — frontend + backend + documented
  API, tested, in a public repo with a clear README. Primary artifact.
- **A Software Template (Scaffolder)** that onboards a service with CI and
  observability pre-wired — demonstrates DevEx-via-automation.
- **A short write-up / demo** ("bringing DB reliability signals into Backstage")
  connecting existing observability strength to the IDP.
- **One open-source contribution** to Backstage or a community plugin.
- **DevEx metrics dashboard** for the demo platform (adoption, onboarding lead time).

## Interview prep

**The story: "infra/operator platform → developer platform."**
- Lead with the truth: "I already build platforms for engineers — Kubernetes
  operators, Helm charts, fleet automation, observability tooling, an AI ops
  agent. The users are operators and service teams; the discipline (abstract the
  hard stuff, reduce toil, own it end to end) is exactly IDP work. Backstage is
  the front door I'm now building on top of that foundation."
- Be direct about the gaps: no Backstage in production yet, front-end depth is
  developing — then immediately point to the built plugin and template as proof
  the gap is closing, not hypothetical.
- Frame AI honestly: applied LLMs for ops (an AI ops agent, incident-grouping), not ML
  research — and tie it to "leverage AI for the IDP" (e.g. AI-assisted catalog
  search, scaffolding, or incident context in Backstage).

**System-design topics to prepare:**
- Backstage plugin architecture (frontend/backend split, the backend system,
  plugin isolation, the software catalog data model and processors).
- API design for a plugin backend; auth/permissions in Backstage; secure-by-design
  (public-sector orgs care about security — connect to AWS Security Specialty cert).
- Multi-tenant / scale considerations for an IDP; performance and caching.
- Observability for the platform itself (plays to strength).
- Rollout/adoption strategy for an internal platform (mirror the instance-group
  and Helm-migration rollouts already done).

**Mentoring/feedback:** prepare one concrete example of tech-sharing or
cross-team coordination (the fleet rollouts qualify); state it as a growth area
being actively worked, framed with conviction.

## Timeline & success metrics

- **Weeks 1–4:** Backstage running locally + TS/React fundamentals solid.
  *Metric: catalog populated, can modify plugin code unaided.*
- **Weeks 4–7:** Frontend plugin shipped and tested.
  *Metric: demoable plugin, >80% of its logic under test.*
- **Weeks 6–9:** Backend plugin + documented API, full-stack integration.
  *Metric: end-to-end feature working, API documented, CI green.*
- **Weeks 9–12:** Productionized, Software Template, DevEx metrics, one OSS PR.
  *Metric: public repo, template onboards a service in one command, OSS PR
  opened/merged.*

**Definition of "interview-ready":** a public full-stack Backstage plugin +
Scaffolder template, a crisp infra-platform→IDP narrative, and preparedness to
whiteboard Backstage plugin/API architecture. Realistic focused timeline:
~10–12 weeks part-time alongside the current role.
