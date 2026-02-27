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
    "ALWAYS read this first before creating Marp slides - lists all available layouts with parameters and descriptions",
    listLayoutsSchema.shape,
    listLayouts
  );

  server.tool(
    "generate_slide_ids",
    "Assigns slide IDs to every slide in a Marp markdown file",
    generateSlideIdsSchema.shape,
    generateSlideIds
  );

  server.tool(
    "manage_slide",
    "Create slides using this tool with appropriate layouts, then fine-tune by direct editing if needed",
    manageSlideSchema.shape,
    manageSlide
  );

  server.tool(
    "set_frontmatter",
    "Add or update required Marp frontmatter fields (marp, theme, header, paginate) and inject style CSS if active",
    setFrontmatterSchema.shape,
    setFrontmatter
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);

  info("Marp MCP Server running on stdio", {
    theme: getActiveTheme().name,
    style: getActiveStyle().name,
    version: packageJson.version,
    tools: ["list_layouts", "generate_slide_ids", "manage_slide", "set_frontmatter"],
  });
}
