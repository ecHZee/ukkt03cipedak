/**
 * Penyimpanan file (Supabase Storage). Semua upload lewat file ini supaya kelak mudah
 * dipindah ke penyedia lain (mis. Cloudflare R2) tanpa mengubah halaman.
 *
 * Bucket: media (publik) · dokumen-publik (publik) · dokumen-internal (privat, signed URL).
 * Path: <folder>/<id>.<ext>; folder = slug bidang, "umum", atau "bph" (internal BPH).
 * Hak tulis per folder ditegakkan kebijakan storage di database.
 */
import { supabase } from "@/integrations/supabase/client";

export const BATAS = {
  fotoSisiTerpanjang: 1920,
  thumbSisiTerpanjang: 480,
  kualitasWebp: 0.8,
  videoMaksByte: 50 * 1024 * 1024,
  dokumenMaksByte: 20 * 1024 * 1024,
} as const;

const idAcak = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);

// ------------------------------------------------------------------ kompresi foto

export type FotoTerkompres = {
  utama: Blob;
  thumb: Blob;
  lebar: number;
  tinggi: number;
};

async function keWebp(bitmap: ImageBitmap, sisiMaks: number, kualitas: number) {
  const skala = Math.min(1, sisiMaks / Math.max(bitmap.width, bitmap.height));
  const lebar = Math.round(bitmap.width * skala);
  const tinggi = Math.round(bitmap.height * skala);
  const canvas = document.createElement("canvas");
  canvas.width = lebar;
  canvas.height = tinggi;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Browser tidak mendukung pemrosesan gambar");
  ctx.drawImage(bitmap, 0, 0, lebar, tinggi);
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", kualitas));
  if (!blob) throw new Error("Gagal mengompres foto");
  return { blob, lebar, tinggi };
}

/** Foto dari HP (bisa 5–10 MB) → WebP 1920 px (±200–400 KB) + thumbnail 480 px. Berjalan di browser. */
export async function kompresFoto(file: Blob): Promise<FotoTerkompres> {
  // imageOrientation: foto HP yang diputar (EXIF) tetap tegak
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  try {
    const utama = await keWebp(bitmap, BATAS.fotoSisiTerpanjang, BATAS.kualitasWebp);
    const thumb = await keWebp(bitmap, BATAS.thumbSisiTerpanjang, 0.75);
    return { utama: utama.blob, thumb: thumb.blob, lebar: utama.lebar, tinggi: utama.tinggi };
  } finally {
    bitmap.close();
  }
}

// ------------------------------------------------------------------ unggah

async function unggah(bucket: string, path: string, isi: Blob, contentType: string) {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, isi, { contentType, cacheControl: "31536000", upsert: false });
  if (error) {
    if (/row-level security|unauthorized|403/i.test(error.message)) {
      throw new Error("Kamu tidak punya izin mengunggah ke folder ini.");
    }
    throw new Error(`Gagal mengunggah: ${error.message}`);
  }
  return path;
}

export type HasilFoto = {
  path: string;
  thumbPath: string;
  lebar: number;
  tinggi: number;
  ukuranByte: number;
};

export async function unggahFoto(file: File, folder: string): Promise<HasilFoto> {
  if (!file.type.startsWith("image/")) throw new Error("File bukan gambar.");
  const f = await kompresFoto(file);
  const id = idAcak();
  const path = `${folder}/${id}.webp`;
  const thumbPath = `${folder}/${id}_thumb.webp`;
  await unggah("media", path, f.utama, "image/webp");
  await unggah("media", thumbPath, f.thumb, "image/webp");
  return { path, thumbPath, lebar: f.lebar, tinggi: f.tinggi, ukuranByte: f.utama.size };
}

/** Foto profil sendiri → media/profil/<id-akun>/… (boleh untuk semua akun). */
export async function unggahFotoProfil(file: File, akunId: string) {
  if (!file.type.startsWith("image/")) throw new Error("File bukan gambar.");
  const f = await kompresFoto(file);
  const path = `profil/${akunId}/${idAcak()}.webp`;
  await unggah("media", path, f.utama, "image/webp");
  return path;
}

export async function unggahVideo(file: File, folder: string) {
  if (!["video/mp4", "video/webm", "video/quicktime"].includes(file.type)) {
    throw new Error("Format video harus MP4, WebM, atau MOV.");
  }
  if (file.size > BATAS.videoMaksByte) {
    throw new Error(
      "Video lebih dari 50 MB. Unggah ke YouTube/Instagram/TikTok lalu tempel link-nya.",
    );
  }
  const ext = file.type === "video/webm" ? "webm" : file.type === "video/quicktime" ? "mov" : "mp4";
  const path = `${folder}/${idAcak()}.${ext}`;
  await unggah("media", path, file, file.type);
  return { path, ukuranByte: file.size };
}

export async function unggahDokumen(file: File, folder: string, internal: boolean) {
  if (file.type !== "application/pdf") throw new Error("Dokumen harus berformat PDF.");
  if (file.size > BATAS.dokumenMaksByte) throw new Error("Dokumen lebih dari 20 MB.");
  const bucket = internal ? "dokumen-internal" : "dokumen-publik";
  const path = `${folder}/${idAcak()}.pdf`;
  await unggah(bucket, path, file, "application/pdf");
  return { bucket, path, ukuranByte: file.size };
}

export async function hapusFile(bucket: string, paths: string[]) {
  const { error } = await supabase.storage.from(bucket).remove(paths);
  if (error) throw new Error(`Gagal menghapus file: ${error.message}`);
}

// ------------------------------------------------------------------ alamat file

/** URL publik untuk file di bucket publik. Path yang sudah berupa URL penuh dikembalikan apa adanya. */
export function urlPublik(bucket: "media" | "dokumen-publik", path: string | null | undefined) {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

/** Link sementara (10 menit) untuk dokumen internal — hanya berhasil untuk pengurus yang berhak. */
export async function urlSementara(path: string, detik = 600) {
  const { data, error } = await supabase.storage
    .from("dokumen-internal")
    .createSignedUrl(path, detik);
  if (error || !data) throw new Error("Kamu tidak punya akses ke dokumen ini.");
  return data.signedUrl;
}

// ------------------------------------------------------------------ video dari link

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
  const host = u.hostname.replace(/^www\.|^m\./, "");

  if (host === "youtu.be" || host.endsWith("youtube.com")) {
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
    const id = u.pathname.match(/\/video\/(\d+)/)?.[1];
    if (!id) return null;
    return { penyedia: "tiktok", url: u.href, embedUrl: `https://www.tiktok.com/embed/v2/${id}` };
  }
  return null;
}
