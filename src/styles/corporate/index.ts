import type { StyleDefinition } from "../../themes/types.js";
import { corporateCss } from "./css.js";
import { titleLayout } from "./layouts/title.js";
import { sectionLayout } from "./layouts/section.js";
import { contentLayout } from "./layouts/content.js";
import { listLayout } from "./layouts/list.js";
import { tableLayout } from "./layouts/table.js";
import { twoColumnLayout } from "./layouts/two-column.js";
import { threeColumnLayout } from "./layouts/three-column.js";
import { statisticsLayout } from "./layouts/statistics.js";
import { processLayout } from "./layouts/process.js";
import { agendaLayout } from "./layouts/agenda.js";
import { imageRightLayout } from "./layouts/image-right.js";
import { highlightBoxLayout } from "./layouts/highlight-box.js";

export const corporateStyle: StyleDefinition = {
  name: "corporate",
  description: "Professional business style with navy color scheme, structured layouts",
  compatibleThemes: [],
  css: corporateCss,
  layouts: {
    title: titleLayout,
    section: sectionLayout,
    content: contentLayout,
    list: listLayout,
    table: tableLayout,
    "two-column": twoColumnLayout,
    "three-column": threeColumnLayout,
    statistics: statisticsLayout,
    process: processLayout,
    agenda: agendaLayout,
    "image-right": imageRightLayout,
    "highlight-box": highlightBoxLayout,
  },
};
