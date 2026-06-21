/** Sumber kebenaran path navigasi — sinkron dengan Blueprint v1.0. */
export const PUBLIC_ROUTES = {
  home: "/",
  tentang: "/tentang",
  program: "/program",
  kegiatan: "/kegiatan",
  berita: "/berita",
  galeri: "/galeri",
  lpj: "/lpj",
  kontak: "/kontak",
} as const;

export const ADMIN_ROUTES = {
  root: "/admin",
  dashboard: "/admin/dashboard",
  anggota: "/admin/anggota",
  berita: "/admin/berita",
  kegiatan: "/admin/kegiatan",
  galeri: "/admin/galeri",
  dokumen: "/admin/dokumen",
  settings: "/admin/settings",
  auditLog: "/admin/audit-log",
} as const;
