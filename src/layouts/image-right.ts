/**
 * Image-right layout - content list with background image on right
 */

import type { SlideLayout } from "./types.js";
import {
  formatLengthPrompt,
  withLengthPrompt,
} from "../utils/text-length.js";

export const imageRightLayout: SlideLayout = {
  name: "image-right",
  description: "Slide with image on right and content list (allows more explanation than image-center)",
  params: {
    heading: {
      type: "string",
      description: withLengthPrompt("Slide heading", 17),
      required: true,
      maxLength: 17,
    },
    list: {
      type: "array",
      description: `List items (max 8 items, each ${formatLengthPrompt(23)})`,
      required: true,
      maxItems: 8,
      maxLength: 23,
    },
    imagePath: {
      type: "string",
      description: "Image file path (local paths supported, e.g., ./attachments/image.png)",
      required: true,
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

    // Fixed background image: bg right:50% contain
    slide += `\n![bg right:50% contain](${params.imagePath})`;

    // Citation (single, no line break)
    if (params.citations) {
      slide += `\n\n> ${params.citations}`;
    }

    return slide;
  },
};
