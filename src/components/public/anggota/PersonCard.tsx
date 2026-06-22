import { User } from "lucide-react";
import type { Anggota } from "@/domains/anggota/data";
import { BIDANG_BY_SLUG } from "@/domains/program/data";

type Props = {
  anggota: Anggota;
  onOpen: (a: Anggota) => void;
};

export function PersonCard({ anggota, onOpen }: Props) {
  const bidang = anggota.bidang ? BIDANG_BY_SLUG[anggota.bidang] : null;
  return (
    <button
      type="button"
      onClick={() => onOpen(anggota)}
      className="group flex items-center gap-3 rounded-xl border border-border bg-surface p-3 text-left shadow-tile transition hover:-translate-y-0.5 hover:shadow-tile-hover hover:border-primary/40"
    >
      <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-lg placeholder-pattern text-primary">
        {anggota.fotoUrl ? (
          <img src={anggota.fotoUrl} alt={anggota.nama} className="h-full w-full object-cover" />
        ) : (
          <User className="size-5" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-heading text-sm font-semibold text-ink">{anggota.nama}</p>
        <p className="truncate text-[12px] text-ink-muted">{anggota.jabatan}</p>
        {bidang && (
          <p className="mt-0.5 truncate text-[11px] uppercase tracking-wider text-primary/80">
            {bidang.short}
          </p>
        )}
      </div>
    </button>
  );
}