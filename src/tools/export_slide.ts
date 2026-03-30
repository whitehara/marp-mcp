/**
 * Tool: export_slide
 * Exports a Marp markdown presentation to HTML or PDF using marp-cli.
 */

import { z } from "zod";
import { spawn } from "child_process";
import { promises as fs } from "fs";
import { join } from "path";
import { validateFilePath } from "../utils/path-validator.js";
import { createErrorResponse, createSuccessResponse } from "../utils/response.js";
import type { ToolResponse } from "../types/common.js";

export const exportSlideSchema = z.object({
  filePath: z.string().describe("Absolute path to the Marp markdown file to export (must end in .md)"),
  format: z
    .enum(["html", "pdf"])
    .describe(
      "Output format: 'html' for browser-viewable presentation with full style rendering, " +
        "'pdf' for printable document"
    ),
  outputPath: z
    .string()
    .optional()
    .describe(
      "Absolute path for the output file (e.g. /tmp/presentation.html). " +
        "If omitted, output is placed next to the input file with the matching extension."
    ),
  allowLocalFiles: z
    .boolean()
    .optional()
    .describe(
      "Allow local file access in HTML export (enables local images). Defaults to false for security. " +
        "Set true only when images are referenced by local file paths."
    ),
  themeSet: z
    .string()
    .optional()
    .describe(
      "Absolute path to a custom theme CSS file to include. " +
        "Omit when using built-in themes (default, gaia, uncover)."
    ),
});

/**
 * Resolves the marp CLI binary path.
 * Looks in node_modules/.bin relative to the current working directory (project root).
 */
function getMarpBinPath(): string {
  return join(process.cwd(), "node_modules", ".bin", "marp");
}

/**
 * Runs marp CLI with the given args and resolves with { exitCode, stdout, stderr }.
 */
function runMarp(
  args: string[],
  timeoutMs: number
): Promise<{ exitCode: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const marpBin = getMarpBinPath();
    const proc = spawn(marpBin, args, { stdio: ["ignore", "pipe", "pipe"] });

    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      proc.kill("SIGTERM");
    }, timeoutMs);

    proc.stdout.on("data", (chunk: Buffer) => { stdout += chunk.toString(); });
    proc.stderr.on("data", (chunk: Buffer) => { stderr += chunk.toString(); });

    proc.on("close", (code) => {
      clearTimeout(timer);
      if (timedOut) {
        resolve({ exitCode: -1, stdout, stderr: "Export timed out after 60 seconds" });
      } else {
        resolve({ exitCode: code ?? 1, stdout, stderr });
      }
    });

    proc.on("error", (err) => {
      clearTimeout(timer);
      resolve({ exitCode: -1, stdout: "", stderr: err.message });
    });
  });
}

/**
 * MCP Tool: Exports a Marp markdown presentation to HTML or PDF.
 *
 * @param {object} options - Export options
 * @param {string} options.filePath - Absolute path to the Marp markdown file
 * @param {"html" | "pdf"} options.format - Output format
 * @param {string} [options.outputPath] - Output file path (default: same dir as input)
 * @param {boolean} [options.allowLocalFiles] - Allow local file access in HTML export
 * @param {string} [options.themeSet] - Path to custom theme CSS file
 * @returns {Promise<ToolResponse>} Export result with output file path
 */
export async function exportSlide({
  filePath,
  format,
  outputPath,
  allowLocalFiles,
  themeSet,
}: z.infer<typeof exportSlideSchema>): Promise<ToolResponse> {
  // Validate input file path
  const pathError = validateFilePath(filePath);
  if (pathError) {
    return createErrorResponse(pathError);
  }

  // Validate themeSet path if provided
  if (themeSet) {
    const themeError = validateFilePath(themeSet, [".css"]);
    if (themeError) {
      return createErrorResponse(`Invalid themeSet path: ${themeError}`);
    }
  }

  // Validate outputPath if provided
  if (outputPath) {
    const outputError = validateFilePath(outputPath, [".html", ".pdf"]);
    if (outputError) {
      return createErrorResponse(`Invalid outputPath: ${outputError}`);
    }
  }

  // Check that the input file exists
  try {
    await fs.access(filePath);
  } catch {
    return createErrorResponse(
      `File not found: ${filePath}. Ensure the file exists before exporting.`
    );
  }

  // Determine output path
  const resolvedOutput = outputPath ?? filePath.replace(/\.md$/, `.${format}`);

  // Build marp CLI args
  const args: string[] = [
    "--no-config-file",
    "--html",                          // always enable --html for style class rendering
    "--output", resolvedOutput,
  ];

  if (format === "pdf") {
    args.push("--pdf");
  }

  if (allowLocalFiles) {
    args.push("--allow-local-files");
  }

  if (themeSet) {
    args.push("--theme-set", themeSet);
  }

  args.push(filePath);

  // Run marp CLI
  const { exitCode, stderr } = await runMarp(args, 60_000);

  if (exitCode !== 0) {
    const errorMessage = stderr.trim() || `marp CLI exited with code ${exitCode}`;
    return createErrorResponse(`Export failed: ${errorMessage}`);
  }

  return createSuccessResponse({
    message: `Exported successfully to ${format.toUpperCase()}`,
    outputPath: resolvedOutput,
    format,
    sourceFile: filePath,
  });
}
