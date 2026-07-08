/**
 * Writes public/sitemap.xml and public/robots.txt from the site's content.
 * Runs under Bun as part of `bun run build`, so every publish refreshes the
 * sitemap. Content saved from the admin editor (custom project/post slugs,
 * the siteUrl setting) is read from .data/site.db when it exists; otherwise
 * the built-in defaults are used.
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { defaultContent, type SiteContent } from "../src/data/content";

const root = path.join(path.dirname(new URL(import.meta.url).pathname), "..");

function loadContent(): SiteContent {
  const merged: SiteContent = { ...defaultContent };
  const dbFile = path.join(root, ".data", "site.db");
  if (!existsSync(dbFile)) return merged;
  try {
    const { Database } = require("bun:sqlite");
    const db = new Database(dbFile, { readonly: true });
    // The table only exists once something has been saved from /admin.
    const hasTable = db
      .prepare("select name from sqlite_master where type = 'table' and name = 'site_content'")
      .get();
    if (!hasTable) return merged;
    const rows = db.prepare("select key, value from site_content").all() as { key: string; value: string }[];
    for (const row of rows) {
      if (row.key in merged) {
        try {
          (merged as Record<string, unknown>)[row.key] = JSON.parse(row.value);
        } catch {
          /* keep default */
        }
      }
    }
  } catch (err) {
    console.warn("sitemap: could not read site.db, using defaults:", err);
  }
  return merged;
}

const content = loadContent();
const base = (content.settings.siteUrl || "https://rokiconstruction.rw").replace(/\/$/, "");
const today = new Date().toISOString().slice(0, 10);

const staticPaths = ["/", "/about", "/services", "/projects", "/blog", "/careers", "/faq", "/contact"];
const paths = [
  ...staticPaths,
  ...content.projects.map((p) => `/projects/${p.slug}`),
  ...content.posts.map((p) => `/blog/${p.slug}`),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map(
    (p) => `  <url>
    <loc>${base}${p === "/" ? "" : p}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p === "/" ? "weekly" : "monthly"}</changefreq>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${base}/sitemap.xml
`;

const pub = path.join(root, "public");
mkdirSync(pub, { recursive: true });
writeFileSync(path.join(pub, "sitemap.xml"), sitemap);
writeFileSync(path.join(pub, "robots.txt"), robots);
console.log(`sitemap: wrote ${paths.length} urls (base ${base})`);
