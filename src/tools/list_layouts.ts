/**
 * Layout registry and list_slide_layouts tool
 */

import { z } from "zod";
import { getActiveTheme } from "../themes/index.js";
import type { SlideLayout } from "../themes/types.js";
import type { ToolResponse } from "../types/common.js";

/**
 * Retrieves a slide layout by name from the active theme.
 *
 * @param name - The name of the layout to retrieve
 * @returns The slide layout if found, null otherwise
 */
export function getLayout(name: string): SlideLayout | null {
  const theme = getActiveTheme();
  return theme.layouts[name] ?? null;
}

/**
 * Retrieves all available layout names from the active theme.
 *
 * @returns Array of layout names
 */
export function getLayoutNames(): string[] {
  const theme = getActiveTheme();
  return Object.keys(theme.layouts);
}

/**
 * Retrieves detailed information about all layouts from the active theme.
 *
 * @returns Array of layout information including name, description, and parameters
 */
export function getAllLayoutsInfo() {
  const theme = getActiveTheme();

  return Object.entries(theme.layouts).map(([name, layout]) => ({
    name,
    description: layout.description,
    className: layout.className,
    params: Object.entries(layout.params).map(([paramName, paramDef]) => ({
      name: paramName,
      ...paramDef,
    })),
  }));
}

export const listLayoutsSchema = z.object({});

/**
 * MCP Tool: Lists all available slide layouts with their parameters.
 * This tool provides information about available layouts in the active theme,
 * including their names, descriptions, and required parameters.
 *
 * @returns {Promise<ToolResponse>} Layout information for the active theme
 */
export async function listLayouts(): Promise<ToolResponse> {
  const theme = getActiveTheme();
  const layoutsInfo = getAllLayoutsInfo();

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            theme: theme.name,
            layouts: layoutsInfo,
          },
          null,
          2
        ),
      },
    ],
  };
}
