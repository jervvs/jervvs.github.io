---
title: "Learning Plan — Data / Production Engineer (Live Trading)"
date: 2026-07-12
description: "Strong fit — my best objective match: hedge-fund data ops mapped almost 1:1 to a live-trading data/production role."
draft: true
series: "career"
order: 2
tags: ["learning", "career", "data-engineering"]
---

## Fit summary

**Strong fit — this is your single best objective match across the CV set.** Your Marshall Wace "Data Engineering & Operations" rotation maps almost 1:1 to the job description: Python data-ingestion pipelines on Airflow, monitoring samplers (+50% scope), and production support for quant researchers in a live trading operation. Layer on the MW DBA rotation (SQL tuning, Snowflake) for the SQL requirement, MW Production Engineering (FIX-protocol log tooling, trading-systems monitoring) for the "production trading environment" requirement, and current Palantir data-store/SQL/observability work — and you comfortably clear every hard requirement: 2+ years, Python, SQL, Linux CLI, ETL, and production support in a live trading environment.

The gaps are narrow and mostly about **vocabulary and named tooling**, not capability. Close them and you interview as a near-perfect profile.

## Gap analysis

| JD requirement | Your evidence | Gap severity |
|---|---|---|
| 2+ years data engineering / data science | MW Data Eng & Ops (2yr rotation) + Palantir DB ops | Strong |
| Python strongly preferred | Python pipelines, samplers, microservices, fleet automation | Strong |
| ETL pipeline management | Airflow-orchestrated ingestion pipelines + web scrapes at MW | Strong |
| Linux command line | K8s / Grafana CLI / fleet ops daily (implied, not named on CV) | Strong |
| SQL (PostgreSQL / MSSQL / MySQL) | MW SQL tuning, query-plan analysis; Palantir PostgreSQL; MSSQL | Strong (MySQL not used — trivial delta) |
| Production support in a live trading environment | MW production support for quant researchers; FIX log tooling; trading-systems alerting | Strong |
| Reconciliations, validations, quality checks | Pipeline monitoring / data-delivery accuracy at MW | Partial (done it; no explicit reconciliation framework named) |
| Data debugging — anomalies in derived datasets, trace to source | Adjacent: incident debugging, log tracing, monitoring | Partial (transferable, not framed as dataset-anomaly work) |
| Automate with a modern Python data stack (pandas / Polars / dbt) | Python + Airflow; specific libraries not evidenced | Partial |
| Financial datasets — major market-data vendors (a big plus) | Vendor/alt-data onboarding + FIX logs at a hedge fund; **specific vendors not on CV** | Gap (do not claim; route here) |

## Priority objectives

1. **Named financial-vendor datasets (the major market-data vendors).** Highest-leverage "big plus." You worked with vendor and alternative data at a hedge fund, but the master CV does not name these vendors — so do not claim them. Learn each vendor's data model, identifiers (RIC, SEDOL, CUSIP, ISIN, FIGI), and delivery mechanisms so you can speak fluently.
2. **Modern Python data stack.** Get explicit, demonstrable fluency in pandas and Polars, and dbt for transformation/testing — so "automate with a modern Python data stack" is a claim you can back with a repo.
3. **Advanced data-quality / reconciliation patterns.** Formalize what you did informally at MW: schema validation, cross-source reconciliation, anomaly detection on derived datasets, and quality-gate frameworks (Great Expectations / Pandera / dbt tests).

## Roadmap

**Phase 1 (Weeks 1–2) — Financial data vocabulary**
- Resources: a market-data fundamentals course (several are free); the major vendors' product docs; a reference on security identifiers (RIC, SEDOL, CUSIP, ISIN, FIGI) and corporate-actions handling.
- Build: a one-page cheat sheet mapping each vendor → what it provides → identifiers → typical delivery (API / flat file / SFTP).
- Milestone: can explain, unprompted, how you would onboard a new market-data vendor feed and reconcile it against an existing source.

