import { Megaphone } from "lucide-react";

const ITEMS = [
  { emoji: "📢", text: "Anniversary Katar RW 03 — 12 Juli" },
  { emoji: "⚽", text: "Futsal Rutin setiap Jumat malam" },
  { emoji: "🧹", text: "Kerja Bakti Mingguan — Minggu pagi" },
  { emoji: "🕌", text: "Persiapan Pawai Obor Ramadhan" },
  { emoji: "📚", text: "Bimbel gratis untuk anak RW 03" },
  { emoji: "🌱", text: "Penghijauan area sekretariat" },
];

export function RunningBanner() {
  const repeated = [...ITEMS, ...ITEMS];
  return (
    <div className="border-y border-border bg-primary/5">
      <div className="mx-auto flex max-w-[1280px] items-center gap-3 px-6 md:px-10 lg:px-16">
        <div className="flex items-center gap-2 py-2.5 text-primary shrink-0">
          <Megaphone className="size-4" />
          <span className="text-[11px] font-bold uppercase tracking-[0.14em]">Info Berjalan</span>
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div className="flex w-max gap-10 animate-marquee py-2.5 will-change-transform">
            {repeated.map((it, i) => (
              <span
                key={i}
                className="flex items-center gap-2 text-sm text-ink whitespace-nowrap"
              >
                <span aria-hidden>{it.emoji}</span>
                {it.text}
              </span>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[oklch(0.96_0.008_248)] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[oklch(0.96_0.008_248)] to-transparent" />
        </div>
      </div>
    </div>
  );
}
