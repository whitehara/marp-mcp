/**
 * Rich style CSS definitions
 * Tailwind-inspired color palette with rich visual components
 */

export const richCss = `
/* ===== Rich Style for Marp ===== */

/* --- Utility Classes --- */
.text-large { font-size: 1.3em; }
.text-center { text-align: center; }

/* --- Grid Layouts --- */
.grid-2col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 1rem;
}
.grid-3col {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1.2rem;
  margin-top: 1rem;
}

/* --- Panel --- */
.panel {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.2rem;
}
.panel h3 {
  margin-top: 0;
  color: #1f2937;
  font-size: 1.1em;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.4rem;
}
.panel ul {
  margin: 0.5rem 0 0 0;
  padding-left: 1.2rem;
}
.panel li {
  margin-bottom: 0.3rem;
  color: #374151;
}
.panel-accent {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  color: #fff;
}
.panel-accent h3 {
  color: #fff;
  border-bottom-color: rgba(255,255,255,0.3);
}
.panel-accent li {
  color: rgba(255,255,255,0.95);
}

/* --- Image Split --- */
.image-split {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 1.5rem;
  align-items: center;
  margin-top: 1rem;
}
.image-split img {
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
}
.split-content ul {
  padding-left: 1.2rem;
}
.split-content li {
  margin-bottom: 0.4rem;
  color: #374151;
}

/* --- Card Grid --- */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}
.card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.2rem;
  text-align: center;
  transition: box-shadow 0.2s;
}
.card-icon {
  font-size: 2em;
  margin-bottom: 0.5rem;
}
.card h4 {
  margin: 0.3rem 0;
  color: #1f2937;
  font-size: 1em;
}
.card p {
  margin: 0;
  color: #4b5563;
  font-size: 0.85em;
}

/* --- Timeline --- */
.timeline {
  position: relative;
  padding-left: 36px;
  margin-top: 1rem;
}
.timeline::before {
  content: '';
  position: absolute;
  left: 13px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, #3b82f6 0%, #10b981 100%);
  border-radius: 2px;
}
.timeline-item {
  position: relative;
  margin-bottom: 1.2rem;
}
.timeline-item::before {
  content: '';
  position: absolute;
  left: -29px;
  top: 0.4em;
  width: 10px;
  height: 10px;
  background: #3b82f6;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 0 2px #3b82f6;
}
.timeline-item strong {
  color: #1f2937;
}
.timeline-item span {
  color: #4b5563;
  margin-left: 0.3rem;
}

/* --- Highlight Box --- */
.highlight-box {
  background: linear-gradient(135deg, #3b82f6 0%, #10b981 100%);
  color: #fff;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  margin: 1.5rem auto;
  max-width: 80%;
}
.highlight-box h3 {
  margin-top: 0;
  font-size: 1.3em;
  color: #fff;
}
.highlight-box p {
  margin-bottom: 0;
  font-size: 1.05em;
  color: rgba(255,255,255,0.95);
}

/* --- Statistics --- */
.stat-box {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}
.stat-box > div {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.2rem 2rem;
  text-align: center;
  min-width: 140px;
  flex: 1 1 calc(33.333% - 1.5rem);
  max-width: calc(50% - 1rem);
}
.stat-number {
  font-size: 2.2em;
  font-weight: 700;
  color: #3b82f6;
  line-height: 1.1;
}
.stat-label {
  font-size: 0.85em;
  color: #4b5563;
  margin-top: 0.3rem;
}

/* --- Section Backgrounds --- */
section.bg-gradient {
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 50%, #10b981 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}
section.bg-gradient h1,
section.bg-gradient h2 {
  color: #fff;
  text-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
section.bg-gradient p {
  color: rgba(255,255,255,0.9);
  font-size: 1.2em;
}

/* --- Title Hero --- */
section.title-hero {
  background: linear-gradient(135deg, #1f2937 0%, #374151 50%, #1f2937 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}
section.title-hero h1 {
  color: #fff;
  font-size: 2.5em;
  text-shadow: 0 2px 12px rgba(0,0,0,0.3);
  margin-bottom: 0.3em;
}
section.title-hero p {
  color: rgba(255,255,255,0.8);
  font-size: 1.3em;
}

/* --- Rich Table --- */
section.rich-table {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
section.rich-table h2 {
  text-align: center;
}
section.rich-table table {
  border-collapse: collapse;
  width: auto;
  margin: 1rem auto;
  font-size: 0.85em;
}
section.rich-table thead th {
  background: #3b82f6;
  color: #fff;
  padding: 0.7rem 1rem;
  font-weight: 600;
  border: 1px solid #3b82f6;
}
section.rich-table tbody tr:nth-child(even) {
  background: #f0f7ff;
}
section.rich-table tbody td {
  padding: 0.6rem 1rem;
  color: #374151;
  border: 1px solid #e5e7eb;
}

/* --- Rich Image Right --- */
section.rich-image-right .image-split {
  grid-template-columns: 3fr 2fr;
}

/* --- Rich Image Center --- */
section.rich-image-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.image-center-wrap {
  text-align: center;
  margin-top: 1rem;
}
.image-center-wrap img {
  max-height: 400px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  object-fit: contain;
}

/* --- Image Comparison --- */
.image-comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 1rem;
}
.comparison-item {
  text-align: center;
}
.comparison-item img {
  width: 100%;
  border-radius: 12px;
  object-fit: contain;
}
.comparison-label {
  margin-top: 0.5rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.95em;
}

/* --- Process Steps --- */
.process-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin-top: 1.5rem;
  flex-wrap: nowrap;
}
.process-step {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem 1.2rem;
  text-align: center;
  flex: 1;
  min-width: 0;
}
.process-step-number {
  font-size: 1.4em;
  font-weight: 700;
  color: #3b82f6;
  line-height: 1.2;
}
.process-step-label {
  font-size: 0.85em;
  color: #374151;
  margin-top: 0.3rem;
}
.process-arrow {
  font-size: 1.5em;
  color: #3b82f6;
  padding: 0 0.4rem;
  flex-shrink: 0;
}

/* --- Rich Quote --- */
section.rich-quote {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
section.rich-quote blockquote {
  border-left: 4px solid #3b82f6;
  padding: 1.5rem 2rem;
  margin: 1rem auto;
  max-width: 80%;
  background: #f9fafb;
  border-radius: 0 12px 12px 0;
  font-size: 1.2em;
  font-style: italic;
  color: #374151;
}
section.rich-quote blockquote p:last-child {
  font-style: normal;
  font-size: 0.85em;
  color: #6b7280;
  margin-top: 0.5rem;
}
`;
