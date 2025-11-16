import {
  getActiveTheme,
  getAvailableThemeNames,
  getTheme,
  setActiveTheme,
} from "../index.js";
import { listLayouts } from "../../tools/list_layouts.js";

describe("theme manager", () => {
  afterEach(() => {
    setActiveTheme("default");
  });

  it("defaults to the Marp default theme", () => {
    expect(getActiveTheme().name).toBe("default");
  });

  it("exposes all registered themes", () => {
    const names = getAvailableThemeNames();
    expect(names).toEqual(expect.arrayContaining(["default", "academic"]));
    expect(getTheme("academic")).toBeDefined();
  });

  it("switches layouts based on active theme", async () => {
    setActiveTheme("academic");
    const academicLayouts = await getLayoutNamesFromTool();
    expect(academicLayouts).toContain("two-column");

    setActiveTheme("default");
    const defaultLayouts = await getLayoutNamesFromTool();
    expect(defaultLayouts).not.toContain("two-column");
  });
});

async function getLayoutNamesFromTool(): Promise<string[]> {
  const response = await listLayouts();
  const payload = JSON.parse(response.content[0].text) as {
    layouts: Array<{ name: string }>;
  };
  return payload.layouts.map((layout) => layout.name);
}
