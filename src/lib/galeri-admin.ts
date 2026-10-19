import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
export {
  slugKegiatan as slugAlbum,
  STATUS_KEGIATAN as STATUS_ALBUM,
  bolehKelolaKegiatan as bolehKelolaAlbum,
  bolehTerbitKegiatan as bolehTerbitAlbum,
} from "./kegiatan-admin";
export type AlbumAdmin = Database["public"]["Tables"]["album"]["Row"];
export type MediaAdmin = Database["public"]["Tables"]["media"]["Row"];
export const BATAS_GALERI = {
  foto: 20 * 1024 * 1024,
  video: 200 * 1024 * 1024,
  antrean: 40,
  album: 200,
} as const;
export function folderDrive(link: string) {
  if (!link.trim()) return "";
  try {
    const u = new URL(link.trim());
    if (
      u.protocol !== "https:" ||
      u.hostname !== "drive.google.com" ||
      u.username ||
      u.password ||
      u.port
    )
      return null;
    const id = u.pathname.match(/^\/drive\/(?:u\/\d+\/)?folders\/([\w-]+)\/?$/)?.[1];
    return id ? `https://drive.google.com/drive/folders/${id}` : null;
  } catch {
    return null;
  }
}
export const formulirAlbum = z
  .object({
    id: z.string().uuid().optional(),
    versi: z.string().datetime({ offset: true }).optional(),
    judul: z.string().trim().min(1, "Isi judul album.").max(180),
    slug: z
      .string()
      .min(1)
      .max(120)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Alamat memakai huruf kecil, angka dan tanda hubung."),
    deskripsi: z.string().trim().max(3000),
    bidang_id: z.string().uuid().nullable(),
    tanggal: z
      .string()
      .nullable()
      .refine(
        (s) =>
          s === null ||
          (/^\d{4}-\d{2}-\d{2}$/.test(s) &&
            Number.isFinite(Date.parse(s)) &&
            new Date(s).toISOString().slice(0, 10) === s),
        "Tanggal tidak valid.",
      ),
    status: z.enum(["draft", "review", "terbit"]),
    gdrive_url: z
      .string()
      .max(500)
      .refine((s) => folderDrive(s) !== null, "Gunakan tautan folder Google Drive.")
      .transform((s) => folderDrive(s)!),
  })
  .strict()
  .refine((d) => !d.id || !!d.versi, {
    path: ["versi"],
    message: "Muat ulang album sebelum menyimpan.",
  });
export type FormulirAlbum = z.infer<typeof formulirAlbum>;
export const reservasiAlbum = z
  .object({
    album_id: z.string().uuid(),
    hash_sumber: z.string().regex(/^[a-f0-9]{64}$/),
    jenis: z.enum(["foto", "video"]),
    mime: z.enum(["image/webp", "video/mp4", "video/webm", "video/quicktime"]),
    ukuran_bytes: z.number().int().positive().max(BATAS_GALERI.video),
    thumb_bytes: z
      .number()
      .int()
      .positive()
      .max(2 * 1024 * 1024)
      .nullable(),
    lebar: z.number().int().min(1).max(1920).nullable(),
    tinggi: z.number().int().min(1).max(1920).nullable(),
    caption: z.string().trim().max(300),
  })
  .strict()
  .refine(
    (d) =>
      d.jenis === "foto"
        ? d.mime === "image/webp" &&
          d.ukuran_bytes <= BATAS_GALERI.foto &&
          d.thumb_bytes !== null &&
          d.lebar !== null &&
          d.tinggi !== null
        : d.mime !== "image/webp" && d.thumb_bytes === null,
    "Metadata unggahan tidak sesuai jenis file.",
  );
export type ReservasiAlbum = z.infer<typeof reservasiAlbum>;
export const aksiMediaAlbum = z
  .object({
    album_id: z.string().uuid(),
    versi: z.string().datetime({ offset: true }),
    aksi: z.enum([
      "cover",
      "caption",
      "naik",
      "turun",
      "hapus",
      "embed",
      "bersihkan",
      "hapus_album",
    ]),
    media_id: z.string().uuid().optional(),
    caption: z.string().trim().max(300).optional(),
    url: z.string().max(500).optional(),
  })
  .strict()
  .refine(
    (d) => ["embed", "bersihkan", "hapus_album"].includes(d.aksi) || !!d.media_id,
    "Pilih media.",
  );
export type AksiMediaAlbum = z.infer<typeof aksiMediaAlbum>;
export const thumbB2 = (path: string) => path.replace(/\.webp$/, "_thumb.webp");
export function cekFileAlbum(f: Pick<File, "type" | "size">) {
  if (f.size === 0) throw new Error("File kosong.");
  if (["image/jpeg", "image/png", "image/webp"].includes(f.type)) {
    if (f.size > BATAS_GALERI.foto) throw new Error("Foto maksimal 20 MB per file.");
  } else if (["video/mp4", "video/webm", "video/quicktime"].includes(f.type)) {
    if (f.size > BATAS_GALERI.video)
      throw new Error("Video maksimal 200 MB. Gunakan tautan video untuk file besar.");
  } else
    throw new Error(
      "Pilih JPG, PNG, WebP, MP4, WebM atau MOV. HEIC perlu diekspor menjadi JPG dulu.",
    );
}
