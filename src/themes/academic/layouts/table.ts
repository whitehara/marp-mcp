/**
 * Academic theme - Table layout
 */

import type { SlideLayout } from "../../types.js";
import { withLengthPrompt } from "../../../utils/text-length.js";

function countTableRows(tableMarkdown: string): number {
  const lines = tableMarkdown.trim().split('\n');
  const tableLines = lines.filter(line => line.trim().startsWith('|'));
  return Math.max(0, tableLines.length - 2);
}

function getTableSizeClass(rowCount: number): string {
  if (rowCount >= 7) return 'table-tiny';
  if (rowCount >= 6) return 'table-small';
  if (rowCount >= 5) return '';
  return 'table-large';
}

export const tableLayout: SlideLayout = {
  name: "table",
  description: "Table slide with auto font-size class",
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
        "Table in markdown format (max 8 rows excluding header, keep content concise for better width fit)",
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

    const rowCount = countTableRows(params.tableMarkdown as string);
    const sizeClass = getTableSizeClass(rowCount);
    const classList = ['table-center', sizeClass].filter(Boolean).join(' ');
    slide += `\n\n<!-- _class: ${classList} -->`;

    if (params.citations) {
      slide += `\n\n> ${params.citations}`;
    }

    return slide;
  },
};
