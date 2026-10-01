import { Users, Home, CalendarCheck, LayoutGrid } from "lucide-react";

export type StatsData = {
  pengurusAktif: number;
  jumlahRt: number | null;
  jumlahBidang: number;
  kegiatanTercatat: number;
};

/** Semua angka dihitung dari database. Angka 0 / kosong tidak ditampilkan. */
export function StatsStrip({ data }: { data: StatsData }) {
  const stats = [
    { icon: Users, value: data.pengurusAktif, label: "Pengurus Aktif" },
    { icon: Home, value: data.jumlahRt, label: "RT Cakupan" },
    { icon: LayoutGrid, value: data.jumlahBidang, label: "Bidang" },
    { icon: CalendarCheck, value: data.kegiatanTercatat, label: "Kegiatan Tercatat" },
  ].filter((s): s is typeof s & { value: number } => Boolean(s.value));
  if (stats.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-0 sm:divide-x sm:divide-border rounded-xl border border-border bg-surface shadow-tile">
      {stats.map(({ icon: Icon, value, label }) => (
        <div key={label} className="flex flex-col gap-1.5 px-5 py-6 sm:items-center sm:text-center">
          <Icon className="size-5 text-primary" />
          <div className="font-heading text-3xl sm:text-4xl font-bold text-ink tabular-nums leading-none">
            {value}
          </div>
          <div className="text-xs sm:text-[13px] text-ink-muted font-medium">{label}</div>
        </div>
      ))}
    </div>
  );
}
