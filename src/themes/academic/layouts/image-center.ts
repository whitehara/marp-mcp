/**
 * Academic theme - Image-center layout
 */

import { readFileSync } from "fs";
import { imageSize } from "image-size";
import type { SlideLayout } from "../../types.js";
import { withLengthPrompt } from "../../../utils/text-length.js";

function getImageConstraint(imagePath: string, hPx: number): string {
  try {
    const buffer = readFileSync(imagePath);
    const { width, height } = imageSize(buffer);
    if (!width || !height) return `h:${hPx}`;
    const projectedWidth = hPx * (width / height);
    if (projectedWidth > 1200) return `h:${hPx} w:1200`;
    return `h:${hPx}`;
  } catch {
    return `h:${hPx}`;
  }
}

export const imageCenterLayout: SlideLayout = {
  name: "image-center",
  description: "Slide with centered image (auto height and width constraint by content and image size)",
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

    if (params.description && params.citations) {
      slide += `![center ${getImageConstraint(params.imagePath as string, 350)}](${params.imagePath})`;
    } else if (!params.description && !params.citations) {
      slide += `![center ${getImageConstraint(params.imagePath as string, 500)}](${params.imagePath})`;
    } else {
      slide += `![center ${getImageConstraint(params.imagePath as string, 400)}](${params.imagePath})`;
    }

    if (params.description) {
      slide += `\n\n${params.description}`;
    }

    if (params.citations) {
      slide += `\n\n> ${params.citations}`;
    }

    return slide;
  },
};
