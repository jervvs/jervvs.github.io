---
title: "Learning Plan — Software Engineer (Full-Stack)"
date: 2026-07-12
description: "Medium-high: a strong backend/platform half; the modern front-end half is real but shallow."
draft: true
series: "career"
order: 5
tags: ["learning", "career", "fullstack"]
---

## Fit summary
**Overall fit: Medium-High.** You are a credible full-stack SWE candidate whose *backend and platform* half is strong and directly on-target, and whose *modern front-end* half is real but shallow. The role explicitly wants "reasonably large, high-availability systems operating at scale" — that is the single best-supported line in your CV (200+ containerized production environments at Palantir, plus live-trading systems at Marshall Wace). Backend service work (C# gRPC + Kafka microservices, TMS, Spring Boot), AWS (5 certs), Docker/Kubernetes, SQL & NoSQL, and ELK-stack observability all map cleanly.

The gap is squarely in the JD's front-end and Node.js stack. Your React is genuine but early-career (Meta + AWS prototypes, ~2022), and you have no evidenced Next.js, Vue.js/Nuxt, or Node.js/TypeScript backend work, no Golang, and no direct government-agency delivery. None of these are disqualifying for a full-stack role that also lists Java/TypeScript/Node/Go as alternatives — but you must close the front-end depth gap fast to interview well and to be honest about seniority.

## Gap analysis
| JD requirement | Your evidence | Gap severity |
|---|---|---|
| Large, high-availability systems at scale | Palantir 200+ K8s prod envs; MW live-trading systems | **Strong** |
| Backend: Java / TypeScript / Node.js / Golang | Java (Palantir operators), C#/.NET + gRPC + Kafka (MW), Kotlin/Spring Boot (CS) | **Strong** on Java/C#; **Gap** on Node.js & Golang |
| Front-end: React.js | Meta full-stack (Hack + React); AWS React prototype | **Partial** — real but early/shallow, no recent production depth |
| Front-end: Next.js / Nuxt / Vue.js | None | **Gap** |
| SQL & NoSQL (PostgreSQL, MySQL, MongoDB) | PostgreSQL, MS SQL Server, Cassandra, Elasticsearch (prod); MongoDB (project); no MySQL | **Strong** (SQL + NoSQL breadth; MySQL is trivially transferable from MS SQL/PostgreSQL) |
| Cloud: AWS (preferred) | AWS internship + 5 AWS certifications; Terraform IaC | **Strong** |
| CI/CD (GitHub Actions, GitLab CI) | CI/CD practice listed; no evidenced GitHub Actions / GitLab CI specifically | **Partial** — concept strong, named tools unproven |
| Docker, Kubernetes | Daily at Palantir (operators, Helm, 200+ envs) | **Strong** |
| Unit + integration tests | Unit tests (Mercari); data validation (Meta); no product-scale integration-test evidence | **Partial** |
| Observability: ELK, CloudWatch, Splunk | ELK/Elasticsearch, Grafana, Loki, Prometheus (strong); no CloudWatch/Splunk | **Partial** — ELK strong, CloudWatch/Splunk gap |
| Agile/Scrum, code review, cross-functional | Rotational program across 4 teams; contribute to shared repos via review | **Strong** (implicit) — sharpen the Scrum vocabulary |
| Collaborate with government agencies / public sector | None | **Gap** — narrative/interview item, not a skill to learn |

## Priority objectives
Ranked by impact on this application:
1. **Modern front-end depth — React + Next.js (TypeScript).** Biggest gap between "listed React" and "can own a full-stack feature." This is the make-or-break for a *full-stack* title.
2. **Node.js/TypeScript backend.** JD's alternative backend stack; pairs with #1 to make you full-stack end-to-end in one language, without leaning on C#/Java.
3. **Integration testing at product scale + named CI/CD (GitHub Actions).** Move from "unit tests" to comprehensive unit *and* integration tests wired into a GitHub Actions pipeline — directly named in the JD.
4. **Secondary: Vue.js/Nuxt familiarity + Golang literacy.** Enough to speak credibly and read code; not full depth.

## Roadmap

### Phase 1 (Weeks 1–3) — React + TypeScript, done properly
- **Resources:** official React docs (react.dev "Learn" track) + TypeScript Handbook; Josh Comeau *The Joy of React* or Kent C. Dodds *Epic React* for depth.
- **Build:** rebuild your Meta-style CRUD tool as a modern React + TypeScript SPA — typed components, hooks, client-side routing, form validation, talking to a mock REST API.
- **Milestone:** a deployed React+TS app with typed state and a clean component tree; no `any`.

### Phase 2 (Weeks 3–6) — Next.js full-stack
- **Resources:** Next.js official "Learn" course (App Router); Vercel deployment docs.
- **Build:** convert the Phase 1 app into a Next.js full-stack app — App Router, server components, API routes as the backend, PostgreSQL (Prisma or Drizzle) for persistence, auth. This turns "React" into "full-stack" on your CV honestly.
- **Milestone:** deployed Next.js app on Vercel, backed by a real PostgreSQL database, with server-side data fetching.

### Phase 3 (Weeks 6–8) — Node.js/TS backend + testing + CI/CD
- **Resources:** Node.js + Express/Fastify docs; Vitest/Jest + Supertest for integration tests; Playwright for end-to-end; GitHub Actions docs.
- **Build:** extract a standalone Node.js/TypeScript API (Fastify) with a Postgres and a MongoDB adapter (hits SQL *and* NoSQL); write comprehensive unit **and** integration tests; wire a GitHub Actions pipeline (lint → test → build → deploy) with Docker.
- **Milestone:** green GitHub Actions pipeline running unit + integration tests on every push, containerized deploy.

### Phase 4 (Weeks 8–10) — breadth: Vue/Nuxt + Golang literacy + observability
- **Resources:** Vue.js official guide + Nuxt docs (skim-to-build); Go "Tour of Go" + build one small HTTP service; AWS CloudWatch + Splunk free tutorials.
- **Build:** a small Vue/Nuxt front-end against your Phase 3 API; a tiny Go HTTP service; add CloudWatch (or Grafana→CloudWatch) dashboards/log queries so you can speak to CloudWatch/Splunk alongside ELK.
- **Milestone:** you can read/modify Vue and Go code and discuss CloudWatch/Splunk vs your ELK experience credibly.

## Proof artifacts to build
- **One deployed full-stack app** (Next.js + TypeScript + PostgreSQL, MongoDB option) — public URL + GitHub repo. This single artifact neutralizes the front-end, Node/TS, and NoSQL gaps at once.
- **A GitHub Actions CI/CD pipeline** in that repo, visibly running unit + integration tests and a Docker build — screenshots/badge in the README.
- **A short "infra → product" README/blog** framing what you learned building it, plus a Vue mini-front-end and a Go micro-service in a `experiments/` folder for breadth signal.
- Pin these repos on GitHub and mirror the stack into your LinkedIn Headline/About/Skills (recruiter search weights those).

## Interview prep
- **Own the scale story (your strongest card):** rehearse the 200+ containerized-environment high-availability narrative and one MW live-trading system story with a metric — this is exactly the role's "high-availability systems at scale" line.
- **Tell the infra → product-SWE story honestly:** "I've operated and written backend/platform code for large-scale systems, and I've built full-stack products (Meta React, Next.js side project); I want to move closer to product delivery." Do not overstate front-end seniority; let the deployed app carry it.
- **Scrum fluency:** be ready to describe Sprint Planning, Review, Retrospective, and how you give/receive code review — draw on the rotational-program cross-functional experience.
- **Public sector:** you have no government-agency delivery — say so plainly and pivot to mission-driven, reliability-critical work (trading systems, 200+ prod envs) as the transferable analogue; show interest in the public sector's citizen-facing scale.
- **System design:** prep a high-availability full-stack design (load balancing, caching, SQL vs NoSQL choice, observability) — you can speak to this from real operational experience, which many candidates cannot.

## Timeline & success metrics
- **10 weeks** part-time (~8–10 hrs/week) to interview-ready full-stack.
- **Week 6:** deployed Next.js full-stack app live (front-end + Node/TS backend + Postgres gap closed).
- **Week 8:** GitHub Actions pipeline green with unit + integration tests (CI/CD + testing gap closed).
- **Week 10:** Vue/Nuxt + Golang + CloudWatch/Splunk breadth demonstrable; CV "Front-end" and "Backend" lines truthfully expanded to include Next.js, Node.js/TypeScript, and GitHub Actions.
- **Success = ** every "Gap"/"Partial" row above has either a shipped proof artifact or a rehearsed, honest interview answer.
