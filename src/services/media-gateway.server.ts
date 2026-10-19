import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { bacaB2 } from "./b2.server";

const pola =
  /^galeri\/(?!staging\/)[a-z0-9-]+\/[0-9a-f-]{36}\/[0-9a-f-]{36}(?:_thumb)?\.(webp|mp4|webm|mov)$/;
type Tugas = { waitUntil?: (p: Promise<unknown>) => void };
const noStore = {
  "Cache-Control": "no-store",
  "CDN-Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};
/** Cache internal menyimpan objek immutable, tetapi izin album dicek lagi pada SETIAP request. */
export async function layaniMedia(
  request: Request,
  ctx: Tugas = {},
  opsi?: {
    publik?: (path: string) => Promise<boolean>;
    baca?: typeof bacaB2;
    cache?: Cache;
  },
): Promise<Response> {
  const url = new URL(request.url),
    path = url.pathname.slice("/media/".length);
  const tolak = (status = 404) =>
    new Response(status === 404 ? "Media tidak tersedia." : "Metode tidak diizinkan.", {
      status,
      headers: noStore,
    });
  if (!["GET", "HEAD"].includes(request.method)) return tolak(405);
  if (!pola.test(path) || (path.includes("_thumb") && !path.endsWith("_thumb.webp")))
    return tolak();
  try {
    const utama = path.replace(/_thumb\.webp$/, ".webp");
    const publik =
      opsi?.publik ??
      (async (p: string) => {
        // Client anonim baru, tanpa cookie/JWT pemanggil dan tanpa service role.
        const db = createClient<Database>(
          process.env.SUPABASE_URL!,
          process.env.SUPABASE_PUBLISHABLE_KEY!,
          { auth: { persistSession: false, autoRefreshToken: false } },
        );
        const r = await db
          .from("media")
          .select("id,album:album!media_album_id_fkey!inner(status)")
          .eq("storage_path", `b2:${p}`)
          .eq("album.status", "terbit")
          .limit(1);
        if (r.error) throw new Error("Pemeriksaan media belum tersedia");
        return r.data.length === 1;
      });
    if (!(await publik(utama))) return tolak();
    const range = request.headers.get("range");
    if (range && !/^bytes=\d*-\d*$/.test(range))
      return new Response(null, { status: 416, headers: noStore });
    const cache =
      opsi?.cache ??
      (globalThis.caches as (CacheStorage & { default?: Cache }) | undefined)?.default;
    const key = new Request(`https://katar-rw03.ukktrw03cipedak.workers.dev/media/${path}`, {
      headers: range ? { Range: range } : {},
    });
    const hit = await cache?.match(key);
    const kirim = (r: Response, status: string) => {
      const headers = new Headers(r.headers);
      Object.entries(noStore).forEach(([k, v]) => headers.set(k, v));
      headers.set("X-Katar-Media-Cache", status);
      headers.set("Accept-Ranges", "bytes");
      headers.delete("set-cookie");
      return new Response(request.method === "HEAD" ? null : r.body, { status: r.status, headers });
    };
    if (hit) return kirim(hit, "HIT");
    const baca = opsi?.baca ?? bacaB2;
    const asal = await baca(path, request.method, range ?? undefined);
    if (!asal.ok) {
      await asal.body?.cancel();
      return tolak(asal.status === 416 ? 416 : 404);
    }
    const mime = asal.headers.get("content-type")?.split(";")[0];
    if (!mime || !["image/webp", "video/mp4", "video/webm", "video/quicktime"].includes(mime)) {
      await asal.body?.cancel();
      return tolak();
    }
    const headers = new Headers({
      "Content-Type": mime,
      "Cache-Control": "public, max-age=31536000, immutable",
      "Accept-Ranges": "bytes",
      "X-Content-Type-Options": "nosniff",
    });
    for (const k of ["content-length", "content-range", "etag", "last-modified"]) {
      const v = asal.headers.get(k);
      if (v) headers.set(k, v);
    }
    const objek = new Response(asal.body, { status: asal.status, headers });
    if (cache && ctx.waitUntil && request.method === "GET" && objek.status === 200)
      ctx.waitUntil(cache.put(new Request(key.url), objek.clone()));
    // Range dingin dilayani streaming; cache hanya menerima respons penuh (bukan 206).
    if (cache && ctx.waitUntil && range && objek.status === 206)
      ctx.waitUntil(
        (async () => {
          const penuh = await baca(path);
          if (penuh.status !== 200) {
            await penuh.body?.cancel();
            return;
          }
          const h = new Headers(headers);
          h.delete("content-range");
          const n = penuh.headers.get("content-length");
          if (n) h.set("Content-Length", n);
          await cache.put(new Request(key.url), new Response(penuh.body, { headers: h }));
        })(),
      );
    return kirim(objek, cache ? "MISS" : "BYPASS");
  } catch {
    return new Response("Media belum dapat dihubungi. Coba lagi.", {
      status: 503,
      headers: noStore,
    });
  }
}
