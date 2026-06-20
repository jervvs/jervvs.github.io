---
title: "Autoscaling"
description: "Can systems learn to right-size themselves? Exploring elastic capacity that adjusts to real demand."
order: 1
tags: ["design", "systems"]
---

Most systems are either over-provisioned (wasting money) or under-provisioned (at risk of failure). The sweet spot between the two is narrow and constantly shifting.

Autoscaling is the idea that systems should **adjust their own capacity** based on actual demand — scaling up when load increases, scaling down when it subsides. Simple in concept, surprisingly hard in practice.

The challenges I'm thinking about:

- **Signal selection** — what metrics actually predict the need to scale? CPU isn't always the right signal.
- **Speed vs. stability** — scale too fast and you oscillate. Scale too slow and you're always behind.
- **Cost awareness** — more capacity costs money. The system needs to balance performance against budget.
- **Graceful degradation** — what happens when you *can't* scale? The system needs a fallback.

I'm reading a lot of Google's SRE literature on this, and exploring how different approaches work in practice. The goal is a design that's simple enough to explain in one paragraph but robust enough to run in production.

Related: [The Art of Running Systems at Scale](/writing/the-art-of-running-systems-at-scale/)
