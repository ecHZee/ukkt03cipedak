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
  // Statistik nol disembunyikan; kolom harus mengikuti isi agar tidak menyisakan kotak kosong.
  const kolom =
    stats.length === 1
      ? "grid-cols-1"
      : stats.length === 2
        ? "grid-cols-2"
        : stats.length === 3
          ? "grid-cols-3"
          : "grid-cols-2 sm:grid-cols-4";

  return (
    <div
      role="group"
      aria-label="Statistik organisasi"
      className={`grid ${kolom} gap-3 sm:gap-0 sm:divide-x sm:divide-border rounded-xl border border-border bg-surface shadow-tile`}
    >
      {stats.map(({ icon: Icon, value, label }) => (
        <div
          key={label}
          className="flex flex-col items-center gap-1.5 px-3 py-6 text-center sm:px-5"
        >
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
