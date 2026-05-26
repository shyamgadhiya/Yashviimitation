import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const publicDir = path.join(rootDir, "public");
const envFiles = [".env.local", ".env"];

async function loadEnvFile(filename) {
  try {
    const contents = await fs.readFile(path.join(rootDir, filename), "utf8");
    for (const rawLine of contents.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const separatorIndex = line.indexOf("=");
      if (separatorIndex === -1) continue;
      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // Ignore missing local env files.
  }
}

function normalizeSiteUrl(value) {
  if (!value) return "";
  return value.replace(/\/+$/, "");
}

function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildUrl(base, pathname) {
  return `${base}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

function buildProductPath(product) {
  return `/product/${product.id}/${slugify(product.name || `product-${product.id}`) || "product"}`;
}

async function fetchTableRows(baseUrl, anonKey, table, select) {
  const response = await fetch(`${baseUrl}/rest/v1/${table}?select=${encodeURIComponent(select)}`, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${table}: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

for (const filename of envFiles) {
  await loadEnvFile(filename);
}

const siteUrl = normalizeSiteUrl(process.env.VITE_SITE_URL) || "https://example.com";
const supabaseUrl = normalizeSiteUrl(process.env.VITE_SUPABASE_URL);
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const staticPaths = [
  "/",
  "/collection",
  "/occasion/daily",
  "/occasion/festive",
  "/occasion/wedding",
];

let categoryPaths = [];
let productPaths = [];

if (supabaseUrl && supabaseAnonKey) {
  try {
    const [categories, products] = await Promise.all([
      fetchTableRows(supabaseUrl, supabaseAnonKey, "categories", "slug"),
      fetchTableRows(supabaseUrl, supabaseAnonKey, "products", "id,name"),
    ]);

    categoryPaths = (categories || [])
      .filter((category) => category.slug)
      .map((category) => `/category/${category.slug}`);

    productPaths = (products || [])
      .filter((product) => product.id)
      .map((product) => buildProductPath(product));
  } catch (error) {
    console.warn(`Sitemap generation warning: ${error.message}`);
  }
}

const allPaths = [...new Set([...staticPaths, ...categoryPaths, ...productPaths])];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPaths
  .map((pathname) => `  <url>\n    <loc>${xmlEscape(buildUrl(siteUrl, pathname))}</loc>\n  </url>`)
  .join("\n")}
</urlset>
`;

const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${buildUrl(siteUrl, "/sitemap.xml")}
`;

await fs.mkdir(publicDir, { recursive: true });
await fs.writeFile(path.join(publicDir, "sitemap.xml"), sitemapXml, "utf8");
await fs.writeFile(path.join(publicDir, "robots.txt"), robotsTxt, "utf8");

if (siteUrl === "https://example.com") {
  console.warn("Sitemap generated with placeholder site URL. Set VITE_SITE_URL for the correct production domain.");
}
