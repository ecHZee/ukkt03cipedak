import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
export {
  slugKegiatan as slugBerita,
  STATUS_KEGIATAN as STATUS_BERITA,
  bolehKelolaKegiatan as bolehKelolaBerita,
  bolehTerbitKegiatan as bolehTerbitBerita,
} from "./kegiatan-admin";

export type BeritaAdmin = Database["public"]["Tables"]["berita"]["Row"];
export const sampulBerita = z
  .object({
    path: z.string().max(300),
    thumbPath: z.string().max(300),
    lebar: z.number().int().min(1).max(1920),
    tinggi: z.number().int().min(1).max(1920),
    ukuranByte: z
      .number()
      .int()
      .min(1)
      .max(20 * 1024 * 1024),
    caption: z.string().trim().max(300),
  })
  .strict();
export const formulirBerita = z
  .object({
    id: z.string().uuid().optional(),
    versi: z.string().datetime({ offset: true }).optional(),
    judul: z.string().trim().min(1, "Isi judul berita.").max(180),
    slug: z
      .string()
      .trim()
      .min(1, "Isi alamat berita.")
      .max(120)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Gunakan huruf kecil, angka dan tanda hubung."),
    ringkasan: z.string().trim().max(500),
    isi: z.string().trim().max(30000),
    bidang_id: z.string().uuid().nullable(),
    pinned: z.boolean(),
    status: z.enum(["draft", "review", "terbit"]),
    cover_id: z.string().uuid().nullable(),
    sampul: sampulBerita.nullable().optional(),
  })
  .strict()
  .superRefine((d, ctx) => {
    if (d.id && !d.versi)
      ctx.addIssue({
        code: "custom",
        path: ["versi"],
        message: "Muat ulang berita sebelum menyimpan.",
      });
    if (d.status !== "draft")
      for (const key of ["ringkasan", "isi"] as const)
        if (!d[key])
          ctx.addIssue({
            code: "custom",
            path: [key],
            message: "Isi bagian ini sebelum mengajukan atau menerbitkan.",
          });
  });
export type FormulirBerita = z.infer<typeof formulirBerita>;
