/**
 * Tool: set_frontmatter
 * Ensures Marp-required frontmatter fields exist with the correct values.
 */

import { promises as fs } from "fs";
import { z } from "zod";
import matter from "gray-matter";
import { getActiveTheme } from "../themes/index.js";
import { getActiveStyle } from "../styles/index.js";
import { validateFilePath } from "../utils/path-validator.js";
import type { ToolResponse } from "../types/common.js";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

type TargetKey = "marp" | "theme" | "header" | "paginate" | "style";

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

/**
 * Sets or updates Marp frontmatter fields in a markdown file.
 *
 * @param {object} options - The frontmatter options
 * @param {string} options.filePath - Absolute path to the Marp markdown file
 * @param {string} [options.header] - Optional header text
 * @param {boolean} [options.paginate] - Optional paginate flag
 * @returns {Promise<ToolResponse>} Operation result
 */
export async function setFrontmatter({
  filePath,
  header,
  paginate,
}: z.infer<typeof setFrontmatterSchema>): Promise<ToolResponse> {
  // Validate file path
  const pathError = validateFilePath(filePath);
  if (pathError) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${pathError}`,
        },
      ],
    };
  }

  let existingContent: string;
  try {
    existingContent = await fs.readFile(filePath, "utf-8");
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: Could not read file at ${filePath}: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
    };
  }

  // Check file size
  if (existingContent.length > MAX_FILE_SIZE) {
    return {
      content: [
        {
          type: "text",
          text: `Error: File too large (${existingContent.length} bytes, max ${MAX_FILE_SIZE} bytes)`,
        },
      ],
    };
  }

  // Parse existing frontmatter
  let parsed;
  try {
    parsed = matter(existingContent);
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: Invalid YAML frontmatter: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
    };
  }
  const data = parsed.data as Record<string, any>;

  // Get active theme and style
  const activeTheme = getActiveTheme().name;
  const activeStyleDef = getActiveStyle();

  // Determine header value
  const headerValue = header !== undefined
    ? header
    : (data.header !== undefined ? String(data.header) : "");

  // Determine paginate value
  const paginateValue = paginate !== undefined
    ? paginate
    : (data.paginate !== undefined ? Boolean(data.paginate) : false);

  // Update frontmatter data
  const newData: Record<string, any> = {
    ...data,
    marp: true,
    theme: activeTheme,
    header: headerValue,
    paginate: paginateValue,
  };

  // Inject style CSS if active style has CSS
  if (activeStyleDef.css) {
    newData.style = activeStyleDef.css;
  }

  // Stringify with gray-matter
  const updatedContent = matter.stringify(parsed.content, newData);

  // Check if content actually changed
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
              style: activeStyleDef.name,
              frontmatter: {
                marp: true,
                theme: activeTheme,
                header: headerValue,
                paginate: paginateValue,
              },
            },
            null,
            2,
          ),
        },
      ],
    };
  }

  // Write updated content
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
            style: activeStyleDef.name,
            frontmatter: {
              marp: true,
              theme: activeTheme,
              header: headerValue,
              paginate: paginateValue,
            },
          },
          null,
          2,
        ),
      },
    ],
  };
}
