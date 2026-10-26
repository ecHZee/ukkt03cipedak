import { ArrowRight, FolderOpen } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useSitus } from "@/hooks/use-situs";
import { urlPublik } from "@/services/storage";

export function Hero() {
  const { periodeAktif, pengaturan } = useSitus();
  const foto = pengaturan.fotoBeranda?.[0];
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-primary via-primary to-[oklch(0.32_0.14_257)]">
      {foto?.path && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[280px] sm:h-[390px] lg:inset-0 lg:h-full"
          aria-hidden="true"
        >
          {/* Pudar ke kanan agar foto menyatu dengan biru dan teks tetap terbaca. */}
          <img
            src={urlPublik("media", foto.path)!}
            alt=""
            width={1200}
            height={800}
            loading="eager"
            fetchPriority="high"
            className="size-full object-cover object-bottom"
            style={{
              maskImage:
                "linear-gradient(to right, black 0%, black 22%, rgb(0 0 0 / 0.16) 52%, transparent 90%)",
              WebkitMaskImage:
                "linear-gradient(to right, black 0%, black 22%, rgb(0 0 0 / 0.16) 52%, transparent 90%)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-50% to-primary lg:bg-gradient-to-r lg:from-primary/10 lg:from-20% lg:to-primary/30" />
        </div>
      )}
      <div
        className="pointer-events-none absolute inset-0 batik-kawung-light batik-op-3"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-accent/20 blur-3xl"
        aria-hidden
      />

      <div
        className={`relative mx-auto max-w-[1280px] px-5 sm:px-6 md:px-10 lg:px-16 text-primary-foreground ${foto?.path ? "pt-64 pb-10 sm:pt-[360px] sm:pb-16 lg:py-28" : "py-10 sm:py-20 lg:py-28"}`}
      >
        <div className={foto?.path ? "lg:ml-auto lg:w-[48%]" : "max-w-2xl"}>
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] backdrop-blur">
              <span className="size-1.5 rounded-full bg-accent" />
              {periodeAktif ? `Periode ${periodeAktif.label} · Aktif` : "Karang Taruna RW 03"}
            </span>

            <h1 className="mt-5 font-heading text-[32px] sm:text-5xl lg:text-6xl font-bold leading-[1.05] max-w-2xl break-words">
              {pengaturan.namaOrganisasi === "Karang Taruna RW 03 Cipedak" ? (
                <>
                  Karang Taruna <br className="hidden sm:block" />
                  RW 03 Cipedak
                </>
              ) : (
                pengaturan.namaOrganisasi
              )}
            </h1>

            <p className="mt-5 max-w-xl text-base sm:text-lg text-white/85 leading-relaxed">
              {pengaturan.tagline ||
                "Membangun generasi muda yang aktif, kreatif, dan berdampak bagi masyarakat."}
            </p>

            <div className="mt-6 sm:mt-8 flex flex-wrap gap-2 sm:gap-3">
              <Link
                to="/kegiatan"
                className="inline-flex min-h-11 items-center gap-2 rounded-md bg-surface px-4 sm:px-5 py-3 text-[13px] sm:text-sm font-semibold text-primary shadow-tile transition hover:shadow-tile-hover"
              >
                Lihat Kegiatan
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/arsip"
                className="inline-flex min-h-11 items-center gap-2 rounded-md border border-white/40 bg-white/10 px-4 sm:px-5 py-3 text-[13px] sm:text-sm font-semibold text-primary-foreground backdrop-blur transition hover:bg-white/20"
              >
                <FolderOpen className="size-4" />
                Arsip Digital
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
