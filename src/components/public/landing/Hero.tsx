import { ArrowRight, FolderOpen } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-primary">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[oklch(0.32_0.14_257)]" />
        <div className="absolute inset-0 batik-overlay-bg mix-blend-overlay" aria-hidden />
      </div>

      <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 py-20 md:py-28 lg:py-32 text-primary-foreground">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] backdrop-blur">
          <span className="size-1.5 rounded-full bg-accent" />
          Periode 2025 – 2028 · Aktif
        </span>

        <h1 className="mt-5 font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] max-w-3xl">
          Karang Taruna <br className="hidden sm:block" />
          RW 03 Cipedak
        </h1>

        <p className="mt-5 max-w-2xl text-base sm:text-lg text-white/85 leading-relaxed">
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
            Jelajahi Arsip
          </Link>
        </div>
      </div>
    </section>
  );
}
