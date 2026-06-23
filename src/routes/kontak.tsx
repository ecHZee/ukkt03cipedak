import { createFileRoute } from "@tanstack/react-router";
import { Clock, Instagram, Mail, MapPin, MessageCircle, Rocket, Youtube } from "lucide-react";
import { PageShell } from "@/components/public/PageShell";
import { PageHero } from "@/components/public/PageHero";
import { APP_CONFIG } from "@/config/app";

export const Route = createFileRoute("/kontak")({ component: Page });

const waLink = () => {
  const num = APP_CONFIG.whatsappNumber.replace(/[^0-9]/g, "");
  return `https://wa.me/${num}?text=${encodeURIComponent(APP_CONFIG.whatsappCtaText)}`;
};

const CHANNELS = [
  {
    icon: MessageCircle, label: "WhatsApp Sekretariat",
    value: APP_CONFIG.whatsappNumber, href: waLink(),
    tone: "bg-success/10 text-success", note: "Respons tercepat",
  },
  {
    icon: Mail, label: "Email Resmi",
    value: APP_CONFIG.socials.email,
    href: `mailto:${APP_CONFIG.socials.email}`,
    tone: "bg-primary/10 text-primary", note: "Komunikasi formal",
  },
  {
    icon: Instagram, label: "Instagram",
    value: "@karangtaruna.rw03", href: APP_CONFIG.socials.instagram,
    tone: "bg-accent/15 text-accent-foreground", note: "Update kegiatan",
  },
  {
    icon: Youtube, label: "YouTube",
    value: "@karangtaruna-rw03", href: APP_CONFIG.socials.youtube,
    tone: "bg-destructive/10 text-destructive", note: "Dokumentasi video",
  },
];

const JAM = [
  { hari: "Senin – Jumat", jam: "19.30 – 22.00 WIB" },
  { hari: "Sabtu",         jam: "16.00 – 22.00 WIB" },
  { hari: "Minggu",        jam: "Sesuai agenda kegiatan" },
];

function Page() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Hubungi Kami"
        title="Sekretariat Karang Taruna RW 03 Cipedak."
        description="Silakan terhubung melalui kanal resmi di bawah. Kami terbuka untuk pertanyaan, kemitraan, atau usulan kegiatan dari warga."
      />

      <section className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 py-12 space-y-10">
        {/* Sekretariat highlight */}
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-tile md:p-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              <MapPin className="size-3.5" /> Sekretariat
            </span>
            <h2 className="mt-4 font-heading text-2xl font-bold text-ink leading-tight">
              RW 03 Cipedak
            </h2>
            <p className="mt-2 text-sm text-ink-muted leading-relaxed">
              Kelurahan Cipedak, Kecamatan Jagakarsa, Jakarta Selatan.<br />
              Alamat lengkap menyusul setelah verifikasi sekretariat tetap.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a
                href={waLink()} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground shadow-tile transition hover:bg-accent/90"
              >
                <Rocket className="size-4" /> Hubungi via WhatsApp
              </a>
              <a
                href={APP_CONFIG.socials.maps} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-muted-surface px-4 py-3 text-sm font-semibold text-ink transition hover:border-primary hover:text-primary"
              >
                <MapPin className="size-4" /> Buka di Google Maps
              </a>
            </div>

            <div className="mt-8">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                <Clock className="size-3.5" /> Jam Operasional
              </div>
              <ul className="mt-3 divide-y divide-border rounded-lg border border-border">
                {JAM.map((j) => (
                  <li key={j.hari} className="flex items-center justify-between px-4 py-2.5 text-sm">
                    <span className="text-ink">{j.hari}</span>
                    <span className="font-semibold tabular-nums text-ink">{j.jam}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[11px] text-ink-muted">
                * Jam operasional dapat menyesuaikan agenda kegiatan organisasi.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border shadow-tile">
            <iframe
              title="Lokasi Sekretariat Karang Taruna RW 03 Cipedak"
              src="https://www.google.com/maps?q=Cipedak,+Jagakarsa,+Jakarta+Selatan&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[360px] w-full border-0 lg:h-full lg:min-h-[480px]"
            />
          </div>
        </div>

        {/* Channels */}
        <div>
          <h2 className="font-heading text-xl font-semibold text-ink">Kanal Resmi</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Sebelum menghubungi, pastikan menggunakan kanal resmi berikut.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CHANNELS.map(({ icon: Icon, label, value, href, tone, note }, i) => (
              <a
                key={label}
                href={href} target="_blank" rel="noopener noreferrer"
                className="group flex flex-col gap-3 rounded-xl border border-border bg-surface p-5 shadow-tile transition hover:-translate-y-0.5 hover:shadow-tile-hover hover:border-primary/30 animate-fade-in-up"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className={`grid size-11 place-items-center rounded-lg ${tone}`}>
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">{label}</p>
                  <p className="mt-1 truncate font-heading text-sm font-semibold text-ink group-hover:text-primary transition">
                    {value}
                  </p>
                  <p className="mt-1 text-[11px] text-ink-muted">{note}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
