/**
 * MCP App for Marp slide preview with theme switching and export.
 * Runs in the browser (iframe) inside the MCP host.
 * Adapted from iwamot/marp-agent-mcp.
 */
import Marp from "@marp-team/marp-core";
import {
  App,
  applyDocumentTheme,
  applyHostFonts,
  applyHostStyleVariables,
  type McpUiHostContext,
} from "@modelcontextprotocol/ext-apps";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

// Built-in Marp themes (bundled in marp-core, no extra CSS needed)
const THEMES = [
  { id: "default", name: "Default" },
  { id: "gaia",    name: "Gaia" },
  { id: "uncover", name: "Uncover" },
] as const;
type ThemeId = typeof THEMES[number]["id"];

interface PreviewResultData {
  markdown: string;
  theme: ThemeId;
  name: string;
}

interface ExportResultData {
  data_base64: string;
  filename: string;
  mime_type: string;
}

const log = {
  info:  console.log.bind(console,  "[marp-mcp]"),
  error: console.error.bind(console, "[marp-mcp]"),
};

const marp = new Marp();
const app  = new App({ name: "Marp Preview", version: "1.0.0" });

// App state
let currentMarkdown: string | null = null;
let currentTheme: ThemeId = "default";
let currentName  = "slide";
let currentPage  = 0;
let totalPages   = 1;
let slides: string[] = [];

let canCallServerTools = false;
let canDownloadFile    = false;

// DOM
const mainEl          = document.querySelector(".main") as HTMLElement;
const themeSelect     = document.getElementById("themeSelect")     as HTMLSelectElement;
const firstBtn        = document.getElementById("firstBtn")        as HTMLButtonElement;
const prevBtn         = document.getElementById("prevBtn")         as HTMLButtonElement;
const nextBtn         = document.getElementById("nextBtn")         as HTMLButtonElement;
const lastBtn         = document.getElementById("lastBtn")         as HTMLButtonElement;
const downloadFormat  = document.getElementById("downloadFormat")  as HTMLSelectElement;
const downloadBtn     = document.getElementById("downloadBtn")     as HTMLButtonElement;
const slideStyle      = document.getElementById("slideStyle")      as HTMLStyleElement;
const slideContainer  = document.querySelector("#previewContainer .marpit") as HTMLElement;

// Populate theme selector
for (const t of THEMES) {
  const opt = document.createElement("option");
  opt.value = t.id;
  opt.textContent = t.name;
  themeSelect.appendChild(opt);
}

// Host context (theme, fonts, safe-area)
function handleHostContextChanged(ctx: McpUiHostContext) {
  if (ctx.theme) applyDocumentTheme(ctx.theme);
  if (ctx.styles?.variables) applyHostStyleVariables(ctx.styles.variables);
  if (ctx.styles?.css?.fonts) applyHostFonts(ctx.styles.css.fonts);
  if (ctx.safeAreaInsets) {
    mainEl.style.paddingTop    = `${ctx.safeAreaInsets.top}px`;
    mainEl.style.paddingRight  = `${ctx.safeAreaInsets.right}px`;
    mainEl.style.paddingBottom = `${ctx.safeAreaInsets.bottom}px`;
    mainEl.style.paddingLeft   = `${ctx.safeAreaInsets.left}px`;
  }
}

// Inject / replace theme in frontmatter
function injectTheme(markdown: string, theme: ThemeId): string {
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

function showToast(msg: string) {
  document.querySelector(".toast")?.remove();
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => {
    el.classList.add("toast-hide");
    el.addEventListener("animationend", () => el.remove());
  }, 3000);
}

function updatePageControls() {
  firstBtn.disabled = currentPage === 0;
  prevBtn.disabled  = currentPage === 0;
  nextBtn.disabled  = currentPage >= totalPages - 1;
  lastBtn.disabled  = currentPage >= totalPages - 1;
}

function updateDownloadAvailability() {
  downloadFormat.disabled = !canDownloadFile;
  downloadBtn.disabled    = !canDownloadFile;
  for (const opt of downloadFormat.options) {
    if (opt.value !== "md") opt.disabled = !canCallServerTools;
  }
  if (!canCallServerTools && downloadFormat.value !== "md") {
    downloadFormat.value = "md";
  }
}

function resetDownloadButton() {
  downloadBtn.textContent = "Download";
  downloadBtn.disabled    = !canDownloadFile;
}

function showCurrentSlide() {
  slideContainer.innerHTML = slides[currentPage] ?? "";
  for (const link of slideContainer.querySelectorAll<HTMLAnchorElement>("a[href]")) {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const url = link.getAttribute("href");
      if (url) app.openLink({ url });
    });
  }
}

