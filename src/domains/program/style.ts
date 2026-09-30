import {
  Archive,
  Briefcase,
  Camera,
  Dumbbell,
  HeartHandshake,
  LayoutGrid,
  Sprout,
  Users2,
  type LucideIcon,
} from "lucide-react";

/**
 * Gaya tampilan per bidang (ikon & warna). Isi bidang (nama, deskripsi, fokus) ada di database;
 * yang di sini hanya urusan desain. Bidang baru tanpa gaya memakai DEFAULT.
 */
export type BidangStyle = { icon: LucideIcon; tone: string; iconBg: string };

const DEFAULT: BidangStyle = {
  icon: LayoutGrid,
  tone: "bg-muted-surface",
  iconBg: "bg-primary/10 text-primary",
};

const STYLE: Record<string, BidangStyle> = {
  okk: { icon: Users2, tone: "bg-primary/5", iconBg: "bg-primary/10 text-primary" },
  kerohanian: {
    icon: HeartHandshake,
    tone: "bg-accent/5",
    iconBg: "bg-accent/15 text-accent-foreground",
  },
  lingkungan: { icon: Sprout, tone: "bg-success/5", iconBg: "bg-success/10 text-success" },
  ekonomi: { icon: Briefcase, tone: "bg-primary/5", iconBg: "bg-primary/10 text-primary" },
  pendidikan: { icon: Dumbbell, tone: "bg-warning/5", iconBg: "bg-warning/10 text-warning" },
  media: { icon: Camera, tone: "bg-muted-surface", iconBg: "bg-ink/10 text-ink" },
  inventaris: {
    icon: Archive,
    tone: "bg-accent/5",
    iconBg: "bg-accent/15 text-accent-foreground",
  },
};

export function gayaBidang(slug: string): BidangStyle {
  return STYLE[slug] ?? DEFAULT;
}
