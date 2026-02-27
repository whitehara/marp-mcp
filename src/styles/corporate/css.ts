/**
 * Corporate style CSS definitions
 * Professional, business-oriented design with navy accent
 */

export const corporateCss = `
/* ===== Corporate Style for Marp ===== */

/* --- Corporate Title --- */
section.corp-title {
  background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #1d4ed8 100%);
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}
section.corp-title h1 {
  color: #ffffff;
  font-size: 2.4em;
  font-weight: 700;
  margin-bottom: 0.3em;
  text-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
section.corp-title p {
  color: rgba(255,255,255,0.85);
  font-size: 1.15em;
}

/* --- Corporate Section --- */
section.corp-section {
  background: linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 100%);
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}
section.corp-section h2 {
  color: #ffffff;
  font-size: 2em;
}
section.corp-section p {
  color: rgba(255,255,255,0.85);
}

/* --- Corporate Table --- */
section.corp-table table {
  border-collapse: collapse;
  width: 100%;
  margin: 1rem auto;
  font-size: 0.9em;
}
section.corp-table thead th {
  background: #1e3a8a;
  color: #ffffff;
  padding: 0.7rem 1rem;
  font-weight: 600;
  border: 1px solid #1e3a8a;
  text-align: left;
}
section.corp-table tbody td {
  padding: 0.6rem 1rem;
  color: #1e293b;
  border: 1px solid #cbd5e1;
  text-align: left;
}
section.corp-table tbody tr:nth-child(even) {
  background: #f8fafc;
}

/* --- Corporate Two Column --- */
.corp-2col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 1rem;
}
.corp-2col-panel {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-top: 3px solid #1e3a8a;
  border-radius: 8px;
  padding: 1.2rem;
}
.corp-2col-panel h3 {
  margin-top: 0;
  color: #1e3a8a;
  font-size: 1.05em;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.4rem;
  margin-bottom: 0.6rem;
}
.corp-2col-panel ul {
  margin: 0;
  padding-left: 1.2rem;
}
.corp-2col-panel li {
  margin-bottom: 0.3rem;
  color: #334155;
}

/* --- Corporate Three Column --- */
.corp-3col {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1.2rem;
  margin-top: 1rem;
}
.corp-3col-panel {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-top: 3px solid #0ea5e9;
  border-radius: 8px;
  padding: 1rem;
}
.corp-3col-panel h3 {
  margin-top: 0;
  color: #1e3a8a;
  font-size: 0.95em;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.3rem;
  margin-bottom: 0.5rem;
}
.corp-3col-panel ul {
  margin: 0;
  padding-left: 1.1rem;
}
.corp-3col-panel li {
  margin-bottom: 0.3rem;
  color: #334155;
  font-size: 0.9em;
}

/* --- Corporate Statistics --- */
.corp-stat-box {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}
.corp-stat-box > div {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-top: 3px solid #1e3a8a;
  border-radius: 8px;
  padding: 1.2rem 2rem;
  text-align: center;
  min-width: 140px;
  flex: 1 1 calc(33.333% - 1.5rem);
  max-width: calc(50% - 1rem);
}
.corp-stat-number {
  font-size: 2.2em;
  font-weight: 700;
  color: #1e3a8a;
  line-height: 1.1;
}
.corp-stat-label {
  font-size: 0.85em;
  color: #475569;
  margin-top: 0.3rem;
}

/* --- Corporate Process --- */
.corp-process-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin-top: 1.5rem;
  flex-wrap: nowrap;
}
.corp-process-step {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 1rem 1.2rem;
  text-align: center;
  flex: 1;
  min-width: 0;
}
.corp-process-step-number {
  font-size: 1.4em;
  font-weight: 700;
  color: #1e3a8a;
  line-height: 1.2;
}
.corp-process-step-label {
  font-size: 0.85em;
  color: #334155;
  margin-top: 0.3rem;
}
.corp-process-arrow {
  font-size: 1.3em;
  color: #0ea5e9;
  padding: 0 0.4rem;
  flex-shrink: 0;
}

/* --- Corporate Agenda --- */
.corp-agenda {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-top: 1rem;
}
.corp-agenda-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-left: 4px solid #1e3a8a;
  border-radius: 0 8px 8px 0;
  padding: 0.7rem 1rem;
}
.corp-agenda-num {
  font-size: 1.4em;
  font-weight: 700;
  color: #1e3a8a;
  min-width: 2.2rem;
  text-align: center;
}
.corp-agenda-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}
.corp-agenda-content strong {
  color: #1e293b;
  font-size: 1em;
}
.corp-agenda-dur {
  color: #64748b;
  font-size: 0.85em;
  white-space: nowrap;
}

/* --- Corporate Image Right --- */
.corp-split {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 1.5rem;
  align-items: center;
  margin-top: 1rem;
}
.corp-split img {
  width: 100%;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
}
.corp-split-content ul {
  padding-left: 1.2rem;
}
.corp-split-content li {
  margin-bottom: 0.4rem;
  color: #334155;
}

/* --- Corporate Highlight Box --- */
.corp-highlight {
  background: linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 100%);
  color: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  margin: 1.5rem auto;
  max-width: 80%;
}
.corp-highlight h3 {
  margin-top: 0;
  font-size: 1.3em;
  color: #ffffff;
}
.corp-highlight p {
  margin-bottom: 0;
  font-size: 1.05em;
  color: rgba(255,255,255,0.9);
}
`;
