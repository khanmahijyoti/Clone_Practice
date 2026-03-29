import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const ROOT = process.cwd();
const TARGET_URL = "https://f4.dev/";
const MIRROR_TARGETS = [
  { source: "https://f4.dev/", localPath: "/" },
  { source: "https://f4.dev/lite", localPath: "/lite" },
  { source: "https://download.f4.dev/", localPath: "/download" },
  { source: "https://docs.f4.dev/", localPath: "/docs" },
  { source: "https://wiki.f4.dev/", localPath: "/wiki" },
];

const URL_REPLACEMENTS = [
  ["https://f4.dev/lite", "/lite"],
  ["https://f4.dev/", "/"],
  ["https://f4.dev", ""],
  ["http://f4.dev/lite", "/lite"],
  ["http://f4.dev/", "/"],
  ["http://f4.dev", ""],
  ["https://download.f4.dev/", "/download/"],
  ["https://download.f4.dev", "/download"],
  ["http://download.f4.dev/", "/download/"],
  ["http://download.f4.dev", "/download"],
  ["https://docs.f4.dev/", "/docs/"],
  ["https://docs.f4.dev", "/docs"],
  ["http://docs.f4.dev/", "/docs/"],
  ["http://docs.f4.dev", "/docs"],
  ["https://wiki.f4.dev/", "/wiki/"],
  ["https://wiki.f4.dev", "/wiki"],
  ["http://wiki.f4.dev/", "/wiki/"],
  ["http://wiki.f4.dev", "/wiki"],
  ["https://auth.f4.dev/auth?return_to=https%3A%2F%2Fdownload.f4.dev%2Fdownload-portal%2F", "/download/"],
  ["https://auth.f4.dev", "/download"],
  ["http://auth.f4.dev", "/download"],
];

const ensureDirs = async () => {
  await mkdir(path.join(ROOT, "public"), { recursive: true });
  await mkdir(path.join(ROOT, "public", "mirror", "lite"), { recursive: true });
  await mkdir(path.join(ROOT, "public", "mirror", "download"), { recursive: true });
  await mkdir(path.join(ROOT, "public", "mirror", "docs"), { recursive: true });
  await mkdir(path.join(ROOT, "public", "mirror", "wiki"), { recursive: true });
  await mkdir(path.join(ROOT, "docs", "design-references"), { recursive: true });
  await mkdir(path.join(ROOT, "docs", "research", "components"), { recursive: true });
};

