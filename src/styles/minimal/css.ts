/**
 * Minimal style CSS definitions
 * Clean, flat design with typography focus
 */

export const minimalCss = `
/* ===== Minimal Style for Marp ===== */

/* --- Minimal Title --- */
section.min-title {
  background: #111827;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}
section.min-title h1 {
  color: #ffffff;
  font-size: 2.5em;
  font-weight: 700;
  margin-bottom: 0.3em;
}
section.min-title p {
  color: rgba(255,255,255,0.7);
  font-size: 1.1em;
}

/* --- Minimal Section --- */
section.min-section {
  background: #111827;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}
section.min-section h2 {
  color: #ffffff;
  font-size: 2em;
}
section.min-section p {
  color: rgba(255,255,255,0.7);
}

/* --- Minimal Table --- */
section.min-table table {
  border-collapse: collapse;
  width: 100%;
  margin: 1rem auto;
  font-size: 0.9em;
}
section.min-table thead th {
  background: #111827;
  color: #ffffff;
  padding: 0.7rem 1rem;
  font-weight: 600;
  border: 1px solid #111827;
  text-align: left;
}
section.min-table tbody td {
  padding: 0.6rem 1rem;
  color: #111827;
  border: 1px solid #e5e7eb;
  text-align: left;
}
section.min-table tbody tr:nth-child(even) {
  background: #f9fafb;
}

/* --- Minimal Image Right --- */
.min-split {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 1.5rem;
  align-items: center;
  margin-top: 1rem;
}
.min-split img {
  width: 100%;
  object-fit: cover;
}
.min-split-content ul {
  padding-left: 1.2rem;
}
.min-split-content li {
  margin-bottom: 0.4rem;
  color: #111827;
}

/* --- Minimal Image Center --- */
section.min-img-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.min-image-center-wrap {
  text-align: center;
  margin-top: 1rem;
}
.min-image-center-wrap img {
  max-height: 380px;
  object-fit: contain;
}

/* --- Minimal Quote --- */
section.min-quote {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
section.min-quote blockquote {
  border-left: 3px solid #2563eb;
  padding: 1.2rem 1.8rem;
  margin: 1rem auto;
  max-width: 85%;
  font-size: 1.2em;
  font-style: italic;
  color: #374151;
  background: transparent;
}
section.min-quote blockquote p:last-child {
  font-style: normal;
  font-size: 0.85em;
  color: #6b7280;
  margin-top: 0.5rem;
}

/* --- Minimal Two Column --- */
.min-2col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 1rem;
}
.min-2col-left {
  border-right: 1px solid #e5e7eb;
  padding-right: 1.5rem;
}
.min-2col-right {
  padding-left: 0.5rem;
}
.min-2col h3 {
  color: #111827;
  font-size: 1em;
  margin-top: 0;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.3rem;
}
.min-2col ul {
  padding-left: 1.2rem;
  margin: 0;
}
.min-2col li {
  margin-bottom: 0.3rem;
  color: #374151;
}

/* --- Minimal Big Statement --- */
section.min-statement {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: #ffffff;
}
section.min-statement h1 {
  color: #111827;
  font-size: 3em;
  font-weight: 800;
  line-height: 1.1;
  max-width: 80%;
}
section.min-statement p {
  color: #6b7280;
  font-size: 1.1em;
  margin-top: 0.5rem;
}
`;
