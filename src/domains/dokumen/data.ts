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

/**
 * Access Level (Design Freeze BAGIAN 5).
 * - public  → preview saja
 * - member  → preview saja
 * - kabid   → download jika diizinkan
 * - bph     → full access
 */
export type DokumenAccess = "public" | "member" | "kabid" | "bph";

export const DOKUMEN_ACCESS_META: Record<
  DokumenAccess,
  { label: string; emoji: string; tone: string; canDownload: boolean }
> = {
  public: { label: "Public", emoji: "🌍", tone: "bg-success/10 text-success border-success/20",   canDownload: false },
  member: { label: "Member", emoji: "👤", tone: "bg-primary/10 text-primary border-primary/20",    canDownload: false },
  kabid:  { label: "Kabid",  emoji: "👨‍💼", tone: "bg-accent/15 text-accent-foreground border-accent/30", canDownload: true },
  bph:    { label: "BPH",    emoji: "👑", tone: "bg-ink text-white border-ink",                    canDownload: true },
};

export type Dokumen = {
  id: string;
  judul: string;
  kategori: DokumenKategori;
  tanggal: string;     // "TBA" jika belum ada
  tahun: number;
  ukuran: string;
  status: DokumenStatus;
  access: DokumenAccess;
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
    access: "public",
  },
  {
    id: "d-2",
    judul: "Proposal Kerja Bakti Lingkungan RW 03",
    kategori: "proposal",
    tanggal: "TBA",
    tahun: 2025,
    ukuran: "—",
    status: "draft",
    access: "kabid",
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
    access: "public",
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
    access: "member",
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
    access: "bph",
    placeholder: true,
  },
];