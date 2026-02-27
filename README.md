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

Use `-s` or `--style` args for style selection. Choose from `default`, `rich`, `minimal`, `dark`, `corporate`, `academic`. Styles are designed for the `default` theme:

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

### Default theme

| Layout | Description |
|--------|-------------|
| `title` | Title slide with heading and content |
| `section` | Section break slide with centered title and subtitle |
| `list` | List slide with bullet points (max 8 items) |
| `table` | Table slide with description (max 7 rows) |
| `image-right` | Slide with image on right and content list (allows more explanation than image-center) |
| `image-center` | Slide with centered image (fixed h:350) |

### Styles

#### `rich` — Rich visual style with cards, timelines, grids, gradients, and more

| Layout | Description |
|--------|-------------|
| `title` | Hero title slide with dark gradient background |
| `section` | Section divider slide with gradient background |
| `list` | List slide with bullet points |
| `table` | Rich table slide with styled header and zebra stripes |
| `image-right` | Rich image-right slide with content on left and image on right (60:40 split) |
| `image-center` | Rich centered image slide with rounded corners and shadow |
| `image-split` | Image on the left with content list on the right (40:60 split) |
| `timeline` | Vertical timeline with labeled events (use 'Label: Description' format) |
| `card-grid` | Grid of cards with icon, title, and description (use 'Icon|Title|Description' format) |
| `statistics` | Statistics display with large numbers and labels (use 'Number|Label' format) |
| `highlight-box` | Centered gradient message box for key takeaways or announcements |
| `two-column-panel` | Two-column layout with styled panels, optional accent highlight on one panel |
| `three-column-panel` | Three-column layout with styled panels (use 'Title|Content' format) |
| `image-comparison` | Two images side by side with labels for comparison |
| `content` | Free-form markdown content slide |
| `quote` | Quote slide with attribution |
| `process` | Horizontal process flow with numbered steps and arrows |

#### `minimal` — Clean, flat design with typography focus and minimal decoration

| Layout | Description |
|--------|-------------|
| `title` | Clean black title slide with white text |
| `section` | Simple black section divider slide |
| `content` | Pure markdown content slide |
| `list` | Simple bullet list slide |
| `table` | Minimal table with black header and clean borders |
| `image-right` | Text on left, image on right (60:40 split), clean design |
| `image-center` | Centered image slide, clean and minimal |
| `quote` | Quote slide with left border accent, no extra decoration |
| `two-column` | Two-column layout with a thin divider line |
| `big-statement` | Large impactful statement slide with bold centered text |

#### `dark` — Dark mode style with indigo and emerald accents, developer-friendly

| Layout | Description |
|--------|-------------|
| `title` | Dark title slide with indigo-violet gradient |
| `section` | Dark section divider with slate-to-indigo gradient |
| `content` | Free-form markdown content slide on dark background |
| `list` | Bullet list slide on dark background |
| `table` | Dark table with indigo header |
| `card-grid` | Dark card grid with icon, title, and description (use 'Icon|Title|Description' format) |
| `timeline` | Dark vertical timeline with indigo-to-emerald gradient line (use 'Label: Description' format) |
| `statistics` | Dark statistics display with large indigo numbers (use 'Number|Label' format) |
| `image-right` | Text on left, image on right on dark background (60:40 split) |
| `terminal` | Terminal-style command display on dark background (prefix lines with '$ ' for commands) |

#### `corporate` — Professional business style with navy color scheme, structured layouts

| Layout | Description |
|--------|-------------|
| `title` | Professional navy gradient title slide |
| `section` | Corporate navy-to-sky section divider slide |
| `content` | Standard business content slide with markdown |
| `list` | Business bullet list slide |
| `table` | Business table with navy header and clean rows |
| `two-column` | Two-column comparison layout with navy-accented panels |
| `three-column` | Three-column layout with sky-accented panels |
| `statistics` | Business metrics display with large navy numbers (use 'Number|Label' format) |
| `process` | Horizontal business process flow with numbered steps |
| `agenda` | Agenda slide with numbered items and optional duration (use 'Item name|Duration' format) |
| `image-right` | Text on left, image on right, professional business style (60:40 split) |
| `highlight-box` | Navy key message box for important announcements or takeaways |

#### `academic` — Academic conference presentation style with maroon color scheme, structured for scholarly talks

| Layout | Description |
|--------|-------------|
| `title` | Academic title slide with author, affiliation, and date |
| `section` | Maroon section divider with optional number |
| `content` | Free-form markdown content slide |
| `list` | Bullet point list with optional citations |
| `table` | Table with maroon header |
| `two-column` | Two-column panel layout for comparisons or parallel content |
| `image-right` | Content on left, image on right (60:40 split) |
| `image-center` | Centered image with description |
| `figure-caption` | Figure with numbered caption and source attribution |
| `key-message` | Conclusion or key takeaway box with maroon highlight |
| `methodology` | Method step flow diagram (use 'Label|Description' format for steps) |
| `comparison` | Side-by-side comparison (e.g., conventional vs proposed method) |

## Example

Rendered samples (GitHub Pages):

- [Academic theme](https://masaki39.github.io/marp-mcp/example-academic-theme.html)
- [Default theme](https://masaki39.github.io/marp-mcp/example-default-theme.html)
- [Gaia theme](https://masaki39.github.io/marp-mcp/example-gaia-theme.html)
- [Uncover theme](https://masaki39.github.io/marp-mcp/example-uncover-theme.html)
- [Default theme, rich style](https://masaki39.github.io/marp-mcp/example-default-rich-style.html)
- [Default theme, minimal style](https://masaki39.github.io/marp-mcp/example-default-minimal-style.html)
- [Default theme, dark style](https://masaki39.github.io/marp-mcp/example-default-dark-style.html)
- [Default theme, corporate style](https://masaki39.github.io/marp-mcp/example-default-corporate-style.html)
- [Default theme, academic style](https://masaki39.github.io/marp-mcp/example-default-academic-style.html)

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
