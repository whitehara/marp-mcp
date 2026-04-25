/**
 * Tool: export_pdf
 * Exports Marp markdown content (passed directly) to PDF and returns base64-encoded data.
 * Used by the preview_slide UI for in-browser PDF download.
 */

import { z } from "zod";
import { runMarpFromMarkdown, injectTheme } from "../utils/marp-cli.js";
import { createErrorResponse } from "../utils/response.js";
import type { ToolResponse } from "../types/common.js";

export const exportPdfSchema = z.object({
  markdown: z.string().describe("Full Marp markdown content to export as PDF"),
  theme: z
    .enum(["default", "gaia", "uncover"])
    .optional()
    .describe("Theme override. Replaces the theme in the markdown frontmatter."),
  name: z
    .string()
    .optional()
    .describe("Output filename stem without extension (e.g. 'my-slides'). Defaults to 'presentation'."),
});

export async function exportPdf({
  markdown,
  theme,
  name,
}: z.infer<typeof exportPdfSchema>): Promise<ToolResponse> {
  try {
    const md       = theme ? injectTheme(markdown, theme) : markdown;
    const buffer   = await runMarpFromMarkdown(md, { format: "pdf" });
    const filename = `${name ?? "presentation"}.pdf`;

    return {
      content: [{ type: "text", text: `PDF exported: ${filename} (${buffer.length} bytes)` }],
      structuredContent: {
        data_base64: buffer.toString("base64"),
        filename,
        mime_type: "application/pdf",
      },
    };
  } catch (e) {
    return createErrorResponse(e instanceof Error ? e.message : String(e));
  }
}
