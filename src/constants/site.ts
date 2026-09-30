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

export const ROLES = ["super_admin", "admin", "editor", "member"] as const;
export type Role = (typeof ROLES)[number];
