import { describe, expect, it } from "@jest/globals";
import { promises as fs } from "fs";
import path from "path";
import {
  getAvailableThemeNames,
  getTheme,
} from "../themes/index.js";
import { getAvailableStyleNames, getStyle } from "../styles/index.js";

const ROOT = path.resolve(process.cwd());
const README_PATH = path.join(ROOT, "README.md");

describe("readme generator", () => {
  it("writes README.md", async () => {
    const content = buildReadme();

    await fs.writeFile(README_PATH, content, "utf-8");
    const saved = await fs.readFile(README_PATH, "utf-8");
    expect(saved).toBe(content);
  });
});

function buildReadme(): string {
  // --- Dynamic: style selection list ---
  const styleList = getAvailableStyleNames()
    .filter((n) => n !== "default")
    .join("`, `");

  // --- Dynamic: Default theme layout table ---
  const defaultTheme = getTheme("default")!;
  const defaultThemeRows = Object.entries(defaultTheme.layouts)
    .map(([name, layout]) => `| \`${name}\` | ${layout.description} |`)
    .join("\n");

  // --- Dynamic: Style layout tables ---
  const styleLayoutSections = getAvailableStyleNames()
    .filter((n) => n !== "default")
    .map((styleName) => {
      const style = getStyle(styleName)!;
      const rows = Object.entries(style.layouts)
        .map(([name, layout]) => `| \`${name}\` | ${layout.description} |`)
        .join("\n");
      return `#### \`${styleName}\` — ${style.description}\n\n| Layout | Description |\n|--------|-------------|\n${rows}`;
    })
    .join("\n\n");

  // --- Dynamic: Example links ---
  const themeLinks = getAvailableThemeNames()
    .map(
      (name) =>
        `- [${capitalize(name)} theme](https://masaki39.github.io/marp-mcp/example-${name}-theme.html)`,
    )
    .join("\n");

  const styleLinks = getAvailableStyleNames()
    .filter((n) => getStyle(n)!.css !== "")
    .map(
      (name) =>
        `- [Default theme, ${name} style](https://masaki39.github.io/marp-mcp/example-default-${name}-style.html)`,
    )
    .join("\n");

  return `# Marp MCP Server

![NPM Downloads](https://img.shields.io/npm/dt/%40masaki39%2Fmarp-mcp)

> [!TIP]
> This package includes a [Claude Code Skill](./skills/marp/SKILL.md). After installing, Claude Code can create Marp presentations via the \`/marp\` command using the built-in CLI — no MCP server configuration required!
>
> **Auto-updating plugin install:**
> \`\`\`
> /plugin marketplace add masaki39/marp-mcp
> /plugin install marp@marp-mcp
> \`\`\`

An MCP server for creating and editing Marp presentations with AI assistance.
This MCP server allows LLMs to edit Markdown files according to a specified layout, and now supports the default Marp theme along with Gaia, Uncover, and the [Academic](./assets/themes/academic.css) in this repository.

## Setup

Add to your MCP client configuration:

\`\`\`json
{
  "mcpServers": {
    "marp-mcp": {
      "command": "npx",
      "args": ["-y", "@masaki39/marp-mcp@latest"]
    }
  }
}
\`\`\`

### Theme selection

Use \`-t\` or \`--theme\` args for theme selection. Choose from \`default\`, \`gaia\`, \`uncover\`, or \`academic\`:

\`\`\`json
{
  "command": "npx",
  "args": [
    "-y",
    "@masaki39/marp-mcp@latest",
    "-t",
    "default"]
}
\`\`\`

## Tools

| Tool | Description |
|------|-------------|
| \`list_themes_and_styles\` | List all available themes and styles with descriptions and layout counts |
| \`list_layouts\` | List all available slide layouts with parameters and descriptions |
| \`create_presentation\` | Create a new presentation with frontmatter and title slide in one step |
| \`manage_slide\` | Insert, replace, or delete slides using slide IDs (ID-based operations) |
| \`set_frontmatter\` | Ensure \`marp\`, \`theme\`, \`header\`, and \`paginate\` frontmatter fields are present |
| \`read_slide\` | Read slide content by ID or list all slides with their IDs and positions |
| \`generate_slide_ids\` | Generate stable UUIDs for every slide (safe to re-run) |
| \`export_slide\` | Export to HTML or PDF using marp-cli |

### Style selection

Use \`-s\` or \`--style\` args for style selection. Choose from \`default\`, \`${styleList}\`. Styles are designed for the \`default\` theme:

\`\`\`json
{
  "command": "npx",
  "args": [
    "-y",
    "@masaki39/marp-mcp@latest",
    "-s",
    "rich"]
}
\`\`\`

## Available Layouts

### Default theme

| Layout | Description |
|--------|-------------|
${defaultThemeRows}

### Styles

${styleLayoutSections}

## Example

Rendered samples (GitHub Pages):

${themeLinks}
${styleLinks}

## Development

### Working with Examples

Generate markdown examples:
\`\`\`bash
npm run examples:generate
\`\`\`

Generate HTML files locally:
\`\`\`bash
npm run examples:html
\`\`\`

Preview examples with live reload (recommended for testing):
\`\`\`bash
npm run examples:server
# Open http://localhost:8080 in your browser
\`\`\`

**Note**: HTML files are automatically generated and deployed to GitHub Pages by CI/CD. They are not committed to git.

## License

MIT License

## Links

- [GitHub](https://github.com/masaki39/marp-mcp)
- [npm](https://www.npmjs.com/package/@masaki39/marp-mcp)
- [Marp](https://marp.app/)
- [Model Context Protocol](https://modelcontextprotocol.io)
`;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
