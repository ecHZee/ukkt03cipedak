import { z } from "zod";

export const KUNCI_SITUS = [
  "organisasi.nama",
  "organisasi.wilayah",
  "organisasi.jumlah_rt",
  "kontak.whatsapp",
  "kontak.email",
  "kontak.alamat",
  "kontak.maps_url",
  "sosmed.instagram",
  "sosmed.tiktok",
  "sosmed.youtube",
  "pengumuman",
  "situs.tampilan",
] as const;
export function urlAman(s: string, host?: string[]) {
  if (!s.startsWith("https://") || /[\\\s]/.test(s)) return false;
  try {
    const u = new URL(s);
    return (
      u.protocol === "https:" &&
      !u.username &&
      !u.password &&
      !u.port &&
      (!host || host.includes(u.hostname))
    );
  } catch {
    return false;
  }
}
const teks = (n: number) => z.string().trim().max(n);
const tanggalValid = (s: string) => {
  if (!s) return true;
  const d = new Date(s + "T00:00:00Z");
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(s) &&
    Number.isFinite(d.getTime()) &&
    d.toISOString().slice(0, 10) === s
  );
};
const link = (host?: string[]) =>
  teks(500).refine((s) => !s || urlAman(s, host), "Gunakan tautan HTTPS resmi yang sesuai.");
export const pathAsetSitus = /^pengaturan\/[0-9a-f-]{36}\/[0-9a-f-]{36}\.webp$/;
const path = teks(130).refine(
  (s) => !s || pathAsetSitus.test(s),
  "Unggah gambar melalui form ini.",
);
export const tampilanForm = z
  .object({
    tagline: teks(180),
    logo: path,
    foto: z
      .array(
        z
          .object({ path, caption: teks(100) })
          .strict()
          .refine((f) => !f.path || Boolean(f.caption), "Foto perlu keterangan singkat."),
      )
      .length(4),
  })
  .strict();
export const pengaturanForm = z
  .object({
    "organisasi.nama": teks(100).min(3),
    "organisasi.wilayah": teks(200),
    "organisasi.jumlah_rt": z.number().int().min(1).max(1000),
    "kontak.whatsapp": teks(30)
      .transform((s) => s.replace(/[\s()+-]/g, "").replace(/^0/, "62"))
      .refine(
        (s) => !s || /^62[1-9][0-9]{7,12}$/.test(s),
        "Isi nomor WhatsApp diawali 08 atau 62.",
      ),
    "kontak.email": teks(150).refine(
      (s) => !s || z.string().email().safeParse(s).success,
      "Alamat email belum benar.",
    ),
    "kontak.alamat": teks(500),
    "kontak.maps_url": link([
      "maps.google.com",
      "www.google.com",
      "google.com",
      "maps.app.goo.gl",
      "goo.gl",
    ]),
    "sosmed.instagram": link(["instagram.com", "www.instagram.com"]),
    "sosmed.tiktok": link(["tiktok.com", "www.tiktok.com"]),
    "sosmed.youtube": link(["youtube.com", "www.youtube.com", "youtu.be"]),
    pengumuman: z
      .object({
        teks: teks(300),
        tautan: teks(500).refine(
          (s) =>
            !s ||
            (/^\/(?!\/)[^\\\s]*$/.test(s) && ![...s].some((c) => c.charCodeAt(0) < 32)) ||
            urlAman(s),
          "Isi path halaman (/kegiatan) atau tautan HTTPS.",
        ),
        sampai: teks(10).refine(tanggalValid, "Tanggal belum benar."),
      })
      .strict(),
    "situs.tampilan": tampilanForm,
  })
  .strict();
export const simpanSitusForm = z
  .object({ nilai: pengaturanForm, versi: z.record(z.string()) })
  .strict();
