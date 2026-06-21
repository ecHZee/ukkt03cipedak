/**
 * Konfigurasi bucket Supabase Storage.
 * Bucket dibuat saat Sprint storage; konstanta tetap di sini sebagai single source.
 */
export const STORAGE_BUCKETS = {
  berita: "berita",
  galeri: "galeri",
  dokumen: "dokumen",
  anggota: "anggota",
  settings: "settings",
} as const;

export type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];
