import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { initMarpFile } from "../init_marp_file.js";

const SLIDE_SEPARATOR = /\n---\n+/;

describe("initMarpFile", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "marp-init-"));
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it("adds default frontmatter values and slide IDs", async () => {
    const filePath = path.join(tempDir, "slides.md");
    await fs.writeFile(
      filePath,
      [
        "# Slide 1",
        "",
        "---",
        "",
        "# Slide 2",
      ].join("\n"),
      "utf-8",
    );

    await initMarpFile({ filePath });

    const content = await fs.readFile(filePath, "utf-8");
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    expect(match).not.toBeNull();
    if (!match) return;

    const [, frontmatter, body] = match;
    expect(frontmatter).toContain("marp: true");
    expect(frontmatter).toContain("theme: default");
    expect(frontmatter).toContain("header: header");
    expect(frontmatter).toContain("paginate: true");

    const slides = body.trim().split(SLIDE_SEPARATOR);
    expect(slides).toHaveLength(2);
    for (const slide of slides) {
      expect(slide).toMatch(/<!--\s*slide-id:/i);
    }
  });

  it("does not modify files already initialized", async () => {
    const filePath = path.join(tempDir, "prepped.md");
    const prepared = [
      "---",
      "marp: true",
      "theme: default",
      "header: header",
      "paginate: true",
      "---",
      "",
      "<!-- slide-id: abc -->",
      "",
      "# Slide",
    ].join("\n");
    await fs.writeFile(filePath, prepared, "utf-8");

    await initMarpFile({ filePath });
    const afterFirst = await fs.readFile(filePath, "utf-8");

    await initMarpFile({ filePath });
    const afterSecond = await fs.readFile(filePath, "utf-8");

    expect(afterFirst).toBe(prepared);
    expect(afterSecond).toBe(prepared);
  });
});
