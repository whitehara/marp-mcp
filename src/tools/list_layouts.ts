/**
 * Layout registry and list_slide_layouts tool
 */

import { z } from "zod";
import { getActiveTheme } from "../themes/index.js";
import type { SlideLayout } from "../themes/types.js";

interface ToolResponse {
  [x: string]: unknown;
  content: Array<{
    type: "text";
    text: string;
  }>;
}

/**
 * Get layout by name
 */
export function getLayout(name: string): SlideLayout | null {
  const theme = getActiveTheme();
  return theme.layouts[name] ?? null;
}

/**
 * Get all layout names
 */
export function getLayoutNames(): string[] {
  const theme = getActiveTheme();
  return Object.keys(theme.layouts);
}

/**
 * Get all layouts info
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

/**
 * Tool: list_layouts
 * List all available slide layouts with their parameters
 */
export const listLayoutsSchema = z.object({});

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
