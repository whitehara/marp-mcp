---
name: marp
description: Create and edit Marp presentations using marp-mcp CLI. Use when user wants to create slides, manage presentations, or work with Marp markdown files.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# Marp Presentation Skill

Create and edit Marp slide decks via the `marp-mcp` CLI.

## Installation Check

First, verify the CLI is available:

```bash
marp-mcp --version
```

If not installed, use npx:

```bash
npx @masaki39/marp-mcp@latest --version
```

## Available Themes and Styles

### Themes

`academic`, `default`, `gaia`, `uncover`

### Styles

| Style | Description | Compatible Themes |
|-------|-------------|-------------------|
| `rich` | Rich visual style with cards, timelines, grids, gradients, and more | all themes |
| `minimal` | Clean, flat design with typography focus and minimal decoration | all themes |
| `dark` | Dark mode style with indigo and emerald accents, developer-friendly | all themes |
| `corporate` | Professional business style with navy color scheme, structured layouts | all themes |
| `academic` | Academic conference presentation style with maroon color scheme, structured for scholarly talks | all themes |

## CLI Command Reference

### Global Options

- `-t, --theme <name>` — Select theme (default: `default`)
- `-s, --style <name>` — Select style (default: `default`)
- `-V, --version` — Show version
- `-h, --help` — Show help

### Commands

#### `list-layouts`

List all available slide layouts (JSON output).

```bash
marp-mcp list-layouts
marp-mcp -t gaia list-layouts
marp-mcp -s rich list-layouts
```

#### `set-frontmatter <file>`

Add or update Marp frontmatter fields.

```bash
marp-mcp set-frontmatter slides.md --header "My Presentation" --paginate
marp-mcp -t academic set-frontmatter slides.md --header "Research Talk"
```

Options:
- `--header <text>` — Header text
- `--paginate / --no-paginate` — Enable or disable pagination

#### `manage <file>`

Insert, replace, or delete slides using slide IDs.

```bash
marp-mcp manage slides.md -l title -p '{"title":"Hello","subtitle":"World"}'
marp-mcp manage slides.md -l content -p '{"title":"Agenda","body":"- Item 1\n- Item 2"}' --position after --slide-id slide-1
marp-mcp manage slides.md -l content --mode replace --slide-id slide-2 -p '{"title":"Updated"}'
marp-mcp manage slides.md -l content --mode delete --slide-id slide-3
```

Options:
- `-l, --layout <type>` — Layout type (required)
- `-p, --params <json>` — Parameters as JSON string (default: `{}`)
- `-m, --mode <mode>` — Operation mode: `insert` | `replace` | `delete` (default: `insert`)
- `--position <pos>` — Position: `end` | `start` | `after` | `before` (default: `end`)
- `--slide-id <id>` — Target slide ID (required for `after`, `before`, `replace`, `delete`)
- `--note <text>` — Speaker notes

#### `generate-ids <file>`

Generate slide IDs for every slide in a Marp markdown file.

```bash
marp-mcp generate-ids slides.md
```

## Workflow

Follow this order when creating a new presentation:

1. **Set frontmatter** — Initialize the file with theme, header, and pagination
   ```bash
   marp-mcp -t default -s rich set-frontmatter slides.md --header "Title" --paginate
   ```

2. **Manage slides** — Add slides one by one using layouts
   ```bash
   marp-mcp -s rich manage slides.md -l title -p '{"title":"My Talk","subtitle":"Subtitle"}'
   marp-mcp -s rich manage slides.md -l content -p '{"title":"Intro","body":"Hello world"}'
   ```

3. **Generate IDs** — Assign IDs for future editing
   ```bash
   marp-mcp generate-ids slides.md
   ```

4. **Edit slides** — Use replace/delete modes with slide IDs
   ```bash
   marp-mcp -s rich manage slides.md -l content --mode replace --slide-id slide-1 -p '{"title":"Updated"}'
   ```

## Layout Information

To get available layouts and their parameters, run:

```bash
marp-mcp list-layouts
```

Or with a specific theme/style:

```bash
marp-mcp -t <theme> -s <style> list-layouts
```

`!`marp-mcp list-layouts``

## Best Practices

- Always run `set-frontmatter` before adding slides to ensure correct theme/style setup
- Use `list-layouts` to check available layouts and required parameters for the current theme/style
- Run `generate-ids` after adding all initial slides, then use IDs for subsequent edits
- When replacing slides, always specify the correct `--slide-id`
- Use `--note` to add speaker notes to any slide
- Prefer `--position after --slide-id <id>` for precise slide placement
