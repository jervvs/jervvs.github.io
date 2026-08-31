---
title: "On Systems Thinking"
date: 2026-02-12
description: "The most valuable skill in operations isn't technical — it's the ability to see connections that others miss."
tags: ["systems", "thinking"]
draft: false
---

I keep coming back to a simple idea: the most important problems aren't contained within a single component. They live in the *connections between* components.

A database is slow. That's a symptom. The cause might be a query pattern that changed when a feature was deployed three services upstream. The connection between "new feature in the product" and "database latency" passes through five layers of abstraction, and nobody who made the feature decision had visibility into the database.

Systems thinking is the discipline of tracing those connections.

## Seeing the Whole

Most engineering education trains you to decompose problems — break them into smaller pieces, solve each piece independently. This is powerful, and it's the right approach for many problems.

But operational problems are often **emergent**. They arise from the interaction between components, not from any single component failing. The database is doing exactly what it was configured to do. The application is doing exactly what it was programmed to do. The failure is in how they interact under load that neither was independently tested against.

You can't find these problems by looking at components in isolation. You have to look at the system as a whole — the feedback loops, the resource contention, the cascading effects.

## Second-Order Effects

The most dangerous operational changes are the ones with non-obvious second-order effects.

You increase the connection pool size to handle more traffic. First-order effect: more concurrent queries. Good. Second-order effect: more concurrent queries means more memory pressure on the database, which triggers garbage collection, which causes latency spikes, which causes upstream timeouts, which causes *more* retries, which means *more* connections. You've created a positive feedback loop that amplifies the original problem.

Every time I review a change, I ask: "and then what happens?" If I can't answer that question through at least two levels of consequence, I don't understand the change well enough to approve it.

## Making it Practical

Systems thinking sounds abstract, but it translates to very concrete practices:

- **Draw the dependency graph** before making changes. If you can't draw it, you don't understand the system well enough.
- **Ask "what else uses this?"** for every resource you modify. CPU, memory, connections, disk I/O — they're all shared.
- **Test at realistic scale**, not just functional correctness. A system that works at 10 QPS and fails at 1000 QPS doesn't have a scale problem — it has a design problem that was invisible at low scale.
- **Read incident reports from other teams**. The failure modes in their systems are the failure modes in yours. The specific technology differs, but the *patterns* are universal.

The goal isn't to predict every failure. It's to develop the habit of looking for connections — and the humility to know that you're probably missing some.
