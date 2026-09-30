/**
 * Konstanta identitas situs — dipakai di metadata, footer, dan SEO.
 * Sumber: Blueprint v1.0 (LOCKED).
 */
export const SITE = {
  name: "Karang Taruna RW 03 Cipedak",
  shortName: "KT RW 03",
  tagline: "Markas Digital Karang Taruna RW 03 Cipedak",
  locale: "id-ID",
  /** Alamat publik web. Diisi lewat `VITE_SITE_URL` (lihat `.env.example`). */
  url: (import.meta.env.VITE_SITE_URL as string | undefined) ?? "http://localhost:5173",
} as const;

/**
 * Model role tunggal (PLANNING §7). Menggantikan 3 versi lama yang bentrok.
 * Urutan dari hak akses terbesar ke terkecil.
 */
export const ROLES = ["super_admin", "bph", "editor_bidang", "anggota"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABEL: Record<Role, string> = {
  super_admin: "Super Admin",
  bph: "BPH",
  editor_bidang: "Editor Bidang",
  anggota: "Anggota",
};

/** Wilayah kerja: 7 RT di bawah RW 03 Cipedak. */
export const RT_LIST = ["RT 01", "RT 02", "RT 03", "RT 04", "RT 05", "RT 06", "RT 07"] as const;
