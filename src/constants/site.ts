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
 * Model role (PLANNING §7), sama dengan enum `app_role` di database.
 * - super_admin → programmer; satu-satunya yang mengelola akun
 * - admin       → BPH (tanpa bidang = lintas bidang) atau Kepala Bidang (terikat satu bidang)
 * - anggota     → Anggota Bidang & Penasihat; bisa berkontribusi bila diberi izin Kabid/BPH
 * Role diturunkan otomatis dari jabatan di tabel pengurus (kecuali Super Admin).
 */
export const ROLES = ["super_admin", "admin", "anggota"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABEL: Record<Role, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  anggota: "Anggota",
};

/** Akun memakai email internal dari username (tidak pernah dikirimi email). */
export const DOMAIN_AKUN = "akun.katar-rw03.internal";

/** Wilayah kerja: 7 RT di bawah RW 03 Cipedak. */
export const RT_LIST = ["RT 01", "RT 02", "RT 03", "RT 04", "RT 05", "RT 06", "RT 07"] as const;
