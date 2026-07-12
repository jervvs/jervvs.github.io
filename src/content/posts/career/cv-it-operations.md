---
title: "CV — IT Operations Engineer"
date: 2026-07-12
description: "My CV cut for IT-operations roles — automation-first, root-cause focus."
draft: true
series: "career"
order: 11
tags: ["learning", "career", "cv", "it-operations"]
---
linkedin.com/in/jervis-chan · Singapore

## Summary
Automation-first operations engineer who turns recurring manual toil into code and owns problems to root cause. I currently safeguard four production data platforms across 200+ containerized (Kubernetes) environments, run an on-call rotation, and build automation — Python scripts, fleet-wide campaigns, and AI-assisted tooling — that removes repetitive operational work and speeds troubleshooting. Strong on Linux, Git, and CI/CD (Continuous Integration / Continuous Delivery) developer workflows, incident response, and clear operational documentation. I am earlier in my career than a classic senior IT-support hire (roughly two years of professional engineering plus my current role), and my edge is analytical root-cause investigation and coding away toil rather than a long help-desk tenure.

## Skills
- **Automation & scripting:** Python, fleet-wide automation campaigns, scheduled jobs (Airflow), REST API scripting (Confluence API), AI-assisted operations tooling
- **Operating systems:** Linux (deep), macOS, Windows *(day-to-day use; endpoint-support depth is a growth area)*
- **Support & operations:** Incident response, on-call rotation, production support, escalation, root-cause analysis, pattern detection, alert/monitor tuning
- **Version control & CI/CD:** Git, CI/CD (Continuous Integration / Continuous Delivery), code review, developer workflows
- **Observability:** Grafana, Prometheus/Mimir (PromQL), Loki (LogQL), Elasticsearch / ELK
- **Infrastructure:** Kubernetes, Docker, Helm, AWS (Amazon Web Services), Terraform (Infrastructure as Code)
- **Data platforms:** PostgreSQL, Cassandra, Kafka, SQL, Snowflake
- **Documentation & process:** Runbooks, SOPs (Standard Operating Procedures), operational docs, Agile/Scrum
- **Languages:** Python, SQL, C#, Kotlin, Java

## Experience

### Database Operations Engineer — Palantir Technologies, Singapore · Jul 2025 – Present
- Design and write Python automation for fleet operations and run automated fleet-wide campaigns across the fleet, replacing repetitive manual work with code and reducing operational toil.
- Investigated and tuned alerts and monitors to cut alerting noise and on-call toil, improving signal-to-noise for the on-call rotation and reducing time lost to false positives.
- Built an AI-assisted operations agent to reduce manual investigation toil during troubleshooting and support.
- Designed an LLM-assisted (Large Language Model) incident-grouping system that clusters incidents by shared root cause (LLM-proposed, human-curated), surfacing long-term reliability trends across the fleet that per-incident triage misses (iterated v1 → v3) — an analytical, pattern-detection approach to recurring issues.
- Serve on the on-call rotation for four stateful data stores (Cassandra, Elasticsearch, Kafka, PostgreSQL) across 200+ Kubernetes production environments, providing in-depth technical support and escalation for reliability, performance, and data-safety issues.
- Led the PostgreSQL storage-controller → Helm migration across the fleet via automated campaigns, standardizing deployment and reducing bespoke configuration.
- Built and operate observability on Grafana, Loki (LogQL), and Mimir (PromQL) to diagnose issues and detect patterns across the fleet.
- Contribute to Kubernetes operators and Helm charts and work daily in Git-based developer workflows with code review.

### Software Engineer (Graduate Rotational Program) — Marshall Wace, Singapore · Jun 2023 – Jun 2025
Two-year rotational program at a global hedge fund across four teams: Production Engineering, Portfolio Management Dev, Database Administration, and Data Engineering & Operations.
- Automated runbook validation by scripting link checks via the Confluence API, scheduled on Airflow, keeping operational documentation accurate without manual review.
- Built log/metric alerting on Loki + Prometheus for live trading systems, improving real-time monitoring and operational visibility.
- Built a Python microservice querying Grafana/Loki to render FIX-protocol logs human-readable, significantly streamlining troubleshooting for support engineers.
- Provided production support ensuring timely, accurate data delivery to quant researchers in a live trading operation, minimizing disruptions.
- Expanded pipeline monitoring scope by 50% via monitoring samplers over Prometheus Alert Manager, Loki, and internal microservices.
- Built Python data-ingestion pipelines and web scrapes orchestrated on Airflow to onboard vendor and alternative data.
- Tuned SQL estate performance by analyzing query plans of slow procedures, improving execution times; cut Snowflake cost via query tuning and built Grafana dashboards attributing Snowflake cost across teams.

### Cloud Architect Intern — Amazon Web Services, Singapore · Jan 2021 – May 2021
- Wrote Terraform Infrastructure-as-Code to provision secure, standardized AWS environments.
- Automated CIS (Center for Internet Security) security-benchmark checks in Python.
- Earned five AWS certifications (see Certifications).

### Enterprise Engineer Intern — Meta, Singapore · May 2022 – Aug 2022
- Built a full-stack internal web application to optimize service-sourcing, including a CRUD interface for sourcing managers, working cross-functionally with internal stakeholders.

## Education
**Nanyang Technological University**, Singapore · Aug 2018 – Dec 2022
M.Sc. in Technology Management; B.Eng.Sc. in Computer Science (Minor in Mathematics)
- Honours with Highest Distinction — CGPA 4.87/5.0, Major GPA 5.0/5.0
- NTU Renaissance Engineering Programme Scholarship (elite double-degree scholarship)

## Certifications
- AWS Certified SysOps Administrator – Associate
- AWS Certified Solutions Architect – Associate
- AWS Certified Developer – Associate
- AWS Certified Security – Specialty
- AWS Certified Cloud Practitioner
- GCC (Google) Cloud Foundations
