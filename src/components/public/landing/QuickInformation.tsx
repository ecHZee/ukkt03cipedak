import { Link } from "@tanstack/react-router";
import { Building2, FileArchive, MessageCircle, ShieldCheck } from "lucide-react";
import { PUBLIC_ROUTES } from "@/constants/routes";
import { useSitus } from "@/hooks/use-situs";
import { linkWhatsApp } from "@/services/konten";

/** Ringkasan info untuk warga. Hanya menampilkan data yang sudah ada di pengaturan/database. */
export function QuickInformation() {
  const { pengaturan: p, periodeAktif } = useSitus();
  const wa = linkWhatsApp(p, "Halo Karang Taruna RW 03, saya ingin bertanya.");

  const items = [
    {
      icon: Building2,
      title: "Sekretariat",
      body: p.alamat ?? p.wilayah ?? "RW 03 Cipedak, Kec. Jagakarsa, Jakarta Selatan",
      tone: "bg-primary/10 text-primary",
    },
    periodeAktif && {
      icon: ShieldCheck,
      title: "Periode Aktif",
      body: periodeAktif.tanggalSK
        ? `${periodeAktif.label} · SK tanggal ${periodeAktif.tanggalSK}`
        : periodeAktif.label,
      tone: "bg-success/10 text-success",
    },
    {
      icon: FileArchive,
      title: "Arsip Digital",
      body: "SK, LPJ, dan dokumen publik organisasi.",
      tone: "bg-primary/10 text-primary",
      to: PUBLIC_ROUTES.lpj,
      cta: "Buka arsip",
    },
  ].filter(Boolean) as Array<{
    icon: typeof Building2;
    title: string;
    body: string;
    tone: string;
    to?: string;
    cta?: string;
  }>;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((it, i) => {
        const Body = (
          <div
            className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-surface p-5 shadow-tile transition hover-lift animate-fade-in-up"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className={`grid size-10 place-items-center rounded-lg ${it.tone}`}>
              <it.icon className="size-5" />
            </div>
            <div>
              <p className="font-heading text-[15px] font-semibold text-ink">{it.title}</p>
              <p className="mt-1 text-sm text-ink-muted leading-relaxed">{it.body}</p>
            </div>
            {it.cta && (
              <span className="mt-auto text-xs font-semibold text-primary">{it.cta} →</span>
            )}
          </div>
        );
        return it.to ? (
          <Link key={it.title} to={it.to}>
            {Body}
          </Link>
        ) : (
          <div key={it.title}>{Body}</div>
        );
      })}

      {wa && (
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="md:col-span-3 group flex items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary to-[oklch(0.32_0.14_257)] p-5 text-primary-foreground shadow-tile transition hover:shadow-elevated"
        >
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-white/15">
              <MessageCircle className="size-5" />
            </div>
            <div>
              <p className="font-heading text-sm font-semibold">Butuh info cepat?</p>
              <p className="text-xs text-white/80">Hubungi sekretariat via WhatsApp.</p>
            </div>
          </div>
          <span className="hidden sm:inline-flex rounded-md bg-accent px-3 py-2 text-xs font-semibold text-accent-foreground shadow-tile">
            +{p.whatsapp}
          </span>
        </a>
      )}
    </div>
  );
}
