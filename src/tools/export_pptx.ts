/**
 * Tool: export_pptx
 * Exports Marp markdown content (passed directly) to PPTX and returns base64-encoded data.
 * Used by the preview_slide UI for in-browser PPTX download.
 */

import { z } from "zod";
import { runMarpFromMarkdown, injectTheme } from "../utils/marp-cli.js";
import { createErrorResponse } from "../utils/response.js";
import type { ToolResponse } from "../types/common.js";

export const exportPptxSchema = z.object({
  markdown: z.string().describe("Full Marp markdown content to export as PPTX"),
  theme: z
    .enum(["default", "gaia", "uncover"])
    .optional()
    .describe("Theme override. Replaces the theme in the markdown frontmatter."),
  name: z
    .string()
    .optional()
    .describe("Output filename stem without extension (e.g. 'my-slides'). Defaults to 'presentation'."),
  editable: z
    .boolean()
    .optional()
    .describe(
      "[EXPERIMENTAL] Generate editable PPTX with actual text/shapes instead of pre-rendered images. " +
        "Requires LibreOffice. May have lower slide reproducibility."
    ),
});

export async function exportPptx({
  markdown,
  theme,
  name,
  editable,
}: z.infer<typeof exportPptxSchema>): Promise<ToolResponse> {
  try {
    const md       = theme ? injectTheme(markdown, theme) : markdown;
    const buffer   = await runMarpFromMarkdown(md, { format: "pptx", editable });
    const filename = `${name ?? "presentation"}.pptx`;
    const label    = editable ? "PPTX (editable)" : "PPTX";

    return {
      content: [{ type: "text", text: `${label} exported: ${filename} (${buffer.length} bytes)` }],
      structuredContent: {
        data_base64: buffer.toString("base64"),
        filename,
        mime_type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      },
    };
  } catch (e) {
    return createErrorResponse(e instanceof Error ? e.message : String(e));
  }
}
