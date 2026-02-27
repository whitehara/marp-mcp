---
marp: true
theme: default
header: Example Labs | default theme, academic style
paginate: true
style: |
  
  /* ===== Academic Style for Marp ===== */
  
  /* --- Page Number --- */
  section::after {
    font-size: 0.6em;
    color: #64748b;
  }
  
  /* --- Academic Title --- */
  section.acad-title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 2rem 3rem;
  }
  section.acad-title h1 {
    color: #800000;
    font-size: 2.2em;
    font-weight: 700;
    margin-bottom: 0.5em;
    border-bottom: 3px solid #800000;
    padding-bottom: 0.4em;
  }
  section.acad-title p {
    color: #475569;
    font-size: 1em;
    margin: 0.15em 0;
  }
  
  /* --- Academic Section --- */
  section.acad-section {
    background: #800000;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section.acad-section h2 {
    color: #ffffff;
    font-size: 2em;
    margin-bottom: 0.2em;
  }
  section.acad-section p {
    color: rgba(255,255,255,0.85);
    font-size: 1.1em;
  }
  section.acad-section span.acad-section-num {
    display: inline-block;
    font-size: 3em;
    font-weight: 700;
    color: rgba(255,255,255,0.3);
    margin-bottom: 0.1em;
  }
  
  /* --- Academic Header Bar (for content slides) --- */
  section h2 {
    color: #800000;
    font-weight: 700;
    border-bottom: 2px solid #800000;
    padding-bottom: 0.3rem;
    margin-bottom: 0.8rem;
  }
  
  /* --- Academic Table --- */
  section.acad-table table {
    border-collapse: collapse;
    width: 100%;
    margin: 0.8rem auto;
    font-size: 0.85em;
  }
  section.acad-table thead th {
    background: #800000;
    color: #ffffff;
    padding: 0.6rem 0.8rem;
    font-weight: 600;
    border: 1px solid #800000;
    text-align: left;
  }
  section.acad-table tbody td {
    padding: 0.5rem 0.8rem;
    color: #1e293b;
    border: 1px solid #dee2e6;
    text-align: left;
  }
  section.acad-table tbody tr:nth-child(even) {
    background: #f8f9fa;
  }
  
  /* --- Academic Two Column --- */
  .acad-2col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-top: 0.8rem;
  }
  .acad-2col-panel {
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-top: 3px solid #800000;
    border-radius: 6px;
    padding: 1rem;
  }
  .acad-2col-panel h3 {
    margin-top: 0;
    color: #800000;
    font-size: 1em;
    border-bottom: 1px solid #dee2e6;
    padding-bottom: 0.3rem;
    margin-bottom: 0.5rem;
  }
  .acad-2col-panel ul {
    margin: 0;
    padding-left: 1.2rem;
  }
  .acad-2col-panel li {
    margin-bottom: 0.25rem;
    color: #1e293b;
  }
  
  /* --- Academic Image Split --- */
  .acad-split {
    display: grid;
    grid-template-columns: 3fr 2fr;
    gap: 1.5rem;
    align-items: center;
    margin-top: 0.8rem;
  }
  .acad-split img {
    width: 100%;
    object-fit: cover;
    border-radius: 4px;
    border: 1px solid #dee2e6;
  }
  .acad-split-content ul {
    padding-left: 1.2rem;
  }
  .acad-split-content li {
    margin-bottom: 0.3rem;
    color: #1e293b;
  }
  
  /* --- Academic Image Center --- */
  section.acad-img-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .acad-image-center-wrap {
    text-align: center;
    margin-top: 0.8rem;
  }
  .acad-image-center-wrap img {
    max-height: 380px;
    object-fit: contain;
    border: 1px solid #dee2e6;
    border-radius: 4px;
  }
  
  /* --- Academic Figure Caption --- */
  .acad-figure {
    text-align: center;
    margin-top: 0.8rem;
  }
  .acad-figure img {
    max-height: 430px;
    object-fit: contain;
    border: 1px solid #dee2e6;
    border-radius: 4px;
  }
  .acad-figure-caption {
    font-size: 0.8em;
    color: #475569;
    margin-top: 0.5rem;
  }
  .acad-figure-caption strong {
    color: #800000;
  }
  
  /* --- Academic Key Message --- */
  .acad-key-message {
    background: #800000;
    color: #ffffff;
    border-radius: 8px;
    padding: 1.5rem 2rem;
    text-align: center;
    margin: 1rem auto;
    max-width: 85%;
  }
  .acad-key-message h3 {
    margin-top: 0;
    font-size: 1.2em;
    color: #ffffff;
    margin-bottom: 0.5rem;
  }
  .acad-key-message p {
    margin-bottom: 0;
    font-size: 1em;
    color: rgba(255,255,255,0.92);
  }
  .acad-key-note {
    font-size: 0.8em;
    color: #475569;
    text-align: center;
    margin-top: 0.8rem;
  }
  
  /* --- Academic Methodology --- */
  .acad-method-steps {
    display: flex;
    align-items: stretch;
    justify-content: center;
    gap: 0;
    margin-top: 1rem;
    flex-wrap: nowrap;
  }
  .acad-method-step {
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-top: 3px solid #800000;
    border-radius: 6px;
    padding: 0.8rem 1rem;
    text-align: center;
    flex: 1;
    min-width: 0;
  }
  .acad-method-step-label {
    font-size: 0.9em;
    font-weight: 600;
    color: #800000;
    line-height: 1.2;
  }
  .acad-method-step-desc {
    font-size: 0.75em;
    color: #475569;
    margin-top: 0.2rem;
  }
  .acad-method-arrow {
    font-size: 1.3em;
    color: #800000;
    padding: 0 0.3rem;
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
  
  /* --- Academic Comparison --- */
  .acad-comparison {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-top: 0.8rem;
  }
  .acad-comparison-panel {
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    padding: 1rem;
  }
  .acad-comparison-panel h3 {
    margin-top: 0;
    font-size: 1em;
    border-bottom: 1px solid #dee2e6;
    padding-bottom: 0.3rem;
    margin-bottom: 0.5rem;
  }
  .acad-comparison-panel:first-child h3 {
    color: #475569;
  }
  .acad-comparison-panel:last-child {
    border-top: 3px solid #800000;
  }
  .acad-comparison-panel:last-child h3 {
    color: #800000;
  }
  .acad-comparison-panel ul {
    margin: 0;
    padding-left: 1.2rem;
  }
  .acad-comparison-panel li {
    margin-bottom: 0.25rem;
    color: #1e293b;
  }
  
  /* --- Academic Citations (blockquote) --- */
  section blockquote {
    position: absolute;
    bottom: 30px;
    left: 40px;
    right: 40px;
    margin: 0;
    padding: 0;
    border: none;
    background: transparent;
    font-size: 0.55em;
    color: #64748b;
    line-height: 1.4;
  }
  section blockquote p {
    margin: 0;
    color: #64748b;
  }
  
---

<!-- layout: title -->
<!-- _class: acad-title -->

# Welcome to the Future

---

<!-- layout: section -->
<!-- _class: acad-section -->

## Part Two

Diving deeper into the details

---

<!-- layout: content -->
## Summary

This is a **free-form** markdown slide.

- Point one
- Point two
- Point three

---

<!-- layout: list -->
## Key Points

- Background context
- Insights discovered
- Next steps

> Source: Sample Dataset

---

<!-- layout: table -->
<!-- _class: acad-table -->

## Data Overview

| Item | Value |
| ---- | ----- |
| Alpha | 42 |
| Beta | 37 |
| Gamma | 58 |
| Delta | 21 |

Higher is better.

> Source: Sample Stats

---

<!-- layout: two-column -->
## Comparison

<div class="acad-2col">
<div class="acad-2col-panel">
<h3>Option A</h3>
<ul>
<li>Fast setup</li>
<li>Low cost</li>
<li>Community support</li>
</ul>
</div>
<div class="acad-2col-panel">
<h3>Option B</h3>
<ul>
<li>Enterprise features</li>
<li>SLA guarantee</li>
<li>Dedicated support</li>
</ul>
</div>
</div>

---

<!-- layout: image-right -->
## Architecture Diagram

<div class="acad-split">

<div class="acad-split-content">

- Ingest
- Process
- Serve

</div>

![](https://picsum.photos/1280/720)

</div>

> Diagram credit: picsum.photos

---

<!-- layout: image-center -->
<!-- _class: acad-img-center -->

## Workflow Snapshot

![center h:430](https://picsum.photos/1280/720)

Step-by-step overview.

> Figure 1

---

<!-- layout: figure-caption -->
## Experimental Results

<div class="acad-figure">

![center h:380](https://picsum.photos/1280/720)

<div class="acad-figure-caption"><strong>Fig. 1.</strong> Comparison of treatment groups over 12-week period (Adapted from Smith et al., 2024)</div>
</div>

> Smith J, et al. J Exp Med. 2024;15(3):102-110.

---

<!-- layout: key-message -->
## Conclusions

<div class="acad-key-message">
<h3>Key Finding</h3>
<p>Our proposed method demonstrates a 35% improvement in accuracy compared to the baseline approach.</p>
</div>

<p class="acad-key-note">Further validation with larger datasets is recommended.</p>

---

<!-- layout: methodology -->
## Study Design

<div class="acad-method-steps">
<div class="acad-method-step">
<div class="acad-method-step-label">Recruitment</div>
<div class="acad-method-step-desc">N=120 participants</div>
</div>
<div class="acad-method-arrow">→</div>
<div class="acad-method-step">
<div class="acad-method-step-label">Randomization</div>
<div class="acad-method-step-desc">Double-blind RCT</div>
</div>
<div class="acad-method-arrow">→</div>
<div class="acad-method-step">
<div class="acad-method-step-label">Intervention</div>
<div class="acad-method-step-desc">12-week protocol</div>
</div>
<div class="acad-method-arrow">→</div>
<div class="acad-method-step">
<div class="acad-method-step-label">Assessment</div>
<div class="acad-method-step-desc">Pre/post measures</div>
</div>
<div class="acad-method-arrow">→</div>
<div class="acad-method-step">
<div class="acad-method-step-label">Analysis</div>
<div class="acad-method-step-desc">Mixed-effects model</div>
</div>
</div>

> Protocol registered: UMIN000012345

---

<!-- layout: comparison -->
## Method Comparison

<div class="acad-comparison">
<div class="acad-comparison-panel">
<h3>Conventional Method</h3>
<ul>
<li>Manual feature extraction</li>
<li>Linear classifier</li>
<li>Limited scalability</li>
</ul>
</div>
<div class="acad-comparison-panel">
<h3>Proposed Method</h3>
<ul>
<li>Automated feature learning</li>
<li>Deep neural network</li>
<li>Highly scalable</li>
</ul>
</div>
</div>

> Based on benchmark results from Dataset X
