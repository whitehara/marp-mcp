/**
 * CLI subcommand definitions
 */

import type { Command } from "commander";
import { resolveFilePath, outputResult } from "./helpers.js";
import { listLayouts } from "../tools/list_layouts.js";
import { generateSlideIds } from "../tools/generate_slide_ids.js";
import { manageSlide } from "../tools/manage_slide.js";
import { setFrontmatter } from "../tools/set_frontmatter.js";

/**
 * Registers all CLI subcommands on the given commander program.
 */
export function registerCommands(program: Command): void {
  program
    .command("list-layouts")
    .description("List all available slide layouts (JSON output)")
    .action(async () => {
      const result = await listLayouts();
      outputResult(result);
    });

  program
    .command("generate-ids <file>")
    .description("Assign slide IDs to every slide in a Marp markdown file")
    .action(async (file: string) => {
      const result = await generateSlideIds({
        filePath: resolveFilePath(file),
      });
      outputResult(result);
    });

  program
    .command("manage <file>")
    .description("Insert, replace, or delete slides in a Marp file")
    .requiredOption("-l, --layout <type>", "Layout type (e.g. title, content)")
    .option("-p, --params <json>", "Parameters as JSON string", "{}")
    .option("-m, --mode <mode>", "Operation mode: insert | replace | delete", "insert")
    .option("--position <pos>", "Position: end | start | after | before", "end")
    .option("--slide-id <id>", "Target slide ID")
    .option("--note <text>", "Speaker notes")
    .action(async (file: string, opts: {
      layout: string;
      params: string;
      mode: string;
      position: string;
      slideId?: string;
      note?: string;
    }) => {
      let params: Record<string, any>;
      try {
        params = JSON.parse(opts.params);
      } catch {
        process.stderr.write("Error: --params must be valid JSON\n");
        process.exit(1);
      }

      const result = await manageSlide({
        filePath: resolveFilePath(file),
        layoutType: opts.layout,
        params,
        mode: opts.mode as "insert" | "replace" | "delete",
        position: opts.position as "end" | "start" | "after" | "before",
        slideId: opts.slideId,
        note: opts.note,
      });
      outputResult(result);
    });

  program
    .command("set-frontmatter <file>")
    .description("Add or update Marp frontmatter fields")
    .option("--header <text>", "Header text")
    .option("--paginate", "Enable pagination")
    .option("--no-paginate", "Disable pagination")
    .action(async (file: string, opts: {
      header?: string;
      paginate?: boolean;
    }) => {
      const result = await setFrontmatter({
        filePath: resolveFilePath(file),
        header: opts.header,
        paginate: opts.paginate,
      });
      outputResult(result);
    });
}
