/**
 * Tool: generate_slide_ids
 * Ensures every slide in a Marp markdown file has a slide ID comment.
 * This tool intentionally does not modify frontmatter.
 */

import { z } from "zod";
import { promises as fs } from "fs";
import { ensureAllSlideIds } from "../utils/slide-id.js";

interface ToolResponse {
  [x: string]: unknown;
  content: Array<{
    type: "text";
    text: string;
  }>;
}

export const generateSlideIdsSchema = z.object({
  filePath: z.string().describe("Absolute path to the Marp markdown file"),
});

function splitFrontmatter(content: string): { frontmatter: string; body: string } {
  const lines = content.split("\n");

  if (lines.length === 0) {
    return { frontmatter: "", body: "" };
  }

  if (lines[0].trim() !== "---") {
    return { frontmatter: "", body: content };
  }

  const closingIndex = lines.slice(1).findIndex(line => line.trim() === "---");
  if (closingIndex === -1) {
    return { frontmatter: "", body: content };
  }

  const closingLine = closingIndex + 1;
  const frontmatterLines = lines.slice(0, closingLine + 1);
  const bodyLines = lines.slice(closingLine + 1);

  return {
    frontmatter: frontmatterLines.join("\n"),
    body: bodyLines.join("\n"),
  };
}

function joinSlides(frontmatter: string, slides: string[]): string {
  if (slides.length === 0) {
    return frontmatter.trim() ? frontmatter : "";
  }

  const processedSlides = slides
    .map(slide => slide.trim())
    .filter(slide => slide.length > 0);

  const slidesContent = processedSlides.join("\n\n---\n\n");

  if (!frontmatter.trim()) {
    return slidesContent;
  }

  const cleanedFrontmatter = frontmatter.replace(/\s+$/, "");
  return slidesContent ? `${cleanedFrontmatter}\n\n${slidesContent}` : cleanedFrontmatter;
}

export async function generateSlideIds({
  filePath,
}: z.infer<typeof generateSlideIdsSchema>): Promise<ToolResponse> {
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

    const { frontmatter, body } = splitFrontmatter(existingContent);
    const trimmedBody = body.trim();
    const slides = trimmedBody ? trimmedBody.split(/\n---\n/) : [];

    // Ensure all slides have IDs
    const { slides: updatedSlides, idToIndex } = ensureAllSlideIds(slides);

    // Check if any changes were made
    const slidesChanged = slides.some((slide, index) => slide !== updatedSlides[index]);
    if (!slidesChanged) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: true,
                message: "All slides already have IDs",
                totalSlides: slides.length,
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
    const newContent = joinSlides(frontmatter, updatedSlides);
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
              message: "Generated slide IDs successfully",
              totalSlides: updatedSlides.length,
              idsGenerated: idSummary.length,
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
          text: `Error generating slide IDs: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
    };
  }
}
