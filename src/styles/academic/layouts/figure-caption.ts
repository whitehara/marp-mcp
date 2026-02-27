/**
 * Academic style - Figure with caption layout
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

export const figureCaptionLayout: SlideLayout = {
  name: "figure-caption",
  description: "Figure with numbered caption and source attribution",
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
    figNumber: {
      type: "string",
      description: "Figure number (e.g., '1', '2a')",
      required: true,
      maxLength: 5,
    },
    caption: {
      type: "string",
      description: "Figure caption text",
      required: true,
      maxLength: 100,
    },
    source: {
      type: "string",
      description: "Source attribution (e.g., 'Adapted from Smith et al., 2024')",
      required: false,
      maxLength: 100,
    },
    citations: {
      type: "string",
      description: "Citation (no line break)",
      required: false,
      maxLength: 130,
    },
  },
  template: (params) => {
    const hPx = params.citations ? 380 : 430;
    let slide = `## ${params.heading}\n\n`;
    slide += `<div class="acad-figure">\n\n`;
    slide += `![center ${getImageConstraint(params.imagePath as string, hPx)}](${params.imagePath})\n\n`;
    slide += `<div class="acad-figure-caption"><strong>Fig. ${params.figNumber}.</strong> ${params.caption}`;
    if (params.source) {
      slide += ` (${params.source})`;
    }
    slide += `</div>\n</div>`;
    if (params.citations) {
      slide += `\n\n> ${params.citations}`;
    }
    return slide;
  },
};
