import { describe, expect, it, afterAll } from "@jest/globals";
import { promises as fs } from "fs";
import path from "path";
import { setActiveTheme } from "../../themes/index.js";
import {
  getAvailableStyleNames,
  getStyle,
  setActiveStyle,
} from "../index.js";
import type { StyleName } from "../../themes/types.js";

const examplesDir = path.resolve(process.cwd(), "assets/examples");
const examplesMarkdownDir = path.resolve(examplesDir, "md");

const SAMPLE_IMAGE = "https://picsum.photos/1280/720";

/**
 * Sample params for rich style layouts (complete set – no merge with theme).
 */
const richLayoutParams: Record<string, Record<string, unknown>> = {
  title: {
    heading: "Welcome to the Future",
    content: "A bold vision for modern presentations",
  },
  section: {
    title: "Part Two",
    subtitle: "Diving deeper into the details",
  },
  list: {
    heading: "Key Points",
    list: ["Background context", "Insights discovered", "Next steps"],
    citations: "Source: Sample Dataset",
  },
  table: {
    heading: "Data Overview",
    tableMarkdown: [
      "| Item | Value |",
      "| ---- | ----- |",
      "| Alpha | 42 |",
      "| Beta | 37 |",
      "| Gamma | 58 |",
      "| Delta | 21 |",
    ].join("\n"),
    description: "Higher is better.",
    citations: "Source: Sample Stats",
  },
  "image-right": {
    heading: "Architecture Diagram",
    list: ["Ingest", "Process", "Serve"],
    imagePath: SAMPLE_IMAGE,
    citations: "Diagram credit: picsum.photos",
  },
  "image-center": {
    heading: "Workflow Snapshot",
    imagePath: SAMPLE_IMAGE,
    description: "Step-by-step overview.",
    citations: "Figure 1",
  },
  "image-split": {
    heading: "Visual Overview",
    imageUrl: SAMPLE_IMAGE,
    items: ["Clear structure", "Engaging visuals", "Concise messaging"],
  },
  timeline: {
    heading: "Project Milestones",
    items: [
      "Q1 2025: Research & Discovery",
      "Q2 2025: Prototype Development",
      "Q3 2025: Beta Launch",
      "Q4 2025: General Availability",
    ],
  },
  "card-grid": {
    heading: "Core Capabilities",
    cards: [
      "🚀|Performance|Blazing fast response times",
      "🔒|Security|Enterprise-grade protection",
      "📊|Analytics|Real-time insights dashboard",
      "🔌|Integration|Connect with any platform",
    ],
  },
  statistics: {
    heading: "Impact at a Glance",
    stats: ["99.9%|Uptime", "2.5M|Users", "150ms|Avg Latency", "4.8★|Rating"],
    caption: "Data as of Q4 2025",
  },
  "highlight-box": {
    heading: "Key Takeaway",
    content:
      "Simplicity and clarity are the foundations of effective communication.",
  },
  "two-column-panel": {
    heading: "Plan Comparison",
    panel1Title: "Free Tier",
    panel1List: ["5 projects", "Community support", "Basic analytics"],
    panel2Title: "Pro Tier",
    panel2List: ["Unlimited projects", "Priority support", "Advanced analytics"],
    accentPanel: "right",
  },
  "three-column-panel": {
    heading: "Our Process",
    panels: [
      "Discover|We research your needs and goals",
      "Design|We craft a tailored solution",
      "Deliver|We ship and iterate together",
    ],
  },
  "image-comparison": {
    heading: "Before & After",
    image1Url: SAMPLE_IMAGE,
    image1Label: "Before",
    image2Url: SAMPLE_IMAGE,
    image2Label: "After",
  },
  content: {
    heading: "Summary",
    body: "This is a **free-form** markdown slide.\n\n- Point one\n- Point two\n- Point three",
  },
  quote: {
    quote: "The best way to predict the future is to invent it.",
    attribution: "Alan Kay",
    content: "A guiding principle for innovation.",
  },
  process: {
    heading: "Development Workflow",
    steps: ["Plan", "Develop", "Test", "Deploy"],
  },
  "two-column": {
    heading: "Comparison",
    leftTitle: "Option A",
    leftList: ["Fast setup", "Low cost", "Community support"],
    rightTitle: "Option B",
    rightList: ["Enterprise features", "SLA guarantee", "Dedicated support"],
  },
  "big-statement": {
    statement: "Less is More",
    subtitle: "The power of simplicity in design",
  },
  "figure-caption": {
    heading: "Experimental Results",
    imagePath: SAMPLE_IMAGE,
    figNumber: "1",
    caption: "Comparison of treatment groups over 12-week period",
    source: "Adapted from Smith et al., 2024",
    citations: "Smith J, et al. J Exp Med. 2024;15(3):102-110.",
  },
  "key-message": {
    heading: "Conclusions",
    title: "Key Finding",
    message:
      "Our proposed method demonstrates a 35% improvement in accuracy compared to the baseline approach.",
    note: "Further validation with larger datasets is recommended.",
  },
  methodology: {
    heading: "Study Design",
    steps: [
      "Recruitment|N=120 participants",
      "Randomization|Double-blind RCT",
      "Intervention|12-week protocol",
      "Assessment|Pre/post measures",
      "Analysis|Mixed-effects model",
    ],
    citations: "Protocol registered: UMIN000012345",
  },
  comparison: {
    heading: "Method Comparison",
    leftTitle: "Conventional Method",
    leftList: ["Manual feature extraction", "Linear classifier", "Limited scalability"],
    rightTitle: "Proposed Method",
    rightList: ["Automated feature learning", "Deep neural network", "Highly scalable"],
    citations: "Based on benchmark results from Dataset X",
  },
  terminal: {
    heading: "Quick Start",
    terminalTitle: "bash",
    lines: [
      "$ npm install my-package",
      "added 42 packages in 1.2s",
      "$ npm run dev",
      "Server running on http://localhost:3000",
    ],
  },
  "three-column": {
    heading: "Three Pillars",
    col1Title: "People",
    col1List: ["Collaboration", "Empowerment", "Growth"],
    col2Title: "Process",
    col2List: ["Agile", "CI/CD", "Automation"],
    col3Title: "Technology",
    col3List: ["Cloud-native", "Microservices", "AI-powered"],
  },
  agenda: {
    heading: "Today's Agenda",
    items: [
      "Introduction|10 min",
      "Market Analysis|20 min",
      "Product Roadmap|30 min",
      "Q&A|15 min",
    ],
  },
};

