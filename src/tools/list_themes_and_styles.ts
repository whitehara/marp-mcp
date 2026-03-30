/**
 * Tool: list_themes_and_styles
 * Lists all available themes and styles with their descriptions and layout counts.
 * Helps LLMs choose appropriate visual styles for presentations.
 */

import { z } from "zod";
import { getAvailableThemeNames, getTheme } from "../themes/index.js";
import { getAvailableStyleNames, getStyle } from "../styles/index.js";
import type { ToolResponse } from "../types/common.js";

export const listThemesAndStylesSchema = z.object({});

/**
 * MCP Tool: Lists all available themes and styles with descriptions.
 *
 * @returns {Promise<ToolResponse>} Theme and style information
 */
export async function listThemesAndStyles(): Promise<ToolResponse> {
  const themeNames = getAvailableThemeNames();
  const styleNames = getAvailableStyleNames();

  const themes = themeNames.map((name) => {
    const theme = getTheme(name)!;
    return {
      name: theme.name,
      description: theme.description,
      layoutCount: Object.keys(theme.layouts).length,
      layouts: Object.keys(theme.layouts),
    };
  });

  const styles = styleNames
    .filter((name) => name !== "default")
    .map((name) => {
      const style = getStyle(name)!;
      return {
        name: style.name,
        description: style.description,
        compatibleThemes:
          style.compatibleThemes.length > 0
            ? style.compatibleThemes
            : ["all themes"],
        layoutCount: Object.keys(style.layouts).length,
        layouts: Object.keys(style.layouts),
      };
    });

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            usage: {
              theme: "Pass theme name via --theme flag or -t (e.g. marp-mcp -t gaia)",
              style:
                "Pass style name via --style flag or -s (e.g. marp-mcp -s rich). Styles are compatible with all themes unless listed in compatibleThemes.",
              combining:
                "Styles add layouts on top of themes. Use list_layouts to see the merged layout list for a specific theme+style combination.",
            },
            themes,
            styles,
          },
          null,
          2
        ),
      },
    ],
  };
}
