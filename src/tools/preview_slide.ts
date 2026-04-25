import {
  RESOURCE_MIME_TYPE,
  registerAppResource,
  registerAppTool,
} from "@modelcontextprotocol/ext-apps/server";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { readFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { z } from "zod";

const __dirname = dirname(fileURLToPath(import.meta.url));
// Compiled to build/tools/preview_slide.js → HTML is at build/mcp-app.html
const HTML_PATH   = join(__dirname, "../mcp-app.html");
const RESOURCE_URI = "ui://marp-mcp/preview.html";

const BUILT_IN_THEMES = ["default", "gaia", "uncover"] as const;

// Cache HTML after first read
let htmlCache: string | null = null;
async function loadHtml(): Promise<string> {
  if (!htmlCache) {
    try {
      htmlCache = await readFile(HTML_PATH, "utf-8");
    } catch {
      htmlCache = '<!DOCTYPE html><html><body><p>UI not built. Run "npm run build".</p></body></html>';
    }
  }
  return htmlCache;
}

/**
 * Registers the preview_slide App Tool and its UI resource on the given server.
 * Must be called inside createMcpServer() for each new server instance.
 */
export function registerPreviewSlide(server: McpServer): void {
  registerAppResource(
    server,
    RESOURCE_URI,
    RESOURCE_URI,
    { mimeType: RESOURCE_MIME_TYPE },
    async () => ({
      contents: [{
        uri: RESOURCE_URI,
        mimeType: RESOURCE_MIME_TYPE,
        text: await loadHtml(),
        _meta: {
          ui: {
            csp: {
              resourceDomains: [
                "https://cdn.jsdelivr.net",
                "https://esm.sh",
              ],
              connectDomains: ["https://esm.sh"],
            },
          },
        },
      }],
    }),
  );

  registerAppTool(
    server,
    "preview_slide",
    {
      description:
        "Preview a Marp markdown presentation in an interactive UI. " +
        "Displays slides with page navigation, theme switching (default/gaia/uncover), " +
        "and Markdown download. Always validate with validate_slide before previewing.",
      inputSchema: {
        markdown: z.string().describe("Full Marp markdown text (including frontmatter)"),
        theme: z.enum(BUILT_IN_THEMES)
          .optional()
          .describe("Built-in Marp theme to use (default, gaia, uncover). Defaults to default."),
        name: z
          .string()
          .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens")
          .optional()
          .describe("Slide name used as download filename (e.g. 'my-slides'). Defaults to 'slide'."),
      },
      outputSchema: z.object({
        markdown: z.string(),
        theme:    z.string(),
        name:     z.string(),
      }),
      _meta: { ui: { resourceUri: RESOURCE_URI } },
    },
    async ({ markdown, theme, name }) => {
      const resolvedTheme = theme ?? "default";
      const resolvedName  = name  ?? "slide";
      return {
        structuredContent: { markdown, theme: resolvedTheme, name: resolvedName },
        content: [{
          type: "text" as const,
          text: JSON.stringify({ markdown, theme: resolvedTheme, name: resolvedName }),
        }],
      };
    },
  );
}
