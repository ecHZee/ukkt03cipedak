import { namaLengkap, type Anggota } from "@/domains/anggota/data";
import { cn } from "@/lib/utils";
import { PersonAvatar } from "./PersonAvatar";

const SOROTAN = {
  ketua: {
    kartu:
      "min-h-[288px] items-center gap-5 border-accent/50 bg-primary p-6 sm:min-h-[264px] sm:gap-8 sm:p-8",
    avatar: "size-20 bg-white/15 text-2xl text-white sm:size-28 sm:text-4xl",
    nama: "text-2xl font-bold text-white sm:text-4xl",
    jabatan: "text-base font-semibold text-white/90 sm:text-lg",
  },
  "wakil-ketua": {
    kartu: "min-h-[200px] flex-col gap-4 border-accent/40 bg-accent/5 p-5 sm:min-h-[248px] sm:p-6",
    avatar: "size-20 text-2xl",
    nama: "text-xl font-bold",
    jabatan: "text-sm font-semibold",
  },
  utama: {
    kartu: "min-h-[216px] flex-col gap-3 border-accent/30 p-4",
    avatar: "size-16 text-xl",
    nama: "text-base font-bold",
    jabatan: "text-sm",
  },
  pendamping: {
    kartu: "min-h-[168px] flex-col gap-3 p-4",
    avatar: "size-12",
    nama: "text-sm",
    jabatan: "text-xs",
  },
  kabid: {
    kartu: "min-h-[160px] items-center gap-4 border-primary/30 bg-primary/5 p-5 sm:gap-6 sm:p-6",
    avatar: "size-20 text-2xl sm:size-24 sm:text-3xl",
    nama: "text-lg font-bold sm:text-2xl",
    jabatan: "text-sm font-semibold text-primary",
  },
};

type Props = {
  anggota: Anggota;
  onOpen: (a: Anggota, pemicu: HTMLButtonElement) => void;
  sorotan?: keyof typeof SOROTAN;
};

export function PersonCard({ anggota, onOpen, sorotan }: Props) {
  const bidangSingkat = anggota.bidangSingkat;
  const gaya = sorotan ? SOROTAN[sorotan] : undefined;
  return (
    <button
      type="button"
      onClick={(e) => onOpen(anggota, e.currentTarget)}
      aria-haspopup="dialog"
      data-sorotan={sorotan}
      className={cn(
        "group flex w-full min-w-0 items-start gap-3 rounded-xl border border-border bg-surface p-4 text-left shadow-tile transition hover:shadow-tile-hover hover:border-primary/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none",
        gaya?.kartu,
      )}
    >
      <PersonAvatar anggota={anggota} className={gaya?.avatar} />
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "font-heading text-sm font-semibold text-ink [overflow-wrap:anywhere]",
            gaya?.nama,
          )}
        >
          {namaLengkap(anggota)}
        </p>
        <p className={cn("mt-1 text-[12px] text-ink-muted", gaya?.jabatan)}>{anggota.jabatan}</p>
        {anggota.group !== "BIDANG" && (
          <span
            className={`mt-2 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
              anggota.group === "BPH"
                ? sorotan === "ketua"
                  ? "bg-accent text-accent-foreground"
                  : "bg-accent/15 text-accent-foreground"
                : "bg-ink text-white"
            }`}
          >
            {anggota.group === "BPH" ? "BPH" : "Penasihat"}
          </span>
        )}
        {sorotan === "ketua" && (
          <p className="mt-3 text-sm text-white/80">Periode {anggota.periode}</p>
        )}
        {bidangSingkat && <p className="mt-2 text-xs text-primary">{bidangSingkat}</p>}
      </div>
    </button>
  );
}
