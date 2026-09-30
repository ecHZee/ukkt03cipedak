import type { BidangSlug } from "@/domains/program/data";

export type Berita = {
  id: string;
  judul: string;
  ringkasan: string;
  kategori: BidangSlug | "umum";
  tanggal: string;
  penulis: string;
  featured?: boolean;
  placeholder?: boolean;
  /** Prioritas Featured: manual pin (true) selalu menang. */
  pinned?: boolean;
  /** Skor popularitas (views/engagement). Sumber: backend nanti. */
  popularitas?: number;
  /** ISO date untuk sort "terbaru" — fallback ke `tanggal`. */
  publishedAt?: string;
};

export const BERITA_LIST: Berita[] = [
  {
    id: "b-1",
    judul: "Pengukuhan Pengurus Karang Taruna RW 03 Cipedak Periode 2025–2028",
    ringkasan:
      "Melalui SK No. 003/SK/KT-Cipedak/VI/2025 tanggal 05 Juni 2025, susunan pengurus periode 2025–2028 resmi dikukuhkan. Tujuh bidang siap menjalankan program kerja tiga tahun ke depan.",
    kategori: "umum",
    tanggal: "05 Juni 2025",
    penulis: "Sekretariat KT RW 03",
    featured: true,
    pinned: true,
    publishedAt: "2025-06-05",
    popularitas: 100,
  },
  {
    id: "b-2",
    judul: "Rapat Konsolidasi Antar-Bidang Periode 2025–2028",
    ringkasan: "Tujuh bidang mulai menyusun rencana kerja awal masa bakti.",
    kategori: "okk",
    tanggal: "TBA",
    penulis: "Bidang OKK",
    placeholder: true,
  },
  {
    id: "b-3",
    judul: "Agenda Kerja Bakti Berkala Mulai Disusun",
    ringkasan: "Bidang Kemasyarakatan menyusun jadwal kerja bakti lingkungan rutin.",
    kategori: "lingkungan",
    tanggal: "TBA",
    penulis: "Bidang Kemasyarakatan",
    placeholder: true,
  },
  {
    id: "b-4",
    judul: "Jadwal Latihan Rutin Olahraga Sedang Difinalisasi",
    ringkasan: "Latihan futsal & voli rutin direncanakan setiap akhir pekan.",
    kategori: "pendidikan",
    tanggal: "TBA",
    penulis: "Bidang Olahraga",
    placeholder: true,
  },
  {
    id: "b-5",
    judul: "Kanal Media Sosial Resmi Akan Segera Diaktifkan",
    ringkasan: "Bidang Media menyiapkan tata kelola publikasi resmi organisasi.",
    kategori: "media",
    tanggal: "TBA",
    penulis: "Bidang Media",
    placeholder: true,
  },
  {
    id: "b-6",
    judul: "Pendataan Aset & Inventaris Tahap I",
    ringkasan: "Bidang Inventarisasi mulai melakukan pencatatan aset organisasi.",
    kategori: "inventaris",
    tanggal: "TBA",
    penulis: "Bidang Inventarisasi",
    placeholder: true,
  },
];
