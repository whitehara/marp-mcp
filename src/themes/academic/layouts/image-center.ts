/**
 * Academic theme - Image-center layout
 */

import type { SlideLayout } from "../../types.js";
import { withLengthPrompt } from "../../../utils/text-length.js";

export const imageCenterLayout: SlideLayout = {
  name: "image-center",
  description: "Slide with centered image (fixed h:350)",
  params: {
    heading: {
      type: "string",
      description: withLengthPrompt("Slide heading", 40),
      required: true,
      maxLength: 40,
    },
    imagePath: {
      type: "string",
      description:
        "Image file path (local paths supported, e.g., ./attachments/image.png)",
      required: true,
    },
    description: {
      type: "string",
      description: withLengthPrompt("Image description below image", 55),
      required: false,
      maxLength: 55,
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

    slide += `![center h:350](${params.imagePath})`;

    if (params.description) {
      slide += `\n\n${params.description}`;
    }

    if (params.citations) {
      slide += `\n\n> ${params.citations}`;
    }

    return slide;
  },
};
