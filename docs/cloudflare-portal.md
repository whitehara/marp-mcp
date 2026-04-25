# Cloudflare MCP Server Portal との連携

[Cloudflare Zero Trust](https://one.cloudflare.com/) の **AI Controls** でこのサーバーを MCP Server として登録する場合、登録時に設定する **Server ID** と環境変数 `MCP_SERVER_ID` を一致させる必要があります。

> **重要:** MCP ホストはリソース URI の先頭にサーバー ID を付加して内部管理します（例: `marp-mcp_ui://marp-mcp/preview.html`）。`MCP_SERVER_ID` がこのサーバー ID と一致していないと、`preview_slide` の UI 読み込み時に **-32602 Invalid resource URI** エラーが発生します。

## 設定例

Cloudflare AI Controls で Server ID を `marp-mcp`（デフォルト）のまま登録する場合、環境変数の追加は不要です。

Server ID を変更した場合は `compose.yml` または `docker run` の `-e` オプションで合わせてください:

```yaml
environment:
  - MCP_SERVER_ID=your-server-id   # Cloudflare AI Controls の Server ID と同じ値
```

デフォルト値は `marp-mcp` です。

## 技術的な背景

MCP ホスト（Claude）はリソース URI を内部管理する際に `{serverId}_{resourceUri}` 形式を使用します。たとえば Server ID が `marp-mcp` の場合、`ui://marp-mcp/preview.html` は `marp-mcp_ui://marp-mcp/preview.html` として扱われます。

Node.js の URL パーサーはアンダースコアを含むスキーム（`marp-mcp_ui://`）を不正と判断するため、このサーバーはリクエスト受信時に `{MCP_SERVER_ID}_` プレフィックスを自動的に除去してから処理します（`src/mcp.ts` の `normalizeResourceReadUri`）。
