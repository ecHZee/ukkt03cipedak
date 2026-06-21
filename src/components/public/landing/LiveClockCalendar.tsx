import { useEffect, useState } from "react";
import { CalendarDays, Clock, Flag, Sparkles } from "lucide-react";

const MONTHS = [
  "Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember",
];
const DAYS = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];
const DAYS_LONG = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];

/** Hari libur nasional Indonesia (subset 2026 — perlu di-update tahunan). */
const HOLIDAYS_2026: Record<string, string> = {
  "2026-01-01": "Tahun Baru Masehi",
  "2026-02-17": "Tahun Baru Imlek 2577",
  "2026-03-19": "Hari Raya Nyepi 1948",
  "2026-03-20": "Wafat Isa Al Masih",
  "2026-03-21": "Hari Raya Idul Fitri 1447 H",
  "2026-03-22": "Hari Raya Idul Fitri 1447 H",
  "2026-05-01": "Hari Buruh Internasional",
  "2026-05-14": "Kenaikan Isa Al Masih",
  "2026-05-21": "Hari Raya Waisak 2570",
  "2026-05-27": "Idul Adha 1447 H",
  "2026-06-01": "Hari Lahir Pancasila",
  "2026-08-17": "Hari Kemerdekaan RI",
  "2026-12-25": "Hari Raya Natal",
};

/** Agenda hari ini (placeholder, akan diisi dari DB pada Sprint kegiatan). */
const AGENDA_TODAY: { time: string; title: string }[] = [
  { time: "19:30", title: "Rapat koordinasi periode aktif" },
  { time: "20:30", title: "Latihan rutin futsal" },
];

function fmt(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function LiveClockCalendar() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6 shadow-tile">
        <div className="h-40 animate-pulse rounded-md bg-muted-surface" />
      </div>
    );
  }

  const y = now.getFullYear();
  const m = now.getMonth();
  const today = now.getDate();
  const firstDay = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const monthHolidays = Object.entries(HOLIDAYS_2026).filter(
    ([k]) => k.startsWith(`${y}-${String(m + 1).padStart(2, "0")}`),
  );

  const dateStr = `${DAYS_LONG[now.getDay()]}, ${today} ${MONTHS[m]} ${y}`;
  const timeStr = now.toLocaleTimeString("id-ID", {
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  });

  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
      {/* Calendar */}
      <div className="rounded-xl border border-border bg-surface p-5 shadow-tile">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 text-primary" />
            <h3 className="font-heading text-sm font-semibold text-ink">
              {MONTHS[m]} {y}
            </h3>
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
            Kalender
          </span>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-ink-muted">
          {DAYS.map((d, i) => (
            <div key={d} className={i === 0 ? "text-destructive" : ""}>{d}</div>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1 text-center text-sm tabular-nums">
          {cells.map((d, i) => {
            if (d === null) return <div key={i} className="aspect-square" />;
            const key = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
            const isHoliday = !!HOLIDAYS_2026[key];
            const isSunday = i % 7 === 0;
            const isToday = d === today;
            return (
              <div
                key={i}
                title={HOLIDAYS_2026[key]}
                className={`aspect-square grid place-content-center rounded-md transition ${
                  isToday
                    ? "bg-primary text-primary-foreground font-bold shadow-tile"
                    : isHoliday
                      ? "text-destructive font-semibold"
                      : isSunday
                        ? "text-destructive"
                        : "text-ink hover:bg-muted-surface"
                }`}
              >
                {d}
              </div>
            );
          })}
        </div>

        {monthHolidays.length > 0 && (
          <ul className="mt-4 space-y-1.5 border-t border-border pt-3 text-xs text-ink-muted">
            {monthHolidays.map(([k, name]) => (
              <li key={k} className="flex items-start gap-2">
                <Flag className="mt-0.5 size-3 shrink-0 text-destructive" />
                <span>
                  <span className="font-semibold text-ink">
                    {Number(k.slice(-2))} {MONTHS[m]}
                  </span>
                  {" — "}
                  {name}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Clock + Agenda */}
      <div className="grid gap-4">
        <div className="rounded-xl border border-border bg-primary p-5 text-primary-foreground shadow-tile">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
            <Clock className="size-3.5" />
            Waktu Lokal · WIB
          </div>
          <div className="mt-2 font-heading text-4xl sm:text-5xl font-bold tabular-nums tracking-tight">
            {timeStr}
          </div>
          <div className="mt-1 text-sm text-white/85">{dateStr}</div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5 shadow-tile">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-accent" />
              <h3 className="font-heading text-sm font-semibold text-ink">Agenda Hari Ini</h3>
            </div>
            <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-success">
              ● Aktif
            </span>
          </div>
          {AGENDA_TODAY.length === 0 ? (
            <p className="mt-3 text-sm text-ink-muted">Tidak ada agenda terjadwal hari ini.</p>
          ) : (
            <ul className="mt-3 space-y-2.5">
              {AGENDA_TODAY.map((a, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="rounded-md bg-muted-surface px-2 py-0.5 font-semibold tabular-nums text-primary text-xs">
                    {a.time}
                  </span>
                  <span className="text-ink">{a.title}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
