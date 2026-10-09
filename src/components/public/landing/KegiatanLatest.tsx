import { MapPin, CalendarDays, CalendarRange } from "lucide-react";
import { Placeholder } from "@/components/public/Placeholder";
import type { Kegiatan } from "@/domains/konten/types";

/** Kartu kegiatan beranda. `items` sudah dipilih (terdekat dulu) oleh pilihKegiatanTerdekat. */
export function KegiatanLatest({
  items,
  namaBidang,
}: {
  items: Kegiatan[];
  namaBidang: Record<string, string>;
}) {
  return (
    <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:overflow-visible sm:px-0 sm:pb-0 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <article
          key={item.id}
          className="group flex w-[80%] shrink-0 snap-start flex-col overflow-hidden rounded-xl border sm:w-auto border-border bg-surface shadow-tile transition hover:shadow-tile-hover hover:-translate-y-0.5"
        >
          <div className="relative aspect-[16/10]">
            <Placeholder
              label={item.judul}
              caption="Dokumentasi kegiatan"
              icon={CalendarRange}
              tone={i === 1 ? "accent" : "neutral"}
              rounded="rounded-none"
            />
            {item.bidang && namaBidang[item.bidang] && (
              <span className="absolute left-3 top-3 rounded-full bg-surface px-2.5 py-1 text-[11px] font-semibold text-primary shadow-tile border border-border">
                {namaBidang[item.bidang]}
              </span>
            )}
          </div>
          <div className="flex flex-1 flex-col p-5">
            <h3 className="font-heading text-lg font-semibold text-ink leading-snug line-clamp-2">
              {item.judul}
            </h3>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-ink-muted">
              {item.jadwal && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-3.5" />
                  {item.jadwal}
                </span>
              )}
              {item.lokasi && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5" />
                  {item.lokasi}
                </span>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
