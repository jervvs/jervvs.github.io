---
title: "CV — Software Engineer (Full-Stack)"
date: 2026-07-12
description: "My CV cut for full-stack software-engineering roles."
draft: true
series: "career"
order: 10
tags: ["learning", "career", "cv", "fullstack"]
---
linkedin.com/in/jervis-chan · Singapore

## Summary
Full-stack software engineer with 3+ years building and operating reasonably large, high-availability systems at scale — currently safeguarding four distributed data stores across 200+ containerized (Kubernetes) production environments at Palantir. Backend depth in C#/.NET, Java, and Python services (Kafka streams, gRPC microservices, live trading systems); full-stack delivery with React front-ends at Meta. AWS-certified (5x), fluent in Docker and Kubernetes, CI/CD (Continuous Integration/Continuous Delivery), and ELK-stack (Elasticsearch, Logstash, Kibana) observability. Works day-to-day in cross-functional agile teams — code review, Scrum ceremonies, and tech-sharing sessions.

## Skills
- **Languages:** Java, C#/.NET, Python, TypeScript/JavaScript, Kotlin, SQL
- **Front-end:** React.js, HTML/CSS, responsive UI, CRUD (Create/Read/Update/Delete) interfaces
- **Backend / services:** RESTful and gRPC microservices, Kafka event streams, Spring Boot, .NET
- **Databases (SQL & NoSQL):** PostgreSQL, MS SQL Server, Cassandra, Elasticsearch, MongoDB, Snowflake
- **Cloud / IaC:** AWS (Amazon Web Services), Terraform (Infrastructure as Code)
- **Containers / orchestration:** Docker, Kubernetes, OpenShift, Helm, Kubernetes Operators
- **CI/CD & testing:** CI/CD (Continuous Integration/Continuous Delivery) pipelines, unit testing, automated validation
- **Observability / monitoring:** ELK stack / Elasticsearch, Grafana, Prometheus, Loki (LogQL, PromQL)
- **Practices:** Agile/Scrum (Sprint Planning, Review, Retrospective), code review, SDLC (Software Development Life Cycle), incident response, on-call, production support
- **AI / LLM (applied):** LLM-assisted tooling and ops agents, prompt/agent workflows

## Experience

### Database Operations / Software Engineer — Palantir Technologies, Singapore · Jul 2025 – Present
Own reliability, performance, and observability of four distributed data stores (Cassandra, Elasticsearch, Kafka, PostgreSQL) across 200+ managed production environments running on Kubernetes.
- Operate and safeguard the reliability of four stateful data stores across 200+ containerized (Kubernetes) environments — a high-availability problem at scale, where stateful workloads on orchestrated infrastructure demand careful handling of storage, failover, and data-safety guarantees.
- Designed and coordinated the fleet-wide rollout of dedicated instance groups to isolate noisy-neighbour workloads, measurably improving database stability; drove cross-team coordination to sequence the migration with zero customer-facing downtime.
- Contribute to Kubernetes operators (cassandra-operator, Java; PostgreSQL db-controller) and Helm charts, and write Python automation for fleet operations — shipping code through review into shared production repositories.
- Drove adoption of up-to-date tooling in the SDLC (Software Development Life Cycle): designed an LLM-assisted incident-grouping system that clusters incidents by shared root cause (LLM-proposed, human-curated), surfacing long-term reliability trends per-incident triage misses (iterated v1 → v3).
- Built and operate observability on the Elasticsearch/Grafana/Loki/Prometheus (Mimir) stack; investigated and tuned alerts and monitors to cut alerting noise and on-call toil.
- Led the PostgreSQL storage-controller → Helm migration across the fleet via automated campaigns, standardizing deployment and reducing bespoke configuration.

*Stack: Kubernetes, Docker, Helm, Java, Python, PostgreSQL, Cassandra, Elasticsearch, Kafka, Grafana, Prometheus, Loki.*

### Software Engineer (Graduate Rotational Program) — Marshall Wace, Singapore · Jun 2023 – Jun 2025
Two-year rotational software engineering program at a global hedge fund, across four teams (Production Engineering, Portfolio Management Dev, Database Administration, Data Engineering & Operations), delivering in cross-functional agile teams under live-trading, high-availability constraints.
- Built a C# gRPC microservice delivering real-time futures/spreads to the commodities desk, improving trading decisions on a latency-sensitive path.
- Designed an expired-order cleaning service in C# over Kafka order streams, cutting downstream errors by preventing stale orders from reaching services.
- Developed and maintained the Trade Management System (TMS), improving trader experience, usability, and reliability of a core internal product.
- Migrated observable-building from SQL queries to Kafka event streams, increasing data freshness for downstream microservices.
- Built a Python microservice querying Grafana/Loki to render FIX-protocol logs human-readable, significantly streamlining troubleshooting.
- Built and expanded log/metric alerting on Loki + Prometheus for trading systems, and tuned SQL estate performance by analyzing query plans of slow procedures.
- Built Python data-ingestion pipelines orchestrated on Airflow to onboard vendor/alternative data; expanded pipeline monitoring scope by 50% via monitoring samplers.

*Stack: C#/.NET, Python, SQL, Kafka, gRPC, Airflow, Snowflake, Grafana, Prometheus, Loki.*

### Enterprise Engineer Intern — Meta, Singapore · May 2022 – Aug 2022
- Built a full-stack web application (Hack + React) to optimize internal service-sourcing, improving efficiency and user experience.
- Built a CRUD (Create/Read/Update/Delete) interface for sourcing managers enabling dynamic rate management, plus a purchase-request creation feature.
- Engineered data models and validation, improving data integrity for internal services.

### Cloud Architect Intern — Amazon Web Services (AWS), Singapore · Jan 2021 – May 2021
- Wrote Terraform Infrastructure as Code (IaC) to provision secure, standardized AWS environments.
- Prototyped an Amazon Connect contact-control panel front-end (React + Connect Streams API).
- Automated CIS security-benchmark checks in Python; earned 5 AWS certifications (see Certifications).

### Technology Summer Analyst — Credit Suisse, Singapore · May 2021 – Aug 2021
- Built a Kotlin + Spring Boot microservice rendering PDFs in sub-0.1s to replace a licensed component; used GNU Parallel to cut processing time ~60%.

### Software Engineer Intern (Android) — Mercari, Japan (Remote) · Aug 2021 – Dec 2021
- Shipped Android features (friend invites, marketing banners) with Braze/Adjust SDKs, added unit tests, and contributed to an MVVM + Jetpack migration.

## Education
**Nanyang Technological University**, Singapore · Aug 2018 – Dec 2022
M.Sc. in Technology Management; B.Eng.Sc. in Computer Science (Minor in Mathematics)
- Honours with Highest Distinction — CGPA 4.87/5.0, Major GPA 5.0/5.0
- NTU Renaissance Engineering Programme Scholarship (elite double-degree scholarship)
- Exchange, Uppsala University: HPC & Parallel Computing, Intro to Machine Learning, Platform-Spanning Systems, UI Programming

## Certifications
- AWS Certified Security – Specialty
- AWS Certified SysOps Administrator – Associate
- AWS Certified Developer – Associate
- AWS Certified Solutions Architect – Associate
- AWS Certified Cloud Practitioner
- GCC (Google) Cloud Foundations

## Projects
- **Crypto-Exchange** — Kotlin, Spring Boot, MongoDB (NoSQL), microservices architecture.
- **SCSE Collaboration Graph** — Python, NetworkX graph analysis.
