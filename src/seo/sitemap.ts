import { PUBLIC_ROUTES } from "@/constants/routes";

/**
 * Daftar URL publik yang akan masuk sitemap.xml.
 * Generator XML akan ditambahkan saat sprint SEO; struktur ini source of truth.
 */
export const STATIC_SITEMAP_URLS: Array<{ path: string; changefreq: string; priority: number }> = [
  { path: PUBLIC_ROUTES.home,     changefreq: "weekly",  priority: 1.0 },
  { path: PUBLIC_ROUTES.tentang,  changefreq: "monthly", priority: 0.7 },
  { path: PUBLIC_ROUTES.program,  changefreq: "monthly", priority: 0.7 },
  { path: PUBLIC_ROUTES.kegiatan, changefreq: "weekly",  priority: 0.8 },
  { path: PUBLIC_ROUTES.berita,   changefreq: "daily",   priority: 0.9 },
  { path: PUBLIC_ROUTES.galeri,   changefreq: "weekly",  priority: 0.6 },
  { path: PUBLIC_ROUTES.lpj,      changefreq: "monthly", priority: 0.7 },
  { path: PUBLIC_ROUTES.kontak,   changefreq: "yearly",  priority: 0.5 },
];

export function buildSitemapXml(baseUrl: string) {
  const urls = STATIC_SITEMAP_URLS.map(
    (u) => `  <url>
    <loc>${baseUrl}${u.path}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority.toFixed(1)}</priority>
  </url>`,
  ).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}
