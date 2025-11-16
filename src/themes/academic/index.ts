import type { ThemeDefinition } from "../types.js";
import { titleLayout } from "./layouts/title.js";
import { sectionLayout } from "./layouts/section.js";
import { listLayout } from "./layouts/list.js";
import { tableLayout } from "./layouts/table.js";
import { twoColumnLayout } from "./layouts/two-column.js";
import { imageRightLayout } from "./layouts/image-right.js";
import { imageCenterLayout } from "./layouts/image-center.js";

export const academicTheme: ThemeDefinition = {
  name: "academic",
  description: "Academic theme with custom layouts and blockquote-style footers",
  layouts: {
    section: sectionLayout,
    title: titleLayout,
    list: listLayout,
    table: tableLayout,
    "two-column": twoColumnLayout,
    "image-right": imageRightLayout,
    "image-center": imageCenterLayout,
  },
};
