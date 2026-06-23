import type { LucideIcon } from "lucide-react";
import { Users2, Dumbbell, Flame, Sprout, HeartHandshake, Camera } from "lucide-react";

export type GaleriKategori =
  | "rapat"
  | "futsal"
  | "pawai-obor"
  | "kerja-bakti"
  | "sosial"
  | "lainnya";

export const KATEGORI_META: Record<
  GaleriKategori,
  { label: string; icon: LucideIcon; tone: string }
> = {
  "rapat":        { label: "Rapat",                icon: Users2,         tone: "bg-primary/10 text-primary" },
  "futsal":       { label: "Futsal",               icon: Dumbbell,       tone: "bg-warning/10 text-warning" },
  "pawai-obor":   { label: "Pawai Obor",           icon: Flame,          tone: "bg-accent/15 text-accent-foreground" },
  "kerja-bakti":  { label: "Kerja Bakti",          icon: Sprout,         tone: "bg-success/10 text-success" },
  "sosial":       { label: "Sosial",               icon: HeartHandshake, tone: "bg-primary/10 text-primary" },
  "lainnya":      { label: "Dokumentasi Lainnya", icon: Camera,         tone: "bg-muted-surface text-ink" },
};

export type Album = {
  id: string;
  judul: string;
  kategori: GaleriKategori;
  tahun: number;
  jumlah: number; // slot foto
  tanggal: string;
  placeholder?: boolean;
};

/** Placeholder — semua album menanti foto asli dari Bidang Media. */
export const ALBUMS: Album[] = [
  { id: "a-1", judul: "Pelantikan Pengurus 2025–2028", kategori: "rapat",      tahun: 2025, jumlah: 8, tanggal: "09 Juni 2025" },
  { id: "a-2", judul: "Rapat Konsolidasi Antar-Bidang", kategori: "rapat",     tahun: 2025, jumlah: 6, tanggal: "TBA", placeholder: true },
  { id: "a-3", judul: "Latihan Rutin Futsal",          kategori: "futsal",     tahun: 2025, jumlah: 9, tanggal: "Rutin", placeholder: true },
  { id: "a-4", judul: "Kerja Bakti Lingkungan RW 03",  kategori: "kerja-bakti",tahun: 2025, jumlah: 7, tanggal: "Rutin", placeholder: true },
  { id: "a-5", judul: "Pawai Obor Ramadhan",           kategori: "pawai-obor", tahun: 2026, jumlah: 12,tanggal: "TBA",   placeholder: true },
  { id: "a-6", judul: "Bakti Sosial Lingkungan",       kategori: "sosial",     tahun: 2025, jumlah: 6, tanggal: "TBA",   placeholder: true },
];