import { PUBLIC_ROUTES } from "@/constants/routes";

export const STATIC_SITEMAP_URLS: string[] = [...Object.values(PUBLIC_ROUTES), "/tentang/pengurus"];
export type EntriSitemap = { path: string; updatedAt?: string | null };
const slugAman = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export function entriKonten(
  prefix: "berita" | "kegiatan" | "galeri" | "program",
  rows: { slug: string; updated_at?: string | null }[],
): EntriSitemap[] {
  return rows
    .filter((r) => slugAman.test(r.slug))
    .map((r) => ({ path: `/${prefix}/${r.slug}`, updatedAt: r.updated_at }));
}
export function pathPublik(path: string) {
  return (
    STATIC_SITEMAP_URLS.includes(path) ||
    /^\/(?:berita|kegiatan|galeri|program)\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(path)
  );
}
const xml = (s: string) =>
  s.replace(
    /[<>&"']/g,
    (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[c]!,
  );

export function buildSitemapXml(baseUrl: string, entries: EntriSitemap[] = []) {
  const base = new URL(baseUrl).origin;
  const semua = new Map<string, EntriSitemap>();
  for (const e of [...STATIC_SITEMAP_URLS.map((path) => ({ path })), ...entries]) {
    if (pathPublik(e.path)) semua.set(e.path, e);
  }
  const urls = [...semua.values()]
    .map((e) => {
      const d = e.updatedAt ? new Date(e.updatedAt) : null;
      const lastmod =
        d && Number.isFinite(d.getTime()) ? `<lastmod>${d.toISOString()}</lastmod>` : "";
      return `  <url><loc>${xml(base + e.path)}</loc>${lastmod}</url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}

export function robotsTxt(baseUrl: string) {
  // Admin/login mengirim noindex; crawler harus dapat membacanya. RLS tetap menjaga datanya.
  return `User-agent: *\nDisallow: /_server/\nDisallow: /berkas/\nDisallow: /media/\nSitemap: ${new URL(baseUrl).origin}/sitemap.xml\n`;
}
