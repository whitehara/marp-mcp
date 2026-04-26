/**
 * Pluggable export backend for export_pdf / export_pptx / export_slide.
 *
 * Backend is selected by the EXPORT_BACKEND environment variable:
 *   none           — return base64 in the tool response (default)
 *   nextcloud_nfs  — write to an NFS-mounted Nextcloud path and return a download URL
 *   nextcloud_webdav — (future) upload via WebDAV
 *   box            — (future) upload via Box API
 */

import { promises as fs } from "fs";
import { dirname, basename } from "path";

type BackendName = "none" | "nextcloud_nfs" | "nextcloud_webdav" | "box";

function getBackendName(): BackendName {
  const v = (process.env.EXPORT_BACKEND ?? "none").toLowerCase();
  if (v === "nextcloud_nfs" || v === "nextcloud_webdav" || v === "box") return v;
  return "none";
}

function nfsExportDir(): string {
  return process.env.NEXTCLOUD_EXPORT_PATH ?? "/tmp/marp-exports";
}

function nextcloudDownloadUrl(filename: string): string {
  const base = process.env.NEXTCLOUD_BASE_URL ?? "https://nextcloud.example.com";
  return `${base}/index.php/apps/files/?dir=/marp-exports&openfile=${encodeURIComponent(filename)}`;
}

export interface ExportSaveResult {
  /** Human-readable message for the tool response */
  message: string;
  /** Base64-encoded file data — only populated by the 'none' backend */
  base64?: string;
  /** Download URL — populated by cloud/NFS backends */
  downloadUrl?: string;
}

/**
 * For buffer-based exports (export_pdf, export_pptx):
 * save the buffer according to the active backend and return result metadata.
 */
export async function saveExportBuffer(
  filename: string,
  buffer: Buffer,
): Promise<ExportSaveResult> {
  switch (getBackendName()) {
    case "nextcloud_nfs": {
      const outPath = `${nfsExportDir()}/${filename}`;
      await fs.mkdir(dirname(outPath), { recursive: true });
      await fs.writeFile(outPath, buffer);
      return {
        message: `Saved to Nextcloud: ${filename}`,
        downloadUrl: nextcloudDownloadUrl(filename),
      };
    }
    default:
      return {
        message: `Exported ${filename} (${buffer.length} bytes)`,
        base64: buffer.toString("base64"),
      };
  }
}

/**
 * For file-based exports (export_slide):
 * returns the path that marp-cli should write to.
 * When using the NFS backend, this redirects output to the NFS directory.
 */
export function resolveExportOutputPath(defaultPath: string): string {
  if (getBackendName() === "nextcloud_nfs") {
    return `${nfsExportDir()}/${basename(defaultPath)}`;
  }
  return defaultPath;
}

/**
 * For file-based exports (export_slide):
 * ensure the output directory exists (needed when the backend redirects to NFS).
 */
export async function ensureExportDir(outputPath: string): Promise<void> {
  if (getBackendName() === "nextcloud_nfs") {
    await fs.mkdir(dirname(outputPath), { recursive: true });
  }
}

/**
 * For file-based exports (export_slide):
 * returns extra fields to merge into the tool response after the file is written.
 */
export function buildFileExportExtra(outputPath: string): { downloadUrl?: string } {
  if (getBackendName() === "nextcloud_nfs") {
    return { downloadUrl: nextcloudDownloadUrl(basename(outputPath)) };
  }
  return {};
}
