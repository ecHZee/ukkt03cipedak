import type { BidangSlug } from "@/domains/program/data";

export type StrukturGroup = "BPH" | "BIDANG";

export type Anggota = {
  id: string;
  nama: string;          // gunakan "Belum diisi" jika data SK belum tersedia
  jabatan: string;       // Ketua / Wakil / Sekretaris / Bendahara / Koordinator / Anggota
  group: StrukturGroup;
  bidang?: BidangSlug;   // BPH tidak punya bidang
  rt?: string;           // mis. "RT 01" — opsional
  periode: string;
  instagram?: string;    // opsional
  fotoUrl?: string;      // opsional — saat foto asli tersedia
  placeholder?: boolean; // true = data SK belum diisi
};

const PERIODE = "2025–2028";

const ph = (
  id: string,
  jabatan: string,
  group: StrukturGroup,
  bidang?: BidangSlug,
): Anggota => ({
  id,
  nama: "Belum diisi (menunggu SK)",
  jabatan,
  group,
  bidang,
  periode: PERIODE,
  placeholder: true,
});

/**
 * Struktur Organisasi Karang Taruna RW 03 Cipedak — Periode 2025–2028.
 * SUMBER: SK resmi (single source of truth). Saat SK final di-share,
 * isi field `nama` (dan opsional `rt`, `instagram`, `fotoUrl`).
 * DILARANG mengisi nama fiktif.
 */
export const STRUKTUR_2025_2028: Anggota[] = [
  // ===== BPH =====
  ph("bph-ketua", "Ketua", "BPH"),
  ph("bph-wakil", "Wakil Ketua", "BPH"),
  ph("bph-sekretaris-1", "Sekretaris I", "BPH"),
  ph("bph-sekretaris-2", "Sekretaris II", "BPH"),
  ph("bph-bendahara-1", "Bendahara I", "BPH"),
  ph("bph-bendahara-2", "Bendahara II", "BPH"),

  // ===== OKK =====
  ph("okk-kor", "Koordinator Bidang", "BIDANG", "okk"),
  ph("okk-ang-1", "Anggota Bidang", "BIDANG", "okk"),
  ph("okk-ang-2", "Anggota Bidang", "BIDANG", "okk"),

  // ===== Kerohanian =====
  ph("ker-kor", "Koordinator Bidang", "BIDANG", "kerohanian"),
  ph("ker-ang-1", "Anggota Bidang", "BIDANG", "kerohanian"),
  ph("ker-ang-2", "Anggota Bidang", "BIDANG", "kerohanian"),

  // ===== Kemasyarakatan =====
  ph("kem-kor", "Koordinator Bidang", "BIDANG", "kemasyarakatan"),
  ph("kem-ang-1", "Anggota Bidang", "BIDANG", "kemasyarakatan"),
  ph("kem-ang-2", "Anggota Bidang", "BIDANG", "kemasyarakatan"),

  // ===== Usaha =====
  ph("usa-kor", "Koordinator Bidang", "BIDANG", "usaha"),
  ph("usa-ang-1", "Anggota Bidang", "BIDANG", "usaha"),
  ph("usa-ang-2", "Anggota Bidang", "BIDANG", "usaha"),

  // ===== Olahraga & Kebudayaan =====
  ph("olr-kor", "Koordinator Bidang", "BIDANG", "olahraga"),
  ph("olr-ang-1", "Anggota Bidang", "BIDANG", "olahraga"),
  ph("olr-ang-2", "Anggota Bidang", "BIDANG", "olahraga"),

  // ===== Media Publikasi =====
  ph("med-kor", "Koordinator Bidang", "BIDANG", "media"),
  ph("med-ang-1", "Anggota Bidang", "BIDANG", "media"),
  ph("med-ang-2", "Anggota Bidang", "BIDANG", "media"),

  // ===== Inventarisasi =====
  ph("inv-kor", "Koordinator Bidang", "BIDANG", "inventarisasi"),
  ph("inv-ang-1", "Anggota Bidang", "BIDANG", "inventarisasi"),
  ph("inv-ang-2", "Anggota Bidang", "BIDANG", "inventarisasi"),
];

export const PERIODE_AKTIF = {
  label: PERIODE,
  pelantikan: "09 Juni 2025",
  status: "Aktif" as const,
};

export const PERIODE_HISTORY = [
  { label: PERIODE, pelantikan: "09 Juni 2025", status: "Aktif" as const },
];