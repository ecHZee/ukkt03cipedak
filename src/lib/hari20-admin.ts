import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
export type DokumenAdmin = Database["public"]["Tables"]["dokumen"]["Row"];
export type PengurusAdmin = Database["public"]["Tables"]["pengurus"]["Row"];
const versi = z.string().datetime({ offset: true }).optional();
const tanggal = z
  .string()
  .nullable()
  .refine(
    (s) =>
      s === null ||
      (/^\d{4}-\d{2}-\d{2}$/.test(s) &&
        !isNaN(Date.parse(s)) &&
        new Date(s).toISOString().slice(0, 10) === s),
    "Tanggal tidak valid.",
  );
export const dokumenForm = z
  .object({
    id: z.string().uuid().optional(),
    versi,
    judul: z.string().trim().min(1, "Isi judul dokumen.").max(180),
    kategori: z.enum([
      "lpj-kegiatan",
      "proposal",
      "surat-masuk",
      "surat-keluar",
      "sk-organisasi",
      "template-surat",
      "lainnya",
    ]),
    tahun: z.number().int().min(2000).max(2100),
    tanggal,
    bidang_id: z.string().uuid().nullable(),
    akses: z.enum(["publik", "anggota", "bph"]),
    status: z.enum(["draft", "review", "terbit"]),
    storage_path: z.string().max(250).nullable(),
    ukuran_bytes: z.number().int().min(1).max(20971520).nullable(),
  })
  .strict()
  .refine((d) => !d.id || !!d.versi, "Muat ulang dokumen sebelum menyimpan.");
export type DokumenForm = z.infer<typeof dokumenForm>;
export const pengurusForm = z
  .object({
    id: z.string().uuid().optional(),
    versi,
    periode_id: z.string().uuid(),
    nama: z.string().trim().min(1, "Isi nama.").max(150),
    gelar: z.string().trim().max(100).nullable(),
    jabatan: z.string().trim().min(1, "Isi jabatan.").max(100),
    grup: z.enum(["penasihat", "bph", "bidang"]),
    bidang_id: z.string().uuid().nullable(),
    urutan: z.number().int().min(0).max(1000),
    rt: z
      .string()
      .regex(/^RT 0[1-7]$/)
      .nullable(),
    aktif: z.boolean(),
    instagram: z
      .string()
      .regex(/^@?[a-zA-Z0-9._]{1,30}$/)
      .nullable(),
    izin_instagram: z.boolean(),
    foto_path: z.string().max(250).nullable(),
    izin_foto: z.boolean(),
  })
  .strict()
  .refine((d) => !d.id || !!d.versi, "Muat ulang pengurus sebelum menyimpan.")
  .refine(
    (d) => (d.grup === "bidang") === (d.bidang_id !== null),
    "Pilih bidang untuk pengurus bidang; BPH/Penasihat tanpa bidang.",
  )
  .refine((d) => !d.izin_foto || !!d.foto_path, "Pilih foto sebelum mengizinkan tampil.")
  .refine((d) => d.aktif || !d.izin_foto, "Cabut izin foto saat menonaktifkan pengurus.");
export type PengurusForm = z.infer<typeof pengurusForm>;
export const idVersi = z
  .object({ id: z.string().uuid(), versi: z.string().datetime({ offset: true }) })
  .strict();
export function pathArsip(path: string) {
  return /^privat:arsip\/[0-9a-f-]{36}\/[0-9a-f-]{36}\.pdf$/.test(path);
}
