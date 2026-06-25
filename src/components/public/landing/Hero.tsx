import { ArrowRight, Award, CalendarDays, FileArchive, FolderOpen, Image as ImageIcon, Users } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Placeholder } from "@/components/public/Placeholder";

const FLOATING = [
  { icon: Users,        value: "59",   label: "Anggota Aktif",  emoji: "👥" },
  { icon: Award,        value: "7",    label: "Bidang Aktif",   emoji: "🏆" },
  { icon: CalendarDays, value: "60+",  label: "Kegiatan",        emoji: "📅" },
  { icon: FileArchive,  value: "Arsip",label: "Digital",         emoji: "📄" },
];

const COLLAGE = [
  { label: "Pelantikan 09 Juni 2025", tone: "neutral" as const },
  { label: "Rapat konsolidasi",        tone: "accent"  as const },
  { label: "Kerja bakti lingkungan",   tone: "accent"  as const },
  { label: "Latihan rutin futsal",     tone: "neutral" as const },
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-primary via-primary to-[oklch(0.32_0.14_257)]">
      <div className="pointer-events-none absolute inset-0 batik-kawung-light batik-op-3" aria-hidden />
      <div
        className="pointer-events-none absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-accent/20 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1280px] px-5 sm:px-6 md:px-10 lg:px-16 py-16 sm:py-20 md:py-24 lg:py-28 text-primary-foreground">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          {/* Left — copy */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] backdrop-blur">
              <span className="size-1.5 rounded-full bg-accent" />
              Periode 2025 – 2028 · Aktif
            </span>

            <h1 className="mt-5 font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] max-w-2xl">
              Karang Taruna <br className="hidden sm:block" />
              RW 03 Cipedak
            </h1>

            <p className="mt-5 max-w-xl text-base sm:text-lg text-white/85 leading-relaxed">
              Membangun generasi muda yang aktif, kreatif, dan berdampak bagi masyarakat.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/kegiatan"
                className="inline-flex items-center gap-2 rounded-md bg-surface px-5 py-3 text-sm font-semibold text-primary shadow-tile transition hover:shadow-tile-hover"
              >
                Lihat Kegiatan
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/lpj"
                className="inline-flex items-center gap-2 rounded-md border border-white/40 bg-white/10 px-5 py-3 text-sm font-semibold text-primary-foreground backdrop-blur transition hover:bg-white/20"
              >
                <FolderOpen className="size-4" />
                Arsip Digital
              </Link>
            </div>

            {/* Floating cards (WOW factor) */}
            <div className="mt-10 grid grid-cols-2 gap-3 sm:max-w-xl sm:grid-cols-4">
              {FLOATING.map((c, i) => (
                <div
                  key={c.label}
                  className="glass-light animate-float rounded-xl p-3 text-white"
                  style={{ animationDelay: `${i * 350}ms` }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base leading-none" aria-hidden>{c.emoji}</span>
                    <c.icon className="size-3.5 text-accent" aria-hidden />
                  </div>
                  <p className="mt-2 font-heading text-xl font-bold tabular-nums leading-none">
                    {c.value}
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-white/80 leading-tight">
                    {c.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — photo collage 2x2 */}
          <div className="relative">
            <div className="grid grid-cols-2 grid-rows-2 gap-3 sm:gap-4">
              {COLLAGE.map((p, i) => (
                <div
                  key={p.label}
                  className={`overflow-hidden rounded-2xl border border-white/20 shadow-elevated ${
                    i === 0 ? "aspect-[4/5]" :
                    i === 1 ? "aspect-[5/4] translate-y-3 sm:translate-y-6" :
                    i === 2 ? "aspect-[5/4] -translate-y-3 sm:-translate-y-6" :
                              "aspect-[4/5]"
                  }`}
                >
                  <Placeholder
                    label={p.label}
                    caption="Foto asli menyusul"
                    icon={ImageIcon}
                    tone={p.tone}
                    rounded="rounded-none"
                  />
                </div>
              ))}
            </div>

            {/* Floating accent tile */}
            <div className="glass-card absolute -left-3 bottom-4 hidden rounded-xl px-3 py-2 text-ink sm:block animate-float">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                Dokumentasi
              </p>
              <p className="font-heading text-sm font-bold leading-tight">
                Karang Taruna RW 03
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
