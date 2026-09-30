import { Users, Home, CalendarCheck, LayoutGrid } from "lucide-react";
import { PENGURUS_AKTIF } from "@/domains/anggota/data";
import { BIDANG_LIST } from "@/domains/program/data";
import { RT_LIST } from "@/constants/site";

// Dihitung dari data, kecuali "60+ kegiatan/tahun" (angka dari pengurus, diganti hitungan otomatis di Fase 1).
const STATS = [
  { icon: Users, value: String(PENGURUS_AKTIF.length), label: "Pengurus Aktif" },
  { icon: Home, value: String(RT_LIST.length), label: "RT Cakupan" },
  { icon: LayoutGrid, value: String(BIDANG_LIST.length), label: "Bidang" },
  { icon: CalendarCheck, value: "60+", label: "Kegiatan / Tahun" },
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
