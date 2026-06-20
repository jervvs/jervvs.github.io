---
title: "Why Automation Isn't About Replacing People"
date: 2026-04-10
description: "The best automation amplifies human judgment instead of removing it. Lessons from building self-healing infrastructure."
tags: ["automation", "systems"]
draft: false
---

There's a persistent myth in operations: that the goal of automation is to remove humans from the loop entirely. Build enough scripts, deploy enough agents, and eventually the systems run themselves.

This is wrong. Not because it's technically impossible — it's increasingly not — but because it misunderstands what humans are actually good at.

## What Machines Do Well

Machines are excellent at **consistency**. They don't forget steps. They don't get tired at 2am. They don't develop muscle memory for the wrong procedure because they practiced on a slightly different system last week.

When you automate a rolling restart, you're not replacing the engineer who used to do it manually. You're encoding the best version of that engineer's judgment — the version that remembers to check cluster health first, that waits for streaming to complete, that backs off when a node doesn't rejoin.

## What Humans Do Well

Humans are excellent at **novelty**. When the automation encounters something it wasn't designed for — and it always eventually does — you need a person who can:

1. Recognize that this situation is different from the ones the automation handles
2. Understand *why* it's different
3. Make a judgment call about what to do next

This is the part that doesn't automate away. The signal detection, the pattern matching across domains, the "this feels wrong" intuition that comes from years of operational experience.

## The Right Model

The best automation I've built follows a simple principle: **automate the known, escalate the unknown**.

The system handles the 95% of cases that follow established patterns. When it hits something outside those patterns, it doesn't guess — it collects context, presents options, and asks a human to decide.

This means the human operator spends their time on the genuinely hard problems, not on the repetitive ones. Their judgment gets applied where it matters most, and the routine work gets done perfectly every time.

That's not replacing people. That's giving them superpowers.
