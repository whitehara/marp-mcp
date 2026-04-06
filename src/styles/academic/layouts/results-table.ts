import type { SlideLayout } from "../../../themes/types.js";

export const resultsTableLayout: SlideLayout = {
  name: "results-table",
  description: "Results table with best-value highlighting (prefix cell with * to highlight)",
  params: {
    heading: {
      type: "string",
      description: "Slide heading",
      required: true,
      maxLength: 80,
    },
    headers: {
      type: "array",
      description: "Table column headers",
      required: true,
      maxItems: 8,
    },
    rows: {
      type: "array",
      description: "Table rows as pipe-separated values (prefix with * to highlight, e.g. 'Model A|*95.2|88.1')",
      required: true,
      maxItems: 10,
    },
    caption: {
      type: "string",
      description: "Table caption (e.g. 'Table 1: Results on benchmark dataset')",
      required: false,
      maxLength: 200,
    },
  },
  template: (params) => {
    const headers = params.headers as string[];
    const rows = params.rows as string[];

    const headerRow = headers.map((h) => `<th>${h.trim()}</th>`).join("");
    const bodyRows = rows
      .map((row) => {
        const cells = row.split("|").map((cell) => {
          const trimmed = cell.trim();
          if (trimmed.startsWith("*")) {
            return `<td class="acad-highlight-cell">${trimmed.substring(1).trim()}</td>`;
          }
          return `<td>${trimmed}</td>`;
        });
        return `<tr>${cells.join("")}</tr>`;
      })
      .join("\n");

    let slide = `## ${params.heading}\n\n`;
    if (params.caption) {
      slide += `<p class="acad-table-caption">${params.caption}</p>\n\n`;
    }
    slide += `<table class="acad-results-table" style="font-size: 0.85em">\n<thead><tr>${headerRow}</tr></thead>\n<tbody>\n${bodyRows}\n</tbody>\n</table>`;

    return slide;
  },
};
