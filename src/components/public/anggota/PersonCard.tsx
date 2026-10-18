import { namaLengkap, type Anggota } from "@/domains/anggota/data";
import { PersonAvatar } from "./PersonAvatar";

type Props = {
  anggota: Anggota;
  onOpen: (a: Anggota, pemicu: HTMLButtonElement) => void;
};

export function PersonCard({ anggota, onOpen }: Props) {
  const bidangSingkat = anggota.bidangSingkat;
  return (
    <button
      type="button"
      onClick={(e) => onOpen(anggota, e.currentTarget)}
      aria-haspopup="dialog"
      className="group flex min-w-0 items-start gap-3 rounded-xl border border-border bg-surface p-4 text-left shadow-tile transition hover:shadow-tile-hover hover:border-primary/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none"
    >
      <PersonAvatar anggota={anggota} />
      <div className="min-w-0 flex-1">
        <p className="font-heading text-sm font-semibold text-ink [overflow-wrap:anywhere]">
          {namaLengkap(anggota)}
        </p>
        <p className="mt-1 text-[12px] text-ink-muted">{anggota.jabatan}</p>
        {anggota.group !== "BIDANG" && (
          <span
            className={`mt-2 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
              anggota.group === "BPH" ? "bg-accent/15 text-accent-foreground" : "bg-ink text-white"
            }`}
          >
            {anggota.group === "BPH" ? "BPH" : "Penasihat"}
          </span>
        )}
        {bidangSingkat && <p className="mt-2 text-xs text-primary">{bidangSingkat}</p>}
      </div>
    </button>
  );
}
