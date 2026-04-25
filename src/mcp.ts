/**
 * MCP Server setup and startup
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import cors from "cors";
import type { Request, Response } from "express";
import { getActiveTheme } from "./themes/index.js";
import { getActiveStyle } from "./styles/index.js";
import { info, error as logError } from "./utils/logger.js";

import {
  listLayoutsSchema,
  listLayouts,
} from "./tools/list_layouts.js";
import {
  manageSlideSchema,
  manageSlide,
} from "./tools/manage_slide.js";
import {
  generateSlideIdsSchema,
  generateSlideIds,
} from "./tools/generate_slide_ids.js";
import {
  setFrontmatterSchema,
  setFrontmatter,
} from "./tools/set_frontmatter.js";
import {
  readSlideSchema,
  readSlide,
} from "./tools/read_slide.js";
import {
  exportSlideSchema,
  exportSlide,
} from "./tools/export_slide.js";
import {
  exportPdfSchema,
  exportPdf,
} from "./tools/export_pdf.js";
import {
  exportPptxSchema,
  exportPptx,
} from "./tools/export_pptx.js";
import {
  createPresentationSchema,
  createPresentation,
} from "./tools/create_presentation.js";
import {
  listThemesAndStylesSchema,
  listThemesAndStyles,
} from "./tools/list_themes_and_styles.js";
import {
  validateSlideSchema,
  validateSlide,
} from "./tools/validate_slide.js";
import { registerPreviewSlide } from "./tools/preview_slide.js";

// Load version from package.json
const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(
  readFileSync(join(__dirname, "../package.json"), "utf-8")
) as { version: string };

const TOOL_NAMES = [
  "list_themes_and_styles",
  "list_layouts",
  "generate_slide_ids",
  "manage_slide",
  "set_frontmatter",
  "read_slide",
  "export_slide",
  "export_pdf",
  "export_pptx",
  "create_presentation",
  "validate_slide",
  "preview_slide",
];

/**
 * Creates and configures an McpServer instance with all tools registered.
 * Returns the server without connecting to any transport.
 */
