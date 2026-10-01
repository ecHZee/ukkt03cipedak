import { Instagram, Mail, MapPin, MessageCircle, Music2, Youtube } from "lucide-react";
import { useSitus } from "@/hooks/use-situs";
import { linkWhatsApp } from "@/services/konten";

const PETA_DEFAULT =
  "https://www.google.com/maps?q=Cipedak,+Jagakarsa,+Jakarta+Selatan&output=embed";

/** Kanal kontak dari pengaturan. Kanal yang belum diisi tidak ditampilkan. */
export function KontakSection() {
  const { pengaturan: p } = useSitus();
  const nama = (url: string) => "@" + url.replace(/\/+$/, "").split("/").pop()?.replace(/^@/, "");
  const channels = [
    {
      icon: MapPin,
      label: "Sekretariat",
      value: p.alamat ?? p.wilayah ?? "Cipedak, Jagakarsa, Jakarta Selatan",
      href: p.mapsUrl,
      tone: "text-primary bg-primary/10",
    },
    p.whatsapp && {
      icon: MessageCircle,
      label: "WhatsApp",
      value: `+${p.whatsapp}`,
      href: linkWhatsApp(p),
      tone: "text-success bg-success/10",
    },
    p.email && {
      icon: Mail,
      label: "Email",
      value: p.email,
      href: `mailto:${p.email}`,
      tone: "text-ink bg-muted-surface",
    },
    p.instagram && {
      icon: Instagram,
      label: "Instagram",
      value: nama(p.instagram),
      href: p.instagram,
      tone: "text-accent-foreground bg-accent/15",
    },
    p.tiktok && {
      icon: Music2,
      label: "TikTok",
      value: nama(p.tiktok),
      href: p.tiktok,
      tone: "text-ink bg-muted-surface",
    },
    p.youtube && {
      icon: Youtube,
      label: "YouTube",
      value: nama(p.youtube),
      href: p.youtube,
      tone: "text-destructive bg-destructive/10",
    },
  ].filter(Boolean) as Array<{
    icon: typeof MapPin;
    label: string;
    value: string;
    href: string | null;
    tone: string;
  }>;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:gap-8">
      <div className="grid content-start gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {channels.map(({ icon: Icon, label, value, href, tone }) => {
          const isi = (
            <>
              <div className={`grid size-11 shrink-0 place-items-center rounded-lg ${tone}`}>
                <Icon className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                  {label}
                </p>
                <p className="truncate text-sm font-semibold text-ink group-hover:text-primary transition">
                  {value}
                </p>
              </div>
            </>
          );
          const kelas =
            "group flex items-center gap-4 rounded-xl border border-border bg-surface p-4 shadow-tile transition";
          return href ? (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${kelas} hover:border-primary/40 hover:shadow-tile-hover`}
            >
              {isi}
            </a>
          ) : (
            <div key={label} className={kelas}>
              {isi}
            </div>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-xl border border-border shadow-tile">
        <iframe
          title="Lokasi Karang Taruna RW 03 Cipedak"
          src={PETA_DEFAULT}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-[360px] w-full border-0 lg:h-full lg:min-h-[420px]"
        />
      </div>
    </div>
  );
}
