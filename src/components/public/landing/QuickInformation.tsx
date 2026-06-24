import { Link } from "@tanstack/react-router";
import {
  Building2, CalendarDays, FileArchive, MapPin, MessageCircle, ShieldCheck,
} from "lucide-react";
import { APP_CONFIG } from "@/config/app";
import { PUBLIC_ROUTES } from "@/constants/routes";

const ITEMS = [
  {
    icon: Building2,
    title: "Sekretariat",
    body: "RW 03 Cipedak, Kec. Jagakarsa, Jakarta Selatan",
    tone: "bg-primary/10 text-primary",
  },
  {
    icon: CalendarDays,
    title: "Jadwal Rutin",
    body: "Sen–Jum · 19.30–22.00 WIB · Sabtu 16.00–22.00 WIB",
    tone: "bg-accent/15 text-accent-foreground",
  },
  {
    icon: ShieldCheck,
    title: "Periode Aktif",
    body: "2025 – 2028 · Dilantik 09 Juni 2025",
    tone: "bg-success/10 text-success",
  },
  {
    icon: FileArchive,
    title: "Arsip Digital",
    body: "LPJ, proposal, SK, surat — terbuka untuk warga sesuai akses.",
    tone: "bg-primary/10 text-primary",
    to: PUBLIC_ROUTES.lpj,
    cta: "Buka arsip",
  },
];

function waLink() {
  const num = APP_CONFIG.whatsappNumber.replace(/[^0-9]/g, "");
  return `https://wa.me/${num}?text=${encodeURIComponent(APP_CONFIG.whatsappCtaText)}`;
}

export function QuickInformation() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {ITEMS.map((it, i) => {
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
          <Link key={it.title} to={it.to}>{Body}</Link>
        ) : (
          <div key={it.title}>{Body}</div>
        );
      })}

      <a
        href={waLink()}
        target="_blank" rel="noopener noreferrer"
        className="md:col-span-2 lg:col-span-4 group flex items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary to-[oklch(0.32_0.14_257)] p-5 text-primary-foreground shadow-tile transition hover:shadow-elevated"
      >
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-lg bg-white/15">
            <MessageCircle className="size-5" />
          </div>
          <div>
            <p className="font-heading text-sm font-semibold">Butuh info cepat?</p>
            <p className="text-xs text-white/80">Hubungi sekretariat via WhatsApp — respons tercepat.</p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-2 text-xs font-semibold text-accent-foreground shadow-tile">
          <MapPin className="size-3.5" /> {APP_CONFIG.whatsappNumber}
        </span>
      </a>
    </div>
  );
}