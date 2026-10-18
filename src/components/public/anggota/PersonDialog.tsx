import { Instagram, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { namaLengkap, type Anggota } from "@/domains/anggota/data";
import { PersonAvatar } from "./PersonAvatar";

type Props = {
  anggota: Anggota | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pemicu?: HTMLButtonElement | null;
};

export function PersonDialog({ anggota, open, onOpenChange, pemicu }: Props) {
  if (!anggota) return null;
  const bidangNama = anggota.bidangNama;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[85dvh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-xl [&>button]:hidden motion-reduce:animate-none"
        onCloseAutoFocus={(e) => {
          if (pemicu?.isConnected) {
            e.preventDefault();
            pemicu.focus();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="sr-only">Profil {anggota.nama}</DialogTitle>
          <DialogDescription className="sr-only">
            Jabatan dan informasi publik pengurus periode {anggota.periode}.
          </DialogDescription>
        </DialogHeader>
        <div className="absolute right-2 top-2">
          <DialogClose asChild>
            <button
              type="button"
              aria-label="Tutup profil"
              className="grid size-11 place-items-center rounded-lg text-ink-muted hover:bg-muted-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            >
              <X className="size-5" aria-hidden />
            </button>
          </DialogClose>
        </div>
        <div className="flex flex-col items-center gap-4 pt-2">
          <PersonAvatar anggota={anggota} className="size-24 rounded-2xl text-3xl" />
          <div className="min-w-0 text-center [overflow-wrap:anywhere]">
            <h3 className="font-heading text-lg font-bold text-ink">{namaLengkap(anggota)}</h3>
            <p className="text-sm text-ink-muted">{anggota.jabatan}</p>
          </div>

          <dl className="w-full divide-y divide-border rounded-lg border border-border bg-muted-surface/40 text-sm">
            <Row
              label="Bidang"
              value={
                bidangNama
                  ? bidangNama
                  : anggota.group === "PENASIHAT"
                    ? "Penasihat"
                    : "Badan Pengurus Harian (BPH)"
              }
            />
            {anggota.rt && <Row label="RT" value={anggota.rt} />}
            <Row label="Periode" value={anggota.periode} />
            {anggota.instagram && (
              <Row
                label="Instagram"
                value={
                  <a
                    href={`https://instagram.com/${anggota.instagram.replace(/^@/, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-1 text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    <Instagram className="size-3.5" />
                    {anggota.instagram}
                  </a>
                }
              />
            )}
          </dl>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[72px_minmax(0,1fr)] gap-3 px-4 py-3">
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">{label}</dt>
      <dd className="min-w-0 text-ink [overflow-wrap:anywhere]">{value}</dd>
    </div>
  );
}
