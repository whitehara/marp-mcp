/**
 * Academic style - Methodology steps layout
 */

import type { SlideLayout } from "../../../themes/types.js";

export const methodologyLayout: SlideLayout = {
  name: "methodology",
  description: "Method step flow diagram (use 'Label|Description' format for steps)",
  params: {
    heading: {
      type: "string",
      description: "Slide heading",
      required: true,
      maxLength: 54,
    },
    steps: {
      type: "array",
      description: "Method steps in 'Label|Description' format",
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
    const steps = params.steps as string[];
    const stepItems = steps
      .map((step, i) => {
        const parts = step.split("|");
        const label = parts[0].trim();
        const desc = parts.length > 1 ? parts[1].trim() : "";
        let html = `<div class="acad-method-step">\n<div class="acad-method-step-label" style="font-size: 0.9em">${label}</div>`;
        if (desc) {
          html += `\n<div class="acad-method-step-desc" style="font-size: 0.75em">${desc}</div>`;
        }
        html += `\n</div>`;
        if (i < steps.length - 1) {
          return html + `\n<div class="acad-method-arrow">\u2192</div>`;
        }
        return html;
      })
      .join("\n");

    let slide = `## ${params.heading}\n\n<div class="acad-method-steps">\n${stepItems}\n</div>`;
    if (params.citations) {
      slide += `\n\n> ${params.citations}`;
    }
    return slide;
  },
};
