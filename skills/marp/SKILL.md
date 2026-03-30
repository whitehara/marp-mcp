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

- **Theme** (`-t`): Base CSS that defines the slide foundation. Each theme is a standalone CSS file in the repository.
- **Style** (`-s`): Additional CSS layouts and components layered on top of a theme. Styles are designed for the `default` theme, so `-s` implies `-t default` unless explicitly overridden.

### Themes

`academic`, `default`, `gaia`, `uncover`

### Styles

| Style | Description |
|-------|-------------|
| `rich` | Rich visual style with cards, timelines, grids, gradients, and more |
| `minimal` | Clean, flat design with typography focus and minimal decoration |
| `dark` | Dark mode style with indigo and emerald accents, developer-friendly |
| `corporate` | Professional business style with navy color scheme, structured layouts |
| `academic` | Academic conference presentation style with maroon color scheme, structured for scholarly talks |
| `tech` | Modern tech/startup style with violet-cyan gradient accents, strong typography for product demos and engineering talks |

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
marp-mcp -s academic set-frontmatter slides.md --header "Research Talk"
```

Options:
- `--header <text>` — Header text
- `--paginate / --no-paginate` — Enable or disable pagination

#### `create <file>`

Create a new Marp presentation with frontmatter and a title slide in one step.

```bash
marp-mcp create slides.md --title "My Talk"
marp-mcp -s tech create slides.md --title "Product Demo" --subtitle "Q3 2025" --slides 5
```

Options:
- `--title <text>` — Presentation title (required)
- `--subtitle <text>` — Optional subtitle for the title slide
- `--no-paginate` — Disable slide page numbers
- `--slides <n>` — Number of blank content placeholder slides to add (default: `0`)

#### `manage <file>`

Insert, replace, or delete slides using slide IDs.

```bash
marp-mcp manage slides.md -l title -p '{"heading":"Hello","content":"World"}'
marp-mcp manage slides.md -l content -p '{"heading":"Agenda","body":"- Item 1\n- Item 2"}' --position after --slide-id <id>
marp-mcp manage slides.md -l content --mode replace --slide-id <id> -p '{"heading":"Updated","body":"New content"}'
marp-mcp manage slides.md --mode delete --slide-id <id>
```

Options:
- `-l, --layout <type>` — Layout type (required for insert/replace)
- `-p, --params <json>` — Parameters as JSON string (default: `{}`)
- `-m, --mode <mode>` — Operation mode: `insert` | `replace` | `delete` (default: `insert`)
- `--position <pos>` — Position: `end` | `start` | `after` | `before` (default: `end`)
- `--slide-id <id>` — Target slide ID (required for `after`, `before`, `replace`, `delete`)
- `--note <text>` — Speaker notes

#### `read <file>`

Read slide content from a Marp file.

```bash
marp-mcp read slides.md
marp-mcp read slides.md --slide-id <id>
```

Options:
- `--slide-id <id>` — Read a specific slide by ID (omit to list all slides with their IDs)

#### `generate-ids <file>`

Generate slide IDs for every slide in a Marp markdown file. Safe to run multiple times — existing IDs are never changed.

```bash
marp-mcp generate-ids slides.md
```

#### `export <file>`

Export a Marp presentation to HTML or PDF.

```bash
marp-mcp export slides.md -f html
marp-mcp export slides.md -f pdf -o /tmp/presentation.pdf
```

Options:
- `-f, --format <format>` — Output format: `html` | `pdf` (required)
- `-o, --output <path>` — Output file path (default: same directory as input)
- `--allow-local-files` — Allow local image file access in HTML export
- `--theme-set <path>` — Path to a custom theme CSS file

## Workflow

### Quick Start (Recommended)

Use `create` to initialize a new presentation in one step, then add slides:

```bash
marp-mcp -s rich create slides.md --title "My Talk" --subtitle "Author · Event" --slides 3
marp-mcp -s rich list-layouts
marp-mcp -s rich manage slides.md -l content --mode replace --slide-id <id> -p '{"heading":"Intro","body":"Hello world"}'
marp-mcp export slides.md -f html
```

### Manual Workflow

Follow this order when building a presentation from scratch:

1. **Set frontmatter** — Initialize the file with theme, header, and pagination
   ```bash
   marp-mcp -s rich set-frontmatter slides.md --header "Title" --paginate
   ```

2. **Manage slides** — Add slides one by one using layouts
   ```bash
   marp-mcp -s rich manage slides.md -l title -p '{"heading":"My Talk","content":"Subtitle"}'
   marp-mcp -s rich manage slides.md -l content -p '{"heading":"Intro","body":"Hello world"}'
   ```

3. **Generate IDs** — Assign IDs for future editing
   ```bash
   marp-mcp generate-ids slides.md
   ```

4. **Edit slides** — Use replace/delete modes with slide IDs
   ```bash
   marp-mcp -s rich manage slides.md -l content --mode replace --slide-id <id> -p '{"heading":"Updated","body":"New content"}'
   ```

5. **Export** — Export to HTML or PDF
   ```bash
   marp-mcp export slides.md -f html
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

- Use `create` for new presentations — it handles frontmatter, title slide, and IDs in one call
- Use `list-layouts` before `manage` to check available layouts and required parameters
- Run `generate-ids` after adding all initial slides, then use IDs for subsequent edits
- When replacing slides, always specify the correct `--slide-id` (use `read` to discover IDs)
- Use `--note` to add speaker notes to any slide
- Prefer `--position after --slide-id <id>` for precise slide placement
- Use `export -f html` to preview the presentation in a browser