const toMirrorFilePath = (sitePath) => {
  if (sitePath === "/") return path.join(ROOT, "public", "mirror", "index.html");
  const normalized = sitePath.replace(/^\//, "").replace(/\/$/, "");
  return path.join(ROOT, "public", "mirror", normalized, "index.html");
};

const rewriteInternalLinks = (html) => {
  return URL_REPLACEMENTS.reduce((output, [from, to]) => output.replaceAll(from, to), html);
};

const run = async () => {
  await ensureDirs();

  for (const target of MIRROR_TARGETS) {
    const response = await fetch(target.source);
    const fullHtml = await response.text();
    const rewritten = rewriteInternalLinks(fullHtml);
    await writeFile(toMirrorFilePath(target.localPath), rewritten, "utf8");
  }

  const browser = await chromium.launch({ headless: true });

  try {
    const desktop = await browser.newContext({ viewport: { width: 1440, height: 2600 } });
    const desktopPage = await desktop.newPage();
    await desktopPage.goto(TARGET_URL, { waitUntil: "networkidle", timeout: 120000 });
    await desktopPage.waitForTimeout(4000);
    await desktopPage.screenshot({
      path: path.join(ROOT, "docs", "design-references", "f4-desktop-full.png"),
      fullPage: true,
    });

    const recon = await desktopPage.evaluate(() => {
      const headings = [...document.querySelectorAll("h1, h2, h3")].map((el) =>
        (el.textContent || "").trim().replace(/\s+/g, " "),
      );
      const links = [...document.querySelectorAll('link[rel*="icon"], link[rel="manifest"]')].map((el) =>
        el.getAttribute("href"),
      );
      const fonts = [...new Set([...document.querySelectorAll("*")].slice(0, 300).map((el) => getComputedStyle(el).fontFamily))];
      const bodyStyles = getComputedStyle(document.body);

      return {
        headings,
        links,
        fonts,
        body: {
          backgroundColor: bodyStyles.backgroundColor,
          color: bodyStyles.color,
          fontFamily: bodyStyles.fontFamily,
        },
      };
    });

    await desktop.close();

    const mobile = await browser.newContext({ viewport: { width: 390, height: 2600 } });
    const mobilePage = await mobile.newPage();
    await mobilePage.goto(TARGET_URL, { waitUntil: "networkidle", timeout: 120000 });
    await mobilePage.waitForTimeout(3000);
    await mobilePage.screenshot({
      path: path.join(ROOT, "docs", "design-references", "f4-mobile-full.png"),
      fullPage: true,
    });
    await mobile.close();

    const behaviorMd = `# Behaviors\n\n- Framer-based page with significant runtime animation and transform effects.\n- Multiple reveal animations trigger on scroll across sections.\n- Hover transitions present on CTA and navigation elements.\n- Layout adapts between desktop and mobile with different stacking.\n`;
    await writeFile(path.join(ROOT, "docs", "research", "BEHAVIORS.md"), behaviorMd, "utf8");

    const topologyMd = `# Page Topology\n\n` + recon.headings.map((h, i) => `- ${i + 1}. ${h || "Untitled section"}`).join("\n") + "\n";
    await writeFile(path.join(ROOT, "docs", "research", "PAGE_TOPOLOGY.md"), topologyMd, "utf8");

    const designTokensMd = `# Global Tokens\n\n- Body background: ${recon.body.backgroundColor}\n- Body color: ${recon.body.color}\n- Body font family: ${recon.body.fontFamily}\n\n## Fonts\n${recon.fonts
      .map((font) => `- ${font}`)
      .join("\n")}\n`;
    await writeFile(path.join(ROOT, "docs", "research", "DESIGN_TOKENS.md"), designTokensMd, "utf8");

    const spec = `# HomePage Specification\n\n## Overview\n- **Target file:** \`src/app/[[...slug]]/page.tsx\`\n- **Screenshot:** \`docs/design-references/f4-desktop-full.png\`\n- **Interaction model:** scroll-driven + hover + time-driven\n\n## DOM Structure\n- Framer-generated app wrapper with section blocks and animated elements.\n\n## Computed Styles (exact values from getComputedStyle)\n- Body backgroundColor: ${recon.body.backgroundColor}\n- Body color: ${recon.body.color}\n- Body fontFamily: ${recon.body.fontFamily}\n\n## States & Behaviors\n- Section entries animate with transforms and opacity changes.\n- Interactive controls include hover transitions and links.\n\n## Per-State Content\n- N/A\n\n## Assets\n- Mirrored pages: \`public/mirror/index.html\`, \`public/mirror/lite/index.html\`, \`public/mirror/download/index.html\`, \`public/mirror/docs/index.html\`, \`public/mirror/wiki/index.html\`\n- Favicons/manifest references:\n${recon.links.map((href) => `  - ${href}`).join("\n")}\n\n## Text Content (verbatim)\n${recon.headings.slice(0, 20).map((h) => `- ${h}`).join("\n")}\n\n## Responsive Behavior\n- **Desktop (1440px):** Full multi-section layout.\n- **Mobile (390px):** Condensed stacked layout.\n- **Breakpoint:** managed by Framer runtime CSS and media queries.\n`;
    await writeFile(path.join(ROOT, "docs", "research", "components", "home-page.spec.md"), spec, "utf8");
  } finally {
    await browser.close();
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
