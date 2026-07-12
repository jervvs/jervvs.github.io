---
title: "CV — Platform Engineer (Backstage IDP)"
date: 2026-07-12
description: "My CV cut for platform-engineering / internal-developer-platform roles."
draft: true
series: "career"
order: 12
tags: ["learning", "career", "cv", "platform-engineering"]
---
linkedin.com/in/jervis-chan · Singapore

## Summary

Systems-thinking platform and reliability engineer who builds the automation,
operators, and observability that other engineers depend on. I safeguard four
stateful data stores across 200+ containerized (Kubernetes) production
environments, and I reduce developer and operator toil by turning recurring
manual work into code — Kubernetes operators, Helm charts, fleet-wide
automation, and AI-assisted operations tooling. I care about outcomes over
output and live by "you build it, you own it": I own problems from design
through operation to root cause. I am moving into internal developer platform
(IDP) work — this is a deliberate step from infrastructure/operator platforms
toward Backstage-based developer experience (DevEx), backed by an active
learning plan (Backstage plugins, React/TypeScript, Node.js).

## Skills

- **Core platform & reliability:** Internal platform/automation tooling,
  Kubernetes Operators, Helm charts, fleet-wide automation, toil reduction,
  developer experience (DevEx), reliability, performance, scalability at scale
- **Languages:** Python, Java, SQL, C#, Kotlin, JavaScript/TypeScript
  (TypeScript depth: developing — see learning plan)
- **Infra / platform:** Kubernetes (K8s), Docker, OpenShift, Helm, Kubernetes
  Operators, distributed/stateful systems
- **Cloud / IaC:** Amazon Web Services (AWS), Terraform (Infrastructure as Code)
- **Observability & monitoring:** Grafana, Prometheus / Mimir (PromQL), Loki
  (LogQL), Elasticsearch / ELK, alerting and monitors
- **Practices:** CI/CD (Continuous Integration / Continuous Delivery), automated
  testing, code review, incident response, on-call, production support,
  Agile/Scrum, RFC-driven design
- **AI / LLM:** Applied LLM tooling for platform/operations — AI ops agents,
  LLM-assisted incident correlation, agent/prompt workflows (applied, not research)
- **Learning for this role:** Backstage (frontend & backend plugins), React,
  Node.js, plugin/API architecture

## Experience

### Database Operations Engineer — Palantir Technologies, Singapore · Jul 2025 – Present

Own reliability, performance, and observability of four distributed data stores
(Cassandra, Elasticsearch, Kafka, PostgreSQL) across 200+ managed
production environments on Kubernetes.

- Build and operate internal platform and automation tooling that other
  engineers depend on — Kubernetes operators, Helm charts, and fleet-wide
  automation — reducing manual operational toil and standardizing how services
  are deployed and run.
- Led the PostgreSQL storage-controller to Helm migration across the fleet via
  automated fleet-wide campaigns,
  standardizing deployment and removing bespoke per-environment configuration —
  platform work that streamlined a workflow shared across many teams.
- Designed and coordinated a fleet-wide rollout of dedicated instance groups to
  isolate noisy-neighbour workloads, measurably improving database stability, sequencing the migration across teams with zero customer-facing
  downtime.
- Authored an RFC for horizontal autoscaling of Elasticsearch to right-size
  capacity automatically instead of static over-provisioning, informing platform architecture and scalability
  strategy through system design.
- Built and operate observability on Grafana, Loki (LogQL), and Mimir (PromQL);
  investigated and tuned alerts and monitors to cut alerting noise and on-call
  toil, improving signal for the on-call
  rotation.
- Built an AI-assisted operations agent and designed an LLM-assisted
  incident-grouping system that clusters incidents by shared root cause
  (LLM-proposed, human-curated) — surfacing long-term reliability trends the
  fleet-wide view misses (iterated v1 to v3); applied AI to reduce investigation
  toil.
- Operate stateful data stores on ephemeral/orchestrated infrastructure — a hard
  reliability problem demanding careful handling of storage, failover, and
  data-safety guarantees.
