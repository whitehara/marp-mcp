import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { setFrontmatter } from "../set_frontmatter.js";
import { setActiveTheme } from "../../themes/index.js";

describe("setFrontmatter", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "marp-frontmatter-"));
    setActiveTheme("default");
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it("creates the required frontmatter when missing", async () => {
    const filePath = path.join(tempDir, "slides.md");
    await fs.writeFile(filePath, "# Slide 1\n", "utf-8");

    await setFrontmatter({ filePath });

    const updated = await fs.readFile(filePath, "utf-8");
    const expectedPrefix = [
      "---",
      "marp: true",
      "theme: default",
      'header: ""',
      "paginate: false",
      "---",
      "",
    ].join("\n");
    expect(updated.startsWith(expectedPrefix)).toBe(true);
    expect(updated.trimEnd()).toContain("# Slide 1");
  });

  it("preserves existing header and paginate when values are omitted", async () => {
    const filePath = path.join(tempDir, "existing.md");
    const original = [
      "---",
      "marp: true",
      "theme: uncover",
      "header: Existing header",
      "paginate: true",
      "custom: keep-me",
      "---",
      "",
      "# Slide",
    ].join("\n");
    await fs.writeFile(filePath, original, "utf-8");
    setActiveTheme("gaia");

    await setFrontmatter({ filePath });

    const updated = await fs.readFile(filePath, "utf-8");
    expect(updated).toContain("theme: gaia");
    expect(updated).toContain("header: Existing header");
    expect(updated).toContain("paginate: true");
    expect(updated).toContain("custom: keep-me");
  });

  it("overrides header and paginate when provided", async () => {
    const filePath = path.join(tempDir, "override.md");
    const original = [
      "---",
      "marp: true",
      "theme: default",
      "---",
      "",
      "# Slide",
    ].join("\n");
    await fs.writeFile(filePath, original, "utf-8");
    setActiveTheme("academic");

    await setFrontmatter({
      filePath,
      header: "Kickoff: FY25",
      paginate: true,
    });

    const updated = await fs.readFile(filePath, "utf-8");
    expect(updated).toContain('header: "Kickoff: FY25"');
    expect(updated).toContain("paginate: true");
    expect(updated).toContain("theme: academic");
  });
});
