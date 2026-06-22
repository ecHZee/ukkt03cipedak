import { MapPin, CalendarDays, CalendarRange } from "lucide-react";
import { Placeholder } from "@/components/public/Placeholder";

const ITEMS = [
  { title: "Rapat Konsolidasi Bidang", date: "Dijadwalkan", location: "Sekretariat RW 03", chip: "OKK" },
  { title: "Kerja Bakti Lingkungan",   date: "Rutin Minggu pagi", location: "RW 03 Cipedak", chip: "Kemasyarakatan" },
  { title: "Latihan Rutin Futsal",     date: "Rutin Jumat malam", location: "Lapangan RW 03", chip: "Olahraga" },
];

export function KegiatanLatest() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {ITEMS.map((item, i) => (
        <article
          key={item.title}
          className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-tile transition hover:shadow-tile-hover hover:-translate-y-0.5"
        >
          <div className="relative aspect-[16/10]">
            <Placeholder
              label={`Dokumentasi ${item.title}`}
              caption="Foto kegiatan menyusul"
              icon={CalendarRange}
              tone={i === 1 ? "accent" : "neutral"}
              rounded="rounded-none"
            />
            <span className="absolute left-3 top-3 rounded-full bg-surface px-2.5 py-1 text-[11px] font-semibold text-primary shadow-tile border border-border">
              {item.chip}
            </span>
          </div>
          <div className="flex flex-1 flex-col p-5">
            <h3 className="font-heading text-lg font-semibold text-ink leading-snug line-clamp-2">
              {item.title}
            </h3>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-ink-muted">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-3.5" />
                {item.date}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                {item.location}
              </span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
