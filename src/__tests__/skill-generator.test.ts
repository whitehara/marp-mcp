import { describe, expect, it } from "@jest/globals";
import { promises as fs } from "fs";
import path from "path";
import { getAvailableThemeNames } from "../themes/index.js";
import { getAvailableStyleNames, getStyle } from "../styles/index.js";

const ROOT = path.resolve(process.cwd());
const SKILL_DIR = path.join(ROOT, ".claude", "skills", "marp");
const SKILL_PATH = path.join(SKILL_DIR, "SKILL.md");

describe("skill generator", () => {
  it("writes SKILL.md", async () => {
    const content = buildSkillFile();

    await fs.mkdir(SKILL_DIR, { recursive: true });
    await fs.writeFile(SKILL_PATH, content, "utf-8");
    const saved = await fs.readFile(SKILL_PATH, "utf-8");
    expect(saved).toBe(content);
  });
});

function buildSkillFile(): string {
  // --- Dynamic: theme list ---
  const themeNames = getAvailableThemeNames();
  const themeList = themeNames.map((n) => `\`${n}\``).join(", ");

  // --- Dynamic: style list ---
  const styleRows = getAvailableStyleNames()
    .filter((n) => n !== "default")
    .map((name) => {
      const style = getStyle(name)!;
      return `| \`${name}\` | ${style.description} |`;
    })
    .join("\n");

  return `---
name: marp
description: Create and edit Marp presentations using marp-mcp CLI. Use when user wants to create slides, manage presentations, or work with Marp markdown files.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# Marp Presentation Skill

Create and edit Marp slide decks via the \`marp-mcp\` CLI.

## Installation Check

First, verify the CLI is available:

\`\`\`bash
marp-mcp --version
\`\`\`

If not installed, use npx:

\`\`\`bash
npx @masaki39/marp-mcp@latest --version
\`\`\`

## Available Themes and Styles

- **Theme** (\`-t\`): Base CSS that defines the slide foundation. Each theme is a standalone CSS file in the repository.
- **Style** (\`-s\`): Additional CSS layouts and components layered on top of a theme. Styles are designed for the \`default\` theme, so \`-s\` implies \`-t default\` unless explicitly overridden.

### Themes

${themeList}

### Styles

| Style | Description |
|-------|-------------|
${styleRows}

## CLI Command Reference

### Global Options

- \`-t, --theme <name>\` — Select theme (default: \`default\`)
- \`-s, --style <name>\` — Select style (default: \`default\`)
- \`-V, --version\` — Show version
- \`-h, --help\` — Show help

### Commands

#### \`list-layouts\`

List all available slide layouts (JSON output).

\`\`\`bash
marp-mcp list-layouts
marp-mcp -t gaia list-layouts
marp-mcp -s rich list-layouts
\`\`\`

#### \`set-frontmatter <file>\`

Add or update Marp frontmatter fields.

\`\`\`bash
marp-mcp set-frontmatter slides.md --header "My Presentation" --paginate
marp-mcp -s academic set-frontmatter slides.md --header "Research Talk"
\`\`\`

Options:
- \`--header <text>\` — Header text
- \`--paginate / --no-paginate\` — Enable or disable pagination

#### \`manage <file>\`

Insert, replace, or delete slides using slide IDs.

\`\`\`bash
marp-mcp manage slides.md -l title -p '{"title":"Hello","subtitle":"World"}'
marp-mcp manage slides.md -l content -p '{"title":"Agenda","body":"- Item 1\\n- Item 2"}' --position after --slide-id slide-1
marp-mcp manage slides.md -l content --mode replace --slide-id slide-2 -p '{"title":"Updated"}'
marp-mcp manage slides.md -l content --mode delete --slide-id slide-3
\`\`\`

Options:
- \`-l, --layout <type>\` — Layout type (required)
- \`-p, --params <json>\` — Parameters as JSON string (default: \`{}\`)
- \`-m, --mode <mode>\` — Operation mode: \`insert\` | \`replace\` | \`delete\` (default: \`insert\`)
- \`--position <pos>\` — Position: \`end\` | \`start\` | \`after\` | \`before\` (default: \`end\`)
- \`--slide-id <id>\` — Target slide ID (required for \`after\`, \`before\`, \`replace\`, \`delete\`)
- \`--note <text>\` — Speaker notes

#### \`read <file>\`

Read slide content from a Marp file.

\`\`\`bash
marp-mcp read slides.md
marp-mcp read slides.md --slide-id <id>
\`\`\`

Options:
- \`--slide-id <id>\` — Read a specific slide by ID (omit to list all slides)

#### \`generate-ids <file>\`

Generate slide IDs for every slide in a Marp markdown file.

\`\`\`bash
marp-mcp generate-ids slides.md
\`\`\`

## Workflow

Follow this order when creating a new presentation:

1. **Set frontmatter** — Initialize the file with theme, header, and pagination
   \`\`\`bash
   marp-mcp -s rich set-frontmatter slides.md --header "Title" --paginate
   \`\`\`

2. **Manage slides** — Add slides one by one using layouts
   \`\`\`bash
   marp-mcp -s rich manage slides.md -l title -p '{"title":"My Talk","subtitle":"Subtitle"}'
   marp-mcp -s rich manage slides.md -l content -p '{"title":"Intro","body":"Hello world"}'
   \`\`\`

3. **Generate IDs** — Assign IDs for future editing
   \`\`\`bash
   marp-mcp generate-ids slides.md
   \`\`\`

4. **Edit slides** — Use replace/delete modes with slide IDs
   \`\`\`bash
   marp-mcp -s rich manage slides.md -l content --mode replace --slide-id slide-1 -p '{"title":"Updated"}'
   \`\`\`

## Layout Information

To get available layouts and their parameters, run:

\`\`\`bash
marp-mcp list-layouts
\`\`\`

Or with a specific theme/style:

\`\`\`bash
marp-mcp -t <theme> -s <style> list-layouts
\`\`\`

\`!\`marp-mcp list-layouts\`\`

## Best Practices

- Always run \`set-frontmatter\` before adding slides to ensure correct theme/style setup
- Use \`list-layouts\` to check available layouts and required parameters for the current theme/style
- Run \`generate-ids\` after adding all initial slides, then use IDs for subsequent edits
- When replacing slides, always specify the correct \`--slide-id\`
- Use \`--note\` to add speaker notes to any slide
- Prefer \`--position after --slide-id <id>\` for precise slide placement
`;
}
