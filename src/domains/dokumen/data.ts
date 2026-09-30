import { Globe, ShieldCheck, UserRound, type LucideIcon } from "lucide-react";

export type DokumenKategori =
  "lpj-kegiatan" | "proposal" | "surat-masuk" | "surat-keluar" | "sk-organisasi";

export const DOKUMEN_KATEGORI_LABEL: Record<DokumenKategori, string> = {
  "lpj-kegiatan": "LPJ Kegiatan",
  proposal: "Proposal",
  "surat-masuk": "Surat Masuk",
  "surat-keluar": "Surat Keluar",
  "sk-organisasi": "SK Organisasi",
};

export type DokumenStatus = "publik" | "internal" | "draft";

/**
 * Tingkat akses dokumen (PLANNING §7).
 * - publik  → tampil di halaman publik & bisa diunduh siapa saja
 * - anggota → hanya pengurus yang login
 * - bph     → hanya BPH & Super Admin
 * Dokumen non-publik TIDAK boleh dikirim ke pengunjung (bukan sekadar dikunci tombolnya).
 */
export type DokumenAccess = "publik" | "anggota" | "bph";

export const DOKUMEN_ACCESS_META: Record<
  DokumenAccess,
  { label: string; icon: LucideIcon; tone: string }
> = {
  publik: { label: "Publik", icon: Globe, tone: "bg-success/10 text-success border-success/20" },
  anggota: {
    label: "Anggota",
    icon: UserRound,
    tone: "bg-primary/10 text-primary border-primary/20",
  },
  bph: { label: "BPH", icon: ShieldCheck, tone: "bg-ink text-white border-ink" },
};

export type Dokumen = {
  id: string;
  judul: string;
  kategori: DokumenKategori;
  tanggal: string; // "TBA" jika belum ada
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
    tanggal: "05 Juni 2025",
    tahun: 2025,
    ukuran: "1.2 MB",
    status: "publik",
    access: "publik",
  },
  {
    id: "d-2",
    judul: "Proposal Kerja Bakti Lingkungan RW 03",
    kategori: "proposal",
    tanggal: "TBA",
    tahun: 2025,
    ukuran: "—",
    status: "draft",
    access: "anggota",
    placeholder: true,
  },
  {
    id: "d-3",
    judul: "LPJ Pengukuhan Pengurus 2025–2028",
    kategori: "lpj-kegiatan",
    tanggal: "TBA",
    tahun: 2025,
    ukuran: "—",
    status: "draft",
    access: "publik",
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
    access: "anggota",
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
