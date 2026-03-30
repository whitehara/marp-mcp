import { defaultStyle } from "./default/index.js";
import { richStyle } from "./rich/index.js";
import { minimalStyle } from "./minimal/index.js";
import { darkStyle } from "./dark/index.js";
import { corporateStyle } from "./corporate/index.js";
import { academicStyle } from "./academic/index.js";
import { techStyle } from "./tech/index.js";
import type { StyleDefinition, StyleName } from "../themes/types.js";

const styles = {
  default: defaultStyle,
  rich: richStyle,
  minimal: minimalStyle,
  dark: darkStyle,
  corporate: corporateStyle,
  academic: academicStyle,
  tech: techStyle,
} satisfies Record<StyleName, StyleDefinition>;

let activeStyle: StyleDefinition = defaultStyle;

export function getActiveStyle(): StyleDefinition {
  return activeStyle;
}

export function setActiveStyle(styleName: StyleName): void {
  activeStyle = styles[styleName];
}

export function getStyle(styleName: string): StyleDefinition | undefined {
  return styles[styleName as StyleName];
}

export function getAvailableStyleNames(): StyleName[] {
  return Object.keys(styles) as StyleName[];
}

export { styles };
