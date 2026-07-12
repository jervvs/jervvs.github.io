---
title: "Compound — Phase 0 Build Spec"
date: 2026-07-12
description: "The first concrete build slice of Compound: an owned core, a ported planning engine, and a Telegram interface."
draft: true
series: "living"
order: 3
tags: ["learning", "living", "life-system", "product"]
---

## Owned core + ported planning engine + Telegram interface

> **For the implementing agent.** Build the first version of Compound: a single-user personal growth system as a **Telegram bot** over an **owned core** (not Foundry). Read the **Compound — Design Doc** first for philosophy and the "just feel" north star. This spec defines Phase 0 concretely. The data model and planner logic are **ported from a proven Foundry app** (model summarized below — treat it as the source of truth, but drop all Foundry-specific machinery).

---

## 1. Scope: the complete Phase 0 loop

One user (the owner). Three interactions, one reinforcing loop:

1. **Conversational goal setup (with confirm step):** the user chats with the bot about a goal; the bot asks clarifying questions, **proposes a full structure** (goal + plan + habits + metrics), the user **approves**, and only then does it **commit** the objects. No object is written before explicit confirmation.
2. **Adaptive daily plan:** the bot generates today's plan from active goals/habits and the user's recent history (full adaptive logic — see §4), surfaced as a short list of tasks.
3. **Frictionless completion with three logging options:** for each plan item the user can:
   - **Done** — one tap, marks complete, logs a habit entry. Zero friction.
   - **Done + metric** — complete and log a quantitative metric value.
   - **Done + reflection** — complete and attach an open-ended free-text reflection, stored as a proper **Entry** (the journaling seed — NOT crammed into a notes field).

This is fully usable on its own and is the "just feel" engine: the system thinks (plans); the user feels and acts (does, optionally reflects).

---

## 2. Architecture (interface-swappable from day one)

