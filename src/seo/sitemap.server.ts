import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { SITE } from "@/constants/site";
import { buildSitemapXml, entriKonten, robotsTxt } from "./sitemap";

export async function ambilEntriSitemap(db: SupabaseClient<Database>) {
  const hasil = await Promise.all([
    db.from("bidang").select("slug"),
    ...(["berita", "kegiatan", "album"] as const).map((table) =>
      db.from(table).select("slug,updated_at").eq("status", "terbit").eq("is_dummy", false),
    ),
  ]);
  if (hasil.some((r) => r.error || !r.data)) throw new Error("Sitemap belum dapat dimuat.");
  return hasil.flatMap((r, i) =>
    entriKonten((["program", "berita", "kegiatan", "galeri"] as const)[i], r.data!),
  );
}
export async function layaniSeo(request: Request) {
  const path = new URL(request.url).pathname;
  if (path !== "/sitemap.xml" && path !== "/robots.txt") return null;
  const headers = new Headers({
    "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff",
  });
  if (!["GET", "HEAD"].includes(request.method))
    return new Response(null, {
      status: 405,
      headers: { ...Object.fromEntries(headers), Allow: "GET, HEAD" },
    });
  let body: string;
  if (path === "/robots.txt") {
    headers.set("Content-Type", "text/plain; charset=utf-8");
    body = robotsTxt(SITE.url);
  } else {
    headers.set("Content-Type", "application/xml; charset=utf-8");
    // Selalu anonim: Authorization/cookie pemanggil tidak dapat memperluas isi sitemap.
    const db = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } },
    );
    try {
      body = buildSitemapXml(SITE.url, await ambilEntriSitemap(db));
    } catch {
      return new Response(request.method === "HEAD" ? null : "Sitemap sementara tidak tersedia.", {
        status: 503,
        headers: { ...Object.fromEntries(headers), "Content-Type": "text/plain; charset=utf-8" },
      });
    }
  }
  return new Response(request.method === "HEAD" ? null : body, { headers });
}