function createMcpServer(): McpServer {
  const server = new McpServer(
    {
      name: "marp-mcp",
      version: packageJson.version,
    },
    {
      capabilities: {
        resources: {},
        tools: {},
      },
    }
  );

  server.tool(
    "list_layouts",
    "List all available slide layouts with their required/optional parameters. " +
      "ALWAYS call this before manage_slide to discover valid layoutType values and their params. " +
      "Accepts optional 'theme' and 'style' params to override server defaults for this call only.",
    listLayoutsSchema.shape,
    listLayouts
  );

  server.tool(
    "generate_slide_ids",
    "Assign stable UUID slide IDs to every slide in a Marp file. " +
      "Run after creating initial slides so that future replace/delete/after/before operations can target specific slides by ID. " +
      "Safe to call multiple times — existing IDs are never changed.",
    generateSlideIdsSchema.shape,
    generateSlideIds
  );

  server.tool(
    "manage_slide",
    "Insert, replace, or delete slides in a Marp file using slide IDs. " +
      "Always call list_layouts first to see available layoutType values and their required params. " +
      "Use read_slide to get existing slide IDs before replace/delete/after/before operations. " +
      "Accepts optional 'theme' and 'style' params to override server defaults for this call only.",
    manageSlideSchema.shape,
    manageSlide
  );

  server.tool(
    "set_frontmatter",
    "Initialize or update required Marp frontmatter (marp:true, theme, header, paginate) and inject active style CSS. " +
      "Call this FIRST before adding slides to any new or existing presentation file. " +
      "Accepts optional 'theme' and 'style' params to override server defaults for this call only.",
    setFrontmatterSchema.shape,
    setFrontmatter
  );

  server.tool(
    "read_slide",
    "Read slide content from a Marp file. Returns a specific slide by ID, or all slides with their IDs and positions. " +
      "Use the returned slideId values with manage_slide for replace/delete/after/before operations.",
    readSlideSchema.shape,
    readSlide
  );

  server.tool(
    "export_slide",
    "Export a Marp markdown presentation to HTML, PDF, or PPTX using marp-cli. " +
      "HTML preserves all style rendering; PDF is printable; PPTX embeds slides as images (editable PPTX via pptxEditable flag requires LibreOffice). " +
      "Note: HTML export may not display local image files correctly — use PDF when local images are present. " +
      "Call set_frontmatter and ensure slides are complete before exporting.",
    exportSlideSchema.shape,
    exportSlide
  );

  server.tool(
    "list_themes_and_styles",
    "List all available themes and styles with descriptions and layout counts. " +
      "Shows current server defaults and explains how to override them per call. " +
      "Call this first when choosing a theme/style, then call list_layouts with your chosen theme/style params.",
    listThemesAndStylesSchema.shape,
    listThemesAndStyles
  );

  server.tool(
    "validate_slide",
    "Check a Marp markdown presentation for slide overflow. " +
      "Detects lines exceeding the per-slide limit and table rows exceeding the width limit, " +
      "with full East Asian character width support. " +
      "Always call this after creating or editing slides before exporting.",
    validateSlideSchema.shape,
    validateSlide
  );

  server.tool(
    "export_pdf",
    "Export Marp markdown content directly to PDF and return base64-encoded file data. " +
      "Used by the preview_slide UI for in-browser PDF download. " +
      "Pass the full markdown text (including frontmatter) and optionally override theme and filename.",
    exportPdfSchema.shape,
    exportPdf
  );

  server.tool(
    "export_pptx",
    "Export Marp markdown content directly to PPTX and return base64-encoded file data. " +
      "Used by the preview_slide UI for in-browser PPTX download. " +
      "Pass the full markdown text (including frontmatter) and optionally override theme and filename. " +
      "Set editable:true to generate an editable PPTX via LibreOffice (experimental).",
    exportPptxSchema.shape,
    exportPptx
  );

  server.tool(
    "create_presentation",
    "Create a new Marp presentation file in one step — initializes frontmatter, adds a title slide, " +
      "and optionally adds content placeholder slides. " +
      "Use this to start a new presentation; use manage_slide to add/edit slides afterward.",
    createPresentationSchema.shape,
    createPresentation
  );

  registerPreviewSlide(server);

  return server;
}

/**
 * Starts the MCP server on stdio transport.
 */
export async function startMcpServer(): Promise<void> {
  const server = createMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);

  info("Marp MCP Server running on stdio", {
    theme: getActiveTheme().name,
    style: getActiveStyle().name,
    version: packageJson.version,
    tools: TOOL_NAMES,
  });
}

/**
 * Starts the MCP server with Streamable HTTP transport (stateless mode).
 * Each request creates a new McpServer instance.
 */
export async function startHttpServer(): Promise<void> {
  const portRaw = parseInt(process.env.PORT ?? "3000", 10);
  const port = isNaN(portRaw) || portRaw < 1 || portRaw > 65535 ? 3000 : portRaw;

  const app = express();
  app.use(cors());
  // Raise body limit to 10 MB — large presentations with inline images can exceed the 100 KB default.
  app.use(express.json({ limit: "10mb" }));

  app.get("/health", (_req: Request, res: Response) => {
    res.send("ok");
  });

  app.all("/mcp", async (req: Request, res: Response) => {
    const server = createMcpServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    res.on("close", () => {
      transport.close().catch(() => {});
      server.close().catch(() => {});
    });

    try {
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } catch (err) {
      logError("MCP HTTP handler error", {
        error: err instanceof Error ? err.message : String(err),
      });
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: "2.0",
          error: { code: -32603, message: "Internal server error" },
          id: null,
        });
      }
    }
  });

  const httpServer = app.listen(port, () => {
    info(`Marp MCP Server running on http://0.0.0.0:${port}/mcp`, {
      theme: getActiveTheme().name,
      style: getActiveStyle().name,
      version: packageJson.version,
      tools: TOOL_NAMES,
    });
  });

  const shutdown = () => {
    httpServer.close(() => process.exit(0));
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}
