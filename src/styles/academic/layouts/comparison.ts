/**
 * Academic style - Comparison layout
 */

import type { SlideLayout } from "../../../themes/types.js";

export const comparisonLayout: SlideLayout = {
  name: "comparison",
  description: "Side-by-side comparison (e.g., conventional vs proposed method)",
  params: {
    heading: {
      type: "string",
      description: "Slide heading",
      required: true,
      maxLength: 54,
    },
    leftTitle: {
      type: "string",
      description: "Left panel title (e.g., 'Conventional Method')",
      required: true,
      maxLength: 40,
    },
    leftList: {
      type: "array",
      description: "Left panel list items",
      required: true,
      maxItems: 6,
    },
    rightTitle: {
      type: "string",
      description: "Right panel title (e.g., 'Proposed Method')",
      required: true,
      maxLength: 40,
    },
    rightList: {
      type: "array",
      description: "Right panel list items",
      required: true,
      maxItems: 6,
    },
    citations: {
      type: "string",
      description: "Citation (no line break)",
      required: false,
      maxLength: 130,
    },
  },
  template: (params) => {
    const renderPanel = (title: unknown, items: unknown) => {
      let html = `<div class="acad-comparison-panel">`;
      if (title) {
        html += `\n<h3>${title}</h3>`;
      }
      if (Array.isArray(items) && items.length > 0) {
        html += `\n<ul>\n${items.map((item) => `<li>${item}</li>`).join("\n")}\n</ul>`;
      }
      html += `\n</div>`;
      return html;
    };

    const left = renderPanel(params.leftTitle, params.leftList);
    const right = renderPanel(params.rightTitle, params.rightList);

    let slide = `## ${params.heading}\n\n<div class="acad-comparison">\n${left}\n${right}\n</div>`;
    if (params.citations) {
      slide += `\n\n> ${params.citations}`;
    }
    return slide;
  },
};
