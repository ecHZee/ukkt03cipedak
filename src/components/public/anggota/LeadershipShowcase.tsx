import { Crown, Users as UsersIcon } from "lucide-react";
import { STRUKTUR_2025_2028, type Anggota } from "@/domains/anggota/data";
import { PersonDialog } from "./PersonDialog";
import { useState } from "react";

/**
 * Leadership Showcase — campaign-poster style untuk BPH.
 * Editorial · premium · heroic. Background typography besar (KETUA / WAKIL / ...)
 * mengikuti referensi postingan Instagram resmi Karang Taruna RW03,
 * tetapi tetap mengikuti Design System (warna, font, radius, shadow).
 *
 * Urutan: Ketua → Wakil → Sekretaris → Bendahara.
 */
export function LeadershipShowcase() {
  const [selected, setSelected] = useState<Anggota | null>(null);
  const [open, setOpen] = useState(false);
  const openProfile = (a: Anggota) => {
    setSelected(a);
    setOpen(true);
  };

  const ketua = STRUKTUR_2025_2028.find((a) => a.id === "bph-ketua");
  const wakil = STRUKTUR_2025_2028.find((a) => a.id === "bph-wakil");
  const sek1 = STRUKTUR_2025_2028.find((a) => a.id === "bph-sekretaris-1");
  const sek2 = STRUKTUR_2025_2028.find((a) => a.id === "bph-sekretaris-2");
  const ben1 = STRUKTUR_2025_2028.find((a) => a.id === "bph-bendahara-1");
  const ben2 = STRUKTUR_2025_2028.find((a) => a.id === "bph-bendahara-2");

  return (
    <section className="relative">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-foreground">
            <Crown className="size-4 text-accent" aria-hidden />
            Badan Pengurus Harian
          </p>
          <h3 className="mt-2 font-heading text-2xl sm:text-3xl font-bold text-ink leading-tight">
            Leadership Hall · Periode 2025–2028
          </h3>
          <p className="mt-1 text-sm text-ink-muted max-w-xl">
            Empat pilar kepemimpinan Karang Taruna RW 03 Cipedak.
          </p>
        </div>
        <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent-foreground tabular-nums">
          6 pengurus inti
        </span>
      </header>

      <div className="grid gap-5 lg:grid-cols-12">
        {/* KETUA — hero card (full width on mobile, 7 cols desktop) */}
        {ketua && (
          <PosterCard
            anggota={ketua}
            bgWord="KETUA"
            variant="dark"
            size="hero"
            className="lg:col-span-7"
            onOpen={openProfile}
          />
        )}
        {/* WAKIL — 5 cols beside Ketua */}
        {wakil && (
          <PosterCard
            anggota={wakil}
            bgWord="WAKIL"
            variant="light"
            size="md"
            className="lg:col-span-5"
            onOpen={openProfile}
          />
        )}

        {/* SEKRETARIS pair */}
        {(sek1 || sek2) && (
          <PairPoster
            anggotaList={[sek1, sek2].filter(Boolean) as Anggota[]}
            bgWord="SEKRETARIS"
            variant="dark"
            roleLabel="Sekretaris"
            className="lg:col-span-6"
            onOpen={openProfile}
          />
        )}
        {/* BENDAHARA pair */}
        {(ben1 || ben2) && (
          <PairPoster
            anggotaList={[ben1, ben2].filter(Boolean) as Anggota[]}
            bgWord="BENDAHARA"
            variant="cream"
            roleLabel="Bendahara"
            className="lg:col-span-6"
            onOpen={openProfile}
          />
        )}
      </div>

      <PersonDialog anggota={selected} open={open} onOpenChange={setOpen} />
    </section>
  );
}

/* ───────────────────────── Poster Card (single) ───────────────────────── */

type Variant = "dark" | "light" | "cream";
type Size = "hero" | "md";

