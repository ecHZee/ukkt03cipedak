import { KartuAgenda } from "@/components/public/KartuAgenda";
import type { Kegiatan } from "@/domains/konten/types";

/** Pilihan agenda beranda berbagi kartu dan tautan dengan daftar kegiatan. */
export function KegiatanLatest({
  items,
  namaBidang,
}: {
  items: Kegiatan[];
  namaBidang: Record<string, string>;
}) {
  return (
    <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:overflow-visible sm:px-0 sm:pb-0 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div key={item.id} className="w-[88%] min-w-0 shrink-0 snap-start sm:w-auto">
          <KartuAgenda kegiatan={item} namaBidang={item.bidang ? namaBidang[item.bidang] : null} />
        </div>
      ))}
    </div>
  );
}
