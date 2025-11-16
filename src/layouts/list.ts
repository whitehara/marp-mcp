/**
 * List slide layout - bullet points
 */

import type { SlideLayout } from "./types.js";
import {
  formatLengthPrompt,
  withLengthPrompt,
} from "../utils/text-length.js";

export const listLayout: SlideLayout = {
  name: "list",
  description: "List slide with bullet points (max 8 items)",
  params: {
    heading: {
      type: "string",
      description: withLengthPrompt("Slide heading", 40),
      required: true,
      maxLength: 40,
    },
    list: {
      type: "array",
      description: `List items (max 8 items, each ${formatLengthPrompt(50)})`,
      required: true,
      maxItems: 8,
      maxLength: 50,
    },
    citations: {
      type: "string",
      description: withLengthPrompt("Citation", 50, {
        note: "no line break",
      }),
      required: false,
      maxLength: 50,
    },
  },
  template: (params) => {
    let slide = "";
    if (params.heading) {
      slide += `## ${params.heading}\n\n`;
    }

    // List items
    params.list.forEach((item: string) => {
      slide += `- ${item}\n`;
    });

    // Citation (single, no line break)
    if (params.citations) {
      slide += `\n> ${params.citations}`;
    }

    return slide;
  },
};
