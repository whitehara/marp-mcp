import type { StyleDefinition } from "../../themes/types.js";
import { academicCss } from "./css.js";
import { titleLayout } from "./layouts/title.js";
import { sectionLayout } from "./layouts/section.js";
import { contentLayout } from "./layouts/content.js";
import { listLayout } from "./layouts/list.js";
import { tableLayout } from "./layouts/table.js";
import { twoColumnLayout } from "./layouts/two-column.js";
import { imageRightLayout } from "./layouts/image-right.js";
import { imageCenterLayout } from "./layouts/image-center.js";
import { figureCaptionLayout } from "./layouts/figure-caption.js";
import { keyMessageLayout } from "./layouts/key-message.js";
import { methodologyLayout } from "./layouts/methodology.js";
import { comparisonLayout } from "./layouts/comparison.js";
import { statisticsLayout } from "./layouts/statistics.js";
import { sidebarLayout } from "./layouts/sidebar.js";
import { resultsTableLayout } from "./layouts/results-table.js";

export const academicStyle: StyleDefinition = {
  name: "academic",
  description:
    "Academic conference presentation style with maroon color scheme, structured for scholarly talks",
  compatibleThemes: [],
  css: academicCss,
  layouts: {
    title: titleLayout,
    section: sectionLayout,
    content: contentLayout,
    list: listLayout,
    table: tableLayout,
    "two-column": twoColumnLayout,
    "image-right": imageRightLayout,
    "image-center": imageCenterLayout,
    "figure-caption": figureCaptionLayout,
    "key-message": keyMessageLayout,
    methodology: methodologyLayout,
    comparison: comparisonLayout,
    statistics: statisticsLayout,
    sidebar: sidebarLayout,
    "results-table": resultsTableLayout,
  },
};
