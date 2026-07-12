---
title: "CV — Data / Production Engineer"
date: 2026-07-12
description: "My CV cut for data / production-engineering roles in live-trading data ops."
draft: true
series: "career"
order: 9
tags: ["learning", "career", "cv", "data-engineering"]
---
linkedin.com/in/jervis-chan · Singapore

## Summary

Data and production engineer with 2+ years building Python data-ingestion pipelines and providing production support inside a live trading operation at a global hedge fund, plus current data-store reliability engineering across 200+ production environments. Strong on ETL (Extract, Transform, Load) orchestration with Airflow, SQL performance tuning, data reconciliation and quality checks, and debugging anomalies in derived datasets by tracing them to source. Comfortable on the Linux command line and across PostgreSQL and Microsoft SQL Server; expanded live-pipeline monitoring scope by 50% and thrives under tight, fast-paced daily turnaround.

## Skills

- **Languages:** Python, SQL (Structured Query Language), C#, Java, Kotlin
- **Databases:** PostgreSQL, Microsoft SQL Server (MSSQL), Snowflake, Cassandra, Elasticsearch, MongoDB (exposure)
- **Data / pipelines:** ETL (Extract, Transform, Load), data ingestion, Apache Airflow orchestration, web scraping, data reconciliation, validation and quality checks, dataset onboarding
- **Production support:** live-trading data operations, on-call / incident response, internal-customer support, real-time monitoring and alerting
- **Observability:** Grafana, Prometheus / Mimir (PromQL), Loki (LogQL), Alert Manager, ELK / Elasticsearch
- **Messaging / streaming:** Apache Kafka
- **Platform:** Linux command line, Kubernetes, Docker, Helm; AWS (Amazon Web Services), Terraform
- **Practices:** CI/CD (Continuous Integration / Continuous Delivery), code review, Agile/Scrum

## Experience

### Database Operations Engineer — Palantir Technologies, Singapore · Jul 2025 – Present

Own reliability, performance, and observability of four distributed data stores — PostgreSQL, Cassandra, Elasticsearch, and Kafka — across 200+ managed production environments on Kubernetes.

- Operate and safeguard four stateful data stores across 200+ containerized (Kubernetes) production environments, handling storage, failover, and data-safety guarantees for workloads on orchestrated infrastructure.
- Investigated and tuned alerts and monitors to cut alerting noise and on-call toil, improving signal-to-noise for the on-call rotation.
- Led the PostgreSQL storage-controller to Helm migration across the fleet via automated fleet-wide campaigns, standardizing deployment and reducing bespoke configuration.
- Built and operate observability on Grafana, Loki (LogQL), and Mimir (PromQL); built an AI-assisted operations agent and an LLM-assisted incident-grouping system to reduce manual investigation toil and surface fleet-wide reliability trends.
- Write Python automation for fleet operations and contribute to Kubernetes operators (Java) and Helm charts.

### Software Engineer, Graduate Rotational Program — Marshall Wace, Singapore · Jun 2023 – Jun 2025

Two-year rotation at a global hedge fund across four teams — Data Engineering & Operations, Database Administration, Production Engineering, and Portfolio Management Dev — supporting a live trading operation.

**Data Engineering & Operations**
- Built Python data-ingestion pipelines and web scrapers orchestrated on Apache Airflow to onboard vendor and alternative datasets for quant researchers, delivering research-ready data into the trading workflow.
- Expanded pipeline monitoring scope by 50% by building monitoring samplers over Prometheus Alert Manager, Loki, and internal microservices, catching data-delivery issues earlier and improving pipeline oversight.
- Provided production support ensuring timely, accurate data delivery to quant researchers in a live trading operation, fielding internal-customer inquiries and resolving issues under tight turnaround to minimize disruption.

**Database Administration**
- Tuned the SQL estate by analyzing query plans for slow procedures and queries, improving execution times and overall efficiency across the database fleet.
- Cut Snowflake cost through query tuning and cost-optimization strategies, and built Grafana dashboards attributing Snowflake spend across teams to drive better resource allocation.

**Production Engineering**
- Built a Python microservice querying Grafana/Loki to render FIX-protocol (Financial Information eXchange) trading logs human-readable, significantly streamlining troubleshooting of live trading systems.
- Built and expanded log and metric alerting on Loki and Prometheus for trading systems, improving real-time monitoring and operational visibility in the production trading environment.
- Automated runbook validation by scripting link checks against the Confluence API, scheduled on Airflow, keeping operational documentation accurate.

**Portfolio Management (Dev)**
- Designed a C# expired-order cleaning service over Kafka order streams, cutting downstream errors by stopping stale orders from reaching services.
- Migrated observable-building from SQL queries to Kafka streams, increasing data freshness for downstream microservices.

### Enterprise Engineer Intern — Meta, Singapore · May 2022 – Aug 2022

- Built a full-stack web application to optimize internal service-sourcing, engineering data models and validation that improved data integrity for internal services.
- Built a CRUD (Create, Read, Update, Delete) interface enabling sourcing managers to manage rates dynamically and create purchase requests.

### Technology Summer Analyst — Credit Suisse, Singapore · May 2021 – Aug 2021

- Built a Kotlin + Spring Boot microservice rendering PDFs in sub-0.1s; used GNU Parallel to cut processing time ~60%, reducing licensing cost.

### Cloud Architect Intern — Amazon Web Services, Singapore · Jan 2021 – May 2021

- Wrote Terraform infrastructure-as-code to provision secure, standardized AWS environments; automated CIS security-benchmark checks in Python. Earned 5 AWS certifications (see below).

## Education

**Nanyang Technological University**, Singapore · Aug 2018 – Dec 2022
M.Sc. in Technology Management; B.Eng.Sc. in Computer Science (Minor in Mathematics)
- Honours with Highest Distinction — CGPA 4.87/5.0, Major GPA 5.0/5.0
- NTU Renaissance Engineering Programme Scholarship (elite double-degree scholarship)
- Exchange, Uppsala University: HPC & Parallel Computing, Intro to Machine Learning, Platform-Spanning Systems

## Certifications

- AWS Certified Security – Specialty
- AWS Certified SysOps Administrator – Associate
- AWS Certified Developer – Associate
- AWS Certified Solutions Architect – Associate
- AWS Certified Cloud Practitioner
- GCC (Google) Cloud Foundations
