import { useState } from "react";
import { ChevronRight, Crown, User } from "lucide-react";
import { STRUKTUR_2025_2028, type Anggota } from "@/domains/anggota/data";
import { BIDANG_LIST } from "@/domains/program/data";
import { PersonCard } from "./PersonCard";
import { PersonDialog } from "./PersonDialog";

/** Human Directory — pengurus BPH + 7 bidang dengan popup profil. */
export function HumanDirectory() {
  const [selected, setSelected] = useState<Anggota | null>(null);
  const [open, setOpen] = useState(false);

  const handleOpen = (a: Anggota) => {
    setSelected(a);
    setOpen(true);
  };

  const bph = STRUKTUR_2025_2028.filter((a) => a.group === "BPH");

  return (
    <div className="space-y-10">
      {/* Premium BPH section (Design Freeze BAGIAN 2) */}
      <section className="rounded-2xl border border-gold-premium bg-gradient-to-br from-surface via-surface to-[oklch(0.97_0.03_80)] p-6 md:p-8">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-foreground">
              <Crown className="size-4 text-accent" />
              Badan Pengurus Harian
            </p>
            <h3 className="mt-2 font-heading text-2xl font-bold text-ink leading-tight">
              Inti kepemimpinan periode 2025–2028
            </h3>
          </div>
          <span className="rounded-full border border-accent/40 bg-accent/15 px-3 py-1 text-xs font-semibold text-accent-foreground tabular-nums">
            {bph.length} pengurus inti
          </span>
        </header>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bph.map((a) => (
            <BphCard key={a.id} anggota={a} onOpen={handleOpen} />
          ))}
        </div>
      </section>

      {BIDANG_LIST.map((b) => {
        const members = STRUKTUR_2025_2028.filter(
          (a) => a.group === "BIDANG" && a.bidang === b.slug,
        );
        if (members.length === 0) return null;
        return (
          <Group key={b.slug} title={b.name} chip={b.short} count={members.length}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((a) => (
                <PersonCard key={a.id} anggota={a} onOpen={handleOpen} />
              ))}
            </div>
          </Group>
        );
      })}

      <PersonDialog anggota={selected} open={open} onOpenChange={setOpen} />
    </div>
  );
}

function BphCard({ anggota, onOpen }: { anggota: Anggota; onOpen: (a: Anggota) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(anggota)}
      className="group flex flex-col items-center gap-3 rounded-2xl border border-accent/30 bg-surface p-5 text-center shadow-elevated transition hover:-translate-y-1 hover:border-accent hover:shadow-tile-hover"
    >
      <div className="grid size-20 place-items-center overflow-hidden rounded-full border-2 border-accent/40 placeholder-pattern-accent text-accent-foreground shadow-tile">
        {anggota.fotoUrl ? (
          <img src={anggota.fotoUrl} alt={anggota.nama} className="h-full w-full object-cover" />
        ) : (
          <User className="size-8" />
        )}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
          {anggota.jabatan}
        </p>
        <p className="mt-1 truncate font-heading text-base font-bold text-ink">{anggota.nama}</p>
        <p className="mt-1 text-[11px] text-ink-muted">Periode {anggota.periode}</p>
      </div>
    </button>
  );
}

function Group({
  title,
  chip,
  count,
  children,
}: {
  title: string;
  chip: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section>
      <header className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted flex items-center gap-2">
            <ChevronRight className="size-3.5 text-primary" />
            {chip}
          </p>
          <h3 className="mt-1 font-heading text-lg font-bold text-ink leading-tight">{title}</h3>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary tabular-nums">
          {count} pengurus
        </span>
      </header>
      {children}
    </section>
  );
}