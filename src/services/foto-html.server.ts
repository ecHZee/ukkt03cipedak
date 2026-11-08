import { Buffer } from "node:buffer";
import { polaFotoBeranda, kunciCacheFotoBeranda } from "@/lib/foto-beranda";
import { headerWebpSah } from "@/lib/pengaturan-admin";

const batasInline = 128 * 1024;

/** Dipanggil HANYA sesudah pengaturan publik dibaca segar pada request yang sama. */
export async function fotoUntukHtml(
  request: Request,
  path: string | null | undefined,
  cache = (globalThis.caches as (CacheStorage & { default?: Cache }) | undefined)?.default,
): Promise<string | null> {
  if (
    request.method !== "GET" ||
    new URL(request.url).pathname !== "/" ||
    !path ||
    !polaFotoBeranda.test(path) ||
    !cache
  )
    return null;
  try {
    // Tidak menambah fetch origin di jalur HTML. Cache dingin/besar/gagal tetap memakai gateway.
    const foto = await cache.match(kunciCacheFotoBeranda(path));
    if (!foto) return null;
    const ukuran = Number(foto.headers.get("content-length"));
    if (
      foto.status !== 200 ||
      foto.headers.get("content-type")?.split(";")[0] !== "image/webp" ||
      !Number.isSafeInteger(ukuran) ||
      ukuran < 12 ||
      ukuran > batasInline
    ) {
      await foto.body?.cancel();
      return null;
    }
    const isi = await foto.arrayBuffer();
    if (isi.byteLength !== ukuran || !headerWebpSah(new Uint8Array(isi))) return null;
    return `data:image/webp;base64,${Buffer.from(isi).toString("base64")}`;
  } catch {
    return null;
  }
}
