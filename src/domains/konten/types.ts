/**
 * Tipe tampilan untuk konten yang diambil dari database (lihat src/services/konten.ts).
 * Semua field berupa data polos (string/number/boolean) supaya bisa dikirim dari server ke browser.
 */

export type KegiatanTahap = "rencana" | "berjalan" | "selesai" | "batal";

export type Kegiatan = {
  id: string;
  slug: string;
  judul: string;
  ringkasan: string;
  /** Jadwal siap tampil, mis. "Sab, 10 Okt 2026 · 19.30 WIB" atau "Setiap Minggu pagi". */
  jadwal: string | null;
  /** ISO, untuk pengurutan & "kegiatan terdekat". Null = belum dijadwalkan / rutin. */
  mulai: string | null;
  rutin: boolean;
  lokasi: string | null;
  bidang: string | null; // slug
  tahap: KegiatanTahap;
};

export type Berita = {
  id: string;
  slug: string;
  judul: string;
  ringkasan: string;
  bidang: string | null; // slug; null = umum
  /** Tanggal terbit siap tampil, mis. "06 Juni 2025". */
  tanggal: string | null;
  terbitAt: string | null; // ISO
  pinned: boolean;
  /** Hanya terisi untuk admin (pengunjung selalu melihat yang terbit). */
  status?: "draft" | "review" | "terbit";
};

export type Album = {
  id: string;
  slug: string;
  judul: string;
  bidang: string | null;
  tanggal: string | null;
  tahun: number | null;
  jumlahMedia: number;
};

/** Pengaturan publik. Null = belum diisi → bagian terkait disembunyikan. */
export type Pengaturan = {
  namaOrganisasi: string;
  wilayah: string | null;
  jumlahRt: number | null;
  whatsapp: string | null; // digit saja, mis. "6281234567890"
  email: string | null;
  alamat: string | null;
  mapsUrl: string | null;
  instagram: string | null;
  tiktok: string | null;
  youtube: string | null;
};
