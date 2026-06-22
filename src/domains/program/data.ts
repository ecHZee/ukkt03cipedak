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
  | "okk"
  | "kerohanian"
  | "kemasyarakatan"
  | "usaha"
  | "olahraga"
  | "media"
  | "inventarisasi";

export type Bidang = {
  slug: BidangSlug;
  name: string;
  short: string;
  description: string;
  fokus: string[];
  icon: LucideIcon;
  tone: string;
  iconBg: string;
};

/** 7 Bidang final — Sumber: SK Karang Taruna RW 03 Cipedak Periode 2025–2028. */
export const BIDANG_LIST: Bidang[] = [
  {
    slug: "okk",
    name: "Organisasi, Kaderisasi Keanggotaan (OKK) & Pengembangan SDM",
    short: "Tata kelola organisasi & pembinaan pengurus.",
    description:
      "Menjaga struktur organisasi, kaderisasi anggota baru, serta pelatihan kapasitas pengurus.",
    fokus: ["Rekrutmen anggota", "Pelatihan pengurus", "Tata kelola SK & periode"],
    icon: Users2,
    tone: "bg-primary/5",
    iconBg: "bg-primary/10 text-primary",
  },
  {
    slug: "kerohanian",
    name: "Kerohanian & Pembinaan Mental",
    short: "Penguatan nilai keagamaan dan karakter.",
    description:
      "Mengelola kegiatan keagamaan, pembinaan akhlak, dan momentum hari besar keagamaan di lingkungan RW 03.",
    fokus: ["Peringatan hari besar", "Pengajian rutin", "Pembinaan mental remaja"],
    icon: HeartHandshake,
    tone: "bg-accent/5",
    iconBg: "bg-accent/15 text-accent-foreground",
  },
  {
    slug: "kemasyarakatan",
    name: "Kemasyarakatan, Kemitraan & Lingkungan Hidup",
    short: "Kerja bakti, kemitraan warga, & lingkungan.",
    description:
      "Membangun relasi dengan warga, instansi mitra, serta menjaga lingkungan RW 03 melalui kerja bakti dan penghijauan.",
    fokus: ["Kerja bakti rutin", "Kemitraan RT/RW", "Penghijauan lingkungan"],
    icon: Sprout,
    tone: "bg-success/5",
    iconBg: "bg-success/10 text-success",
  },
  {
    slug: "usaha",
    name: "Usaha & Kesejahteraan Sosial",
    short: "Unit usaha & santunan sosial.",
    description:
      "Mengembangkan unit usaha mandiri Karang Taruna serta menyalurkan program kesejahteraan sosial untuk warga.",
    fokus: ["Unit usaha", "Santunan sosial", "Bantuan warga terdampak"],
    icon: Briefcase,
    tone: "bg-primary/5",
    iconBg: "bg-primary/10 text-primary",
  },
  {
    slug: "olahraga",
    name: "Olahraga & Kebudayaan",
    short: "Olahraga rutin & pelestarian budaya.",
    description:
      "Mengelola kegiatan olahraga rutin dan turnamen serta melestarikan kegiatan kebudayaan di lingkungan RW 03.",
    fokus: ["Futsal & voli rutin", "Turnamen antar-RT", "Kegiatan kebudayaan"],
    icon: Dumbbell,
    tone: "bg-warning/5",
    iconBg: "bg-warning/10 text-warning",
  },
  {
    slug: "media",
    name: "Media Publikasi, Dokumentasi & Desain Grafis",
    short: "Dokumentasi & publikasi resmi organisasi.",
    description:
      "Mengelola kanal media sosial, dokumentasi setiap kegiatan, dan publikasi desain grafis resmi Karang Taruna.",
    fokus: ["Dokumentasi kegiatan", "Konten media sosial", "Desain grafis resmi"],
    icon: Camera,
    tone: "bg-muted-surface",
    iconBg: "bg-ink/10 text-ink",
  },
  {
    slug: "inventarisasi",
    name: "Inventarisasi & Kearsipan",
    short: "Aset organisasi & arsip dokumen.",
    description:
      "Mendata seluruh aset dan inventaris, serta mengarsipkan dokumen resmi organisasi lintas periode.",
    fokus: ["Inventaris aset", "Arsip SK & LPJ", "Pencatatan logistik"],
    icon: Archive,
    tone: "bg-accent/5",
    iconBg: "bg-accent/15 text-accent-foreground",
  },
];

/** Quick lookup. */
export const BIDANG_BY_SLUG = Object.fromEntries(
  BIDANG_LIST.map((b) => [b.slug, b]),
) as Record<BidangSlug, Bidang>;