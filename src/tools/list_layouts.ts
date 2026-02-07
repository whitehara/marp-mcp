/**
 * Layout registry and list_slide_layouts tool
 */

import { z } from "zod";
import { getActiveTheme } from "../themes/index.js";
import { getActiveStyle } from "../styles/index.js";
import type { SlideLayout } from "../themes/types.js";
import type { ToolResponse } from "../types/common.js";

/**
 * Returns merged layouts from the active theme and active style.
 * Style layouts override theme layouts with the same name.
 */
function getMergedLayouts(): Record<string, SlideLayout> {
  const theme = getActiveTheme();
  const style = getActiveStyle();
  return { ...theme.layouts, ...style.layouts };
}

/**
 * Retrieves a slide layout by name from the merged theme+style layouts.
 *
 * @param name - The name of the layout to retrieve
 * @returns The slide layout if found, null otherwise
 */
export function getLayout(name: string): SlideLayout | null {
  const layouts = getMergedLayouts();
  return layouts[name] ?? null;
}

/**
 * Retrieves all available layout names from the merged theme+style layouts.
 *
 * @returns Array of layout names
 */
export function getLayoutNames(): string[] {
  const layouts = getMergedLayouts();
  return Object.keys(layouts);
}

/**
 * Retrieves detailed information about all layouts from the merged theme+style layouts.
 *
 * @returns Array of layout information including name, description, and parameters
 */
export function getAllLayoutsInfo() {
  const layouts = getMergedLayouts();

  return Object.entries(layouts).map(([name, layout]) => ({
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
  const style = getActiveStyle();
  const layoutsInfo = getAllLayoutsInfo();

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            theme: theme.name,
            style: style.name,
            layouts: layoutsInfo,
          },
          null,
          2
        ),
      },
    ],
  };
}
