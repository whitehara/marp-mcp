# Marp MCP Server

![NPM Downloads](https://img.shields.io/npm/dt/%40masaki39%2Fmarp-mcp)

An MCP server for creating and editing Marp presentations with AI assistance.
This MCP server allows LLMs to edit Markdown files according to a specified layout, and now supports the default Marp theme along with Gaia, Uncover, and the [Academic](./assets/themes/academic.css) in this repository.

## Setup

Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "marp-mcp": {
      "command": "npx",
      "args": ["-y", "@masaki39/marp-mcp@latest"]
    }
  }
}
```

### Theme selection

Use `-t` or `--theme` args for theme selection. Choose from `default`, `gaia`, `uncover`, or `academic`:

```json
{
  "command": "npx",
  "args": [
    "-y",
    "@masaki39/marp-mcp@latest",
    "-t",
    "default"]
}
```

## Tools

| Tool | Description |
|------|-------------|
| `list_layouts` | List all available slide layouts with parameters and descriptions |
| `generate_slide_ids` | Generate slide IDs for every slide |
| `manage_slide` | Insert, replace, or delete slides using slide IDs (ID-based operations) |
| `set_frontmatter` | Ensure `marp`, `theme`, `header`, and `paginate` frontmatter fields are present |

### Style selection

Use `-s` or `--style` args for style selection. Choose from `default` or `rich`. Styles are designed for the `default` theme:

```json
{
  "command": "npx",
  "args": [
    "-y",
    "@masaki39/marp-mcp@latest",
    "-s",
    "rich"]
}
```

## Available Layouts

| Layout | Description |
|--------|-------------|
| `title` | Title slide with left-aligned heading and metadata |
| `section` | Section divider with centered title and subtitle |
| `list` | Content slide with heading and bullet points or text |
| `table` | Table layout with customizable size and alignment |
| `two-column` | Two-column layout for side-by-side content *(academic theme only)* |
| `image-right` | Layout with image on the right side |
| `image-center` | Centered image layout with adjustable dimensions |

### Rich style additional layouts

| Layout | Description |
|--------|-------------|
| `image-split` | Image with bullet points in a split view |
| `timeline` | Vertical timeline with gradient line and dots |
| `card-grid` | Grid of icon cards with title and description |
| `statistics` | Large number statistics with labels |
| `highlight-box` | Gradient-styled highlight callout box |
| `two-column-panel` | Two styled panels side by side |
| `three-column-panel` | Three styled panels in a row |
| `image-comparison` | Side-by-side image comparison with labels |
| `content` | Free-form markdown content slide |
| `quote` | Styled blockquote with attribution |
| `process` | Horizontal process flow with numbered steps and arrows |

## Example

Rendered samples (GitHub Pages):

- [Academic theme](https://masaki39.github.io/marp-mcp/example-academic-theme.html)
- [Default theme](https://masaki39.github.io/marp-mcp/example-default-theme.html)
- [Default theme, default style](https://masaki39.github.io/marp-mcp/example-default-default-style.html)
- [Default theme, rich style](https://masaki39.github.io/marp-mcp/example-default-rich-style.html)
- [Gaia theme](https://masaki39.github.io/marp-mcp/example-gaia-theme.html)
- [Uncover theme](https://masaki39.github.io/marp-mcp/example-uncover-theme.html)

## Development

### Working with Examples

Generate markdown examples:
```bash
npm run examples:generate
```

Generate HTML files locally:
```bash
npm run examples:html
```

Preview examples with live reload (recommended for testing):
```bash
npm run examples:server
# Open http://localhost:8080 in your browser
```

**Note**: HTML files are automatically generated and deployed to GitHub Pages by CI/CD. They are not committed to git.

## License

MIT License

## Links

- [GitHub](https://github.com/masaki39/marp-mcp)
- [npm](https://www.npmjs.com/package/@masaki39/marp-mcp)
- [Marp](https://marp.app/)
- [Model Context Protocol](https://modelcontextprotocol.io)
