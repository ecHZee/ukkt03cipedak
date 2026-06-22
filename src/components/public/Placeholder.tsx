import type { LucideIcon } from "lucide-react";
import { Image as ImageIcon } from "lucide-react";

type Tone = "neutral" | "accent" | "ink";

type Props = {
  label?: string;
  caption?: string;
  icon?: LucideIcon;
  tone?: Tone;
  className?: string;
  rounded?: string;
};

/**
 * Placeholder netral untuk slot foto yang belum tersedia.
 * TIDAK menggunakan gambar AI / pihak ketiga — hanya pattern + label.
 * Saat foto asli KT RW 03 tersedia, ganti komponen pemanggil dengan <img/>.
 */
export function Placeholder({
  label = "Foto Karang Taruna RW 03",
  caption = "Placeholder · menunggu dokumentasi asli",
  icon: Icon = ImageIcon,
  tone = "neutral",
  className = "",
  rounded = "rounded-xl",
}: Props) {
  const tonePattern =
    tone === "ink"
      ? "placeholder-pattern-ink text-white/85"
      : tone === "accent"
        ? "placeholder-pattern-accent text-accent-foreground"
        : "placeholder-pattern text-ink-muted";

  return (
    <div
      role="img"
      aria-label={label}
      className={`relative isolate flex h-full w-full items-center justify-center overflow-hidden border border-border ${rounded} ${tonePattern} ${className}`}
    >
      <div className="flex flex-col items-center gap-2 px-6 text-center">
        <div
          className={`grid size-11 place-items-center rounded-full ${
            tone === "ink" ? "bg-white/10" : "bg-surface/80"
          } backdrop-blur shadow-tile`}
        >
          <Icon className={`size-5 ${tone === "ink" ? "text-white" : "text-primary"}`} />
        </div>
        <p
          className={`font-heading text-sm font-semibold leading-tight ${
            tone === "ink" ? "text-white" : "text-ink"
          }`}
        >
          {label}
        </p>
        <p className="text-[11px] uppercase tracking-[0.14em]">{caption}</p>
      </div>
    </div>
  );
}