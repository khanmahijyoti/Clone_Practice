import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const MANIFEST_PATH = path.join(ROOT, "docs", "research", "assets-manifest.json");
const OUT_DIR = path.join(ROOT, "public", "assets", "trysoro");
const CONCURRENCY = 4;

const toAbsolute = (value) => {
  if (!value) return null;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("//")) return `https:${value}`;
  if (value.startsWith("/")) return `https://trysoro.com${value}`;
  return null;
};

const sanitizePath = (urlValue) => {
  try {
    const url = new URL(urlValue);
    const pathname = url.pathname.replace(/^\/+/, "") || "index";
    return path.join(OUT_DIR, pathname);
  } catch {
    return null;
  }
};

const downloadOne = async (urlValue) => {
  const absolute = toAbsolute(urlValue);
  if (!absolute) return { url: urlValue, status: "skipped" };
  const outputFile = sanitizePath(absolute);
  if (!outputFile) return { url: absolute, status: "skipped" };

  await mkdir(path.dirname(outputFile), { recursive: true });
  const response = await fetch(absolute);
  if (!response.ok) {
    return { url: absolute, status: `failed (${response.status})` };
  }

  const arrayBuffer = await response.arrayBuffer();
  await writeFile(outputFile, Buffer.from(arrayBuffer));
  return { url: absolute, status: "downloaded", file: path.relative(ROOT, outputFile).replaceAll("\\", "/") };
};

const runPool = async (jobs) => {
  const results = [];
  const queue = [...jobs];
  const workers = Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
    while (queue.length > 0) {
      const next = queue.shift();
      if (!next) continue;
      try {
        results.push(await downloadOne(next));
      } catch (error) {
        results.push({ url: next, status: `failed (${error instanceof Error ? error.message : "unknown"})` });
      }
    }
  });

  await Promise.all(workers);
  return results;
};

const run = async () => {
  const raw = await readFile(MANIFEST_PATH, "utf8");
  const manifest = JSON.parse(raw);
  const urls = new Set();

  for (const image of manifest.images || []) {
    urls.add(image.src);
  }
  for (const video of manifest.videos || []) {
    if (video.src) urls.add(video.src);
    if (video.poster) urls.add(video.poster);
  }
  for (const icon of manifest.favicons || []) {
    urls.add(icon.href);
  }

  const cleaned = [...urls].filter(Boolean);
  const results = await runPool(cleaned);

  await writeFile(
    path.join(ROOT, "docs", "research", "asset-download-report.json"),
    JSON.stringify({ total: cleaned.length, results }, null, 2),
    "utf8",
  );

  const successCount = results.filter((result) => result.status === "downloaded").length;
  console.log(`Downloaded ${successCount}/${cleaned.length} assets`);
};

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
