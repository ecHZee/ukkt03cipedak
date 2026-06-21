import { Users, Home, CalendarCheck, FileArchive } from "lucide-react";

const STATS = [
  { icon: Users,         value: "59",   label: "Anggota Aktif" },
  { icon: Home,          value: "7",    label: "RT Cakupan" },
  { icon: CalendarCheck, value: "60+",  label: "Kegiatan / Tahun" },
  { icon: FileArchive,   value: "12",   label: "Dokumen LPJ" },
];

export function StatsStrip() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-0 sm:divide-x sm:divide-border rounded-xl border border-border bg-surface shadow-tile">
      {STATS.map(({ icon: Icon, value, label }) => (
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
