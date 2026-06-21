import { MapPin, CalendarDays } from "lucide-react";
import { PLACEHOLDERS } from "./placeholders";

const ITEMS = [
  { title: "Futsal Persahabatan Antar-RT", date: "15 Juni 2026", location: "Lapangan Cipedak", chip: "Olahraga" },
  { title: "Kerja Bakti Bersih Lingkungan",  date: "08 Juni 2026", location: "RT 03 & RT 04",   chip: "Lingkungan" },
  { title: "Pawai Obor Sambut Ramadhan",     date: "01 Juni 2026", location: "Sepanjang RW 03", chip: "Kemasyarakatan" },
];

export function KegiatanLatest() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {ITEMS.map((item, i) => (
        <article
          key={item.title}
          className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-tile transition hover:shadow-tile-hover hover:-translate-y-0.5"
        >
          <div className="relative aspect-[16/10] overflow-hidden bg-muted-surface">
            <img
              src={PLACEHOLDERS.kegiatan[i].src}
              alt={PLACEHOLDERS.kegiatan[i].alt}
              className="h-full w-full object-cover transition duration-200 group-hover:scale-[1.02]"
              loading="lazy"
            />
            <span className="absolute left-3 top-3 rounded-full bg-surface/95 px-2.5 py-1 text-[11px] font-semibold text-primary shadow-tile backdrop-blur">
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
