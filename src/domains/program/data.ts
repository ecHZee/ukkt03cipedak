import {
  Users2,
  HeartHandshake,
  Sprout,
  Briefcase,
  Dumbbell,
  Camera,
  Archive,
  type LucideIcon,
} from "lucide-react";

export type BidangSlug =
  "okk" | "kerohanian" | "lingkungan" | "ekonomi" | "pendidikan" | "media" | "inventaris";

export type Bidang = {
  slug: BidangSlug;
  /** Nama resmi sesuai SK No. 003/SK/KT-Cipedak/VI/2025. */
  name: string;
  /** Nama pendek untuk chip filter, badge, dan kartu. */
  singkat: string;
  /** Satu kalimat ringkas tentang fokus bidang. */
  tagline: string;
  description: string;
  fokus: string[];
  icon: LucideIcon;
  tone: string;
  iconBg: string;
};

/** 7 Bidang — urutan & nama resmi mengikuti SK Karang Taruna RW 03 Cipedak 2025–2028. */
export const BIDANG_LIST: Bidang[] = [
  {
    slug: "okk",
    name: "Organisasi Kaderisasi, Keanggotaan (OKK) & Pemberdayaan SDM",
    singkat: "OKK & SDM",
    tagline: "Kaderisasi, keanggotaan, & pengembangan pengurus.",
    description:
      "Mengelola keanggotaan dan kaderisasi pemuda, serta meningkatkan kapasitas pengurus lewat pelatihan.",
    fokus: ["Rekrutmen & data anggota", "Kaderisasi", "Pelatihan pengurus"],
    icon: Users2,
    tone: "bg-primary/5",
    iconBg: "bg-primary/10 text-primary",
  },
  {
    slug: "kerohanian",
    name: "Kerohanian & Pembinaan Mental",
    singkat: "Kerohanian",
    tagline: "Penguatan nilai keagamaan dan karakter.",
    description:
      "Mengelola kegiatan keagamaan, pembinaan akhlak, dan momentum hari besar keagamaan di lingkungan RW 03.",
    fokus: ["Peringatan hari besar", "Pengajian rutin", "Pembinaan mental remaja"],
    icon: HeartHandshake,
    tone: "bg-accent/5",
    iconBg: "bg-accent/15 text-accent-foreground",
  },
  {
    slug: "lingkungan",
    name: "Lingkungan Kemasyarakatan, Kemitraan & Tata Kelola Organisasi",
    singkat: "Lingkungan & Kemitraan",
    tagline: "Kerja bakti, kemitraan warga, & tata kelola.",
    description:
      "Menjaga lingkungan RW 03, membangun kemitraan dengan warga dan lembaga, serta merapikan tata kelola organisasi.",
    fokus: ["Kerja bakti rutin", "Kemitraan RT/RW & mitra", "Tata kelola organisasi"],
    icon: Sprout,
    tone: "bg-success/5",
    iconBg: "bg-success/10 text-success",
  },
  {
    slug: "ekonomi",
    name: "Ekonomi Mandiri & Kesejahteraan Sosial",
    singkat: "Ekonomi & Kesos",
    tagline: "Usaha mandiri & kepedulian sosial.",
    description:
      "Mengembangkan usaha mandiri Karang Taruna, mendukung UMKM warga, dan menyalurkan program kesejahteraan sosial.",
    fokus: ["Usaha mandiri", "UMKM warga", "Santunan & bantuan sosial"],
    icon: Briefcase,
    tone: "bg-primary/5",
    iconBg: "bg-primary/10 text-primary",
  },
  {
    slug: "pendidikan",
    name: "Pendidikan, Keolahragaan & Kebudayaan",
    singkat: "Pendidikan & Olahraga",
    tagline: "Belajar, olahraga, & budaya.",
    description:
      "Menyelenggarakan kegiatan pendidikan, olahraga rutin dan turnamen, serta pelestarian budaya di lingkungan RW 03.",
    fokus: ["Kegiatan belajar", "Olahraga & turnamen", "Kegiatan kebudayaan"],
    icon: Dumbbell,
    tone: "bg-warning/5",
    iconBg: "bg-warning/10 text-warning",
  },
  {
    slug: "media",
    name: "Media Publikasi, Dokumentasi & Desain Grafis",
    singkat: "Media",
    tagline: "Dokumentasi & publikasi resmi organisasi.",
    description:
      "Mengelola kanal media sosial dan website, dokumentasi setiap kegiatan, serta desain grafis resmi Karang Taruna.",
    fokus: ["Dokumentasi kegiatan", "Media sosial & website", "Desain grafis resmi"],
    icon: Camera,
    tone: "bg-muted-surface",
    iconBg: "bg-ink/10 text-ink",
  },
  {
    slug: "inventaris",
    name: "Inventaris & Arsip",
    singkat: "Inventaris & Arsip",
    tagline: "Aset organisasi & arsip dokumen.",
    description:
      "Mendata seluruh aset dan inventaris, serta mengarsipkan dokumen resmi organisasi lintas periode.",
    fokus: ["Inventaris aset", "Arsip SK & LPJ", "Peminjaman perlengkapan"],
    icon: Archive,
    tone: "bg-accent/5",
    iconBg: "bg-accent/15 text-accent-foreground",
  },
];

/** Quick lookup. */
export const BIDANG_BY_SLUG = Object.fromEntries(BIDANG_LIST.map((b) => [b.slug, b])) as Record<
  BidangSlug,
  Bidang
>;
