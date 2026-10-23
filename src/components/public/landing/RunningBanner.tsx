import { useState } from "react";
import { Megaphone, Pause, Play } from "lucide-react";
import { useSitus } from "@/hooks/use-situs";
import type { BidangData } from "@/services/organisasi";

export function RunningBanner({ bidang, rutin }: { bidang: BidangData[]; rutin: string[] }) {
  const { periodeAktif } = useSitus();
  const [dijeda, setDijeda] = useState(false);
  // Hanya info dari data resmi / data kegiatan. Jangan menambah klaim yang belum ada datanya.
  const ITEMS = [
    periodeAktif?.tanggalSK && {
      text: `SK pengurus periode ${periodeAktif.label} ditetapkan pada ${periodeAktif.tanggalSK}`,
    },
    bidang.length > 0 && {
      text: `${bidang.length} bidang aktif: ${bidang.map((b) => b.singkat).join(", ")}`,
    },
    ...rutin.map((text) => ({ text })),
    { text: "Akses arsip organisasi melalui menu Arsip Digital" },
  ].filter((x): x is { text: string } => Boolean(x));
  const repeated = [...ITEMS, ...ITEMS];
  return (
    <section
      aria-label="Informasi berjalan"
      className="border-y border-primary/15 bg-primary text-primary-foreground"
    >
      <div className="mx-auto flex max-w-[1280px] items-center gap-4 px-6 md:px-10 lg:px-16">
        <div className="flex items-center gap-2 py-4 shrink-0 motion-reduce:hidden">
          <div className="grid size-8 place-items-center rounded-md bg-accent text-accent-foreground">
            <Megaphone className="size-4" />
          </div>
          <span className="hidden sm:inline text-xs font-bold uppercase tracking-[0.18em] text-white/90">
            Info Berjalan
          </span>
        </div>
        {/* min-w-0: tanpa ini item flex ikut selebar isi marquee (±6000px) → halaman bisa digeser di HP */}
        <div
          role="group"
          aria-label="Informasi organisasi"
          className="relative min-w-0 flex-1 overflow-hidden motion-reduce:overflow-visible"
        >
          <div
            className="flex w-max gap-12 animate-marquee py-4 will-change-transform motion-reduce:animate-none motion-reduce:w-auto motion-reduce:flex-col motion-reduce:gap-2"
            style={{ animationPlayState: dijeda ? "paused" : "running" }}
            data-info-berjalan
          >
            {repeated.map((it, i) => (
              <span
                key={i}
                aria-hidden={i >= ITEMS.length ? true : undefined}
                className={`flex items-center gap-3 text-[15px] sm:text-base font-medium whitespace-nowrap motion-reduce:whitespace-normal motion-reduce:items-start ${i >= ITEMS.length ? "motion-reduce:hidden" : ""}`}
              >
                <span className="size-1.5 rounded-full bg-accent" aria-hidden />
                {it.text}
              </span>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-primary to-transparent motion-reduce:hidden" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-primary to-transparent motion-reduce:hidden" />
        </div>
        <button
          type="button"
          onClick={() => setDijeda((v) => !v)}
          aria-label={dijeda ? "Lanjutkan informasi berjalan" : "Jeda informasi berjalan"}
          aria-pressed={dijeda}
          className="grid size-11 shrink-0 place-items-center rounded-lg border border-white/40 hover:bg-white/10 focus-visible:outline-white motion-reduce:hidden"
        >
          {dijeda ? (
            <Play className="size-4" aria-hidden />
          ) : (
            <Pause className="size-4" aria-hidden />
          )}
        </button>
      </div>
    </section>
  );
}
