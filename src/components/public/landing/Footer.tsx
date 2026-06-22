import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MapPin, MessageCircle, Youtube } from "lucide-react";
import { APP_CONFIG } from "@/config/app";
import { PUBLIC_ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[#0F172A] text-slate-300">
      <div className="absolute inset-0 batik-overlay-bg pointer-events-none opacity-[0.5]" aria-hidden />
      <div className="relative mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                KT
              </div>
              <div>
                <p className="font-heading font-semibold text-white leading-tight">Karang Taruna</p>
                <p className="text-[11px] text-slate-400">RW 03 Cipedak</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              {SITE.tagline}. Markas digital yang dirancang untuk
              diwariskan lintas periode kepengurusan.
            </p>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold text-white">Navigasi</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              {[
                ["Tentang", PUBLIC_ROUTES.tentang],
                ["Program", PUBLIC_ROUTES.program],
                ["Kegiatan", PUBLIC_ROUTES.kegiatan],
                ["Berita", PUBLIC_ROUTES.berita],
                ["Galeri", PUBLIC_ROUTES.galeri],
                ["LPJ", PUBLIC_ROUTES.lpj],
              ].map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="hover:text-white transition">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold text-white">Kontak</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
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
            <h4 className="font-heading text-sm font-semibold text-white">Periode Aktif</h4>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
              <span className="size-1.5 rounded-full bg-success" />
              2025 – 2028
            </div>
            <p className="mt-3 text-xs text-slate-400 tabular-nums">
              Dilantik 09 Juni 2025
            </p>
            <div className="mt-5 flex gap-2">
              <a
                href={APP_CONFIG.socials.instagram}
                aria-label="Instagram"
                className="grid size-10 place-items-center rounded-lg border border-white/10 text-slate-300 hover:text-white hover:border-white/30 transition"
                target="_blank" rel="noopener noreferrer"
              >
                <Instagram className="size-4" />
              </a>
              <a
                href={APP_CONFIG.socials.youtube}
                aria-label="YouTube"
                className="grid size-10 place-items-center rounded-lg border border-white/10 text-slate-300 hover:text-white hover:border-white/30 transition"
                target="_blank" rel="noopener noreferrer"
              >
                <Youtube className="size-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-2 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} {SITE.name}. Seluruh hak cipta dilindungi.</p>
          <p>Masa Bakti 2025 – 2028</p>
        </div>
      </div>
    </footer>
  );
}
