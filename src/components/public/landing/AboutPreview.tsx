import { Link } from "@tanstack/react-router";
import { ArrowRight, HeartHandshake, Users } from "lucide-react";
import { Placeholder } from "@/components/public/Placeholder";

export function AboutPreview() {
  return (
    <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
      <div className="relative aspect-[4/3]">
        <Placeholder
          label="Dokumentasi kebersamaan pengurus"
          caption="Foto resmi menyusul"
          icon={Users}
          rounded="rounded-2xl"
        />
        <div className="absolute bottom-4 left-4 rounded-lg bg-surface px-3 py-2 shadow-tile border border-border">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">Pelantikan Periode 2025–2028</p>
          <p className="font-heading text-base font-bold text-primary tabular-nums">09 Juni 2025</p>
        </div>
      </div>

      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-foreground">
          <HeartHandshake className="size-3.5" />
          Tentang Kami
        </div>
        <h2 className="mt-4 font-heading text-3xl sm:text-4xl font-bold text-ink leading-tight">
          Wadah pemuda RW 03 Cipedak untuk berkarya dan berkontribusi.
        </h2>
        <p className="mt-4 text-[15px] text-ink-muted leading-relaxed">
          Karang Taruna RW 03 Cipedak adalah organisasi kepemudaan resmi yang
          menjadi rumah bagi pemuda-pemudi dari 7 RT. Periode kepengurusan
          2025–2028 dilantik pada <span className="font-semibold text-ink">09 Juni 2025</span>{" "}
          melalui SK Karang Taruna RW 03 Cipedak.
        </p>
        <p className="mt-3 text-[15px] text-ink-muted leading-relaxed">
          Visi kami sederhana: generasi muda yang aktif, kreatif, dan
          berdampak bagi masyarakat sekitar.
        </p>
        <Link
          to="/tentang"
          className="mt-6 inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-ink shadow-tile transition hover:border-primary hover:text-primary"
        >
          Selengkapnya
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