- Contribute to Kubernetes operators (`cassandra-operator`, Java; Postgres
  `db-controller`) and Helm charts; write Python automation for fleet operations.

*Stack: Kubernetes, Helm, Cassandra, Elasticsearch, Kafka, PostgreSQL, Java,
Python, Grafana, Loki, Prometheus/Mimir.*

### Software Engineer (Graduate Rotational Program) — Marshall Wace, Singapore · Jun 2023 – Jun 2025

Two-year rotational program at a global hedge fund across four teams: Production
Engineering, Portfolio Management Dev, Database Administration, and Data
Engineering & Operations.

- Built a Python microservice querying Grafana/Loki to render FIX-protocol logs
  human-readable, significantly streamlining troubleshooting for engineers — a
  developer-experience tool that removed a recurring pain point.
- Built and expanded log/metric alerting on Loki and Prometheus for trading
  systems, improving real-time monitoring and operational visibility.
- Automated runbook validation by scripting link checks via the Confluence API,
  scheduled on Airflow, keeping operational documentation accurate.
- Designed an expired-order cleaning service in C# over Kafka order streams,
  cutting downstream errors by preventing stale orders reaching services.
- Built a C# gRPC microservice delivering real-time futures/spreads to the
  commodities desk, improving decision-making; migrated observable-building from
  SQL queries to Kafka streams to increase data freshness for microservices.
- Cut Snowflake cost via query tuning and built Grafana dashboards attributing
  cost across teams for better resource allocation; tuned SQL estate performance
  by analyzing query plans of slow procedures.
- Built Python data-ingestion pipelines orchestrated on Airflow to onboard
  vendor and alternative data; expanded pipeline monitoring scope by 50% via
  samplers over Prometheus Alert Manager, Loki, and internal microservices.

*Stack: Python, SQL, C#, Kafka, Airflow, Snowflake, Grafana, Prometheus, Loki,
gRPC.*

### Enterprise Engineer Intern — Meta, Singapore · May 2022 – Aug 2022

- Built a full-stack web application (Hack + React) to optimize internal
  service-sourcing, improving efficiency and user experience.
- Built a CRUD interface for sourcing managers enabling dynamic rate management,
  plus a purchase-request creation feature; engineered data models and
  validation to improve data integrity.

### Cloud Architect Intern — Amazon Web Services, Singapore · Jan 2021 – May 2021

- Wrote Terraform Infrastructure as Code (IaC) to provision secure, standardized
  AWS environments; automated CIS security benchmark checks in Python.
- Prototyped an Amazon Connect contact-control panel (React + Connect Streams
  API). Earned 5 AWS certifications (see Certifications).

### Technology Summer Analyst — Credit Suisse, Singapore · May 2021 – Aug 2021

- Built a Kotlin + Spring Boot microservice rendering PDFs in sub-0.1s to reduce
  licensing cost; used GNU Parallel to cut processing time ~60%.

### Software Engineer Intern (Android) — Mercari, Japan (Remote) · Aug 2021 – Dec 2021

- Shipped Android features with Braze/Adjust SDKs; added unit tests; contributed
  to an MVVM + Jetpack migration.

## Education

**Nanyang Technological University**, Singapore · Aug 2018 – Dec 2022
M.Sc. in Technology Management; B.Eng.Sc. in Computer Science (Minor in Mathematics)
- Honours with Highest Distinction — CGPA 4.87/5.0, Major GPA 5.0/5.0
- NTU Renaissance Engineering Programme Scholarship (elite double-degree scholarship)
- Exchange, Uppsala University: HPC & Parallel Computing, Intro to ML,
  Platform-Spanning Systems, UI Programming

## Certifications

- AWS Certified Security – Specialty
- AWS Certified SysOps Administrator – Associate
- AWS Certified Developer – Associate
- AWS Certified Solutions Architect – Associate
- AWS Certified Cloud Practitioner
- GCC (Google) Cloud Foundations

## Projects

- **Crypto-Exchange** — Kotlin, Spring Boot, MongoDB; microservices architecture.
- **SCSE Collaboration Graph** — Python, NetworkX graph analysis.
- **Mini-Mercari** — Android, Jetpack, MVVM.
