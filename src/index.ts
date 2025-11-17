#!/usr/bin/env node

/**
 * Marp MCP Server
 * A Model Context Protocol server for managing Marp presentation projects
 * Optimized for Claude Code and Cursor
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  getActiveTheme,
  getAvailableThemeNames,
  getTheme,
  setActiveTheme,
} from "./themes/index.js";

// Import tools
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

// Create server instance
const server = new McpServer({
  name: "marp-mcp",
  version: "0.4.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Register tools
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
  "Add or update required Marp frontmatter fields (marp, theme, header, paginate)",
  setFrontmatterSchema.shape,
  setFrontmatter
);

// Start the server
async function main() {
  const themeArg = parseThemeArgument(process.argv.slice(2));
  if (themeArg) {
    const theme = getTheme(themeArg.toLowerCase());
    if (!theme) {
      console.error(
        `Unknown theme "${themeArg}". Available themes: ${getAvailableThemeNames().join(", ")}`,
      );
      process.exit(1);
    }
    setActiveTheme(theme.name);
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`Marp MCP Server running on stdio (theme: ${getActiveTheme().name})`);
  console.error("Tools: list_layouts, generate_slide_ids, manage_slide, set_frontmatter");
}

function parseThemeArgument(args: string[]): string | undefined {
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "-t" || arg === "--theme") {
      return args[i + 1];
    }
    if (arg.startsWith("--theme=")) {
      const [, value] = arg.split("=", 2);
      return value;
    }
  }
  return undefined;
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
