import { Megaphone } from "lucide-react";
import { PERIODE_AKTIF } from "@/domains/anggota/data";
import { BIDANG_LIST } from "@/domains/program/data";

// Hanya info yang sesuai data resmi / data kegiatan. Jangan menambah klaim yang belum ada datanya.
const ITEMS = [
  {
    text: `Pengurus periode ${PERIODE_AKTIF.label} dikukuhkan melalui SK tanggal ${PERIODE_AKTIF.tanggalSK}`,
  },
  { text: `7 bidang aktif: ${BIDANG_LIST.map((b) => b.singkat).join(", ")}` },
  { text: "Futsal rutin setiap Jumat malam di lapangan RW 03" },
  { text: "Kerja bakti rutin setiap Minggu pagi" },
  { text: "Dokumen publik tersedia di menu Arsip Digital" },
];

export function RunningBanner() {
  const repeated = [...ITEMS, ...ITEMS];
  return (
    <div className="border-y border-primary/15 bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-[1280px] items-center gap-4 px-6 md:px-10 lg:px-16">
        <div className="flex items-center gap-2 py-4 shrink-0">
          <div className="grid size-8 place-items-center rounded-md bg-accent text-accent-foreground">
            <Megaphone className="size-4" />
          </div>
          <span className="hidden sm:inline text-xs font-bold uppercase tracking-[0.18em] text-white/90">
            Info Berjalan
          </span>
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div className="flex w-max gap-12 animate-marquee py-4 will-change-transform">
            {repeated.map((it, i) => (
              <span
                key={i}
                className="flex items-center gap-3 text-[15px] sm:text-base font-medium whitespace-nowrap"
              >
                <span className="size-1.5 rounded-full bg-accent" aria-hidden />
                {it.text}
              </span>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-primary to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-primary to-transparent" />
        </div>
      </div>
    </div>
  );
}
