---
title: "Compound — Design Doc"
date: 2026-07-12
description: "A personal life-system whose job is to do the admin of living so you can just feel and act."
draft: true
series: "living"
order: 2
tags: ["learning", "living", "life-system", "product"]
---

## A personal life system whose job is to let you stop thinking and just feel

> **Status:** design doc (tech-agnostic). Captures the philosophy, the unified faculty model, the behavioral mechanics, and the build sequence. Precedes build specs. Single-user (just the owner); not building for others.
>
> **Relationship to prior work:** this supersedes the multi-user "Life-OS" framing. The owner has an existing, well-architected Foundry app (also called Compound) that proves the goals/habits/metrics/daily-planning model. This doc defines the *new* Compound: the same proven engine, ported off Foundry to a platform the owner controls and uses on their phone, plus the missing "feeling" layer, unified into one super app.

---

## 1. North star: "offload the thinking, just feel"

The purpose of Compound is **to do the administrative and planning labor of life so the owner's attention is freed for living it.** Not a better place to input data — a system that thinks *for* you and hands you a surface that says, in effect: *here's your day, just follow it; here's what matters now, just be present.*

This inverts the usual tracker relationship:
- A tracker asks **you** to think (categorize, plan, decide, log).
- Compound does the **thinking**, and asks you only to **feel and act**.

Everything below serves this. A feature earns its place only if it *removes* cognitive load or *enriches feeling* — never if it adds another thing to manage.

### Two guardrails (from the owner's own wellbeing research — do not lose these)
1. **Agency, not dependence.** "Offload all thinking" must mean offloading *administrative* thinking (what's on my plate, what's the plan, did I do it) so there's *more* capacity for the thinking that matters (what do I want, who do I love, what's meaningful). The system must make the owner feel **clear and free, never managed**, and must hand agency back, not absorb it. Over-reliance is a documented wellbeing risk; design against it.
2. **Invite feeling, don't automate it.** The system handles the *logistics* of life; it must never handle the *experiencing* of it. Savoring and gratitude work because *the person* attends to the good thing — so the feeling layer **prompts and resurfaces** (notice this, remember that), but never manufactures or reduces the feeling to a number/streak. Logistics are automated; meaning is invited.

---

## 2. What already exists (and what we keep vs. rebuild)

The Foundry Compound validated a lot. We **keep the model, rebuild the platform.**

**Keep (proven concepts, port them):**
- The two-layer data model: definitions (Goal, Habit, Metric) vs. immutable time-series entries (HabitEntry, MetricEntry).
- The chain: Area/Domain → Goal → GoalPlan → Habit/Metric → DailyPlan → execution.
- **AI-planned, human-executed** with **minimum daily friction** ("open → see today → tap Done") — this is literally the "just feel" engine.
- The **adaptive planner**: factors skip rate, expiry rate, recent quality from history to adjust intensity/timing; distinguishes "expired" (ran out of time) from "skipped" (declined).
- Life domains (Areas) as a balance mechanism.

**Rebuild / leave behind:**
- The **Foundry platform itself** — it can't live on the owner's phone, can't be a true personal product, and the owner doesn't control it. Foundry stays as the validated prototype; the new Compound is greenfield on a platform the owner owns.
- Foundry-specific machinery (ontology RIDs, Workshop, action-validation rules, the hidden-UUID-parameter pattern). These were Foundry workarounds, not portable design.

**Add (the missing half):**
- The **feeling layer**: gratitude, captured moments, mood, reflection — the rich-entry content the achievement-only Foundry app never had, and the part the owner's research ranks *most* important (relationships, wellbeing, meaning, savoring).

---

## 3. Unified faculty model (one super app, distinct surfaces)

Compound is **one app over one shared core**, with faculties as internal modules (not separate apps, not separate data). The interface is swappable (Telegram first, iOS next) — faculties never assume a front-end.

**The thinking side (ported from Foundry):**
- **Planning** — the daily-plan engine. The heart of "just feel." Generates today's plan from goals/habits/history; surfaces it as a tap-to-do list. *Leads the build.*
- **Goals & Habits** — the goal→plan→habit structure and streaks.
- **Metrics** — quantitative tracking (incl. physical wellbeing: sleep, movement; can later import from HealthKit on iOS).

