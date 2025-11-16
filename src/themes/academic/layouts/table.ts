/**
 * Academic theme - Table layout
 */

import type { SlideLayout } from "../../types.js";
import { withLengthPrompt } from "../../../utils/text-length.js";

export const tableLayout: SlideLayout = {
  name: "table",
  description: "Table slide with fixed center-tiny layout",
  params: {
    heading: {
      type: "string",
      description: withLengthPrompt("Slide heading", 40),
      required: true,
      maxLength: 40,
    },
    tableMarkdown: {
      type: "string",
      description:
        "Table in markdown format (max 7 rows excluding header, total ~40 chars/~23 Japanese chars across columns recommended)",
      required: true,
    },
    description: {
      type: "string",
      description: withLengthPrompt("Table description below table", 55, {
        note: "no line break",
      }),
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

    slide += params.tableMarkdown;

    if (params.description) {
      slide += `\n\n${params.description}`;
    }

    slide += `\n\n<!-- _class: table-center table-tiny -->`;

    if (params.citations) {
      slide += `\n\n> ${params.citations}`;
    }

    return slide;
  },
};
