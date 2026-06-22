import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
};

/** Hero seragam untuk halaman public (Tentang, Program, Kegiatan, Berita). */
export function PageHero({ eyebrow, title, description, children }: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-primary text-primary-foreground">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[oklch(0.32_0.14_257)]" />
        <div className="absolute inset-0 batik-overlay-bg mix-blend-overlay" aria-hidden />
      </div>
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 py-16 md:py-20">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] backdrop-blur">
          <span className="size-1.5 rounded-full bg-accent" />
          {eyebrow}
        </span>
        <h1 className="mt-5 font-heading text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] max-w-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-white/85 leading-relaxed">
            {description}
          </p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}