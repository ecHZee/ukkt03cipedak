import { Megaphone } from "lucide-react";
import { useSitus } from "@/hooks/use-situs";
import type { BidangData } from "@/services/organisasi";

export function RunningBanner({ bidang, rutin }: { bidang: BidangData[]; rutin: string[] }) {
  const { periodeAktif } = useSitus();
  // Hanya info dari data resmi / data kegiatan. Jangan menambah klaim yang belum ada datanya.
  const ITEMS = [
    periodeAktif?.tanggalSK && {
      text: `Pengurus periode ${periodeAktif.label} dikukuhkan melalui SK tanggal ${periodeAktif.tanggalSK}`,
    },
    bidang.length > 0 && {
      text: `${bidang.length} bidang aktif: ${bidang.map((b) => b.singkat).join(", ")}`,
    },
    ...rutin.map((text) => ({ text })),
    { text: "Dokumen publik tersedia di menu Arsip Digital" },
  ].filter((x): x is { text: string } => Boolean(x));
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