**The feeling side (new):**
- **Journaling / Gratitude** — gratitude reflections + privately captured photo-moments (your eyes only; never shared — public sharing harms wellbeing via comparison). Rich entries, not checkboxes.
- **Connection** — gentle tracking/prompting of staying in touch with people (the #1 happiness predictor), as reflective entries.

**The seam where both sides meet:**
- **Weekly Review** — the one surface that reads *both* halves: your habit/goal data AND your gratitude/feeling entries, into a reflective end-of-week summary. (Foundry Compound had this as a Phase-2 aspiration; here it's the natural integration point.) This is where "thinking" and "feeling" reconcile.

**Later / long-term:**
- **Finances** — explicitly part of the vision ("even my finances managed by this"): another domain the system thinks about so you don't. Correctly **last** — most complex, most sensitive (account data, security). Its presence validates that faculties should be *generic domains*, but it is not scoped now.

```
            Interface (Telegram now -> iOS app next)  -- swappable
                              |
   +--------------------------+---------------------------+
   |   THINKING side          |   FEELING side            |
   |  Planning (leads)        |  Journaling / Gratitude   |
   |  Goals & Habits          |  Connection               |
   |  Metrics (+HealthKit)    |                           |
   +--------------------------+---------------------------+
                  \            |            /
                   \      Weekly Review     /   <- the seam: reads both
                    \         |            /
                  Shared core: two layers (definitions + entries),
                  userId-scoped, accessed via one data boundary
                              |
                  (later) Finances faculty
```

---

## 4. The two-layer core (carried over, now holding both sides)

- **Layer A — Tracking:** goals, habits, metrics; streaks, targets, time-series entries. The thinking side lives mostly here. (Directly ported from Foundry's Goal/Habit/Metric + Entry split.)
- **Layer B — Entries (rich content):** gratitude text, captured photos+captions, mood, connection notes, reflections. The feeling side lives here. **Never reduce an entry to its tracking record** — the streak says *that* you journaled; the entry holds *what* you felt.

Shared conventions to carry from Foundry: `userId` on every record (single-user now, but keep the discipline — it's nearly free and the Foundry app already does it), life-domain tagging for balance, and links between entities (a gratitude entry can tag a person/domain; a habit links to a goal).

---

## 5. Behavioral mechanics (make it effective, not just functional)

The successful apps in this space win on UX-as-behavior-design. Apply the owner's own concept-map science:

- **Near-zero activation energy** (Atomic Habits: make it easy). Default interactions are one tap / one line / one photo. Never a blank essay page. "Aim for done, not deep." The daily surface is tap-to-complete.
- **Cue-based prompts, not blank pages** (make it obvious; decision-fatigue elimination). The system *prompts* ("What went well today?", "Here's your plan") so the owner never faces "what do I even do/write." Let the owner anchor prompts to existing routines (habit stacking / implementation intentions).
- **Gentle streaks with forgiveness** (loss aversion, used carefully). Streaks motivate via loss aversion but a hard broken streak causes abandonment and (for gratitude) hollowing. Use grace days / freezes, celebrate consistency-over-time, never guilt copy. Gamify *showing up*, never the *content* of feeling (over-justification effect: extrinsic rewards can crowd out intrinsic motivation).
- **Reminiscence / "On This Day"** (savoring lever). Resurface past gratitude entries and captured moments — re-delivers positive emotion at near-zero cost and makes the archive *compound* in value. High-priority early feature on the feeling side.
- **Visible progress, kindly** (SDT competence + flow's feedback condition). Show gentle trends and a calendar of done-days. Encouraging, not clinical.
- **AI does the planning** (the core friction-remover). The owner follows and logs; the system reasons about skip/expiry/quality and adapts — exactly the ported Foundry planner.

---

## 6. Build sequence (core-first; Telegram now; iOS next)

The core (planning logic + data) is separate from the interface, so interfaces are added over a stable core without rework.

- **Phase 0 — Core + Planning engine + Telegram interface.**
  Port the proven daily-planning loop off Foundry into an owned core, exposed through a Telegram bot. Deliver the "just feel" loop fast and cheap: morning plan -> tap Done. Validates the engine before any Swift. *Planning leads, per decision.*
- **Phase 1 — Goals & Habits + Metrics** over the same core (the rest of the thinking side; the structure the planner draws from).
- **Phase 2 — Journaling / Gratitude + Connection** (the feeling layer): gratitude entries, private photo-moments, "On This Day," gentle streaks.
- **Phase 3 — iOS app** as a second interface over the same core. This is where the owner gets the build experience, the phone-native capture (camera for moments), notifications, and optional HealthKit import for sleep/movement metrics. The Telegram phase is not throwaway — it proved the core.
- **Phase 4 — Weekly Review** (the seam): reflective summary across both halves.
- **Phase 5+ (long-term) — Finances** and other domains, once the loop is trusted.

---

## 7. Platform & runtime notes (to resolve at build-spec time, not now)
- **Core:** one project/language the owner can maintain solo; data accessed through a single boundary so storage is swappable.
- **Interface mode:** Telegram first (capture anywhere, free, fast); iOS native later (camera, notifications, HealthKit). iOS implies an Apple Developer account (~$99/yr) — accepted as the cost of the "build an app + use on my iPhone" goal.
- **LLM:** cloud, swappable, isolated in the interface/planning layer (no local model — owner hardware can't run one). The planner's reasoning is the main LLM use.
- **Cost:** near-free for the Telegram/core phase; iOS phase adds the Apple account. Exact hosting decided at spec time (single always-on process for a Telegram bot, or serverless).

---

## 8. Open decisions (for the first build spec)
- Language/stack for the owned core (optimize for solo maintainability + an easy path to an iOS client — e.g. a core that an iOS app can call cleanly).
- Cloud LLM provider for the planner.
- Hosting for the Telegram-phase core (always-on vs. serverless; ties to whether strict-$0 or ~$5/mo).
- How much of the Foundry planner's adaptive logic to port in Phase 0 vs. add later (suggest: port the core ranking + skip/expiry adaptation; defer phased multi-week plans).
- Whether to model the owner's existing goals/habits as seed data migrated from Foundry, or start fresh.
