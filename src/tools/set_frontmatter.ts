/**
 * Tool: set_frontmatter
 * Ensures Marp-required frontmatter fields exist with the correct values.
 */

import { promises as fs } from "fs";
import { z } from "zod";
import { getActiveTheme } from "../themes/index.js";

interface ToolResponse {
  [x: string]: unknown;
  content: Array<{
    type: "text";
    text: string;
  }>;
}

type TargetKey = "marp" | "theme" | "header" | "paginate";

const TARGET_KEYS: TargetKey[] = ["marp", "theme", "header", "paginate"];

export const setFrontmatterSchema = z.object({
  filePath: z.string().describe("Absolute path to the Marp markdown file"),
  header: z
    .string()
    .optional()
    .describe("Optional header text. If omitted and no header exists, a blank header entry is created."),
  paginate: z
    .boolean()
    .optional()
    .describe("Optional paginate flag. If omitted and no value exists, paginate defaults to false."),
});

function splitFrontmatter(content: string): {
  frontmatterLines: string[] | null;
  body: string;
} {
  const lines = content.split("\n");

  if (lines.length === 0) {
    return { frontmatterLines: null, body: "" };
  }

  if (lines[0].trim() !== "---") {
    return { frontmatterLines: null, body: content };
  }

  const closingIndex = lines.slice(1).findIndex(line => line.trim() === "---");
  if (closingIndex === -1) {
    return { frontmatterLines: null, body: content };
  }

  const closingLine = closingIndex + 1;
  const bodyLines = lines.slice(closingLine + 1);
  return {
    frontmatterLines: lines.slice(1, closingLine),
    body: bodyLines.join("\n"),
  };
}

function extractTargetValues(lines: string[]): {
  existingValues: Partial<Record<TargetKey, string>>;
  remainingLines: string[];
} {
  const existingValues: Partial<Record<TargetKey, string>> = {};
  const remainingLines: string[] = [];

  for (const line of lines) {
    const normalized = parseKeyValue(line);
    if (normalized && TARGET_KEYS.includes(normalized.key as TargetKey)) {
      existingValues[normalized.key as TargetKey] = normalized.value;
    } else {
      remainingLines.push(line);
    }
  }

  return { existingValues, remainingLines };
}

function parseKeyValue(line: string): { key: string; value: string } | undefined {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) {
    return undefined;
  }

  const match = /^([^:]+):\s*(.*)$/.exec(trimmed);
  if (!match) {
    return undefined;
  }

  const key = match[1].trim().toLowerCase();
  const value = match[2] ?? "";
  return { key, value };
}

function formatNewHeaderValue(value: string): string {
  if (value.length === 0) {
    return '""';
  }

  if (needsQuoting(value)) {
    return `"${escapeQuotes(value)}"`;
  }

  return value;
}

function needsQuoting(value: string): boolean {
  return (
    /^\s|\s$/.test(value) ||
    /[:{}[\],&*#?|<>!=%@]/.test(value)
  );
}

function escapeQuotes(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function normalizeExistingHeaderValue(value: string | undefined): string {
  if (value === undefined) {
    return '""';
  }

  const trimmed = value.trim();
  return trimmed.length === 0 ? '""' : value;
}

function resolvePaginateValue(
  provided: boolean | undefined,
  existing: string | undefined,
): { lineValue: string; summaryValue: boolean | string } {
  if (typeof provided === "boolean") {
    return {
      lineValue: provided ? "true" : "false",
      summaryValue: provided,
    };
  }

  if (existing !== undefined) {
    const parsed = parseBoolean(existing);
    return {
      lineValue: existing,
      summaryValue: parsed ?? existing,
    };
  }

  return {
    lineValue: "false",
    summaryValue: false,
  };
}

function parseBoolean(value: string): boolean | undefined {
  const normalized = value.split("#")[0].trim().toLowerCase();
  if (normalized === "true") {
    return true;
  }
  if (normalized === "false") {
    return false;
  }
  return undefined;
}

function combineDocument(frontmatterLines: string[], body: string): string {
  const frontmatterBlock = ["---", ...frontmatterLines, "---"].join("\n");
  if (!body) {
    return `${frontmatterBlock}\n`;
  }
  const hasLeadingNewline = body.startsWith("\n");
  const separator = hasLeadingNewline ? "" : "\n\n";
  return `${frontmatterBlock}${separator}${body}`;
}

function stripOuterQuotes(value: string): string {
  if (value.length < 2) {
    return value;
  }
  const first = value[0];
  const last = value[value.length - 1];
  if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
    return value.slice(1, -1);
  }
  return value;
}

export async function setFrontmatter({
  filePath,
  header,
  paginate,
}: z.infer<typeof setFrontmatterSchema>): Promise<ToolResponse> {
  let existingContent: string;
  try {
    existingContent = await fs.readFile(filePath, "utf-8");
  } catch {
    return {
      content: [
        {
          type: "text",
          text: `Error: Could not read file at ${filePath}`,
        },
      ],
    };
  }

  const { frontmatterLines, body } = splitFrontmatter(existingContent);
  const baseLines = frontmatterLines ?? [];
  const { existingValues, remainingLines } = extractTargetValues(baseLines);

  const headerLineValue =
    header !== undefined
      ? formatNewHeaderValue(header)
      : normalizeExistingHeaderValue(existingValues.header);

  const { lineValue: paginateLineValue, summaryValue: paginateSummary } = resolvePaginateValue(
    paginate,
    existingValues.paginate,
  );

  const activeTheme = getActiveTheme().name;
  const newFrontmatterLines = [
    "marp: true",
    `theme: ${activeTheme}`,
    `header: ${headerLineValue}`,
    `paginate: ${paginateLineValue}`,
    ...remainingLines,
  ];

  const updatedContent = combineDocument(newFrontmatterLines, body);

  if (updatedContent === existingContent) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: true,
              message: "Frontmatter already satisfied requirements",
              file: filePath,
              frontmatter: {
                marp: true,
                theme: activeTheme,
                header: header ?? stripOuterQuotes(existingValues.header ?? ""),
                paginate: paginate ?? paginateSummary,
              },
            },
            null,
            2,
          ),
        },
      ],
    };
  }

  await fs.writeFile(filePath, updatedContent, "utf-8");

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            success: true,
            message: "Updated frontmatter successfully",
            file: filePath,
            frontmatter: {
              marp: true,
              theme: activeTheme,
              header: header ?? stripOuterQuotes(existingValues.header ?? ""),
              paginate: paginate ?? paginateSummary,
            },
          },
          null,
          2,
        ),
      },
    ],
  };
}