**Phase 2 (Weeks 3–4) — Modern Python data stack**
- Resources: Polars user guide; pandas-to-Polars migration notes; dbt "Learn Analytics Engineering" course.
- Build: an ETL demo that ingests a public financial dataset (e.g., equities OHLCV or FX rates), transforms in Polars, loads to PostgreSQL, and models/tests it with dbt.
- Milestone: pipeline runs end-to-end on Airflow with dbt tests wired in as a quality gate.

**Phase 3 (Weeks 5–6) — Data quality, reconciliation & debugging**
- Resources: Great Expectations or Pandera docs; write-ups on reconciliation and anomaly detection for time-series/market data.
- Build: a reconciliation + quality-check tool (see Proof artifacts) that diffs two "sources" of the same dataset, flags anomalies in a derived column, and traces a discrepancy back to source.
- Milestone: tool emits a human-readable reconciliation report and a decision tree for triaging a flagged anomaly.

**Phase 4 (Week 7, light/ongoing) — MySQL + polish**
- Resources: MySQL tutorial focused on deltas from PostgreSQL/MSSQL (syntax, engines, `EXPLAIN`).
- Milestone: can run and tune a query on all three engines; CV skills line honestly covers PostgreSQL, MSSQL, and MySQL.

## Proof artifacts to build

- **Data-reconciliation & quality-check tool (headline artifact):** Python (Polars/pandas) CLI that ingests two datasets, reconciles row/column-level differences, runs validation rules, flags anomalies in derived fields, and outputs a report tracing each discrepancy toward source. Directly demonstrates the JD's "reconciliations, validations, quality checks" and "data debugging" pillars.
- **Financial-data ETL demo:** Airflow DAG → ingest public market/FX data → transform in Polars → load to PostgreSQL → dbt models + tests. Demonstrates "modern Python data stack" and "ETL pipeline management."
- **Optional writeup:** short README framing both as "how I'd onboard and reconcile a new vendor feed in a live trading operation."

## Interview prep

**The story arc — "hedge-fund data ops → data/production engineer":**
Lead with Marshall Wace. You were a data/production engineer for a live trading operation before the title existed for you: Python ingestion pipelines onboarding vendor and alternative data for quant researchers, +50% monitoring scope so bad data surfaced fast, and direct production support fielding researcher inquiries under trading-day pressure. Then the DBA rotation (SQL tuning, Snowflake cost) and Production Engineering (FIX-protocol log tooling, trading-systems alerting) show you know the production trading environment end to end. Palantir extends this to reliability and observability at 200+ environment scale.

**Be honest about vendors.** If asked about the major market-data vendors: "At Marshall Wace I onboarded vendor and alternative datasets for quant research and worked daily with FIX-protocol trading logs, so I know the shape of financial-data onboarding and live-trading data ops. I haven't worked with those specific vendors by name — here's the cheat sheet I built and how I'd approach onboarding one." That reframes a gap into initiative.

**Likely technical questions to rehearse:**
- SQL: window functions, query-plan reading, join/index tuning, deduplication, point-in-time joins — ground answers in your MW query-plan tuning work.
- Python: given a messy dataset, clean/validate/featurize it (pandas or Polars); write a reconciliation between two sources.
- Data debugging: "a derived metric looks wrong — walk me through finding the cause." Use a deductive-reasoning structure: reproduce → isolate transform stage → diff against source → check upstream feed → confirm with the data owner.
- Production support: how you triage under a tight turnaround, communicate with an internal customer (quant researcher), and prevent recurrence.

## Timeline & success metrics

- **Weeks 1–2:** vendor cheat sheet done → can discuss major market-data vendor onboarding coherently.
- **Weeks 3–4:** financial-data ETL demo running on Airflow with dbt tests → "modern Python data stack" is repo-backed.
- **Weeks 5–6:** reconciliation/quality tool complete → "reconciliations, validations, quality checks, data debugging" all demonstrable.
- **Week 7+:** MySQL delta closed; both artifacts on GitHub and linked from LinkedIn.
- **Success = interview-ready in ~6 weeks:** two proof artifacts, a vendor-fluency cheat sheet, and a crisp "hedge-fund data ops" narrative. Given the Strong baseline fit, most of this is credential-and-vocabulary polish rather than net-new capability.
