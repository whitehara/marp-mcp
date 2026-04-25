/**
 * Shared marp-cli subprocess utility for markdown-direct export.
 */

import { spawn } from "child_process";
import { promises as fs } from "fs";
import { join } from "path";
import { tmpdir } from "os";

export type ExportFormat = "pdf" | "pptx";

export interface RunMarpOptions {
  format: ExportFormat;
  editable?: boolean;
}

// Cached after first resolution — the binary location doesn't change at runtime.
let _marpCommand: string | undefined;

/** Resolves the marp binary: dev node_modules first, then system PATH. */
async function getMarpCommand(): Promise<string> {
  if (_marpCommand !== undefined) return _marpCommand;
  const devPath = join(process.cwd(), "node_modules", ".bin", "marp");
  try {
    await fs.access(devPath);
    _marpCommand = devPath;
  } catch {
    _marpCommand = "marp";
  }
  return _marpCommand;
}

function runCommand(
  command: string,
  args: string[],
  timeoutMs: number
): Promise<{ exitCode: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const proc = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });

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
        resolve({ exitCode: -1, stdout, stderr: `Command timed out after ${timeoutMs / 1000}s` });
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

/** Injects or replaces the theme in Marp frontmatter. */
export function injectTheme(markdown: string, theme: string): string {
  const m = markdown.match(/^---\n([\s\S]*?)\n---/);
  if (m) {
    const fm = m[1];
    const newFm = /^theme:/m.test(fm)
      ? fm.replace(/^theme:.*$/m, `theme: ${theme}`)
      : `${fm}\ntheme: ${theme}`;
    return markdown.replace(m[0], `---\n${newFm}\n---`);
  }
  return `---\ntheme: ${theme}\n---\n\n${markdown}`;
}

/**
 * Runs marp-cli on the given markdown string and returns the output as a Buffer.
 * Writes to a temp directory and cleans up on completion.
 */
export async function runMarpFromMarkdown(
  markdown: string,
  opts: RunMarpOptions
): Promise<Buffer> {
  const tmpDir     = await fs.mkdtemp(join(tmpdir(), "marp-export-"));
  const inputPath  = join(tmpDir, "input.md");
  const ext        = opts.format === "pdf" ? "pdf" : "pptx";
  const outputPath = join(tmpDir, `output.${ext}`);

  try {
    await fs.writeFile(inputPath, markdown, "utf-8");

    const args: string[] = [
      "--no-config-file",
      "--html",
      "--output", outputPath,
    ];

    if (opts.format === "pdf") {
      args.push("--pdf");
    } else {
      args.push("--pptx");
      if (opts.editable) args.push("--pptx-editable");
    }

    args.push(inputPath);

    const command = await getMarpCommand();
    const result  = await runCommand(command, args, 120_000);

    if (result.exitCode !== 0) {
      const msg = result.stderr.trim() || `marp exited with code ${result.exitCode}`;
      throw new Error(`marp-cli failed: ${msg}`);
    }

    return await fs.readFile(outputPath);
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
}
