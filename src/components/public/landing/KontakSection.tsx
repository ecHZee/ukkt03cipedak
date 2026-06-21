import { Instagram, Mail, MapPin, MessageCircle, Youtube } from "lucide-react";
import { APP_CONFIG } from "@/config/app";

const waLink = () => {
  const num = APP_CONFIG.whatsappNumber.replace(/[^0-9]/g, "");
  return `https://wa.me/${num}`;
};

const CHANNELS = [
  {
    icon: MapPin, label: "Sekretariat",
    value: "Cipedak, Jagakarsa, Jakarta Selatan",
    href: APP_CONFIG.socials.maps, tone: "text-primary bg-primary/10",
  },
  {
    icon: MessageCircle, label: "WhatsApp",
    value: APP_CONFIG.whatsappNumber,
    href: waLink(), tone: "text-success bg-success/10",
  },
  {
    icon: Mail, label: "Email",
    value: APP_CONFIG.socials.email,
    href: `mailto:${APP_CONFIG.socials.email}`, tone: "text-ink bg-muted-surface",
  },
  {
    icon: Instagram, label: "Instagram",
    value: "@karangtaruna.rw03",
    href: APP_CONFIG.socials.instagram, tone: "text-accent-foreground bg-accent/15",
  },
  {
    icon: Youtube, label: "YouTube",
    value: "@karangtaruna-rw03",
    href: APP_CONFIG.socials.youtube, tone: "text-destructive bg-destructive/10",
  },
];

export function KontakSection() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:gap-8">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {CHANNELS.map(({ icon: Icon, label, value, href, tone }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-xl border border-border bg-surface p-4 shadow-tile transition hover:border-primary/40 hover:shadow-tile-hover"
          >
            <div className={`grid size-11 shrink-0 place-items-center rounded-lg ${tone}`}>
              <Icon className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">{label}</p>
              <p className="truncate text-sm font-semibold text-ink group-hover:text-primary transition">
                {value}
              </p>
            </div>
          </a>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border shadow-tile">
        <iframe
          title="Lokasi Sekretariat Karang Taruna RW 03 Cipedak"
          src="https://www.google.com/maps?q=Cipedak,+Jagakarsa,+Jakarta+Selatan&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-[360px] w-full border-0 lg:h-full lg:min-h-[420px]"
        />
      </div>
    </div>
  );
}
