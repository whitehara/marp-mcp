---
marp: true
theme: academic
---

# Research Presentation Title

**Dr. Ada Lovelace** · Institute of Future Computing

<!-- _class: lead -->

---

# Background
## Why Modern Architectures Matter

<!-- _class: section -->

---

## Key Contributions

- Hybrid reasoning pipeline
- Formal verification of agents
- Benchmarks across 3 domains

> Citation: Lovelace et al., 2025

---

## Ablation Study Results

| Variant | Accuracy |
| ------ | -------- |
| Baseline | 78% |
| + Memory | 84% |
| + Memory + Tooling | 91% |

Detailed explanation of variance.

<!-- _class: table-center table-tiny -->

> Citation: Appendix B

---

## Approach Comparison

> > ### Symbolic
> >
> > - Deterministic
> > - Hard constraints
> > - Costly to scale
>
> > ### Neural
> >
> > - Adaptive
> > - Probabilistic
> > - Data hungry

> Citation: Survey 2024

---

## Deployment Footprint

- Edge nodes in APAC
- Multi-cloud redundancy
- 45 ms median latency

![bg right:50% contain](./attachments/network.png)

> Citation: Ops report Q2

---

## Agent Loop

![center h:350](./attachments/loop.png)

Agents evaluate tool responses with a safety reviewer in the loop.

> Citation: Internal whitepaper
