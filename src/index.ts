#!/usr/bin/env node

/**
 * Marp MCP Server
 * A Model Context Protocol server for managing Marp presentation projects
 * Optimized for Claude Code and Cursor
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  getActiveTheme,
  getAvailableThemeNames,
  getTheme,
  setActiveTheme,
} from "./themes/index.js";
import {
  getActiveStyle,
  getAvailableStyleNames,
  getStyle,
  setActiveStyle,
} from "./styles/index.js";
import { info, error as logError } from "./utils/logger.js";

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

// Load version from package.json
const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(
  readFileSync(join(__dirname, "../package.json"), "utf-8")
) as { version: string };

// Create server instance
const server = new McpServer({
  name: "marp-mcp",
  version: packageJson.version,
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
  "Add or update required Marp frontmatter fields (marp, theme, header, paginate) and inject style CSS if active",
  setFrontmatterSchema.shape,
  setFrontmatter
);

// Start the server
async function main() {
  const args = process.argv.slice(2);

  const themeArg = parseThemeArgument(args);
  if (themeArg) {
    const theme = getTheme(themeArg.toLowerCase());
    if (!theme) {
      logError(
        `Unknown theme "${themeArg}". Available themes: ${getAvailableThemeNames().join(", ")}`,
        { themeArg, availableThemes: getAvailableThemeNames() }
      );
      process.exit(1);
    }
    setActiveTheme(theme.name);
  }

  const styleArg = parseStyleArgument(args);
  if (styleArg) {
    const style = getStyle(styleArg.toLowerCase());
    if (!style) {
      logError(
        `Unknown style "${styleArg}". Available styles: ${getAvailableStyleNames().join(", ")}`,
        { styleArg, availableStyles: getAvailableStyleNames() }
      );
      process.exit(1);
    }
    // Validate compatible themes
    if (style.compatibleThemes.length > 0) {
      const currentTheme = getActiveTheme().name;
      if (!style.compatibleThemes.includes(currentTheme)) {
        logError(
          `Style "${style.name}" is not compatible with theme "${currentTheme}". Compatible themes: ${style.compatibleThemes.join(", ")}`,
          { style: style.name, currentTheme, compatibleThemes: style.compatibleThemes }
        );
        process.exit(1);
      }
    }
    setActiveStyle(style.name);
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);

  info("Marp MCP Server running on stdio", {
    theme: getActiveTheme().name,
    style: getActiveStyle().name,
    version: packageJson.version,
    tools: ["list_layouts", "generate_slide_ids", "manage_slide", "set_frontmatter"],
  });
}

/**
 * Parses theme argument from command line arguments.
 * Theme names are case-insensitive and will be normalized to lowercase.
 *
 * @param args - Command line arguments
 * @returns Theme name in lowercase, or undefined if not found
 */
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

/**
 * Parses style argument from command line arguments.
 * Style names are case-insensitive and will be normalized to lowercase.
 *
 * @param args - Command line arguments
 * @returns Style name, or undefined if not found
 */
function parseStyleArgument(args: string[]): string | undefined {
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "-s" || arg === "--style") {
      return args[i + 1];
    }
    if (arg.startsWith("--style=")) {
      const [, value] = arg.split("=", 2);
      return value;
    }
  }
  return undefined;
}

main().catch((err) => {
  logError("Fatal error in main()", {
    error: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
  });
  process.exit(1);
});
