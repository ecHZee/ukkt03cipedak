import { Dumbbell, BookOpen, Leaf, HandHeart, Camera, Boxes, ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

const PROGRAMS = [
  { icon: Dumbbell,  title: "Olahraga",         desc: "Futsal, voli, dan turnamen RT.",                tone: "bg-primary/5",  iconBg: "bg-primary/10 text-primary" },
  { icon: BookOpen,  title: "Pendidikan",       desc: "Bimbel & literasi anak RW 03.",                tone: "bg-accent/5",   iconBg: "bg-accent/15 text-accent-foreground" },
  { icon: Leaf,      title: "Lingkungan",       desc: "Penghijauan dan kerja bakti mingguan.",        tone: "bg-success/5",  iconBg: "bg-success/10 text-success" },
  { icon: HandHeart, title: "Kemasyarakatan",   desc: "Bakti sosial dan santunan periodik.",          tone: "bg-primary/5",  iconBg: "bg-primary/10 text-primary" },
  { icon: Camera,    title: "Media Publikasi",  desc: "Dokumentasi & konten media sosial.",           tone: "bg-muted-surface", iconBg: "bg-ink/10 text-ink" },
  { icon: Boxes,     title: "Inventarisasi",    desc: "Pengelolaan aset & inventaris organisasi.",    tone: "bg-warning/5",  iconBg: "bg-warning/10 text-warning" },
];

export function ProgramBento() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {PROGRAMS.map(({ icon: Icon, title, desc, tone, iconBg }, i) => (
        <Link
          key={title}
          to="/program"
          className={`group relative overflow-hidden rounded-xl border border-border ${tone} p-5 transition shadow-tile hover:shadow-tile-hover hover:-translate-y-0.5 ${
            i === 0 ? "lg:col-span-2" : ""
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className={`grid size-11 place-items-center rounded-lg ${iconBg}`}>
              <Icon className="size-5" />
            </div>
            <ArrowUpRight className="size-4 text-ink-muted transition group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          <h3 className="mt-4 font-heading text-lg font-semibold text-ink">{title}</h3>
          <p className="mt-1 text-sm text-ink-muted leading-relaxed">{desc}</p>
        </Link>
      ))}
    </div>
  );
}
