import type { ReactNode } from "react";

/**
 * Variant peruntukan (Design Freeze BAGIAN 7):
 * - primary   → Beranda (biru penuh)
 * - split     → Tentang (biru + putih)
 * - light     → Program / Kegiatan (putih dominan, accent gold)
 * - editorial → Berita (80% putih + 20% biru sidebar strip)
 * - dark      → Galeri (#0F172A)
 * - slate     → Arsip Digital (putih + slate)
 * - friendly  → Kontak (gradient biru → putih)
 */
export type PageHeroVariant =
  | "primary"
  | "split"
  | "light"
  | "editorial"
  | "dark"
  | "slate"
  | "friendly";

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
  variant?: PageHeroVariant;
};

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  variant = "primary",
}: Props) {
  const v = VARIANTS[variant];
  return (
    <section className={`relative isolate overflow-hidden ${v.wrap}`}>
      <div className="absolute inset-0 -z-10">{v.bg}</div>
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 py-16 md:py-20">
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] backdrop-blur ${v.eyebrow}`}
        >
          <span className={`size-1.5 rounded-full ${v.dot}`} />
          {eyebrow}
        </span>
        <h1
          className={`mt-5 font-heading text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] max-w-3xl ${v.title}`}
        >
          {title}
        </h1>
        {description && (
          <p className={`mt-4 max-w-2xl text-base sm:text-lg leading-relaxed ${v.desc}`}>
            {description}
          </p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}

const VARIANTS: Record<
  PageHeroVariant,
  {
    wrap: string;
    bg: ReactNode;
    eyebrow: string;
    dot: string;
    title: string;
    desc: string;
  }
> = {
  primary: {
    wrap: "bg-primary text-primary-foreground",
    bg: (
      <>
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[oklch(0.32_0.14_257)]" />
        <div className="absolute inset-0 batik-kawung-light batik-op-3" aria-hidden />
      </>
    ),
    eyebrow: "border-white/25 bg-white/10 text-white",
    dot: "bg-accent",
    title: "text-white",
    desc: "text-white/85",
  },
  split: {
    wrap: "bg-surface text-ink",
    bg: (
      <>
        <div className="absolute inset-y-0 left-0 w-full md:w-1/2 bg-gradient-to-br from-primary to-[oklch(0.32_0.14_257)]" />
        <div className="absolute inset-y-0 left-0 w-full md:w-1/2 batik-kawung-light batik-op-3" aria-hidden />
        <div className="absolute inset-y-0 right-0 w-full md:w-1/2 bg-surface" />
      </>
    ),
    eyebrow:
      "border-white/25 bg-white/10 text-white md:border-primary/20 md:bg-primary/8 md:text-primary",
    dot: "bg-accent",
    title: "text-white md:text-ink",
    desc: "text-white/85 md:text-ink-muted",
  },
  light: {
    wrap: "bg-surface text-ink border-b border-border",
    bg: (
      <>
        <div className="absolute inset-0 bg-gradient-to-b from-muted-surface to-surface" />
        <div className="absolute inset-0 batik-kawung batik-op-2" aria-hidden />
        <div className="absolute -right-12 top-10 h-40 w-40 rounded-full bg-accent/15 blur-3xl" />
      </>
    ),
    eyebrow: "border-primary/20 bg-primary/8 text-primary",
    dot: "bg-accent",
    title: "text-ink",
    desc: "text-ink-muted",
  },
  editorial: {
    wrap: "bg-surface text-ink border-b border-border",
    bg: (
      <>
        <div className="absolute inset-0 bg-surface" />
        <div className="absolute inset-y-0 left-0 w-2 bg-primary" />
        <div className="absolute right-0 top-0 h-full w-1/3 batik-mega-mendung batik-op-3" aria-hidden />
      </>
    ),
    eyebrow: "border-primary/20 bg-primary/8 text-primary",
    dot: "bg-primary",
    title: "text-ink",
    desc: "text-ink-muted",
  },
  dark: {
    wrap: "bg-[#0F172A] text-white",
    bg: (
      <>
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#111B33] to-[#0B1224]" />
        <div className="absolute inset-0 batik-kawung-light batik-op-5" aria-hidden />
      </>
    ),
    eyebrow: "border-white/15 bg-white/8 text-white",
    dot: "bg-accent",
    title: "text-white",
    desc: "text-white/75",
  },
  slate: {
    wrap: "bg-surface text-ink border-b border-border",
    bg: (
      <>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-100 to-surface" />
        <div className="absolute inset-0 batik-kawung batik-op-2" aria-hidden />
      </>
    ),
    eyebrow: "border-slate-300 bg-white text-slate-700",
    dot: "bg-slate-500",
    title: "text-slate-900",
    desc: "text-slate-600",
  },
  friendly: {
    wrap: "text-ink",
    bg: (
      <>
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-[oklch(0.55_0.14_257)] to-surface" />
        <div className="absolute inset-0 batik-kawung-light batik-op-3" aria-hidden />
      </>
    ),
    eyebrow: "border-white/30 bg-white/15 text-white",
    dot: "bg-accent",
    title: "text-white",
    desc: "text-white/85",
  },
};