describe("style example generator", () => {
  afterAll(() => {
    setActiveTheme("default");
    setActiveStyle("default");
  });

  it("writes markdown examples for every style", async () => {
    await fs.mkdir(examplesMarkdownDir, { recursive: true });

    const styleNames = getAvailableStyleNames();

    for (const styleName of styleNames) {
      const style = getStyle(styleName);
      if (!style) {
        throw new Error(`Style "${styleName}" not found`);
      }

      // Skip styles with no layouts (e.g. default)
      const layoutNames = Object.keys(style.layouts);
      if (layoutNames.length === 0) {
        continue;
      }

      const markdown = buildExampleMarkdown(styleName, style.layouts, layoutNames);
      const filePath = path.join(
        examplesMarkdownDir,
        `example-default-${styleName}-style.md`,
      );
      await fs.writeFile(filePath, markdown, "utf-8");
      const savedMarkdown = await fs.readFile(filePath, "utf-8");
      expect(savedMarkdown).toBe(markdown);
    }
  }, 30000);
});

function buildExampleMarkdown(
  styleName: StyleName,
  layouts: Record<string, { template: (params: Record<string, unknown>) => string }>,
  layoutNames: string[],
): string {
  setActiveTheme("default");
  setActiveStyle(styleName);

  const style = getStyle(styleName);
  if (!style) {
    throw new Error(`Style "${styleName}" not found`);
  }

  const slides = layoutNames.map((layoutName) => {
    const layout = layouts[layoutName];
    if (!layout) {
      throw new Error(`Layout "${layoutName}" not found in style "${styleName}"`);
    }

    const params = richLayoutParams[layoutName];
    if (!params) {
      throw new Error(
        `Missing sample params for layout "${layoutName}" in style "${styleName}"`,
      );
    }

    const content = layout.template(params);
    return `<!-- layout: ${layoutName} -->\n${content.trim()}`;
  });

  const frontmatterLines = [
    "---",
    "marp: true",
    "theme: default",
    `header: Example Labs | default theme, ${styleName} style`,
    "paginate: true",
  ];

  if (style.css) {
    frontmatterLines.push(`style: |`);
    for (const line of style.css.split("\n")) {
      frontmatterLines.push(`  ${line}`);
    }
  }

  frontmatterLines.push("---");

  return [
    ...frontmatterLines,
    "",
    slides.join("\n\n---\n\n"),
    "",
  ].join("\n");
}