function PosterCard({
  anggota,
  bgWord,
  variant,
  size,
  className = "",
  onOpen,
}: {
  anggota: Anggota;
  bgWord: string;
  variant: Variant;
  size: Size;
  className?: string;
  onOpen: (a: Anggota) => void;
}) {
  const v = VARIANT_STYLES[variant];
  const heightCls =
    size === "hero"
      ? "min-h-[440px] sm:min-h-[520px] lg:min-h-[560px]"
      : "min-h-[360px] sm:min-h-[440px] lg:min-h-[560px]";

  return (
    <button
      type="button"
      onClick={() => onOpen(anggota)}
      className={`group relative isolate overflow-hidden rounded-2xl border ${v.border} ${v.bg} ${heightCls} text-left shadow-elevated transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-tile-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${className}`}
      aria-label={`${anggota.jabatan} — ${anggota.nama}`}
    >
      {/* Background typography (large word repeated) */}
      <BgWord text={bgWord} variant={variant} repeat={size === "hero" ? 3 : 2} />

      {/* Subtle batik */}
      <div
        className={`pointer-events-none absolute inset-0 ${variant === "dark" ? "batik-kawung-light batik-op-5" : "batik-kawung batik-op-2"}`}
        aria-hidden
      />

      {/* Portrait silhouette (placeholder) */}
      <PortraitArea anggota={anggota} variant={variant} />

      {/* Nameplate */}
      <Nameplate
        nama={anggota.nama}
        jabatan={anggota.jabatan}
        periode={anggota.periode}
        variant={variant}
      />
    </button>
  );
}

/* ───────────────────────── Pair Poster (Sek/Bend) ───────────────────────── */

function PairPoster({
  anggotaList,
  bgWord,
  variant,
  roleLabel,
  className = "",
  onOpen,
}: {
  anggotaList: Anggota[];
  bgWord: string;
  variant: Variant;
  roleLabel: string;
  className?: string;
  onOpen: (a: Anggota) => void;
}) {
  const v = VARIANT_STYLES[variant];
  return (
    <article
      className={`relative isolate overflow-hidden rounded-2xl border ${v.border} ${v.bg} min-h-[440px] sm:min-h-[480px] shadow-elevated ${className}`}
    >
      <BgWord text={bgWord} variant={variant} repeat={2} />
      <div
        className={`pointer-events-none absolute inset-0 ${variant === "dark" ? "batik-kawung-light batik-op-5" : "batik-kawung batik-op-2"}`}
        aria-hidden
      />

      {/* Two silhouettes side by side */}
      <div className="relative z-10 flex h-[260px] sm:h-[300px] items-end justify-center gap-3 pt-10 px-6">
        {anggotaList.map((a, i) => (
          <button
            key={a.id}
            type="button"
            onClick={() => onOpen(a)}
            aria-label={`${a.jabatan} — ${a.nama}`}
            className="group relative flex h-full w-[44%] max-w-[180px] items-end justify-center rounded-2xl border border-white/15 bg-gradient-to-b from-white/5 to-white/20 backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-tile-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className={`grid h-full w-full place-items-center ${variant === "dark" ? "text-white/70" : "text-primary/70"}`}>
              <UsersIcon className="size-10" aria-hidden />
            </div>
          </button>
        ))}
      </div>

      {/* Pair nameplate */}
      <div className="absolute inset-x-5 bottom-5 z-10">
        <div className={`rounded-xl border ${v.plateBorder} ${v.plateBg} px-5 py-4 backdrop-blur shadow-tile`}>
          <p className={`text-[10px] font-bold uppercase tracking-[0.22em] ${v.plateEyebrow}`}>
            {roleLabel} · Periode 2025–2028
          </p>
          <p className={`mt-1.5 font-heading text-lg sm:text-xl font-bold leading-snug ${v.plateName}`}>
            {anggotaList.map((a) => shortName(a.nama)).join("  ·  ")}
          </p>
        </div>
      </div>
    </article>
  );
}

