/**
 * Tool: export_pptx
 * Exports Marp markdown content (passed directly) to PPTX.
 * Returns base64-encoded data (default) or a download URL depending on EXPORT_BACKEND.
 */

import { z } from "zod";
import { runMarpFromMarkdown, injectTheme } from "../utils/marp-cli.js";
import { createErrorResponse } from "../utils/response.js";
import { saveExportBuffer } from "../export-backend.js";
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
    const result   = await saveExportBuffer(filename, buffer);

    return {
      content: [{ type: "text", text: `${label}: ${result.message}` }],
      structuredContent: {
        filename,
        mime_type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        ...(result.base64    ? { data_base64:   result.base64 }    : {}),
        ...(result.downloadUrl ? { download_url: result.downloadUrl } : {}),
      },
    };
  } catch (e) {
    return createErrorResponse(e instanceof Error ? e.message : String(e));
  }
}
