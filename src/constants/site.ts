/**
 * Konstanta identitas situs — dipakai di metadata, footer, dan SEO.
 * Sumber: Blueprint v1.0 (LOCKED).
 */
export const SITE = {
  name: "Karang Taruna RW 03 Cipedak",
  shortName: "KT RW 03",
  tagline: "Markas Digital Karang Taruna RW 03 Cipedak",
  locale: "id-ID",
  url: "https://karangtaruna-rw03.lovable.app",
} as const;

export const ROLES = ["super_admin", "admin", "editor", "member"] as const;
export type Role = (typeof ROLES)[number];
