import { Globe, ShieldCheck, UserRound, type LucideIcon } from "lucide-react";

/** Sama dengan constraint `dokumen.kategori` di database. */
export type DokumenKategori =
  | "lpj-kegiatan"
  | "proposal"
  | "surat-masuk"
  | "surat-keluar"
  | "sk-organisasi"
  | "template-surat"
  | "lainnya";

export const DOKUMEN_KATEGORI_LABEL: Record<DokumenKategori, string> = {
  "lpj-kegiatan": "LPJ Kegiatan",
  proposal: "Proposal",
  "surat-masuk": "Surat Masuk",
  "surat-keluar": "Surat Keluar",
  "sk-organisasi": "SK Organisasi",
  "template-surat": "Template Surat",
  lainnya: "Lainnya",
};

/**
 * Tingkat akses dokumen (PLANNING §7), sama dengan enum `akses_dokumen`.
 * - publik  → tampil di halaman publik & bisa diunduh siapa saja
 * - anggota → semua admin yang login
 * - bph     → hanya BPH & Super Admin
 * Dokumen non-publik tidak pernah dikirim ke pengunjung (ditegakkan RLS).
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
  tahun: number;
  tanggal: string | null; // sudah diformat
  akses: DokumenAccess;
  ukuran: string | null; // sudah diformat, mis. "1.2 MB"
  /** URL file PDF (bucket dokumen-publik), null bila file belum diunggah. */
  url: string | null;
};
