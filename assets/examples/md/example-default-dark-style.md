---
marp: true
theme: default
header: Example Labs | default theme, dark style
paginate: true
style: |
  
  /* ===== Dark Style for Marp ===== */
  
  /* --- Base: All slides dark --- */
  section {
    background: #0f172a;
    color: #e2e8f0;
  }
  section h1, section h2, section h3, section h4 {
    color: #f1f5f9;
  }
  section a {
    color: #818cf8;
  }
  section code {
    background: #1e293b;
    color: #34d399;
  }
  
  /* --- Dark Title --- */
  section.dk-title {
    background: linear-gradient(135deg, #312e81 0%, #4c1d95 50%, #1e1b4b 100%);
    color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section.dk-title h1 {
    color: #ffffff;
    font-size: 2.5em;
    font-weight: 700;
    margin-bottom: 0.3em;
    text-shadow: 0 2px 12px rgba(0,0,0,0.4);
  }
  section.dk-title p {
    color: rgba(255,255,255,0.75);
    font-size: 1.2em;
  }
  
  /* --- Dark Section --- */
  section.dk-section {
    background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
    color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section.dk-section h2 {
    color: #818cf8;
    font-size: 2em;
  }
  section.dk-section p {
    color: rgba(255,255,255,0.7);
  }
  
  /* --- Dark Table --- */
  section.dk-table table {
    border-collapse: collapse;
    width: 100%;
    margin: 1rem auto;
    font-size: 0.9em;
  }
  section.dk-table thead th {
    background: #3730a3;
    color: #ffffff;
    padding: 0.7rem 1rem;
    font-weight: 600;
    border: 1px solid #4338ca;
    text-align: left;
  }
  section.dk-table tbody tr {
    background: #0f172a;
  }
  section.dk-table tbody tr:nth-child(even) {
    background: #1e293b;
  }
  section.dk-table tbody td {
    padding: 0.6rem 1rem;
    color: #e2e8f0;
    border: 1px solid #334155;
    text-align: left;
  }
  
  /* --- Dark Card Grid --- */
  .dk-card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }
  .dk-card {
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 12px;
    padding: 1.2rem;
    text-align: center;
  }
  .dk-card-icon {
    font-size: 2em;
    margin-bottom: 0.5rem;
  }
  .dk-card h4 {
    margin: 0.3rem 0;
    color: #f1f5f9;
    font-size: 1em;
  }
  .dk-card p {
    margin: 0;
    color: #94a3b8;
    font-size: 0.85em;
  }
  
  /* --- Dark Timeline --- */
  .dk-timeline {
    position: relative;
    padding-left: 36px;
    margin-top: 1rem;
  }
  .dk-timeline::before {
    content: '';
    position: absolute;
    left: 13px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, #818cf8 0%, #34d399 100%);
    border-radius: 2px;
  }
  .dk-timeline-item {
    position: relative;
    margin-bottom: 1.2rem;
  }
  .dk-timeline-item::before {
    content: '';
    position: absolute;
    left: -29px;
    top: 0.4em;
    width: 10px;
    height: 10px;
    background: #818cf8;
    border-radius: 50%;
    border: 2px solid #0f172a;
    box-shadow: 0 0 0 2px #818cf8;
  }
  .dk-timeline-item strong {
    color: #818cf8;
  }
  .dk-timeline-item span {
    color: #94a3b8;
    margin-left: 0.3rem;
  }
  
  /* --- Dark Statistics --- */
  .dk-stat-box {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 1rem;
    flex-wrap: wrap;
  }
  .dk-stat-box > div {
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 12px;
    padding: 1.2rem 2rem;
    text-align: center;
    min-width: 140px;
    flex: 1 1 calc(33.333% - 1.5rem);
    max-width: calc(50% - 1rem);
  }
  .dk-stat-number {
    font-size: 2.2em;
    font-weight: 700;
    color: #818cf8;
    line-height: 1.1;
  }
  .dk-stat-label {
    font-size: 0.85em;
    color: #94a3b8;
    margin-top: 0.3rem;
  }
  
  /* --- Dark Image Right --- */
  .dk-split {
    display: grid;
    grid-template-columns: 3fr 2fr;
    gap: 1.5rem;
    align-items: center;
    margin-top: 1rem;
  }
  .dk-split img {
    width: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
  .dk-split-content ul {
    padding-left: 1.2rem;
  }
  .dk-split-content li {
    margin-bottom: 0.4rem;
    color: #cbd5e1;
  }
  
  /* --- Dark Terminal --- */
  .dk-terminal-box {
    background: #020617;
    border: 1px solid #334155;
    border-radius: 8px;
    margin-top: 1rem;
    overflow: hidden;
    font-family: 'Courier New', Courier, monospace;
  }
  .dk-terminal-header {
    background: #1e293b;
    color: #94a3b8;
    padding: 0.5rem 1rem;
    font-size: 0.85em;
    border-bottom: 1px solid #334155;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .dk-terminal-header::before {
    content: '● ● ●';
    color: #475569;
    font-size: 0.8em;
  }
  .dk-terminal-body {
    padding: 1rem 1.2rem;
  }
  .dk-terminal-line {
    color: #e2e8f0;
    font-size: 0.85em;
    line-height: 1.8;
    white-space: pre-wrap;
  }
  .dk-terminal-line[data-cmd]::before,
  .dk-terminal-line:not([data-out])::first-line {
    color: #34d399;
  }
  
---

<!-- layout: title -->
<!-- _class: dk-title -->

# Welcome to the Future

A bold vision for modern presentations

---

<!-- layout: section -->
<!-- _class: dk-section -->

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


<!-- _footer: Source: Sample Dataset -->

---

<!-- layout: table -->
<!-- _class: dk-table -->

## Data Overview

| Item | Value |
| ---- | ----- |
| Alpha | 42 |
| Beta | 37 |
| Gamma | 58 |
| Delta | 21 |

Higher is better.

<!-- _footer: Source: Sample Stats -->

---

<!-- layout: card-grid -->
## Core Capabilities

<div class="dk-card-grid">
<div class="dk-card">
<div class="dk-card-icon">🚀</div>
<h4>Performance</h4>
<p>Blazing fast response times</p>
</div>
<div class="dk-card">
<div class="dk-card-icon">🔒</div>
<h4>Security</h4>
<p>Enterprise-grade protection</p>
</div>
<div class="dk-card">
<div class="dk-card-icon">📊</div>
<h4>Analytics</h4>
<p>Real-time insights dashboard</p>
</div>
<div class="dk-card">
<div class="dk-card-icon">🔌</div>
<h4>Integration</h4>
<p>Connect with any platform</p>
</div>
</div>

---

<!-- layout: timeline -->
## Project Milestones

<div class="dk-timeline">
<div class="dk-timeline-item">
<strong>Q1 2025</strong> <span>Research & Discovery</span>
</div>
<div class="dk-timeline-item">
<strong>Q2 2025</strong> <span>Prototype Development</span>
</div>
<div class="dk-timeline-item">
<strong>Q3 2025</strong> <span>Beta Launch</span>
</div>
<div class="dk-timeline-item">
<strong>Q4 2025</strong> <span>General Availability</span>
</div>
</div>

---

<!-- layout: statistics -->
## Impact at a Glance

<div class="dk-stat-box">
<div>
<div class="dk-stat-number">99.9%</div>
<div class="dk-stat-label">Uptime</div>
</div>
<div>
<div class="dk-stat-number">2.5M</div>
<div class="dk-stat-label">Users</div>
</div>
<div>
<div class="dk-stat-number">150ms</div>
<div class="dk-stat-label">Avg Latency</div>
</div>
<div>
<div class="dk-stat-number">4.8★</div>
<div class="dk-stat-label">Rating</div>
</div>
</div>

<p>Data as of Q4 2025</p>

---

<!-- layout: image-right -->
## Architecture Diagram

<div class="dk-split">

<div class="dk-split-content">

- Ingest
- Process
- Serve

</div>

![](https://picsum.photos/1280/720)

</div>

<!-- _footer: Diagram credit: picsum.photos -->

---

<!-- layout: terminal -->
## Quick Start

<div class="dk-terminal-box">
<div class="dk-terminal-header">bash</div>
<div class="dk-terminal-body">
<div class="dk-terminal-line">$ npm install my-package</div>
<div class="dk-terminal-line">added 42 packages in 1.2s</div>
<div class="dk-terminal-line">$ npm run dev</div>
<div class="dk-terminal-line">Server running on http://localhost:3000</div>
</div>
</div>
