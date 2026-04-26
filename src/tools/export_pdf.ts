/**
 * Tool: export_pdf
 * Exports Marp markdown content (passed directly) to PDF.
 * Returns base64-encoded data (default) or a download URL depending on EXPORT_BACKEND.
 */

import { z } from "zod";
import { runMarpFromMarkdown, injectTheme } from "../utils/marp-cli.js";
import { createErrorResponse } from "../utils/response.js";
import { saveExportBuffer } from "../export-backend.js";
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
    const result   = await saveExportBuffer(filename, buffer);

    return {
      content: [{ type: "text", text: result.message }],
      structuredContent: {
        filename,
        mime_type: "application/pdf",
        ...(result.base64    ? { data_base64:   result.base64 }    : {}),
        ...(result.downloadUrl ? { download_url: result.downloadUrl } : {}),
      },
    };
  } catch (e) {
    return createErrorResponse(e instanceof Error ? e.message : String(e));
  }
}
