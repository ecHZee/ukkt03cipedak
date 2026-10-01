import type { LucideIcon } from "lucide-react";

/** Data bidang diambil dari database (src/services/organisasi.ts); gaya tampilan di ./style.ts. */

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
