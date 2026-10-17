import { Link } from "@tanstack/react-router";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";
import type { Kegiatan } from "@/domains/konten/types";
import { gayaBidang } from "@/domains/program/style";

const labelTahap = { rencana: "Rencana", berjalan: "Berjalan", selesai: "Selesai", batal: "Batal" };

export function KartuAgenda({
  kegiatan: k,
  namaBidang,
}: {
  kegiatan: Kegiatan;
  namaBidang?: string | null;
}) {
  const gaya = gayaBidang(k.bidang ?? "");
  const d = k.mulai ? new Date(k.mulai) : null;
  const tanggal = d && Number.isFinite(d.getTime()) ? d : null;
  const format = (opsi: Intl.DateTimeFormatOptions) =>
    tanggal?.toLocaleDateString("id-ID", { ...opsi, timeZone: "Asia/Jakarta" });
  return (
    <Link
      to="/kegiatan/$slug"
      params={{ slug: k.slug }}
      className="group flex h-full min-w-0 gap-4 rounded-xl border border-border bg-surface p-5 shadow-tile transition hover:border-primary/40 hover:shadow-tile-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <div
        className={`flex w-16 shrink-0 flex-col items-center self-start rounded-lg px-2 py-3 ${gaya.iconBg}`}
        aria-hidden
      >
        {tanggal ? (
          <>
            <span className="text-3xl font-bold tabular-nums">{format({ day: "2-digit" })}</span>
            <span className="mt-1 text-xs font-semibold">{format({ month: "short" })}</span>
            <span className="text-xs">{format({ year: "numeric" })}</span>
          </>
        ) : (
          <>
            <CalendarDays className="size-7" />
            <span className="mt-2 text-center text-xs">{k.rutin ? "Rutin" : "Agenda"}</span>
          </>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <span className={`rounded-full px-2 py-1 ${gaya.iconBg}`}>{namaBidang ?? "Umum"}</span>
          <span className="rounded-full bg-muted-surface px-2 py-1 text-ink-muted">
            {labelTahap[k.tahap]}
          </span>
        </div>
        <h3 className="mt-3 font-heading text-lg font-bold leading-snug text-ink group-hover:text-primary [overflow-wrap:anywhere]">
          {k.judul}
        </h3>
        {k.ringkasan && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-muted">{k.ringkasan}</p>
        )}
        {k.jadwal && (
          <p className="mt-3 flex items-start gap-2 text-xs text-ink-muted">
            <CalendarDays className="size-4 shrink-0" aria-hidden />
            {k.jadwal}
          </p>
        )}
        {k.lokasi && (
          <p className="mt-2 flex items-start gap-2 text-xs text-ink-muted">
            <MapPin className="size-4 shrink-0" aria-hidden />
            {k.lokasi}
          </p>
        )}
        <span className="mt-auto inline-flex min-h-11 items-center gap-2 pt-3 text-sm font-semibold text-primary">
          Lihat kegiatan <ArrowRight className="size-4" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
