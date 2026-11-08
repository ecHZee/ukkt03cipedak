/** Pembacaan media publik tidak menarik kode unggah dan fungsi CMS ke beranda. */

/** URL publik untuk file di bucket publik. Path yang sudah berupa URL penuh dikembalikan apa adanya. */
export function urlPublik(bucket: "media" | "dokumen-publik", path: string | null | undefined) {
  if (!path) return null;
  if (bucket === "media" && path.startsWith("b2:galeri/")) return `/media/${path.slice(3)}`;
  if (/^https?:\/\//.test(path)) return path;
  // Sama dengan getPublicUrl tanpa menginisialisasi SDK Auth/Storage di halaman publik.
  const base = import.meta.env?.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  if (!base) throw new Error("Alamat penyimpanan belum tersedia.");
  return encodeURI(`${base.replace(/\/$/, "")}/storage/v1/object/public/${bucket}/${path}`);
}

export type Embed = { penyedia: "youtube" | "instagram" | "tiktok"; url: string; embedUrl: string };

/** Ubah link YouTube/Instagram/TikTok menjadi alamat pemutar. Null bila link tidak dikenali. */
export function bacaLinkVideo(link: string): Embed | null {
  let u: URL;
  try {
    u = new URL(link.trim());
  } catch {
    return null;
  }
  if (u.protocol !== "https:") return null;
  if (u.username || u.password || u.port) return null;
  const host = u.hostname.replace(/^www\.|^m\./, "");

  if (host === "youtu.be" || host === "youtube.com" || host === "youtube-nocookie.com") {
    const id =
      host === "youtu.be"
        ? u.pathname.slice(1)
        : (u.searchParams.get("v") ??
          u.pathname.match(/\/(?:shorts|embed|live)\/([\w-]{6,})/)?.[1]);
    if (!id || !/^[\w-]{6,}$/.test(id)) return null;
    return {
      penyedia: "youtube",
      url: u.href,
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
    };
  }
  if (host === "instagram.com") {
    const m = u.pathname.match(/^\/(p|reel|tv)\/([\w-]+)/);
    if (!m) return null;
    return {
      penyedia: "instagram",
      url: u.href,
      embedUrl: `https://www.instagram.com/${m[1]}/${m[2]}/embed`,
    };
  }
  if (host === "tiktok.com") {
    const id = u.pathname.match(/\/(?:video|player\/v1|embed\/v2)\/(\d+)(?:\/|$)/)?.[1];
    if (!id) return null;
    return { penyedia: "tiktok", url: u.href, embedUrl: `https://www.tiktok.com/player/v1/${id}` };
  }
  return null;
}
