/**
 * Tool: manage_slide
 * Manage slides in a Marp presentation file (insert, replace, delete) using slide IDs
 */

import { z } from "zod";
import { promises as fs } from "fs";
import { getLayout, getLayoutNames } from "./list_layouts.js";
import { ensureSlideId, findSlideIndexById, generateSlideId } from "../utils/slide-id.js";
import { validateFilePath } from "../utils/path-validator.js";
import { parseFrontmatter, splitSlides, joinSlides } from "../utils/frontmatter.js";
import { MAX_FILE_SIZE } from "../utils/constants.js";
import { createErrorResponse, createSuccessResponse } from "../utils/response.js";
import type { ToolResponse } from "../types/common.js";

export const manageSlideSchema = z.object({
  filePath: z.string().describe("Absolute path to the Marp markdown file"),
  layoutType: z.string().optional().describe("Layout type to use (title, lead, content, table, multi-column, quote). Not required for delete mode."),
  params: z.record(z.any()).optional().describe("Parameters for the layout template. Not required for delete mode."),
  mode: z.enum(["insert", "replace", "delete"]).optional().describe("Operation mode: insert (default), replace, or delete"),
  position: z.enum(["end", "start", "after", "before"]).optional().describe("Position for insertion: end (default), start, after, before"),
  slideId: z.string().optional().describe("Slide ID for 'after', 'before' position, 'replace' mode, or 'delete' mode"),
  note: z
    .string()
    .optional()
    .describe("Optional speaker notes appended to the slide as an HTML comment block"),
});

/**
 * Ensures all slides in the array have IDs
 */
function ensureAllSlidesHaveIds(slides: string[]): string[] {
  return slides.map(slide => ensureSlideId(slide).content);
}

/**
 * Reads a Marp file and returns parsed frontmatter and slides with IDs.
 * Handles file read errors and size validation.
 */
async function readAndParseSlides(filePath: string): Promise<
  | { ok: true; frontmatter: string; slides: string[] }
  | { ok: false; response: ToolResponse }
> {
  let existingContent: string;

  try {
    existingContent = await fs.readFile(filePath, "utf-8");
  } catch (error) {
    return {
      ok: false,
      response: createErrorResponse(
        `Could not read file at ${filePath}: ${error instanceof Error ? error.message : String(error)}`
      ),
    };
  }

  if (existingContent.length > MAX_FILE_SIZE) {
    return {
      ok: false,
      response: createErrorResponse(
        `File too large (${existingContent.length} bytes, max ${MAX_FILE_SIZE} bytes)`
      ),
    };
  }

  const { frontmatter, body } = parseFrontmatter(existingContent);
  let slides = splitSlides(body);
  slides = ensureAllSlidesHaveIds(slides);

  return { ok: true, frontmatter, slides };
}

/**
 * Appends speaker notes to slide content as an HTML comment block.
 *
 * @param slideContent - The slide content
 * @param note - Optional speaker notes to append
 * @returns The slide content with appended notes if provided, otherwise unchanged
 */
function appendSlideNote(slideContent: string, note?: string): string {
  if (note === undefined || note.length === 0) {
    return slideContent;
  }

  const normalizedNote = note.replace(/\r\n/g, "\n");
  const trimmedContent = slideContent.trimEnd();
  const separator = trimmedContent.length > 0 ? "\n\n" : "";
  return `${trimmedContent}${separator}<!--\n${normalizedNote}\n-->`;
}

/**
 * MCP Tool: Manages slides in a Marp presentation file.
 * Supports inserting, replacing, and deleting slides using slide IDs.
 *
 * @param {object} options - The slide management options
 * @param {string} options.filePath - Absolute path to the Marp markdown file
 * @param {string} [options.layoutType] - Layout type to use (title, lead, content, etc.)
 * @param {Record<string, any>} [options.params] - Parameters for the layout template
 * @param {"insert" | "replace" | "delete"} [options.mode="insert"] - Operation mode
 * @param {"end" | "start" | "after" | "before"} [options.position="end"] - Position for insertion
 * @param {string} [options.slideId] - Slide ID for 'after', 'before', 'replace', or 'delete' operations
 * @param {string} [options.note] - Optional speaker notes to append
 * @returns {Promise<ToolResponse>} Operation result with slide information
 */
