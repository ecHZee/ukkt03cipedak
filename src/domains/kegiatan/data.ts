import type { BidangSlug } from "@/domains/program/data";

export type KegiatanStatus = "rencana" | "berjalan" | "selesai";

export type Kegiatan = {
  id: string;
  judul: string;
  ringkasan: string;
  tanggal: string;          // "TBA" jika belum dijadwalkan
  lokasi: string;
  bidang: BidangSlug;
  status: KegiatanStatus;
  placeholder?: boolean;
};

/**
 * Sumber: rencana program kerja periode 2025–2028.
 * Tanggal pasti menyusul setelah rapat konsolidasi bidang.
 */
export const KEGIATAN_LIST: Kegiatan[] = [
  {
    id: "k-1",
    judul: "Rapat Konsolidasi Antar-Bidang",
    ringkasan: "Penyelarasan program kerja awal tujuh bidang periode 2025–2028.",
    tanggal: "TBA",
    lokasi: "Sekretariat RW 03 Cipedak",
    bidang: "okk",
    status: "rencana",
    placeholder: true,
  },
  {
    id: "k-2",
    judul: "Kerja Bakti Lingkungan RW 03",
    ringkasan: "Bersih-bersih lingkungan secara rutin setiap akhir pekan.",
    tanggal: "Rutin · Minggu pagi",
    lokasi: "Wilayah RW 03 Cipedak",
    bidang: "kemasyarakatan",
    status: "berjalan",
  },
  {
    id: "k-3",
    judul: "Latihan Rutin Futsal",
    ringkasan: "Latihan persahabatan antar pemuda RW 03.",
    tanggal: "Rutin · Jumat malam",
    lokasi: "Lapangan RW 03",
    bidang: "olahraga",
    status: "berjalan",
  },
  {
    id: "k-4",
    judul: "Pembinaan Mental & Kerohanian Pemuda",
    ringkasan: "Pengajian dan diskusi rutin bersama pemuda RW 03.",
    tanggal: "TBA",
    lokasi: "Sekretariat RW 03",
    bidang: "kerohanian",
    status: "rencana",
    placeholder: true,
  },
  {
    id: "k-5",
    judul: "Aktivasi Kanal Media Sosial Resmi",
    ringkasan: "Peluncuran akun resmi Instagram & YouTube Karang Taruna RW 03.",
    tanggal: "TBA",
    lokasi: "Daring",
    bidang: "media",
    status: "rencana",
    placeholder: true,
  },
  {
    id: "k-6",
    judul: "Pelantikan Pengurus 2025–2028",
    ringkasan: "Pengukuhan susunan pengurus Karang Taruna RW 03 Cipedak periode 2025–2028.",
    tanggal: "09 Juni 2025",
    lokasi: "RW 03 Cipedak",
    bidang: "okk",
    status: "selesai",
  },
  {
    id: "k-7",
    judul: "Pendataan Aset & Inventaris",
    ringkasan: "Pendataan ulang seluruh inventaris organisasi.",
    tanggal: "TBA",
    lokasi: "Sekretariat RW 03",
    bidang: "inventarisasi",
    status: "rencana",
    placeholder: true,
  },
  {
    id: "k-8",
    judul: "Penyusunan Unit Usaha Mandiri",
    ringkasan: "Studi kelayakan unit usaha untuk pendanaan organisasi.",
    tanggal: "TBA",
    lokasi: "Sekretariat RW 03",
    bidang: "usaha",
    status: "rencana",
    placeholder: true,
  },
];