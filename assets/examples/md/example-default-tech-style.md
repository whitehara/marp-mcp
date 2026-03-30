---
marp: true
theme: default
header: Example Labs | default theme, tech style
paginate: true
style: |
  
  /* === Tech Style ===
     Violet (#6d28d9) + Cyan (#0891b2) gradient accents
     Modern startup/SaaS aesthetic for product demos and engineering talks
     CSS class prefix: tech-
  */
  
  /* --- Tech Title Slide --- */
  .tech-title-slide {
    background: linear-gradient(135deg, #6d28d9 0%, #0891b2 100%);
    color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 3rem;
  }
  .tech-title-heading {
    font-size: 2.4em;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin: 0 0 0.5rem 0;
    line-height: 1.15;
  }
  .tech-title-subtitle {
    font-size: 1.1em;
    opacity: 0.85;
    font-weight: 400;
    margin: 0 0 2rem 0;
  }
  .tech-title-meta {
    font-size: 0.85em;
    opacity: 0.7;
    margin: 0;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  
  /* --- Tech Section Slide --- */
  .tech-section-slide {
    background: #0f172a;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 3rem;
  }
  .tech-section-eyebrow {
    font-size: 0.75em;
    font-weight: 600;
    color: #22d3ee;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin: 0 0 0.8rem 0;
  }
  .tech-section-heading {
    font-size: 2.2em;
    font-weight: 800;
    color: #ffffff;
    margin: 0;
    line-height: 1.2;
  }
  
  /* --- Tech Content Slide --- */
  .tech-content {
    border-left: 4px solid #6d28d9;
    padding-left: 1.2rem;
    margin-top: 0.5rem;
  }
  
  /* --- Tech List Slide --- */
  .tech-list {
    list-style: none;
    padding: 0;
    margin: 0.5rem 0 0 0;
  }
  .tech-list li {
    padding: 0.5rem 0 0.5rem 1.8rem;
    position: relative;
    border-bottom: 1px solid #f1f5f9;
    font-size: 0.95em;
    color: #1e293b;
  }
  .tech-list li:last-child {
    border-bottom: none;
  }
  .tech-list li::before {
    content: "›";
    position: absolute;
    left: 0;
    color: #6d28d9;
    font-weight: 700;
    font-size: 1.2em;
    line-height: 1.3;
  }
  
  /* --- Tech Two-Column --- */
  .tech-2col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-top: 0.5rem;
  }
  .tech-2col-panel {
    background: #f8fafc;
    border-top: 3px solid #6d28d9;
    border-radius: 0 0 6px 6px;
    padding: 1rem 1.2rem;
  }
  .tech-2col-panel-title {
    font-size: 0.8em;
    font-weight: 700;
    color: #6d28d9;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin: 0 0 0.6rem 0;
  }
  .tech-2col-panel ul {
    margin: 0;
    padding-left: 1.2rem;
  }
  .tech-2col-panel li {
    font-size: 0.9em;
    color: #334155;
    margin-bottom: 0.3rem;
  }
  
  /* --- Tech Statistics --- */
  .tech-stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 1rem;
    margin-top: 0.8rem;
  }
  .tech-stat {
    text-align: center;
    padding: 1rem;
    background: linear-gradient(135deg, rgba(109,40,217,0.05), rgba(8,145,178,0.05));
    border: 1px solid rgba(109,40,217,0.15);
    border-radius: 8px;
  }
  .tech-stat-value {
    font-size: 2em;
    font-weight: 800;
    background: linear-gradient(90deg, #6d28d9, #0891b2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.2;
    display: block;
  }
  .tech-stat-label {
    font-size: 0.8em;
    color: #64748b;
    margin-top: 0.3rem;
    display: block;
  }
  .tech-stat-trend {
    font-size: 0.75em;
    color: #0891b2;
    font-weight: 600;
    display: block;
    margin-top: 0.2rem;
  }
  .tech-stats-caption {
    text-align: center;
    font-size: 0.8em;
    color: #94a3b8;
    margin-top: 0.5rem;
  }
  
  /* --- Tech Quote --- */
  .tech-quote-box {
    border-left: 5px solid #6d28d9;
    padding: 1.2rem 1.5rem;
    background: linear-gradient(135deg, rgba(109,40,217,0.04), rgba(8,145,178,0.04));
    border-radius: 0 8px 8px 0;
    margin-top: 0.5rem;
  }
  .tech-quote-mark {
    font-size: 3em;
    color: #6d28d9;
    opacity: 0.3;
    line-height: 1;
    font-family: Georgia, serif;
    margin-bottom: -0.5rem;
    display: block;
  }
  .tech-quote-text {
    font-size: 1.1em;
    font-style: italic;
    color: #1e293b;
    line-height: 1.6;
    margin: 0 0 0.8rem 0;
  }
  .tech-quote-attribution {
    font-size: 0.85em;
    font-weight: 600;
    color: #6d28d9;
    margin: 0;
  }
  .tech-quote-context {
    font-size: 0.8em;
    color: #64748b;
    margin: 0.2rem 0 0 0;
  }
  
  /* --- Tech Highlight Box --- */
  .tech-highlight-info {
    background: rgba(8,145,178,0.08);
    border: 1px solid rgba(8,145,178,0.3);
    border-left: 4px solid #0891b2;
    border-radius: 6px;
    padding: 1rem 1.2rem;
    margin-top: 0.5rem;
  }
  .tech-highlight-warning {
    background: rgba(245,158,11,0.08);
    border: 1px solid rgba(245,158,11,0.3);
    border-left: 4px solid #f59e0b;
    border-radius: 6px;
    padding: 1rem 1.2rem;
    margin-top: 0.5rem;
  }
  .tech-highlight-success {
    background: rgba(16,185,129,0.08);
    border: 1px solid rgba(16,185,129,0.3);
    border-left: 4px solid #10b981;
    border-radius: 6px;
    padding: 1rem 1.2rem;
    margin-top: 0.5rem;
  }
  .tech-highlight-label {
    font-size: 0.75em;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin: 0 0 0.4rem 0;
  }
  .tech-highlight-info .tech-highlight-label { color: #0891b2; }
  .tech-highlight-warning .tech-highlight-label { color: #f59e0b; }
  .tech-highlight-success .tech-highlight-label { color: #10b981; }
  .tech-highlight-content {
    font-size: 0.95em;
    color: #1e293b;
    margin: 0;
    line-height: 1.5;
  }
  
  /* --- Tech Feature Grid --- */
  .tech-feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
    margin-top: 0.8rem;
  }
  .tech-feature-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-top: 3px solid #6d28d9;
    border-radius: 0 0 8px 8px;
    padding: 1rem;
    transition: none;
  }
  .tech-feature-icon {
    font-size: 1.5em;
    display: block;
    margin-bottom: 0.4rem;
  }
  .tech-feature-name {
    font-size: 0.88em;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 0.3rem 0;
  }
  .tech-feature-desc {
    font-size: 0.8em;
    color: #64748b;
    margin: 0;
    line-height: 1.4;
  }
  
  /* --- Tech Roadmap --- */
  .tech-roadmap {
    display: flex;
    gap: 0;
    margin-top: 1rem;
    position: relative;
  }
  /* Line is drawn at the vertical center of the dots (dot height=1rem, center=0.5rem) */
  .tech-roadmap::before {
    content: "";
    position: absolute;
    top: 0.5rem;
    left: 0;
    right: 0;
    height: 2px;
    background: #e2e8f0;
    z-index: 0;
  }
  .tech-milestone {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 1;
  }
  /* All dots are exactly 1rem so the line always passes through their center */
  .tech-milestone-dot {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    border: 2px solid #e2e8f0;
    background: #f8fafc;
    margin-bottom: 0.6rem;
    flex-shrink: 0;
  }
  .tech-milestone.done .tech-milestone-dot {
    background: #6d28d9;
    border-color: #6d28d9;
  }
  .tech-milestone.current .tech-milestone-dot {
    background: #0891b2;
    border-color: #0891b2;
    /* box-shadow only — keep size at 1rem so line stays aligned */
    box-shadow: 0 0 0 3px rgba(8,145,178,0.2);
  }
  .tech-milestone.future .tech-milestone-dot {
    background: #f8fafc;
    border-color: #cbd5e1;
  }
  .tech-milestone-phase {
    font-size: 0.7em;
    font-weight: 600;
    text-align: center;
    margin-bottom: 0.2rem;
  }
  .tech-milestone.done .tech-milestone-phase { color: #6d28d9; }
  .tech-milestone.current .tech-milestone-phase { color: #0891b2; }
  .tech-milestone.future .tech-milestone-phase { color: #94a3b8; }
  .tech-milestone-label {
    font-size: 0.75em;
    color: #475569;
    text-align: center;
    max-width: 80px;
    line-height: 1.3;
  }
  .tech-milestone.future .tech-milestone-label { color: #94a3b8; }
  
---

<!-- layout: title -->
<div class="tech-title-slide">
<h1 class="tech-title-heading">Welcome to the Future</h1>
</div>

---

<!-- layout: section -->
<div class="tech-section-slide">
<h2 class="tech-section-heading">Part Two</h2>
</div>

---

<!-- layout: content -->
## Summary

<div class="tech-content">

This is a **free-form** markdown slide.

- Point one
- Point two
- Point three

</div>

---

<!-- layout: list -->
## Key Points

<ul class="tech-list">
<li>Background context</li>
<li>Insights discovered</li>
<li>Next steps</li>
</ul>

---

<!-- layout: two-column -->
## Comparison

<div class="tech-2col">
<div class="tech-2col-panel">
<p class="tech-2col-panel-title">Option A</p>
<ul>
<li>Fast setup</li>
<li>Low cost</li>
<li>Community support</li>
</ul>
</div>
<div class="tech-2col-panel">
<p class="tech-2col-panel-title">Option B</p>
<ul>
<li>Enterprise features</li>
<li>SLA guarantee</li>
<li>Dedicated support</li>
</ul>
</div>
</div>

---

<!-- layout: statistics -->
## Impact at a Glance

<div class="tech-stats-grid">
<div class="tech-stat"><span class="tech-stat-value">99.9%</span><span class="tech-stat-label">Uptime</span></div>
<div class="tech-stat"><span class="tech-stat-value">2.5M</span><span class="tech-stat-label">Users</span></div>
<div class="tech-stat"><span class="tech-stat-value">150ms</span><span class="tech-stat-label">Avg Latency</span></div>
<div class="tech-stat"><span class="tech-stat-value">4.8★</span><span class="tech-stat-label">Rating</span></div>
</div>
<p class="tech-stats-caption">Data as of Q4 2025</p>

---

<!-- layout: quote -->
## undefined

<div class="tech-quote-box">
<span class="tech-quote-mark">"</span>
<p class="tech-quote-text">The best way to predict the future is to invent it.</p>
<p class="tech-quote-attribution">— Alan Kay</p>
</div>

---

<!-- layout: highlight-box -->
## Key Takeaway

<div class="tech-highlight-info">
<p class="tech-highlight-label">INFO</p>
<p class="tech-highlight-content">Simplicity and clarity are the foundations of effective communication.</p>
</div>

---

<!-- layout: feature-grid -->
## Core Capabilities

<div class="tech-feature-grid">
<div class="tech-feature-card">
<span class="tech-feature-icon">🚀</span>
<p class="tech-feature-name">Fast Deployment</p>
<p class="tech-feature-desc">Ship to production in minutes, not days</p>
</div>
<div class="tech-feature-card">
<span class="tech-feature-icon">🔒</span>
<p class="tech-feature-name">Enterprise Security</p>
<p class="tech-feature-desc">SOC 2 Type II compliant infrastructure</p>
</div>
<div class="tech-feature-card">
<span class="tech-feature-icon">📊</span>
<p class="tech-feature-name">Real-time Analytics</p>
<p class="tech-feature-desc">Live dashboards with sub-second latency</p>
</div>
<div class="tech-feature-card">
<span class="tech-feature-icon">🔌</span>
<p class="tech-feature-name">Integrations</p>
<p class="tech-feature-desc">Connect with 100+ services out of the box</p>
</div>
<div class="tech-feature-card">
<span class="tech-feature-icon">🤖</span>
<p class="tech-feature-name">AI-Powered</p>
<p class="tech-feature-desc">Built-in intelligence for smart automation</p>
</div>
</div>

---

<!-- layout: roadmap -->
## Product Roadmap

<p style="font-size:0.85em;color:#64748b;margin:0 0 0.5rem">FY2025–2026</p>

<div class="tech-roadmap">
<div class="tech-milestone done">
<div class="tech-milestone-dot"></div>
<span class="tech-milestone-phase">Q1</span>
<span class="tech-milestone-label">Foundation</span>
</div>
<div class="tech-milestone done">
<div class="tech-milestone-dot"></div>
<span class="tech-milestone-phase">Q2</span>
<span class="tech-milestone-label">Beta Launch</span>
</div>
<div class="tech-milestone current">
<div class="tech-milestone-dot"></div>
<span class="tech-milestone-phase">Q3</span>
<span class="tech-milestone-label">GA Release</span>
</div>
<div class="tech-milestone future">
<div class="tech-milestone-dot"></div>
<span class="tech-milestone-phase">Q4</span>
<span class="tech-milestone-label">Enterprise Tier</span>
</div>
<div class="tech-milestone future">
<div class="tech-milestone-dot"></div>
<span class="tech-milestone-phase">Q1 2026</span>
<span class="tech-milestone-label">AI Features</span>
</div>
</div>