export async function manageSlide({
  filePath,
  layoutType,
  params,
  mode = "insert",
  position = "end",
  slideId,
  note,
}: z.infer<typeof manageSlideSchema>): Promise<ToolResponse> {
  // Validate file path
  const pathError = validateFilePath(filePath);
  if (pathError) {
    return createErrorResponse(pathError);
  }

  // Handle delete mode separately
  if (mode === "delete") {
    if (!slideId) {
      return createErrorResponse("slideId is required for delete mode");
    }

    try {
      const result = await readAndParseSlides(filePath);
      if (!result.ok) return result.response;

      const { frontmatter, slides } = result;
      const slideIndex = findSlideIndexById(slides, slideId);

      if (slideIndex === -1) {
        return createErrorResponse(`Slide with ID "${slideId}" not found`);
      }

      // Remove the slide
      slides.splice(slideIndex, 1);
      const newContent = joinSlides(frontmatter, slides);
      await fs.writeFile(filePath, newContent, "utf-8");

      return createSuccessResponse({
        operation: `Deleted slide with ID ${slideId}`,
        totalSlides: slides.length,
        file: filePath,
      });
    } catch (error) {
      return createErrorResponse(
        `Error deleting slide: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  // For insert/replace modes, layoutType and params are required
  if (!layoutType) {
    return createErrorResponse("layoutType is required for insert/replace modes");
  }

  const layout = getLayout(layoutType);

  if (!layout) {
    return createErrorResponse(
      `Unknown layout type "${layoutType}". Available layouts: ${getLayoutNames().join(", ")}`
    );
  }

  // Validate required parameters
  const missingParams: string[] = [];
  for (const [paramName, paramDef] of Object.entries(layout.params)) {
    if (paramDef.required && (!params || !params[paramName])) {
      missingParams.push(paramName);
    }
  }

  if (missingParams.length > 0) {
    return createErrorResponse(`Missing required parameters: ${missingParams.join(", ")}`);
  }

  // Validate parameter types and constraints
  if (params) {
    for (const [paramName, value] of Object.entries(params)) {
      const paramDef = layout.params[paramName];
      if (!paramDef) continue;

      if (paramDef.type === "string" && typeof value !== "string") {
        return createErrorResponse(`Parameter "${paramName}" must be a string`);
      }

      if (paramDef.type === "array" && !Array.isArray(value)) {
        return createErrorResponse(`Parameter "${paramName}" must be an array`);
      }

      if (paramDef.type === "number" && typeof value !== "number") {
        return createErrorResponse(`Parameter "${paramName}" must be a number`);
      }

      if (paramDef.type === "string" && paramDef.maxLength && typeof value === "string") {
        if (value.length > paramDef.maxLength) {
          return createErrorResponse(
            `Parameter "${paramName}" exceeds maximum length of ${paramDef.maxLength} characters (current: ${value.length})`
          );
        }
      }

      if (paramDef.type === "array" && paramDef.maxItems && Array.isArray(value)) {
        if (value.length > paramDef.maxItems) {
          return createErrorResponse(
            `Parameter "${paramName}" exceeds maximum items of ${paramDef.maxItems} (current: ${value.length})`
          );
        }
      }
    }
  }

  // Validate slideId for operations that require it
  if ((position === "after" || position === "before" || mode === "replace") && !slideId) {
    return createErrorResponse(
      `slideId is required for position "${position}" or mode "${mode}"`
    );
  }

  // Generate slide content
  try {
    const slideContent = appendSlideNote(layout.template(params || {}), note);

    const result = await readAndParseSlides(filePath);
    if (!result.ok) return result.response;

    const { frontmatter, slides } = result;

    let newContent: string;
    let operation: string;
    let resultSlideId: string;

    if (mode === "replace") {
      if (!slideId) {
        return createErrorResponse("slideId is required for replace mode");
      }

      const slideIndex = findSlideIndexById(slides, slideId);

      if (slideIndex === -1) {
        return createErrorResponse(`Slide with ID "${slideId}" not found`);
      }

      // Keep the same ID for replaced slide
      const slideWithId = `<!-- slide-id: ${slideId} -->\n\n${slideContent}`;
      slides[slideIndex] = slideWithId;
      newContent = joinSlides(frontmatter, slides);
      operation = `Replaced slide with ID ${slideId}`;
      resultSlideId = slideId;
    } else {
      // Insert mode - generate new ID
      const newSlideId = generateSlideId();
      const slideWithId = `<!-- slide-id: ${newSlideId} -->\n\n${slideContent}`;

      let insertIndex: number;

      if (position === "start") {
        insertIndex = 0;
      } else if (position === "end") {
        insertIndex = slides.length;
      } else if (position === "after") {
        if (!slideId) {
          return createErrorResponse('slideId is required for position "after"');
        }

        const refIndex = findSlideIndexById(slides, slideId);
        if (refIndex === -1) {
          return createErrorResponse(`Slide with ID "${slideId}" not found`);
        }

        insertIndex = refIndex + 1;
      } else if (position === "before") {
        if (!slideId) {
          return createErrorResponse('slideId is required for position "before"');
        }

        const refIndex = findSlideIndexById(slides, slideId);
        if (refIndex === -1) {
          return createErrorResponse(`Slide with ID "${slideId}" not found`);
        }

        insertIndex = refIndex;
      } else {
        insertIndex = slides.length;
      }

      slides.splice(insertIndex, 0, slideWithId);
      newContent = joinSlides(frontmatter, slides);
      operation = `Inserted slide at position ${insertIndex + 1} (${position})`;
      resultSlideId = newSlideId;
    }

    // Write updated content
    await fs.writeFile(filePath, newContent, "utf-8");

    return createSuccessResponse({
      operation,
      slideId: resultSlideId,
      layoutType,
      totalSlides: slides.length,
      file: filePath,
    });
  } catch (error) {
    return createErrorResponse(
      `Error managing slide: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
