import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { manageSlide } from "../manage_slide.js";
import { setActiveTheme } from "../../themes/index.js";

const FRONTMATTER = ["---", "marp: true", "theme: default", "---", ""].join("\n");

async function readSlides(filePath: string): Promise<string> {
  return fs.readFile(filePath, "utf-8");
}

describe("manageSlide - notes", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "marp-manage-slide-"));
    setActiveTheme("default");
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it("appends notes when inserting slides", async () => {
    const filePath = path.join(tempDir, "insert.md");
    await fs.writeFile(filePath, `${FRONTMATTER}\n`, "utf-8");

    await manageSlide({
      filePath,
      layoutType: "title",
      params: { heading: "Intro" },
      note: "Remember to greet the audience\nShare agenda briefly",
    });

    const updated = await readSlides(filePath);
    expect(updated).toContain("<!--");
    expect(updated).toContain("Remember to greet the audience");
    expect(updated).toContain("Share agenda briefly");
    expect(updated.trimEnd().endsWith("-->")).toBe(true);
  });

  it("appends notes when replacing slides", async () => {
    const filePath = path.join(tempDir, "replace.md");
    const existingSlideId = "aabbccdd-1234";
    const initialContent = [
      FRONTMATTER,
      `<!-- slide-id: ${existingSlideId} -->`,
      "",
      "# Old heading",
      "",
      "Legacy body",
    ].join("\n");
    await fs.writeFile(filePath, `${initialContent}\n`, "utf-8");

    await manageSlide({
      filePath,
      layoutType: "title",
      params: { heading: "Updated title" },
      mode: "replace",
      slideId: existingSlideId,
      note: "New talking points",
    });

    const updated = await readSlides(filePath);
    expect(updated).toContain("# Updated title");
    expect(updated).toContain("<!--\nNew talking points\n-->");
  });
});
