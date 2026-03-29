import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const ROOT = process.cwd();
const TARGET_URL = "https://f4.dev/";

const ensureDirs = async () => {
  await mkdir(path.join(ROOT, "public"), { recursive: true });
  await mkdir(path.join(ROOT, "docs", "design-references"), { recursive: true });
  await mkdir(path.join(ROOT, "docs", "research", "components"), { recursive: true });
};

const run = async () => {
  await ensureDirs();

  const response = await fetch(TARGET_URL);
  const fullHtml = await response.text();
  await writeFile(path.join(ROOT, "public", "f4-snapshot.html"), fullHtml, "utf8");

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

    const spec = `# HomePage Specification\n\n## Overview\n- **Target file:** \`src/app/page.tsx\`\n- **Screenshot:** \`docs/design-references/f4-desktop-full.png\`\n- **Interaction model:** scroll-driven + hover + time-driven\n\n## DOM Structure\n- Framer-generated app wrapper with section blocks and animated elements.\n\n## Computed Styles (exact values from getComputedStyle)\n- Body backgroundColor: ${recon.body.backgroundColor}\n- Body color: ${recon.body.color}\n- Body fontFamily: ${recon.body.fontFamily}\n\n## States & Behaviors\n- Section entries animate with transforms and opacity changes.\n- Interactive controls include hover transitions and links.\n\n## Per-State Content\n- N/A\n\n## Assets\n- Source snapshot: \`public/f4-snapshot.html\`\n- Favicons/manifest references:\n${recon.links.map((href) => `  - ${href}`).join("\n")}\n\n## Text Content (verbatim)\n${recon.headings.slice(0, 20).map((h) => `- ${h}`).join("\n")}\n\n## Responsive Behavior\n- **Desktop (1440px):** Full multi-section layout.\n- **Mobile (390px):** Condensed stacked layout.\n- **Breakpoint:** managed by Framer runtime CSS and media queries.\n`;
    await writeFile(path.join(ROOT, "docs", "research", "components", "home-page.spec.md"), spec, "utf8");
  } finally {
    await browser.close();
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
