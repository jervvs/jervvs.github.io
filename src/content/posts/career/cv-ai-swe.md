---
title: "CV — AI Engineer (AI for Software Engineering)"
date: 2026-07-12
description: "My CV cut for applied-AI / AI-for-software-engineering roles."
draft: true
series: "career"
order: 8
tags: ["learning", "career", "cv", "ai-swe"]
---
linkedin.com/in/jervis-chan · Singapore

## Summary
Engineer applying large language models (LLMs) and AI-powered automation to real software and operations problems, and a daily practitioner of AI-assisted development (AI coding assistants such as Claude Code). Built an AI-assisted operations agent and an LLM-assisted incident-correlation system, iterated across three versions, to reimagine engineering workflows and cut manual toil. Proven full-stack software development experience (C#, Python, gRPC, Kafka) with a strong grasp of CI/CD (Continuous Integration / Continuous Delivery), cloud (Amazon Web Services / AWS), DevOps, and software testing. Curious and experimental, ownership-oriented, and motivated by public-sector impact — keen to help a public-sector organisation integrate AI across the software-development lifecycle and measure its impact on developer efficiency and software quality.

## Skills
- **AI / LLM (applied):** Large Language Models (LLMs), AI coding assistants (Claude Code), AI-assisted development, AI operations agents, embeddings-based clustering, prompt and agent workflows, AI-powered automation *(applied to real problems; ML research / fine-tuning in progress — see learning plan)*
- **Languages:** Python, C#, SQL, Java, Kotlin, JavaScript/TypeScript
- **Software engineering:** microservices, gRPC (gRPC Remote Procedure Calls), event streaming (Apache Kafka), REST APIs, code review, Agile/Scrum
- **CI/CD & DevOps:** Continuous Integration / Continuous Delivery (CI/CD), automated build/deploy campaigns, Kubernetes, Docker, Helm, OpenShift, Kubernetes Operators
- **Cloud / IaC:** Amazon Web Services (AWS), Terraform (Infrastructure as Code / IaC)
- **Testing & QA:** unit testing, runbook/validation automation, production support, incident response, on-call
- **Observability:** Grafana, Prometheus/Mimir, Loki, Elasticsearch (LogQL, PromQL)
- **Data / pipelines:** Apache Airflow, ETL (Extract-Transform-Load), data ingestion, web scraping, Snowflake

## Experience

### Database Operations Engineer — Palantir Technologies, Singapore · Jul 2025 – Present
Own reliability, performance, and observability of four distributed data stores (Cassandra, Elasticsearch, Kafka, PostgreSQL) across 200+ managed production environments on Kubernetes.

- Designed and iterated (v1 → v3) an **LLM-assisted incident-grouping system** that clusters incidents by shared root cause using embeddings and LLM calls (LLM-proposed, human-curated), surfacing long-term reliability trends that per-incident triage misses.
- Built and operate an AI-assisted operations agent, applying LLMs to automate manual investigation and reduce on-call toil.
- Daily practitioner of **AI-assisted development** (AI coding assistants such as Claude Code) for automation, tooling, and investigation workflows; actively evaluate how LLM tools change engineering practice.
- Wrote **Python automation** for fleet operations and led the PostgreSQL storage-controller → Helm migration via automated fleet-wide campaigns, standardizing deployment across the fleet.
- Investigated and tuned alerts and monitors to cut alerting noise and on-call toil, improving signal-to-noise for the on-call rotation.
- Contribute to Kubernetes operators (`cassandra-operator`, Java; Postgres `db-controller`) and Helm charts; drive adoption of new tooling and practices through internal tech-sharing.

*Stack: Python, Java, LLMs / AI agents, Kubernetes, Helm, Grafana, Loki, Prometheus/Mimir, Cassandra, Elasticsearch, Kafka, PostgreSQL.*

### Software Engineer (Graduate Rotational Program) — Marshall Wace, Singapore · Jun 2023 – Jun 2025
Two-year rotational program at a global hedge fund across four teams: Production Engineering, Portfolio Management Dev, Database Administration, and Data Engineering & Operations.

- Built a **C# gRPC microservice** delivering real-time futures/spreads to the commodities desk, improving trading decisions.
- Designed an **expired-order cleaning service in C#** over Kafka order streams, cutting downstream errors by preventing stale orders reaching services.
- Developed and maintained the **Trade Management System (TMS)**, improving trader experience, usability, and reliability; migrated observable-building from SQL queries to Kafka streams to increase data freshness.
- Built a **Python microservice** querying Grafana/Loki to render FIX-protocol logs human-readable, streamlining troubleshooting.
- Automated **runbook validation** by scripting link checks via the Confluence API, scheduled on Airflow, keeping operational docs accurate.
- Built **Python data-ingestion pipelines** and web scrapes on Airflow to onboard vendor/alternative data; expanded pipeline monitoring scope by **50%** over Prometheus Alert Manager, Loki, and internal microservices.
- Provided **production support** ensuring timely, accurate data delivery in a live trading operation; tuned SQL query plans and cut Snowflake cost via query tuning and cost-attribution Grafana dashboards.

*Stack: Python, C#, SQL, Kafka, Airflow, Snowflake, gRPC, Grafana, Prometheus, Loki.*

### Enterprise Engineer Intern — Meta, Singapore · May 2022 – Aug 2022
- Built a **full-stack web application** (Hack + React) to optimize internal service-sourcing, improving efficiency and UX.
- Engineered data models and validation, and a CRUD interface enabling dynamic rate management plus purchase-request creation.

### Cloud Architect Intern — Amazon Web Services, Singapore · Jan 2021 – May 2021
- Wrote **Terraform** Infrastructure-as-Code to provision secure, standardized AWS environments; automated **CIS security benchmark** checks in Python.
- Prototyped an Amazon Connect contact-control panel (React + Connect Streams API); earned 5 AWS certifications (see below).

### Technology Summer Analyst — Credit Suisse, Singapore · May 2021 – Aug 2021
- Built a **Kotlin + Spring Boot** microservice rendering PDFs in sub-0.1s to reduce licensing cost; used GNU Parallel to cut processing time **~60%**.

## Education
**Nanyang Technological University**, Singapore · Aug 2018 – Dec 2022
M.Sc. in Technology Management; B.Eng.Sc. in Computer Science (Minor in Mathematics)
- **Honours with Highest Distinction** — CGPA 4.87/5.0, Major GPA 5.0/5.0
- **NTU Renaissance Engineering Programme Scholarship** (elite double-degree scholarship)
- Exchange, Uppsala University: HPC & Parallel Computing, Intro to Machine Learning, Platform-Spanning Systems, UI Programming

## Certifications
- AWS Certified Security – Specialty
- AWS Certified SysOps Administrator – Associate
- AWS Certified Developer – Associate
- AWS Certified Solutions Architect – Associate
- AWS Certified Cloud Practitioner
- GCC (Google) Cloud Foundations

## Projects
- **LLM-assisted incident grouping (v1 → v3)** — embeddings + LLM calls to cluster fleet incidents by root cause; applied-AI system in production use.
- **AI operations agent** — automates investigation toil across 200+ environments.
- **Crypto-Exchange** — Kotlin, Spring Boot, MongoDB, microservices architecture.
