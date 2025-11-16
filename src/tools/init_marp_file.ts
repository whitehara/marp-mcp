/**
 * Tool: init_marp_file
 * Initializes a Marp markdown file by ensuring required frontmatter fields
 * and generating slide IDs for all slides missing them.
 */

import { z } from "zod";
import { promises as fs } from "fs";
import { getActiveTheme } from "../themes/index.js";
import { ensureAllSlideIds } from "../utils/slide-id.js";

interface ToolResponse {
  [x: string]: unknown;
  content: Array<{
    type: "text";
    text: string;
  }>;
}

export const initMarpFileSchema = z.object({
  filePath: z.string().describe("Absolute path to the Marp markdown file"),
});

/**
 * Parses frontmatter from content, separating it from the body.
 * If no valid frontmatter exists, returns a default block.
 */
function parseFrontmatter(content: string): { frontmatter: string; body: string } {
  const normalized = content.trimStart();
  const lines = normalized.split("\n");

  if (lines.length === 0 || lines[0].trim() !== "---") {
    return {
      frontmatter: "---\nmarp: true\n---",
      body: normalized.trim(),
    };
  }

  const closingIndex = lines.findIndex((line, index) => index > 0 && line.trim() === "---");
  if (closingIndex === -1) {
    return {
      frontmatter: "---\nmarp: true\n---",
      body: normalized.trim(),
    };
  }

  const frontmatterLines = lines.slice(0, closingIndex + 1);
  const bodyLines = lines.slice(closingIndex + 1);

  return {
    frontmatter: frontmatterLines.join("\n"),
    body: bodyLines.join("\n").trim(),
  };
}

/**
 * Ensures required directives exist in the frontmatter.
 */
function ensureFrontmatter(frontmatter: string, themeName: string): { value: string; changed: boolean } {
  const lines = frontmatter.split("\n");
  if (lines.length === 0 || lines[0].trim() !== "---") {
    lines.unshift("---");
  }
  if (lines[lines.length - 1].trim() !== "---") {
    lines.push("---");
  }

  let changed = false;
  const hasDirective = (key: string): boolean => {
    const target = `${key.toLowerCase()}:`;
    return lines.some((line, index) => {
      if (index === 0 || index === lines.length - 1) {
        return false;
      }
      return line.trimStart().toLowerCase().startsWith(target);
    });
  };

  const addDirective = (directive: string): void => {
    lines.splice(lines.length - 1, 0, directive);
    changed = true;
  };

  if (!hasDirective("marp")) {
    addDirective("marp: true");
  }
  if (!hasDirective("theme")) {
    addDirective(`theme: ${themeName}`);
  }
  if (!hasDirective("header")) {
    addDirective("header: header");
  }
  if (!hasDirective("paginate")) {
    addDirective("paginate: true");
  }

  return { value: lines.join("\n"), changed };
}

/**
 * Joins frontmatter and slides together
 */
function joinSlides(frontmatter: string, slides: string[]): string {
  if (slides.length === 0) {
    return frontmatter;
  }

  // Trim all slides and filter out empty ones
  const processedSlides = slides
    .map(s => s.trim())
    .filter(s => s !== '');

  if (processedSlides.length === 0) {
    return frontmatter;
  }

  // Frontmatter + 2 newlines + slides joined by separator
  return frontmatter + "\n\n" + processedSlides.join("\n\n---\n\n");
}

export async function initMarpFile({
  filePath,
}: z.infer<typeof initMarpFileSchema>): Promise<ToolResponse> {
  try {
    // Read existing file
    let existingContent: string;
    try {
      existingContent = await fs.readFile(filePath, "utf-8");
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: Could not read file at ${filePath}`,
          },
        ],
      };
    }

    // Parse frontmatter and body
    const { frontmatter, body } = parseFrontmatter(existingContent);
    const themeName = getActiveTheme().name;
    const { value: ensuredFrontmatter, changed: frontmatterChanged } = ensureFrontmatter(
      frontmatter,
      themeName,
    );

    const slides = body ? body.split(/\n---\n/) : [];
    // Ensure all slides have IDs
    const { slides: updatedSlides, idToIndex } = ensureAllSlideIds(slides);

    // Check if any changes were made
    const slidesChanged = slides.some((slide, index) => slide !== updatedSlides[index]);
    const changesNeeded = slidesChanged || frontmatterChanged;

    if (!changesNeeded) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: true,
                message: "Marp file already initialized",
                totalSlides: slides.length,
                metadataUpdated: false,
                file: filePath,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    // Write updated content
    const newContent = joinSlides(ensuredFrontmatter, updatedSlides);
    await fs.writeFile(filePath, newContent, "utf-8");

    // Create ID summary
    const idSummary = Array.from(idToIndex.entries()).map(([id, index]) => ({
      position: index + 1,
      slideId: id,
    }));

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: true,
              message: "Initialized Marp file successfully",
              totalSlides: updatedSlides.length,
              idsGenerated: idSummary.length,
              metadataUpdated: frontmatterChanged,
              file: filePath,
            },
            null,
            2
          ),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error initializing Marp file: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
    };
  }
}
