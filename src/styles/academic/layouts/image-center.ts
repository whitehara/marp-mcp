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
    if (projectedWidth > 1200) return `w:1200`;
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
    caption: {
      type: "string",
      description: "Image caption displayed below",
      required: false,
      maxLength: 120,
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

    const hPx = params.description && params.citations ? 430 : !params.description && !params.citations ? 530 : 480;
    slide += `![center ${getImageConstraint(params.imagePath as string, hPx)}](${params.imagePath})`;

    if (params.caption) {
      slide += `\n\n<p class="acad-image-caption">${params.caption}</p>`;
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
