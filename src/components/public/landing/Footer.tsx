import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MapPin, MessageCircle, Youtube } from "lucide-react";
import { APP_CONFIG } from "@/config/app";
import { PUBLIC_ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-surface">
      <div className="absolute inset-0 batik-overlay-bg pointer-events-none" aria-hidden />
      <div className="relative mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                KT
              </div>
              <div>
                <p className="font-heading font-semibold text-ink leading-tight">Karang Taruna</p>
                <p className="text-[11px] text-ink-muted">RW 03 Cipedak</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-ink-muted leading-relaxed">
              {SITE.tagline}. Markas digital yang dirancang untuk
              diwariskan lintas periode kepengurusan.
            </p>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold text-ink">Navigasi</h4>
            <ul className="mt-4 space-y-2 text-sm text-ink-muted">
              {[
                ["Tentang", PUBLIC_ROUTES.tentang],
                ["Program", PUBLIC_ROUTES.program],
                ["Kegiatan", PUBLIC_ROUTES.kegiatan],
                ["Berita", PUBLIC_ROUTES.berita],
                ["Galeri", PUBLIC_ROUTES.galeri],
                ["LPJ", PUBLIC_ROUTES.lpj],
              ].map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="hover:text-primary transition">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold text-ink">Kontak</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-muted">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                Cipedak, Jagakarsa, Jakarta Selatan
              </li>
              <li className="flex items-start gap-2">
                <MessageCircle className="mt-0.5 size-4 shrink-0 text-success" />
                {APP_CONFIG.whatsappNumber}
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 size-4 shrink-0" />
                {APP_CONFIG.socials.email}
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold text-ink">Periode Aktif</h4>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent-foreground">
              <span className="size-1.5 rounded-full bg-success" />
              2025 – 2028
            </div>
            <div className="mt-5 flex gap-2">
              <a
                href={APP_CONFIG.socials.instagram}
                aria-label="Instagram"
                className="grid size-10 place-items-center rounded-lg border border-border text-ink-muted hover:text-primary hover:border-primary/40 transition"
                target="_blank" rel="noopener noreferrer"
              >
                <Instagram className="size-4" />
              </a>
              <a
                href={APP_CONFIG.socials.youtube}
                aria-label="YouTube"
                className="grid size-10 place-items-center rounded-lg border border-border text-ink-muted hover:text-primary hover:border-primary/40 transition"
                target="_blank" rel="noopener noreferrer"
              >
                <Youtube className="size-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-border pt-6 text-xs text-ink-muted sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} {SITE.name}. Seluruh hak cipta dilindungi.</p>
          <p>Masa Bakti 2025 – 2028</p>
        </div>
      </div>
    </footer>
  );
}
