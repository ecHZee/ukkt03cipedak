import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { STRUKTUR_2025_2028, type Anggota } from "@/domains/anggota/data";
import { BIDANG_LIST } from "@/domains/program/data";
import { PersonCard } from "./PersonCard";
import { PersonDialog } from "./PersonDialog";
import { LeadershipShowcase } from "./LeadershipShowcase";

/** Human Directory — pengurus BPH + 7 bidang dengan popup profil. */
export function HumanDirectory() {
  const [selected, setSelected] = useState<Anggota | null>(null);
  const [open, setOpen] = useState(false);

  const handleOpen = (a: Anggota) => {
    setSelected(a);
    setOpen(true);
  };

  return (
    <div className="space-y-12">
      {/* Leadership Showcase (campaign-poster style) — BPH only */}
      <LeadershipShowcase />

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