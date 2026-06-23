export type DokumenKategori =
  | "lpj-kegiatan"
  | "proposal"
  | "surat-masuk"
  | "surat-keluar"
  | "sk-organisasi";

export const DOKUMEN_KATEGORI_LABEL: Record<DokumenKategori, string> = {
  "lpj-kegiatan":  "LPJ Kegiatan",
  "proposal":      "Proposal",
  "surat-masuk":   "Surat Masuk",
  "surat-keluar":  "Surat Keluar",
  "sk-organisasi": "SK Organisasi",
};

export type DokumenStatus = "publik" | "internal" | "draft";

export type Dokumen = {
  id: string;
  judul: string;
  kategori: DokumenKategori;
  tanggal: string;     // "TBA" jika belum ada
  tahun: number;
  ukuran: string;
  status: DokumenStatus;
  placeholder?: boolean;
};

export const DOKUMEN_LIST: Dokumen[] = [
  {
    id: "d-1",
    judul: "SK Pengurus Karang Taruna RW 03 Periode 2025–2028",
    kategori: "sk-organisasi",
    tanggal: "09 Juni 2025",
    tahun: 2025,
    ukuran: "1.2 MB",
    status: "publik",
  },
  {
    id: "d-2",
    judul: "Proposal Kerja Bakti Lingkungan RW 03",
    kategori: "proposal",
    tanggal: "TBA",
    tahun: 2025,
    ukuran: "—",
    status: "draft",
    placeholder: true,
  },
  {
    id: "d-3",
    judul: "LPJ Pelantikan Pengurus 2025–2028",
    kategori: "lpj-kegiatan",
    tanggal: "TBA",
    tahun: 2025,
    ukuran: "—",
    status: "draft",
    placeholder: true,
  },
  {
    id: "d-4",
    judul: "Surat Pemberitahuan Kegiatan ke RT",
    kategori: "surat-keluar",
    tanggal: "TBA",
    tahun: 2025,
    ukuran: "—",
    status: "draft",
    placeholder: true,
  },
  {
    id: "d-5",
    judul: "Surat Undangan Rapat Konsolidasi",
    kategori: "surat-masuk",
    tanggal: "TBA",
    tahun: 2025,
    ukuran: "—",
    status: "draft",
    placeholder: true,
  },
];