- **Owned core** holds all logic + data; the **Telegram bot is just an interface** over it. No business logic in the Telegram layer. (An iOS app will later be a second interface over the same core — design for that now by keeping the boundary clean.)
- **LLM access isolated behind one swappable interface** — used for (a) the conversational goal-setup reasoning and (b) the adaptive planner's ranking. Use a hosted free-tier API (see §7); provider must be swappable via config.
- **Data access through one repository boundary** so storage can change without touching faculties.
- **Every record carries `userId`** (one user now; keep the discipline — the Foundry app already does this and it's nearly free).

---

## 3. Data model (ported from Foundry Compound; two-layer)

Drop Foundry ontology/RIDs/Workshop/action-validation/hidden-UUID machinery. Keep the *model*. Definitions are mutable; entries are immutable time-series.

**Tracking layer — definitions:**
```
Area      (shared seed list of life domains; e.g. Health, Career, Relationships, Growth, Finance, Recreation, Meaning)
  id, name, description, icon, priority, status

Goal
  id, userId, areaId, title, description, targetValue, targetUnit, deadline,
  status [not_started|in_progress|completed|abandoned], createdAt, updatedAt

GoalPlan         (strategy for a goal; versioned, one active at a time)
  id, userId, goalId, name, strategyNotes, weeklySessions,
  status [active|paused|revised|completed], version, timestamps

GoalPlanItem     (weekly recurring activity within a plan)
  id, userId, goalPlanId, habitId, name, targetPerWeek, priorityLevel [high|medium|low],
  dayPreference, notes, suggestedIntensity [easy|moderate|hard], orderInPlan, timestamps

Habit
  id, userId, goalId, name, description, frequencyType, frequencyTarget, frequencyCap,
  energyType [physical|mental|emotional|creative], timeOfDay, isActive, timestamps

Metric
  id, userId, goalId, name, description, unit,
  direction [higher_is_better|lower_is_better|target_range], targetValue,
  measurementFrequency, timestamps

DailyPlan
  id, userId, date, status [active|completed|expired], aiNotes, timestamps

DailyPlanItem
  id, userId, planId, habitId, planItemId, entryId?, date, sortOrder,
  status [pending|completed|skipped|expired], aiReason, suggestedIntensity, completedAt, timestamps
```

**Tracking layer — entries (immutable):**
```
HabitEntry   (immutable log of a habit occurrence)
  id, userId, habitId, date, completed, value, valueUnit, valueSecondary, valueSecondaryUnit,
  quality (1-5), notes, energyBefore, energyAfter, createdAt

MetricEntry  (immutable time-series value)
  id, userId, metricId, date, value, notes, createdAt
```

**Entry layer — rich content (NEW; the journaling seed):**
```
Reflection   (open-ended entry; the Layer-B seed for the future feeling layer)
  id, userId, body (free text), linkedPlanItemId?, linkedHabitId?, areaId?, tags[], occurredAt, createdAt
```
A "Done + reflection" completion creates a `Reflection` linked to the plan item — stored as a first-class entry so Phase 2's journaling faculty inherits it cleanly.

**Links to preserve from Foundry (as FKs):** Area→Goal, Goal→GoalPlan, Goal→Habit, Goal→Metric, GoalPlan→GoalPlanItem, Habit→GoalPlanItem, Habit→HabitEntry, Metric→MetricEntry, DailyPlan→DailyPlanItem, Habit→DailyPlanItem, GoalPlanItem→DailyPlanItem, DailyPlanItem→HabitEntry (0..1).

---

## 4. The adaptive planner (port FULL logic from Foundry)

Port the Foundry `generateDailyPlan` v2 behavior in full, in four phases:

- **Phase A — Stale sweep:** find pending DailyPlanItems with date < target date (this user); mark each `expired`. (Distinguishes "ran out of time" from "actively skipped.")
- **Phase B — History analysis:** over the last 14 days, compute per-habit skip rate, expiry rate, completion rate; note recent quality scores; load active GoalPlans, GoalPlanItems, Habits.
- **Phase C — Rank & decide:** score candidate items by weekly progress vs. target, day preference, priority level; apply adaptations — high skip rate → downgrade intensity (hard→moderate→easy); high expiry rate → prefer an easier/earlier slot; pick ~3–7 items.
- **Phase D — Create:** create one DailyPlan; create a DailyPlanItem per chosen item, each with an `aiReason` that cites the data signal that justified it (e.g. "downgraded to moderate — skipped 3 of last 4").

The `aiReason` transparency matters for the "agency not dependence" guardrail — the user sees *why* the system planned what it did.

---

## 5. Conversational goal setup (the platform upgrade over Foundry)

Foundry was single-shot; Telegram is natively conversational, so do the real thing:

1. User opens a goal conversation (free text: "I want to get fitter / read more / …").
2. Bot asks **clarifying questions** as needed (what does success look like, rough timeline, current baseline, constraints).
3. Bot **proposes a complete structure**: which Area, the Goal (title/description/target/deadline), a GoalPlan (strategy, weekly sessions), 2–5 Habits (with energy type, time of day), GoalPlanItems (weekly targets), 1–3 Metrics. Shows it back in a readable summary.
4. User **confirms / edits**. Nothing is written until confirmation.
5. On confirm, the bot **commits all objects atomically** (create goal + plan + habits + items + metrics, correctly linked).

Keep the Foundry prompt lessons: be opinionated (propose, don't interrogate endlessly), use explicit lowercase enums, generate consistent IDs so the multi-object create links up.

---

## 6. Telegram interaction design (apply the behavioral mechanics)

- **Near-zero friction:** the daily plan is a tappable list; "Done" is one tap. (Telegram inline keyboards / buttons.)
- **Capture-fallback:** any message the bot can't confidently route is saved (as a Reflection or inbox note), never dropped.
- **Gentle, not naggy:** an optional morning "here's your plan" message and an optional evening nudge; easily disabled. No guilt copy.
- **Transparency:** when surfacing the plan, optionally show each item's `aiReason` so the system explains itself.
- The three completion options map to buttons: ✓ Done / 📊 Done+metric (prompts for a value) / ✍️ Done+reflection (prompts for free text).

---

## 7. Platform / runtime
- **LLM:** hosted free-tier API (single-user volume is tiny — morning plan + a little parsing/day). Swappable behind one interface. No self-hosted/local model (the planner needs real reasoning quality; free EC2 can't host a good-enough model).
- **Storage:** start with the simplest owned store (e.g. SQLite) behind the repository boundary; `userId`-scoped; trivially backed up.
- **Hosting:** a small always-on process for the Telegram bot (polling) OR a webhook on a free serverless tier. Implementer picks and documents; note polling wants always-on, webhook pairs with serverless.
- **Language/stack:** choose for solo maintainability AND a clean path to an iOS client later (a core the iOS app can call).

---

## 8. Acceptance criteria (Phase 0 "done")
- [ ] User can have a back-and-forth goal conversation; the bot proposes a full structure and writes nothing until the user confirms; on confirm it creates goal+plan+habits+items+metrics, correctly linked.
- [ ] User can ask for today's plan and get a ranked 3–7 item list generated by the **full adaptive logic** (stale sweep, 14-day rates, intensity adaptation, aiReason citing the signal).
- [ ] Each plan item offers **Done / Done+metric / Done+reflection**; Done logs a HabitEntry, Done+metric logs a MetricEntry, Done+reflection stores a first-class Reflection entry linked to the item.
- [ ] Stale pending items from prior days are expired (not silently dropped or counted as skips).
- [ ] Every record carries `userId`; all data access is through the repository boundary; LLM access is swappable; no business logic in the Telegram layer.
- [ ] Misrouted input is captured, never lost.
- [ ] Runs on free-tier LLM + free/near-free hosting.

---

## 9. Open decisions (escalate; don't guess)
- Seed from Foundry (migrate the owner's existing goals/habits) or start fresh?
- Which hosted LLM free tier (confirm current availability/limits at build time).
- Hosting: always-on polling vs. serverless webhook (ties to strict-$0 vs ~$5/mo tolerance).
- Stack/language (with the iOS-client path in mind).
- Default on/off for morning plan + evening nudge messages.
