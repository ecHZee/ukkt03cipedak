import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import type { Anggota } from "@/domains/anggota/data";
import type { BidangData } from "@/services/organisasi";
import { PersonCard } from "./PersonCard";
import { PersonDialog } from "./PersonDialog";

/** Dipakai direktori lengkap dan detail bidang; profil tetap lewat portal yang sama. */
export function DaftarPengurus({ pengurus }: { pengurus: Anggota[] }) {
  const [selected, setSelected] = useState<Anggota | null>(null);
  const [open, setOpen] = useState(false);
  const pemicu = useRef<HTMLButtonElement | null>(null);
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {pengurus.map((a) => (
          <PersonCard
            key={a.id}
            anggota={a}
            onOpen={(anggota, tombol) => {
              pemicu.current = tombol;
              setSelected(anggota);
              setOpen(true);
            }}
          />
        ))}
      </div>
      <PersonDialog anggota={selected} open={open} onOpenChange={setOpen} pemicu={pemicu.current} />
    </>
  );
}

export function HumanDirectory({
  pengurus,
  bidang,
}: {
  pengurus: Anggota[];
  bidang: BidangData[];
}) {
  const [filter, setFilter] = useState("semua");
  const kelompok = [
    {
      id: "bph",
      nama: "Badan Pengurus Harian",
      anggota: pengurus.filter((a) => a.group === "BPH"),
    },
    {
      id: "penasihat",
      nama: "Penasihat",
      anggota: pengurus.filter((a) => a.group === "PENASIHAT"),
    },
    ...bidang.map((b) => ({
      id: b.slug,
      nama: b.name,
      anggota: pengurus.filter((a) => a.group === "BIDANG" && a.bidang === b.slug),
    })),
  ].filter((g) => g.anggota.length > 0);
  const ditampilkan = kelompok.filter((g) => filter === "semua" || g.id === filter);
  const jumlah = ditampilkan.reduce((n, g) => n + g.anggota.length, 0);
  return (
    <div>
      <div className="mb-8 flex flex-col gap-3 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full sm:max-w-sm">
          <label htmlFor="filter-pengurus" className="mb-2 block text-sm font-semibold text-ink">
            Tampilkan pengurus
          </label>
          <select
            id="filter-pengurus"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="min-h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            <option value="semua">Semua bidang & peran</option>
            {kelompok.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nama} ({g.anggota.length})
              </option>
            ))}
          </select>
        </div>
        <p role="status" className="text-sm text-ink-muted">
          Menampilkan {jumlah} dari {pengurus.length} orang
        </p>
      </div>
      <div className="space-y-10">
        {ditampilkan.map((g) => (
          <section key={g.id} aria-labelledby={`grup-${g.id}`}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 id={`grup-${g.id}`} className="font-heading text-xl font-bold text-ink">
                {g.nama}{" "}
                <span className="text-sm font-medium text-ink-muted">
                  · {g.anggota.length} orang
                </span>
              </h2>
              {g.id !== "bph" && g.id !== "penasihat" && (
                <Link
                  to="/program/$bidang"
                  params={{ bidang: g.id }}
                  className="inline-flex min-h-11 items-center text-sm font-semibold text-primary underline underline-offset-4"
                >
                  Lihat bidang →
                </Link>
              )}
            </div>
            <DaftarPengurus pengurus={g.anggota} />
          </section>
        ))}
      </div>
    </div>
  );
}
