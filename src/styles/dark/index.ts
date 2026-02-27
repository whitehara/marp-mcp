import type { StyleDefinition } from "../../themes/types.js";
import { darkCss } from "./css.js";
import { titleLayout } from "./layouts/title.js";
import { sectionLayout } from "./layouts/section.js";
import { contentLayout } from "./layouts/content.js";
import { listLayout } from "./layouts/list.js";
import { tableLayout } from "./layouts/table.js";
import { cardGridLayout } from "./layouts/card-grid.js";
import { timelineLayout } from "./layouts/timeline.js";
import { statisticsLayout } from "./layouts/statistics.js";
import { imageRightLayout } from "./layouts/image-right.js";
import { terminalLayout } from "./layouts/terminal.js";

export const darkStyle: StyleDefinition = {
  name: "dark",
  description: "Dark mode style with indigo and emerald accents, developer-friendly",
  compatibleThemes: [],
  css: darkCss,
  layouts: {
    title: titleLayout,
    section: sectionLayout,
    content: contentLayout,
    list: listLayout,
    table: tableLayout,
    "card-grid": cardGridLayout,
    timeline: timelineLayout,
    statistics: statisticsLayout,
    "image-right": imageRightLayout,
    terminal: terminalLayout,
  },
};
