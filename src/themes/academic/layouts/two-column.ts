/**
 * Academic theme - Two-column layout
 */

import type { SlideLayout } from "../../types.js";
import {
  formatLengthPrompt,
  withLengthPrompt,
} from "../../../utils/text-length.js";

export const twoColumnLayout: SlideLayout = {
  name: "two-column",
  description:
    "Two-column layout for comparing or discussing two topics (different from list)",
  params: {
    heading: {
      type: "string",
      description: withLengthPrompt("Slide heading", 40),
      required: true,
      maxLength: 40,
    },
    column1Heading: {
      type: "string",
      description: withLengthPrompt("Column 1 heading", 17),
      required: true,
      maxLength: 17,
    },
    column1List: {
      type: "array",
      description: `Column 1 list items (max 6 items, each ${formatLengthPrompt(
        23,
      )})`,
      required: true,
      maxItems: 6,
      maxLength: 23,
    },
    column2Heading: {
      type: "string",
      description: withLengthPrompt("Column 2 heading", 17),
      required: true,
      maxLength: 17,
    },
    column2List: {
      type: "array",
      description: `Column 2 list items (max 6 items, each ${formatLengthPrompt(
        23,
      )})`,
      required: true,
      maxItems: 6,
      maxLength: 23,
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

    slide += `> > ### ${params.column1Heading}\n> > \n`;
    params.column1List.forEach((item: string) => {
      slide += `> > - ${item}\n`;
    });

    slide += `>\n`;

    slide += `> > ### ${params.column2Heading}\n> > \n`;
    params.column2List.forEach((item: string) => {
      slide += `> > - ${item}\n`;
    });

    if (params.citations) {
      slide += `\n\n> ${params.citations}`;
    }

    return slide;
  },
};