function renderSlides() {
  if (!currentMarkdown) return;
  try {
    const { html, css } = marp.render(injectTheme(currentMarkdown, currentTheme));
    const doc  = new DOMParser().parseFromString(html, "text/html");
    slides     = Array.from(doc.querySelectorAll<SVGElement>("svg[data-marpit-svg]"))
                      .map((s) => s.outerHTML);
    slideStyle.textContent = css;
    totalPages = slides.length;
    updatePageControls();
    showCurrentSlide();
  } catch (err) {
    log.error("Render error:", err);
    showToast("レンダリングに失敗しました");
  }
}

async function triggerDownload(base64Data: string, filename: string, mimeType: string) {
  try {
    const { isError } = await app.downloadFile({
      contents: [{
        type: "resource",
        resource: { uri: `file:///${filename}`, mimeType, blob: base64Data },
      }],
    });
    if (isError) log.info("Download cancelled by host");
  } catch (e) {
    log.error("Download error:", e);
  }
  resetDownloadButton();
}

async function handleToolResult(result: CallToolResult) {
  let data = result.structuredContent as ExportResultData | undefined;
  // Fallback: parse JSON from content[0].text if structuredContent is absent
  if (!data?.data_base64) {
    const first = result.content?.[0];
    if (first && "text" in first) {
      try { data = JSON.parse(first.text) as ExportResultData; } catch { /* not JSON */ }
    }
  }
  if (data?.data_base64) {
    await triggerDownload(data.data_base64, data.filename, data.mime_type);
  } else {
    resetDownloadButton();
  }
}

async function handleMarkdownDownload() {
  if (!currentMarkdown) return;
  downloadBtn.disabled = true;
  downloadBtn.textContent = "wait...";
  try {
    const bytes  = new TextEncoder().encode(injectTheme(currentMarkdown, currentTheme));
    let binary   = "";
    for (const b of bytes) binary += String.fromCharCode(b);
    await app.downloadFile({
      contents: [{
        type: "resource",
        resource: {
          uri: `file:///${currentName}.md`,
          mimeType: "text/markdown",
          blob: btoa(binary),
        },
      }],
    });
  } catch (e) {
    log.error("Markdown download error:", e);
    showToast("ダウンロードに失敗しました");
  }
  resetDownloadButton();
}

async function handleServerExport(toolName: string, args: Record<string, unknown>) {
  if (!currentMarkdown) return;
  downloadBtn.disabled = true;
  downloadBtn.textContent = "wait...";
  try {
    const result = await app.callServerTool(
      { name: toolName, arguments: { markdown: currentMarkdown, theme: currentTheme, name: currentName, ...args } },
      { timeout: 120000 },
    );
    if (result && !result.isError) {
      await handleToolResult(result);
    } else {
      showToast("エクスポートに失敗しました");
      resetDownloadButton();
    }
  } catch (e) {
    log.error(`${toolName} failed:`, e);
    showToast("エクスポートに失敗しました");
    resetDownloadButton();
  }
}

// Event listeners
themeSelect.addEventListener("change", () => {
  currentTheme = themeSelect.value as ThemeId;
  if (currentMarkdown) renderSlides();
});
firstBtn.addEventListener("click", () => { currentPage = 0;               updatePageControls(); showCurrentSlide(); });
prevBtn .addEventListener("click", () => { if (currentPage > 0) currentPage--;              updatePageControls(); showCurrentSlide(); });
nextBtn .addEventListener("click", () => { if (currentPage < totalPages-1) currentPage++;   updatePageControls(); showCurrentSlide(); });
lastBtn .addEventListener("click", () => { currentPage = totalPages - 1;  updatePageControls(); showCurrentSlide(); });

downloadBtn.addEventListener("click", async () => {
  const fmt = downloadFormat.value;
  if      (fmt === "pdf")           await handleServerExport("export_pdf",  {});
  else if (fmt === "pptx")          await handleServerExport("export_pptx", {});
  else if (fmt === "pptx-editable") await handleServerExport("export_pptx", { editable: true });
  else if (fmt === "md")            await handleMarkdownDownload();
});

// MCP App lifecycle
app.ontoolresult = (result) => {
  const data = result.structuredContent as PreviewResultData | undefined;
  if (!data?.markdown) return;
  currentMarkdown = data.markdown;
  if (data.theme) { currentTheme = data.theme; themeSelect.value = currentTheme; }
  if (data.name)    currentName  = data.name;
  currentPage = 0;
  renderSlides();
  themeSelect.disabled = false;
  updateDownloadAvailability();
};

app.ontoolcancelled = (p) => { log.info("Cancelled:", p.reason); resetDownloadButton(); };
app.onerror = (e) => { log.error("App error:", e); };
app.onteardown = async () => { log.info("Teardown"); return {}; };
app.onhostcontextchanged = handleHostContextChanged;

app.connect()
  .then(() => {
    const ctx  = app.getHostContext();
    if (ctx) handleHostContextChanged(ctx);
    const caps = app.getHostCapabilities();
    canCallServerTools = !!caps?.serverTools;
    canDownloadFile    = !!caps?.downloadFile;
  })
  .catch((e: unknown) => { log.error("Connect failed:", e); });
