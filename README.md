# marp-mcp

An MCP server for creating and editing [Marp](https://marp.app/) presentations with AI assistance.

This project integrates [masaki39/marp-mcp](https://github.com/masaki39/marp-mcp) (slide management tools, theme/style system, CLI framework) with [iwamot/marp-agent-mcp](https://github.com/iwamot/marp-agent-mcp) (HTTP transport, overflow validation, interactive preview UI) to produce a full-featured, self-hostable Marp MCP server.

## Features

- **Dual transport** — stdio for local MCP clients, HTTP for self-hosted / containerized deployments
- **12 tools** — slide CRUD, theme/style selection, overflow validation, PDF/PPTX export, and interactive preview
- **East Asian character support** — accurate overflow detection for Japanese, Chinese, and Korean text
- **MCP Apps preview** — interactive slide preview with theme switching and in-browser download
- **Docker-ready** — multi-stage Dockerfile with Chromium (PDF) and LibreOffice (editable PPTX)

---

## Tools

| Tool | Description |
|------|-------------|
| `list_themes_and_styles` | List available themes and styles with descriptions; shows current server defaults |
| `list_layouts` | List slide layouts and their required/optional parameters for a given theme/style |
| `create_presentation` | Create a new Marp file in one step — initializes frontmatter and adds a title slide |
| `set_frontmatter` | Initialize or update required Marp frontmatter (`marp`, `theme`, `header`, `paginate`) |
| `read_slide` | Read slide content by ID, or list all slides with their IDs and positions |
| `generate_slide_ids` | Assign stable UUIDs to every slide in a file (safe to re-run; existing IDs are never changed) |
| `manage_slide` | Insert, replace, or delete slides using stable slide IDs |
| `validate_slide` | Detect per-slide overflow with full East Asian character width support |
| `export_slide` | Export a Marp file (by path) to HTML, PDF, or PPTX via marp-cli |
| `export_pdf` | Export Marp markdown text directly to PDF; returns base64-encoded data for in-browser download |
| `export_pptx` | Export Marp markdown text directly to PPTX; returns base64-encoded data for in-browser download |
| `preview_slide` | Open an interactive slide preview UI (MCP Apps) with theme switching and download buttons |

### Recommended workflow

```
list_themes_and_styles
  → list_layouts
  → create_presentation
  → manage_slide  (add / edit slides)
  → validate_slide
  → export_slide  (or preview_slide)
```

`export_pdf` and `export_pptx` are called by the `preview_slide` UI when the user clicks the download button. They can also be called directly to get base64 file data.

### Per-call theme/style override

`list_layouts`, `manage_slide`, and `set_frontmatter` accept optional `theme` and `style` parameters to override the server default for a single call:

```json
{ "theme": "gaia", "style": "rich" }
```

---

## Installation

**Requirements:** Node.js ≥ 18, [pnpm](https://pnpm.io/)

```bash
git clone https://github.com/whitehara/marp-mcp.git
cd marp-mcp
pnpm install
pnpm run build
```

Build output is written to `build/`.

---

## Startup

### stdio mode (default)

```bash
node build/index.js serve
```

Connect a local MCP client (Claude Desktop, Claude Code) using the stdio transport:

```json
{
  "mcpServers": {
    "marp-mcp": {
      "command": "node",
      "args": ["/absolute/path/to/marp-mcp/build/index.js", "serve"]
    }
  }
}
```

### HTTP mode

```bash
MCP_TRANSPORT=http PORT=3000 node build/index.js serve
```

The server listens on `http://0.0.0.0:3000/mcp`.  
A health check endpoint is available at `http://0.0.0.0:3000/health`.

Connect an HTTP-capable MCP client to `http://localhost:3000/mcp`.

### Setting the default theme and style

Pass `-t` / `--theme` and `-s` / `--style` to set server-wide defaults at startup:

```bash
node build/index.js serve -t gaia -s rich
```

| Argument | Options |
|----------|---------|
| `--theme` | `default`, `gaia`, `uncover`, `academic` |
| `--style` | `default`, `rich`, `minimal`, `dark`, `corporate`, `academic`, `tech` |

Omitting these flags defaults to `default` theme and `default` style.

---

## Docker

### Build the image

```bash
docker build -t marp-mcp .
```

The image is based on `node:24-slim` and includes:
- **Chromium** — for PDF export via Puppeteer
- **fonts-noto-cjk** — CJK font support (Japanese, Chinese, Korean)
- **LibreOffice Impress** — for editable PPTX export (`pptxEditable: true`)
- **marp-cli** — installed globally from npm

### Run the container

```bash
# Using a locally built image
docker run -p 3000:3000 marp-mcp

# Using the pre-built image
docker run -p 3000:3000 ghcr.io/whitehara/marp-mcp:latest
```

The server starts in HTTP mode automatically (`MCP_TRANSPORT=http` is set in the image).

### Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MCP_TRANSPORT` | `http` | Transport: `http` or `stdio` |
| `PORT` | `3000` | HTTP listen port |
| `MCP_SERVER_ID` | `marp-mcp` | Server ID — must match the ID registered in your MCP host (e.g., Cloudflare AI Controls) |
| `PUPPETEER_EXECUTABLE_PATH` | `/usr/bin/chromium` | Chromium binary path for PDF export |
| `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD` | `true` | Skip bundled Chromium download (uses system Chromium) |

---

## compose.yml

A `compose.yml` is provided for Docker Compose and Swarm deployments:

```yaml
services:
  marp-mcp:
    image: ghcr.io/whitehara/marp-mcp:latest
    ports:
      - "3000:3000"
    environment:
      - MCP_TRANSPORT=http
      - PORT=3000
      # MCP_SERVER_ID must match the Server ID registered in Cloudflare AI Controls.
      # Default: marp-mcp
      #- MCP_SERVER_ID=marp-mcp
```

After starting, connect your MCP client to `http://<host>:3000/mcp`.

---

## Available Themes and Styles

### Themes

| Theme | Description |
|-------|-------------|
| `default` | Standard Marp default theme |
| `gaia` | Marp Gaia theme (light, clean) |
| `uncover` | Marp Uncover theme (minimal, bold) |
| `academic` | Academic conference style with maroon color scheme |

### Styles (default theme variants)

| Style | Description |
|-------|-------------|
| `default` | Standard layout set |
| `rich` | Cards, timelines, grids, gradients |
| `minimal` | Clean, flat design with typography focus |
| `dark` | Dark mode with indigo and emerald accents |
| `corporate` | Professional business style with navy color scheme |
| `academic` | Scholarly layout set (compatible with `default` theme) |
| `tech` | Modern tech/startup style with violet-cyan gradient accents |

Run `list_themes_and_styles` to see all available layouts for each combination, or `list_layouts` with a specific `theme`/`style` pair.

---

## Development

```bash
pnpm test           # Run test suite
pnpm run build      # TypeScript compile + Vite UI bundle
pnpm run build:ui   # Vite bundle only (mcp-app.html)
```

> **Note:** The original masaki39/marp-mcp project auto-generates `README.md` and `skills/marp/SKILL.md` via Jest generator tests. Running `pnpm test` in this fork will regenerate those files from the generator templates. If you update the README manually, skip the generator tests or update `src/__tests__/readme-generator.test.ts` accordingly.

---

## Cloudflare MCP Server Portal との連携

[Cloudflare Zero Trust](https://one.cloudflare.com/) の **AI Controls** でこのサーバーを MCP Server として登録する場合、登録時に設定する **Server ID** と環境変数 `MCP_SERVER_ID` を一致させる必要があります。

> **重要:** MCP ホストはリソース URI の先頭にサーバー ID を付加して内部管理します（例: `marp-mcp_ui://marp-mcp/preview.html`）。`MCP_SERVER_ID` がこのサーバー ID と一致していないと、`preview_slide` の UI 読み込み時に **-32602 Invalid resource URI** エラーが発生します。

### 設定例

Cloudflare AI Controls で Server ID を `marp-mcp`（デフォルト）のまま登録する場合、環境変数の追加は不要です。

Server ID を変更した場合は `compose.yml` または `docker run` の `-e` オプションで合わせてください:

```yaml
environment:
  - MCP_SERVER_ID=your-server-id   # Cloudflare AI Controls の Server ID と同じ値
```

デフォルト値は `marp-mcp` です。

---

## Credits

This project builds on the work of:

- **[masaki39/marp-mcp](https://github.com/masaki39/marp-mcp)** — Core slide management tools, theme/style system, ID-based slide operations, and CLI framework. Thank you for the thoughtful architecture and rich layout library.

- **[iwamot/marp-agent-mcp](https://github.com/iwamot/marp-agent-mcp)** — HTTP transport design, `validate_slide` (East Asian character width overflow detection), and `preview_slide` (MCP Apps interactive UI). Thank you for pioneering the preview and validation patterns.

---

## License

MIT
