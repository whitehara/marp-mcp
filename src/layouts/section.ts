/**
 * Section slide layout - centered title for section breaks
 */

import type { SlideLayout } from "./types.js";
import { withLengthPrompt } from "../utils/text-length.js";

export const sectionLayout: SlideLayout = {
  name: "section",
  description: "Section break slide with centered title and subtitle",
  className: "section",
  params: {
    title: {
      type: "string",
      description: withLengthPrompt("Section title", 30),
      required: true,
      maxLength: 30,
    },
    subtitle: {
      type: "string",
      description: withLengthPrompt("Section subtitle", 40),
      required: false,
      maxLength: 40,
    },
  },
  template: (params) => {
    let slide = `# ${params.title}\n`;
    if (params.subtitle) {
      slide += `## ${params.subtitle}\n`;
    }
    slide += `\n<!-- _class: section -->`;
    return slide;
  },
};
