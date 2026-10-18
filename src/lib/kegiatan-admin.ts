import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

export const STATUS_KEGIATAN = { draft: "Draf", review: "Menunggu persetujuan", terbit: "Terbit" };
export const TAHAP_KEGIATAN = {
  rencana: "Rencana",
  berjalan: "Berjalan",
  selesai: "Selesai",
  batal: "Batal",
};
export type KegiatanAdmin = Database["public"]["Tables"]["kegiatan"]["Row"];
export type AksesKegiatan = {
  id: string;
  role: "super_admin" | "admin" | "anggota";
  bidangId: string | null;
  bolehKontribusi: boolean;
};

export function slugKegiatan(judul: string) {
  return judul
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120)
    .replace(/-$/, "");
}

/** datetime-local selalu ditafsirkan WIB, termasuk bila komputer pengurus di zona lain. */
export function waktuWib(isi: string): string | null {
  if (!isi) return null;
  if (!/^(19|20|21)\d{2}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(isi)) return null;
  const d = new Date(`${isi}:00+07:00`);
  if (!Number.isFinite(d.getTime())) return null;
  const balik = new Date(d.getTime() + 7 * 3600_000).toISOString().slice(0, 16);
  return balik === isi ? d.toISOString() : null;
}

export function keInputWib(iso: string | null) {
  return iso ? new Date(new Date(iso).getTime() + 7 * 3600_000).toISOString().slice(0, 16) : "";
}

const tanggal = z.string().refine((s) => !s || waktuWib(s) !== null, "Tanggal/jam tidak valid.");
export const formulirKegiatan = z
  .object({
    id: z.string().uuid().optional(),
    versi: z.string().datetime({ offset: true }).optional(),
    judul: z.string().trim().min(1, "Isi judul kegiatan.").max(180, "Maksimal 180 karakter."),
    slug: z
      .string()
      .trim()
      .min(1, "Isi alamat kegiatan.")
      .max(120)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Gunakan huruf kecil, angka, dan tanda hubung."),
    ringkasan: z.string().trim().max(500, "Maksimal 500 karakter."),
    isi: z.string().trim().max(20000, "Maksimal 20.000 karakter."),
    bidang_id: z.string().uuid().nullable(),
    periode_id: z.string().uuid("Pilih periode."),
    mulai: tanggal,
    selesai: tanggal,
    rutin: z.string().trim().max(200, "Maksimal 200 karakter."),
    lokasi: z.string().trim().max(300, "Maksimal 300 karakter."),
    tahap: z.enum(["rencana", "berjalan", "selesai", "batal"]),
    status: z.enum(["draft", "review", "terbit"]),
  })
  .strict()
  .superRefine((d, ctx) => {
    const masalah = (path: string, message: string) =>
      ctx.addIssue({ code: "custom", path: [path], message });
    if (d.id && !d.versi) masalah("versi", "Muat ulang kegiatan sebelum menyimpan.");
    if (d.selesai && !d.mulai) masalah("mulai", "Isi waktu mulai sebelum waktu selesai.");
    if (waktuWib(d.mulai) && waktuWib(d.selesai) && waktuWib(d.selesai)! < waktuWib(d.mulai)!)
      masalah("selesai", "Waktu selesai tidak boleh mendahului mulai.");
    if (d.status !== "draft") {
      if (!d.ringkasan) masalah("ringkasan", "Isi ringkasan sebelum mengajukan atau menerbitkan.");
      if (!d.mulai && !d.rutin) masalah("mulai", "Isi tanggal mulai atau jadwal rutin.");
    }
  });
export type FormulirKegiatan = z.infer<typeof formulirKegiatan>;

/** Mencerminkan boleh_terbit/boleh_kelola untuk UI; RLS tetap memeriksa setiap operasi. */
export function bolehTerbitKegiatan(
  a: AksesKegiatan,
  k: Pick<KegiatanAdmin, "bidang_id" | "created_by">,
) {
  return (
    a.role === "super_admin" ||
    (a.role === "admin" &&
      (a.bidangId === null ||
        k.bidang_id === a.bidangId ||
        (k.bidang_id === null && k.created_by === a.id)))
  );
}
export function bolehKelolaKegiatan(
  a: AksesKegiatan,
  k: Pick<KegiatanAdmin, "bidang_id" | "created_by" | "status">,
) {
  return (
    bolehTerbitKegiatan(a, k) ||
    (a.bolehKontribusi &&
      k.status !== "terbit" &&
      k.created_by === a.id &&
      k.bidang_id === a.bidangId)
  );
}

export function dataSimpanKegiatan(d: FormulirKegiatan) {
  return {
    judul: d.judul,
    slug: d.slug,
    ringkasan: d.ringkasan || null,
    isi: d.isi || null,
    bidang_id: d.bidang_id,
    periode_id: d.periode_id,
    mulai: waktuWib(d.mulai),
    selesai: waktuWib(d.selesai),
    rutin: d.rutin || null,
    lokasi: d.lokasi || null,
    tahap: d.tahap,
    status: d.status,
  };
}