export type IsianSitus = z.infer<typeof pengaturanForm>;
export const TAMPILAN_AWAL = {
  tagline: "",
  logo: "",
  foto: Array.from({ length: 4 }, () => ({ path: "", caption: "" })),
};
export function isianDariBaris(baris: { key: string; value: unknown }[]): IsianSitus {
  const v = Object.fromEntries(baris.map((r) => [r.key, r.value]));
  const s = (key: string) => (typeof v[key] === "string" ? (v[key] as string) : "");
  const t = tampilanForm.safeParse(v["situs.tampilan"]);
  const p = v.pengumuman as { teks?: string; tautan?: string; sampai?: string } | null;
  return {
    "organisasi.nama": s("organisasi.nama"),
    "organisasi.wilayah": s("organisasi.wilayah"),
    "organisasi.jumlah_rt": Number(v["organisasi.jumlah_rt"]) || 7,
    "kontak.whatsapp": s("kontak.whatsapp"),
    "kontak.email": s("kontak.email"),
    "kontak.alamat": s("kontak.alamat"),
    "kontak.maps_url": s("kontak.maps_url"),
    "sosmed.instagram": s("sosmed.instagram"),
    "sosmed.tiktok": s("sosmed.tiktok"),
    "sosmed.youtube": s("sosmed.youtube"),
    pengumuman: { teks: p?.teks ?? "", tautan: p?.tautan ?? "", sampai: p?.sampai ?? "" },
    "situs.tampilan": t.success ? t.data : structuredClone(TAMPILAN_AWAL),
  };
}
export function pathTampilan(t: z.infer<typeof tampilanForm>) {
  return [t.logo, ...t.foto.map((f) => f.path)].filter(Boolean);
}
export const MODUL_AUDIT = [
  "pengaturan",
  "akun",
  "profiles",
  "pengurus",
  "kegiatan",
  "berita",
  "album",
  "media",
  "dokumen",
  "periode",
  "bidang",
] as const;
export const LABEL_MODUL: Record<string, string> = {
  pengaturan: "Pengaturan",
  akun: "Akun login",
  profiles: "Profil akun",
  pengurus: "Pengurus",
  kegiatan: "Kegiatan",
  berita: "Berita",
  album: "Album galeri",
  media: "Foto dan video",
  dokumen: "Dokumen",
  periode: "Periode",
  bidang: "Bidang",
};
export const filterAudit = z
  .object({
    modul: z.enum(["", ...MODUL_AUDIT]).default(""),
    aksi: z.enum(["", "INSERT", "UPDATE", "DELETE"]).default(""),
    pelaku: z.string().uuid().or(z.literal("")).default(""),
    dari: z.string().refine(tanggalValid, "Tanggal belum benar.").default(""),
    sampai: z.string().refine(tanggalValid, "Tanggal belum benar.").default(""),
    halaman: z.coerce.number().int().min(0).max(10000).default(0),
  })
  .strict()
  .refine(
    (f) => !f.dari || !f.sampai || f.dari <= f.sampai,
    "Tanggal akhir harus sesudah tanggal awal.",
  );
/** Nilai lama/baru sengaja tidak dikirim ke browser; bisa memuat kontak pribadi. */
export function ringkasAudit(r: {
  tabel: string;
  aksi: string;
  sebelum: unknown;
  sesudah: unknown;
}) {
  const a = (r.sebelum ?? {}) as Record<string, unknown>,
    b = (r.sesudah ?? {}) as Record<string, unknown>;
  const label =
    r.aksi === "INSERT" ? "Menambah" : r.aksi === "DELETE" ? "Menghapus" : "Memperbarui";
  if (r.tabel === "akun") {
    const aksi = {
      ganti_username: "Mengganti username",
      reset_password: "Mereset password",
      aktifkan: "Mengaktifkan akun",
      nonaktifkan: "Menonaktifkan akun",
    };
    return aksi[b.aksi as keyof typeof aksi] ?? "Memperbarui akses akun";
  }
  const bidang = Object.keys({ ...a, ...b }).filter(
    (k) =>
      !["updated_at", "id", "created_at"].includes(k) &&
      JSON.stringify(a[k]) !== JSON.stringify(b[k]),
  );
  const modul = LABEL_MODUL[r.tabel]?.toLowerCase() ?? "data";
  if (
    r.aksi === "UPDATE" &&
    a.status !== b.status &&
    ["draft", "review", "terbit"].includes(String(b.status))
  ) {
    const status = {
      draft: "Mengembalikan ke draf",
      review: "Mengajukan peninjauan",
      terbit: "Menerbitkan",
    };
    return `${status[b.status as keyof typeof status]} · ${modul}`;
  }
  return `${label} ${modul}${bidang.length ? ` · ${bidang.length} bagian berubah` : ""}`;
}
