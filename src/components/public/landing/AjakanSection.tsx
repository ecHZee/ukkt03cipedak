import { Instagram, Lightbulb, MapPin, MessageCircle, Music2, Rocket, Youtube } from "lucide-react";
import { useSitus } from "@/hooks/use-situs";
import { linkWhatsApp } from "@/services/konten";

/**
 * Penutup beranda: tiga ajakan (Gabung · Usul kegiatan · Hubungi) lewat WhatsApp sekretariat,
 * plus sosmed & lokasi. Menggantikan Info Singkat, Kalender, dan Kontak agar beranda di HP ringkas.
 * Ajakan WA disembunyikan bila nomor belum diisi di pengaturan.
 */
export function AjakanSection() {
  const { pengaturan: p } = useSitus();
  const ajakan = [
    {
      icon: Rocket,
      judul: "Gabung jadi anggota",
      ket: "Warga RW 03 usia 13–45 tahun, terbuka untuk semua RT.",
      pesan: "Halo Karang Taruna RW 03, saya tertarik bergabung. Nama saya …, dari RT …",
      tone: "bg-accent text-accent-foreground",
    },
    {
      icon: Lightbulb,
      judul: "Usul kegiatan",
      ket: "Punya ide acara, lomba, atau kerja bakti? Sampaikan saja.",
      pesan: "Halo Karang Taruna RW 03, saya mau mengusulkan kegiatan: …",
      tone: "bg-primary/10 text-primary",
    },
    {
      icon: MessageCircle,
      judul: "Hubungi sekretariat",
      ket: "Pertanyaan, undangan, atau butuh bantuan pemuda.",
      pesan: "Halo Karang Taruna RW 03, saya ingin bertanya tentang …",
      tone: "bg-success/10 text-success",
    },
  ]
    .map((a) => ({ ...a, href: linkWhatsApp(p, a.pesan) }))
    .filter((a) => a.href);

  const nama = (url: string) => "@" + url.replace(/\/+$/, "").split("/").pop()?.replace(/^@/, "");
  const sosmed = [
    p.instagram && { icon: Instagram, href: p.instagram, label: nama(p.instagram) },
    p.tiktok && { icon: Music2, href: p.tiktok, label: nama(p.tiktok) },
    p.youtube && { icon: Youtube, href: p.youtube, label: nama(p.youtube) },
  ].filter(Boolean) as Array<{ icon: typeof Instagram; href: string; label: string }>;
  const lokasi = p.alamat ?? p.wilayah;

  return (
    <div>
      {ajakan.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-3">
          {ajakan.map(({ icon: Icon, judul, ket, href, tone }) => (
            <a
              key={judul}
              href={href!}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 rounded-xl border border-border bg-surface p-4 shadow-tile transition hover:border-primary/40 hover:shadow-tile-hover sm:flex-col sm:p-5"
            >
              <span className={`grid size-11 shrink-0 place-items-center rounded-lg ${tone}`}>
                <Icon className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block font-heading text-base font-semibold text-ink group-hover:text-primary">
                  {judul}
                </span>
                <span className="mt-0.5 block text-sm text-ink-muted">{ket}</span>
              </span>
            </a>
          ))}
        </div>
      )}

      {(sosmed.length > 0 || lokasi) && (
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink-muted">
          {lokasi &&
            (p.mapsUrl ? (
              <a
                href={p.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-primary"
              >
                <MapPin className="size-4" /> {lokasi}
              </a>
            ) : (
              <span className="inline-flex items-center gap-2">
                <MapPin className="size-4" /> {lokasi}
              </span>
            ))}
          {sosmed.map(({ icon: Icon, href, label }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-medium text-ink hover:text-primary"
            >
              <Icon className="size-4" /> {label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