/* ───────────────────────── Atoms ───────────────────────── */

function PortraitArea({ anggota, variant }: { anggota: Anggota; variant: Variant }) {
  return (
    <div className="relative z-10 flex h-[58%] items-end justify-center pt-10">
      <div
        className={`grid aspect-[3/4] h-full max-h-[420px] place-items-center rounded-2xl border ${variant === "dark" ? "border-white/15 bg-white/5" : "border-primary/15 bg-primary/5"} backdrop-blur-sm`}
        aria-hidden
      >
        {anggota.fotoUrl ? (
          <img
            src={anggota.fotoUrl}
            alt={anggota.nama}
            className="h-full w-full rounded-2xl object-cover"
          />
        ) : (
          <UsersIcon
            className={`size-16 ${variant === "dark" ? "text-white/60" : "text-primary/60"}`}
          />
        )}
      </div>
    </div>
  );
}

function Nameplate({
  nama,
  jabatan,
  periode,
  variant,
}: {
  nama: string;
  jabatan: string;
  periode: string;
  variant: Variant;
}) {
  const v = VARIANT_STYLES[variant];
  return (
    <div className="absolute inset-x-5 bottom-5 z-10">
      <div
        className={`rounded-xl border ${v.plateBorder} ${v.plateBg} px-5 py-4 backdrop-blur shadow-tile`}
      >
        <p className={`text-[10px] font-bold uppercase tracking-[0.22em] ${v.plateEyebrow}`}>
          {jabatan} · {periode}
        </p>
        <p
          className={`mt-1.5 font-heading text-lg sm:text-xl font-bold leading-snug ${v.plateName} line-clamp-2`}
        >
          {shortName(nama)}
        </p>
      </div>
    </div>
  );
}

function BgWord({
  text,
  variant,
  repeat = 2,
}: {
  text: string;
  variant: Variant;
  repeat?: number;
}) {
  const color =
    variant === "dark"
      ? "text-white/[0.08]"
      : variant === "cream"
        ? "text-primary/[0.10]"
        : "text-primary/[0.08]";
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 flex select-none flex-col justify-start overflow-hidden pt-4"
      aria-hidden
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          className={`font-heading font-black uppercase leading-[0.85] tracking-[-0.02em] ${color} whitespace-nowrap`}
          style={{
            fontSize: "clamp(72px, 14vw, 180px)",
            transform: `translateX(${i % 2 === 0 ? "-2%" : "-8%"})`,
          }}
        >
          {text}
        </div>
      ))}
    </div>
  );
}

function shortName(nama: string) {
  if (!nama) return "Belum diisi";
  return nama.replace(/\s*\(menunggu SK\)\s*$/i, "").trim();
}

/* ───────────────────────── Variant styles ───────────────────────── */

const VARIANT_STYLES: Record<
  Variant,
  {
    bg: string;
    border: string;
    plateBg: string;
    plateBorder: string;
    plateEyebrow: string;
    plateName: string;
  }
> = {
  dark: {
    bg: "bg-gradient-to-br from-[#0F172A] via-[#111B33] to-[#0B1224]",
    border: "border-white/10",
    plateBg: "bg-white/95",
    plateBorder: "border-white/30",
    plateEyebrow: "text-primary",
    plateName: "text-ink",
  },
  light: {
    bg: "bg-gradient-to-br from-slate-50 via-white to-slate-100",
    border: "border-border",
    plateBg: "bg-primary/95",
    plateBorder: "border-primary/40",
    plateEyebrow: "text-white/85",
    plateName: "text-white",
  },
  cream: {
    bg: "bg-gradient-to-br from-[oklch(0.97_0.03_80)] via-[oklch(0.985_0.01_85)] to-white",
    border: "border-accent/30",
    plateBg: "bg-white/95",
    plateBorder: "border-accent/40",
    plateEyebrow: "text-accent-foreground",
    plateName: "text-ink",
  },
};