# Deployment Guide

This guide covers building from source, running via Docker, and deploying with Docker Compose / Swarm.

---

## Building from Source

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
| `MCP_SERVER_ID` | `marp-mcp` | Server ID — must match the ID registered in your MCP host (e.g., Cloudflare AI Controls). See [Cloudflare MCP Server Portal](cloudflare-portal.md). |
| `PUPPETEER_EXECUTABLE_PATH` | `/usr/bin/chromium` | Chromium binary path for PDF export |
| `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD` | `true` | Skip bundled Chromium download (uses system Chromium) |
| `EXPORT_BACKEND` | `none` | Export backend: `none` (base64 in response), `nextcloud_nfs` (write to NFS path). See [Nextcloud Export](nextcloud-export.md). |
| `NEXTCLOUD_EXPORT_PATH` | *(required for `nextcloud_nfs`)* | Absolute path to the NFS-mounted export directory (e.g. `/nextcloud-data/data/username/files/marp-exports`) |
| `NEXTCLOUD_BASE_URL` | *(required for `nextcloud_nfs`)* | Base URL of your Nextcloud instance (e.g. `https://nextcloud.example.com`) |
| `NEXTCLOUD_USERNAME` | *(required for `nextcloud_nfs`)* | Nextcloud username used to construct the download URL |

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
