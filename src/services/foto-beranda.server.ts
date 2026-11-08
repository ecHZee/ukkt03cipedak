import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { polaFotoBeranda, kunciCacheFotoBeranda } from "@/lib/foto-beranda";

const noStore = {
  "Cache-Control": "no-store",
  "CDN-Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};
const batasByte = 2 * 1024 * 1024;
type Tugas = { waitUntil?: (p: Promise<unknown>) => void };

async function ambilFotoAktif() {
  // Selalu anonim: sesi pengunjung tidak boleh membuka aset draf atau pengaturan privat.
  const db = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
  const { data, error } = await db
    .from("pengaturan")
    .select("value")
    .eq("key", "situs.tampilan")
    .eq("publik", true)
    .maybeSingle();
  if (error) throw new Error("Pengaturan foto belum dapat diperiksa.");
  const tampilan = data?.value;
  if (!tampilan || typeof tampilan !== "object" || Array.isArray(tampilan)) return null;
  const foto = tampilan.foto;
  if (!Array.isArray(foto)) return null;
  const pertama = foto[0];
  return pertama && typeof pertama === "object" && !Array.isArray(pertama)
    ? (pertama.path ?? null)
    : null;
}

/** Cache byte foto immutable di origin situs; status aktif diperiksa sebelum SETIAP cache hit. */
export async function layaniFotoBeranda(
  request: Request,
  ctx: Tugas = {},
  opsi?: {
    aktif?: () => Promise<unknown>;
    baca?: (path: string, method: string) => Promise<Response>;
    cache?: Cache;
  },
): Promise<Response> {
  const path = new URL(request.url).pathname.slice("/media/situs/".length);
  const tolak = (status = 404) =>
    new Response(status === 405 ? "Metode tidak diizinkan." : "Foto tidak tersedia.", {
      status,
      headers: noStore,
    });
  if (!["GET", "HEAD"].includes(request.method)) return tolak(405);
  if (!polaFotoBeranda.test(path)) return tolak();
  try {
    if ((await (opsi?.aktif ?? ambilFotoAktif)()) !== path) return tolak();
    const cache =
      opsi?.cache ??
      (globalThis.caches as (CacheStorage & { default?: Cache }) | undefined)?.default;
    const key = kunciCacheFotoBeranda(path);
    const kirim = (r: Response, status: string) => {
      const headers = new Headers(noStore);
      headers.set("Content-Type", "image/webp");
      headers.set("X-Katar-Foto-Cache", status);
      for (const nama of ["content-length", "etag", "last-modified"]) {
        const nilai = r.headers.get(nama);
        if (nilai) headers.set(nama, nilai);
      }
      return new Response(request.method === "HEAD" ? null : r.body, { headers });
    };
    const hit = await cache?.match(key);
    if (hit) return kirim(hit, "HIT");
    const baca =
      opsi?.baca ??
      ((p: string, method: string) =>
        fetch(`${process.env.SUPABASE_URL}/storage/v1/object/public/media/${p}`, { method }));
    // Tidak meneruskan cookie, JWT atau header pemanggil ke Storage.
    const asal = await baca(path, request.method);
    const ukuran = Number(asal.headers.get("content-length"));
    if (
      asal.status !== 200 ||
      asal.headers.get("content-type")?.split(";")[0] !== "image/webp" ||
      !Number.isSafeInteger(ukuran) ||
      ukuran <= 0 ||
      ukuran > batasByte
    ) {
      await asal.body?.cancel();
      return tolak();
    }
    const headers = new Headers({
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Length": String(ukuran),
    });
    for (const nama of ["etag", "last-modified"]) {
      const nilai = asal.headers.get(nama);
      if (nilai) headers.set(nama, nilai);
    }
    const gambar = new Response(asal.body, { headers });
    if (cache && request.method === "GET") {
      // Cache opsional: kegagalan tulis cache tidak menggagalkan foto yang sudah berhasil dibaca.
      const simpan = cache.put(key, gambar.clone()).catch(() => undefined);
      if (ctx.waitUntil) ctx.waitUntil(simpan);
      else await simpan;
    }
    return kirim(gambar, "MISS");
  } catch {
    // Gagal memeriksa pengaturan tidak boleh menyajikan cache foto lama.
    return tolak(503);
  }
}
