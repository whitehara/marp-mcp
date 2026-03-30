/**
 * MCP Server setup and startup
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getActiveTheme } from "./themes/index.js";
import { getActiveStyle } from "./styles/index.js";
import { info } from "./utils/logger.js";

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
  createPresentationSchema,
  createPresentation,
} from "./tools/create_presentation.js";
import {
  listThemesAndStylesSchema,
  listThemesAndStyles,
} from "./tools/list_themes_and_styles.js";

// Load version from package.json
const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(
  readFileSync(join(__dirname, "../package.json"), "utf-8")
) as { version: string };

/**
 * Starts the MCP server on stdio transport.
 */
export async function startMcpServer(): Promise<void> {
  const server = new McpServer({
    name: "marp-mcp",
    version: packageJson.version,
    capabilities: {
      resources: {},
      tools: {},
    },
  });

  server.tool(
    "list_layouts",
    "List all available slide layouts with their required/optional parameters. " +
      "ALWAYS call this before manage_slide to discover valid layoutType values and their params for the active theme/style.",
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
      "Use read_slide to get existing slide IDs before replace/delete/after/before operations.",
    manageSlideSchema.shape,
    manageSlide
  );

  server.tool(
    "set_frontmatter",
    "Initialize or update required Marp frontmatter (marp:true, theme, header, paginate) and inject active style CSS. " +
      "Call this FIRST before adding slides to any new or existing presentation file.",
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
    "Export a Marp markdown presentation to HTML or PDF using marp-cli. " +
      "HTML export preserves all style class rendering; PDF produces a printable document. " +
      "Call set_frontmatter and ensure slides are complete before exporting.",
    exportSlideSchema.shape,
    exportSlide
  );

  server.tool(
    "list_themes_and_styles",
    "List all available themes and styles with descriptions and layout counts. " +
      "Use this to help choose the right visual style for a presentation. " +
      "Then call list_layouts with the chosen -t theme / -s style to see the specific layouts available.",
    listThemesAndStylesSchema.shape,
    listThemesAndStyles
  );

  server.tool(
    "create_presentation",
    "Create a new Marp presentation file in one step — initializes frontmatter, adds a title slide, " +
      "and optionally adds content placeholder slides. " +
      "Use this to start a new presentation; use manage_slide to add/edit slides afterward.",
    createPresentationSchema.shape,
    createPresentation
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);

  info("Marp MCP Server running on stdio", {
    theme: getActiveTheme().name,
    style: getActiveStyle().name,
    version: packageJson.version,
    tools: ["list_themes_and_styles", "list_layouts", "generate_slide_ids", "manage_slide", "set_frontmatter", "read_slide", "export_slide", "create_presentation"],
  });
}
