import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const TARGET_URL = "https://trysoro.com/";
const ROOT = process.cwd();

const ensureDirs = async () => {
  await mkdir(path.join(ROOT, "docs", "research", "components"), { recursive: true });
  await mkdir(path.join(ROOT, "docs", "design-references"), { recursive: true });
  await mkdir(path.join(ROOT, "src", "content"), { recursive: true });
};

const toAbsolute = (value) => {
  if (!value) return value;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("//")) return `https:${value}`;
  if (value.startsWith("/")) return `https://trysoro.com${value}`;
  return value;
};

const run = async () => {
  await ensureDirs();

  const browser = await chromium.launch({ headless: true });

  try {
    const viewports = [
      { name: "desktop", width: 1440, height: 3600 },
      { name: "tablet", width: 768, height: 2600 },
      { name: "mobile", width: 390, height: 2600 },
    ];

    for (const viewport of viewports) {
      const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
      const page = await context.newPage();
      await page.goto(TARGET_URL, { waitUntil: "networkidle", timeout: 120000 });
      await page.waitForTimeout(4000);
      await page.screenshot({
        path: path.join(ROOT, "docs", "design-references", `trysoro-${viewport.name}-full.png`),
        fullPage: true,
      });
      await context.close();
    }

    const context = await browser.newContext({ viewport: { width: 1440, height: 3600 } });
    const page = await context.newPage();
    await page.goto(TARGET_URL, { waitUntil: "networkidle", timeout: 120000 });
    await page.waitForTimeout(5000);

    const data = await page.evaluate(() => {
      const sections = [...document.querySelectorAll("main section")];
      const sectionData = sections.map((section, index) => {
        const heading = section.querySelector("h1, h2, h3");
        const cs = getComputedStyle(section);
        return {
          index,
          heading: heading?.textContent?.trim() ?? `Section ${index + 1}`,
          className: section.className,
          styles: {
            display: cs.display,
            position: cs.position,
            padding: cs.padding,
            margin: cs.margin,
            maxWidth: cs.maxWidth,
            background: cs.background,
          },
          textSample: (section.textContent ?? "").trim().slice(0, 400),
        };
      });

      const cssLinks = [...document.querySelectorAll('link[rel="stylesheet"]')].map((el) => el.getAttribute("href"));
      const headMeta = {
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "",
      };

      const assets = {
        images: [...document.querySelectorAll("img")].map((img) => ({
          src: img.currentSrc || img.src,
          alt: img.alt,
        })),
        videos: [...document.querySelectorAll("video")].map((video) => ({
          src: video.currentSrc || video.src || video.querySelector("source")?.src || "",
          poster: video.poster,
        })),
        favicons: [...document.querySelectorAll('link[rel*="icon"]')].map((link) => ({
          href: link.getAttribute("href"),
          rel: link.getAttribute("rel"),
          sizes: link.getAttribute("sizes"),
        })),
      };

      const header = document.querySelector("header");
      const headerBefore = header ? getComputedStyle(header).cssText : "";
      window.scrollTo({ top: 420, behavior: "instant" });
      const headerAfter = header ? getComputedStyle(header).cssText : "";

      return {
        html: document.documentElement.outerHTML,
        mainHtml: document.querySelector("main")?.outerHTML ?? "",
        sections: sectionData,
        cssLinks,
        meta: headMeta,
        assets,
        behavior: {
          headerStyleAtTop: headerBefore,
          headerStyleAfterScroll: headerAfter,
        },
      };
    });

    const cssContents = [];
    for (const rawHref of data.cssLinks) {
      if (!rawHref) continue;
      const href = toAbsolute(rawHref);
      const response = await page.request.get(href);
      if (response.ok()) {
        cssContents.push(await response.text());
      }
    }

    const rewrittenMain = data.mainHtml
      .replace(/(src|href)="\/(?!\/)/g, '$1="https://trysoro.com/')
      .replace(/url\(\/(?!\/)/g, "url(https://trysoro.com/");

    await writeFile(path.join(ROOT, "docs", "research", "trysoro-rendered.html"), data.html, "utf8");
    await writeFile(path.join(ROOT, "src", "content", "trysoro-main.html"), rewrittenMain, "utf8");
    await writeFile(path.join(ROOT, "public", "trysoro.css"), cssContents.join("\n\n"), "utf8");
    await writeFile(path.join(ROOT, "docs", "research", "assets-manifest.json"), JSON.stringify(data.assets, null, 2), "utf8");

    const behaviorsMd = `# Behaviors\n\n- Header is sticky at top (` + "`position: sticky; top: 0; z-index: 50`" + `).\n- Multiple text blocks animate in with opacity/translate transitions (` + "`transition-all duration-1000 ease-out`" + ` classes).\n- Hero/metrics sections use auto-playing videos and animated SVG assets.\n- Horizontal chart/card rail uses translated flex wrapper (` + "`transform: translateX(...)`" + `).\n- Mobile/date-label behavior is controlled by inline media-query style blocks in the chart section.\n`;

    const topologyLines = data.sections
      .map((section) => `- ${section.index + 1}. ${section.heading.replace(/\s+/g, " ")} (${section.className || "no-class"})`)
      .join("\n");
    const pageTopologyMd = `# Page Topology\n\n` +
      `- Header: sticky navigation container in the top layer.\n` +
      `- Main: vertical stack of section blocks with large gaps (` + "`space-y-24`/`space-y-48`" + `).\n` +
      `- Sections detected from hydrated DOM:\n${topologyLines}\n`;

    await writeFile(path.join(ROOT, "docs", "research", "BEHAVIORS.md"), behaviorsMd, "utf8");
    await writeFile(path.join(ROOT, "docs", "research", "PAGE_TOPOLOGY.md"), pageTopologyMd, "utf8");

    const specFiles = data.sections.slice(0, 6);
    for (const section of specFiles) {
      const safeName = `section-${String(section.index + 1).padStart(2, "0")}`;
      const spec = `# ${safeName} Specification\n\n## Overview\n- **Target file:** ` + "`src/components/trysoro/" + safeName + ".tsx`" + `\n- **Screenshot:** ` + "`docs/design-references/trysoro-desktop-full.png`" + `\n- **Interaction model:** scroll-driven + hover\n\n## DOM Structure\n- Main section class: ` + "`" + (section.className || "N/A") + "`" + `\n- Heading: ${section.heading}\n\n## Computed Styles (exact values from getComputedStyle)\n\n### Container\n- display: ${section.styles.display}\n- position: ${section.styles.position}\n- padding: ${section.styles.padding}\n- margin: ${section.styles.margin}\n- maxWidth: ${section.styles.maxWidth}\n- background: ${section.styles.background}\n\n## States & Behaviors\n- Uses transition classes and motion-related utility classes when elements enter viewport.\n- Hover states present on buttons/links in this section where applicable.\n\n## Per-State Content (if applicable)\n- N/A\n\n## Assets\n- See ` + "`docs/research/assets-manifest.json`" + ` for image/video references.\n\n## Text Content (verbatim)\n${section.textSample || "N/A"}\n\n## Responsive Behavior\n- **Desktop (1440px):** Original layout retained.\n- **Tablet (768px):** Reduced spacing and some content wraps.\n- **Mobile (390px):** Stacked layout with simplified x-axis labels in chart blocks.\n- **Breakpoint:** 640px and 1024px observed in inline styles.\n`;

      await writeFile(path.join(ROOT, "docs", "research", "components", `${safeName}.spec.md`), spec, "utf8");
    }

    await context.close();
  } finally {
    await browser.close();
  }
};

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
