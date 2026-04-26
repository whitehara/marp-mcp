# Nextcloud Export

This guide covers using the `nextcloud_nfs` export backend to save exported files (PDF / PPTX / HTML) directly to a Nextcloud-mounted NFS share.

---

## How it works

When `EXPORT_BACKEND=nextcloud_nfs` is set, `export_pdf`, `export_pptx`, and `export_slide` write files to an NFS-mounted directory instead of returning base64 data. The tool response includes a Nextcloud download URL pointing to the saved file.

**Advantages:**
- No base64 data in LLM context (saves tokens for large files)
- Files are immediately accessible in Nextcloud's file browser

---

## Requirements

- Nextcloud running with NFS data storage accessible to the marp-mcp container
- The export directory exists in Nextcloud's data path
- `filesystem_check_changes=1` set in Nextcloud config so Nextcloud detects externally-written files

---

## 1. Create the export directory

On the NFS server (or the node mounting the Nextcloud data volume):

```bash
# Replace with your actual Nextcloud data path and username
mkdir -p /path/to/nextcloud-data/data/<username>/files/marp-exports
chown -R www-data:www-data /path/to/nextcloud-data/data/<username>/files/marp-exports
```

---

## 2. Enable external filesystem change detection

Nextcloud does not detect files written directly to disk by default.  
Add or verify the following line in your `config.php`:

```php
'filesystem_check_changes' => 1,
```

This makes Nextcloud check for file changes on each access, so externally-written exports appear immediately.

---

## 3. Environment variables

| Variable | Description |
|----------|-------------|
| `EXPORT_BACKEND` | Set to `nextcloud_nfs` |
| `NEXTCLOUD_EXPORT_PATH` | Absolute path visible to the marp-mcp container (e.g. `/nextcloud-data/data/<username>/files/marp-exports`) |
| `NEXTCLOUD_BASE_URL` | Base URL of your Nextcloud instance (e.g. `https://nextcloud.example.com`) |
| `NEXTCLOUD_USERNAME` | Nextcloud username (used in the download URL) |

---

## 4. Add NFS volume to compose.yml

Mount the Nextcloud NFS volume into the marp-mcp service:

```yaml
services:
  marp-mcp:
    image: ghcr.io/whitehara/marp-mcp:latest
    environment:
      - EXPORT_BACKEND=nextcloud_nfs
      - NEXTCLOUD_EXPORT_PATH=/nextcloud-data/data/<username>/files/marp-exports
      - NEXTCLOUD_BASE_URL=https://nextcloud.example.com
      - NEXTCLOUD_USERNAME=<username>
    volumes:
      - nextcloud_nfs:/nextcloud-data

volumes:
  nextcloud_nfs:
    driver: local
    driver_opts:
      type: nfs
      o: addr=<nfs-server>,nfsvers=4.2,hard,nconnect=4
      device: ":/path/to/nextcloud-data"
```

---

## Tool response example

With `nextcloud_nfs` backend, `export_pdf` returns:

```json
{
  "content": [{ "type": "text", "text": "Saved to Nextcloud: my-slides.pdf" }],
  "structuredContent": {
    "filename": "my-slides.pdf",
    "mime_type": "application/pdf",
    "download_url": "https://nextcloud.example.com/index.php/apps/files/?dir=/marp-exports&openfile=my-slides.pdf"
  }
}
```

No `data_base64` field is included, keeping LLM context lean.

---

## Future backends

| Backend | Status | Description |
|---------|--------|-------------|
| `none` | ✅ Available | Returns base64 in tool response (default) |
| `nextcloud_nfs` | ✅ Available | Writes to NFS-mounted Nextcloud path |
| `nextcloud_webdav` | 🔮 Planned | Uploads via WebDAV API (no NFS mount required) |
| `box` | 🔮 Planned | Uploads via Box API |
