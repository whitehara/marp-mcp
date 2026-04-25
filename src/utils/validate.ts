/**
 * Slide overflow validation utilities.
 * Ported from iwamot/marp-agent-mcp, logic synchronized with
 * minorun365/marp-agent output_slide.py.
 */

import { eastAsianWidth } from "get-east-asian-width";
import { parseFrontmatter, splitSlides } from "./frontmatter.js";
import {
  MAX_DISPLAY_WIDTH_PER_LINE,
  MAX_LINES_PER_SLIDE,
  MAX_TABLE_ROW_WIDTH,
} from "./constants.js";

export interface LineOverflow {
  type: "line_overflow";
  slide_number: number;
  line_count: number;
  max_lines: number;
  excess: number;
}

export interface TableOverflow {
  type: "table_overflow";
  slide_number: number;
  max_width: number;
  limit: number;
  excess: number;
}

export type Violation = LineOverflow | TableOverflow;

/** Returns display width of a string in half-width character units. */
export function getDisplayWidth(text: string): number {
  let width = 0;
  for (const char of text) {
    const codePoint = char.codePointAt(0);
    if (codePoint !== undefined) {
      width += eastAsianWidth(codePoint, { ambiguousAsWide: true });
    }
  }
  return width;
}

/** Strips common Markdown inline formatting for width calculation. */
export function stripMarkdownFormatting(text: string): string {
  let result = text;
  result = result.replace(/\*\*(.+?)\*\*/g, "$1");
  result = result.replace(/__(.+?)__/g, "$1");
  result = result.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "$1");
  result = result.replace(/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, "$1");
  result = result.replace(/~~(.+?)~~/g, "$1");
  result = result.replace(/`(.+?)`/g, "$1");
  result = result.replace(/\[(.+?)\]\(.+?\)/g, "$1");
  result = result.replace(/^[-*+]\s+/, "");
  result = result.replace(/^\d+\.\s+/, "");
  result = result.replace(/^#{1,6}\s+/, "");
  result = result.replace(/^>\s*/, "");
  return result;
}

/**
 * Estimates how many visual lines a single text line occupies,
 * accounting for line wrapping at MAX_DISPLAY_WIDTH_PER_LINE.
 */
export function estimateVisualLines(text: string): number {
  const stripped = text.trim();
  // Table rows count as 1 line regardless of width
  if (stripped.startsWith("|") && stripped.endsWith("|")) {
    return 1;
  }
  const displayText = stripMarkdownFormatting(stripped);
  const width = getDisplayWidth(displayText);
  if (width <= MAX_DISPLAY_WIDTH_PER_LINE) {
    return 1;
  }
  return Math.ceil(width / MAX_DISPLAY_WIDTH_PER_LINE);
}

/**
 * Counts the total visual line count of a slide's content,
 * skipping code blocks, HTML comments, and table separator rows.
 */
export function countContentLines(slideContent: string): number {
  const lines = slideContent.split("\n");
  let count = 0;
  let inCodeBlock = false;

  for (const line of lines) {
    const stripped = line.trim();
    if (stripped.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (!stripped) continue;
    if (
      stripped.startsWith("<!--") &&
      stripped.endsWith("-->") &&
      !stripped.slice(4, -3).includes("-->")
    ) continue;
    if (/^\|[\s\-:|]+\|$/.test(stripped)) continue;
    count += estimateVisualLines(stripped);
  }
  return count;
}

/**
 * Returns the maximum display width of table rows in a slide that exceed
 * MAX_TABLE_ROW_WIDTH, or 0 if no table overflow exists.
 */
export function checkTableWidth(slideContent: string): number {
  let maxWidth = 0;
  for (const line of slideContent.split("\n")) {
    const stripped = line.trim();
    if (!(stripped.startsWith("|") && stripped.endsWith("|"))) continue;
    if (/^\|[\s\-:|]+\|$/.test(stripped)) continue;
    const width = getDisplayWidth(stripped);
    if (width > MAX_TABLE_ROW_WIDTH) {
      maxWidth = Math.max(maxWidth, width);
    }
  }
  return maxWidth;
}

/**
 * Validates a full Marp markdown document for slide overflow.
 * Skips slides with _class: top/lead/end/tinytext.
 */
export function checkSlideOverflow(markdown: string): Violation[] {
  const { body } = parseFrontmatter(markdown);
  const slides = splitSlides(body);
  const violations: Violation[] = [];

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const slideNumber = i + 1;

    if (/_class:\s*(top|lead|end|tinytext)/.test(slide)) continue;

    const lineCount = countContentLines(slide);
    if (lineCount > MAX_LINES_PER_SLIDE) {
      violations.push({
        type: "line_overflow",
        slide_number: slideNumber,
        line_count: lineCount,
        max_lines: MAX_LINES_PER_SLIDE,
        excess: lineCount - MAX_LINES_PER_SLIDE,
      });
    }

    const tableMaxWidth = checkTableWidth(slide);
    if (tableMaxWidth > 0) {
      violations.push({
        type: "table_overflow",
        slide_number: slideNumber,
        max_width: tableMaxWidth,
        limit: MAX_TABLE_ROW_WIDTH,
        excess: tableMaxWidth - MAX_TABLE_ROW_WIDTH,
      });
    }
  }
  return violations;
}
