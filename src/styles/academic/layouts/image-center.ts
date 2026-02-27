/**
 * Academic style - Image-center layout
 */

import { readFileSync } from "fs";
import { imageSize } from "image-size";
import type { SlideLayout } from "../../../themes/types.js";

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
  description: "Centered image with description",
  className: "acad-img-center",
  params: {
    heading: {
      type: "string",
      description: "Slide heading",
      required: true,
      maxLength: 54,
    },
    imagePath: {
      type: "string",
      description: "Image file path (local paths supported)",
      required: true,
    },
    description: {
      type: "string",
      description: "Image description below image (no line break)",
      required: false,
      maxLength: 75,
    },
    citations: {
      type: "string",
      description: "Citation (no line break)",
      required: false,
      maxLength: 130,
    },
  },
  template: (params) => {
    let slide = `<!-- _class: acad-img-center -->\n\n`;
    slide += `## ${params.heading}\n\n`;

    if (params.description && params.citations) {
      slide += `![center ${getImageConstraint(params.imagePath as string, 430)}](${params.imagePath})`;
    } else if (!params.description && !params.citations) {
      slide += `![center ${getImageConstraint(params.imagePath as string, 530)}](${params.imagePath})`;
    } else {
      slide += `![center ${getImageConstraint(params.imagePath as string, 480)}](${params.imagePath})`;
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
