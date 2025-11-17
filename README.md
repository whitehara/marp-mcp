# Marp MCP Server

![NPM Downloads](https://img.shields.io/npm/dt/%40masaki39%2Fmarp-mcp)

An MCP server for creating and editing Marp presentations with AI assistance.
This MCP server allows LLMs to edit Markdown files according to a specified layout, and now supports the default Marp theme along with Gaia, Uncover, and the [academic custom CSS](./assets/academic.css) in this repository.

<a href="https://glama.ai/mcp/servers/@masaki39/marp-mcp">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@masaki39/marp-mcp/badge" alt="Marp Server MCP server" />
</a>

## Setup

Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "marp-mcp": {
      "command": "npx",
      "args": ["-y", "@masaki39/marp-mcp"]
    }
  }
}
```

### Theme selection

The server uses Marp's default theme unless you specify another one. To switch themes when launching the MCP server, pass `-t` or `--theme`:

```bash
npx @masaki39/marp-mcp -t academic
npx @masaki39/marp-mcp -t gaia
npx @masaki39/marp-mcp -t uncover
npx @masaki39/marp-mcp --theme academic
```

Future themes can be activated with the same flag once they are added.

Gaia and Uncover reuse the default layout set, while Gaia's title layout automatically applies the `lead` class so you can opt into that styling without manual markup.

## Tools

| Tool | Description |
|------|-------------|
| `list_layouts` | List all available slide layouts with parameters and descriptions |
| `init_marp_file` | Ensure Marp frontmatter fields exist and generate IDs for all slides |
| `manage_slide` | Insert, replace, or delete slides using slide IDs (ID-based operations) |

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

## Example

See the [example presentation](https://filedn.com/lF97wFVWosQpHEoDAbvva0h/slides/%E2%96%B6%EF%B8%8F2025-10-04_marp-mcp-example.html) demonstrating all available layouts.

The example was created entirely using this MCP server and showcases:
- Title and section slides
- List and table layouts
- Two-column layout
- Image layouts (center and right)

Source: [example.md](./assets/example.md)

Theme-specific layout references:
- [Academic theme example](./assets/examples/example-academic-theme.md)
- [Default theme example](./assets/examples/example-default-theme.md)
- [Gaia theme example](./assets/examples/example-gaia-theme.md)
- [Uncover theme example](./assets/examples/example-uncover-theme.md)

## License

MIT License

## Links

- [GitHub](https://github.com/masaki39/marp-mcp)
- [npm](https://www.npmjs.com/package/@masaki39/marp-mcp)
- [Marp](https://marp.app/)
- [Model Context Protocol](https://modelcontextprotocol.io)
