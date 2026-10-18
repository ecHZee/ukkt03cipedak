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
        data-profil-layout="potret"
        className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-[820px] gap-0 overflow-y-auto rounded-xl p-0 [&>button]:hidden motion-reduce:animate-none"
        onCloseAutoFocus={(e) => {
          if (pemicu?.isConnected) {
            e.preventDefault();
            pemicu.focus();
          }
        }}
      >
        <div className="sticky top-0 z-10 flex h-0 justify-end">
          <DialogClose asChild>
            <button
              type="button"
              aria-label="Tutup profil"
              className="mr-2 mt-2 grid size-11 shrink-0 place-items-center rounded-lg bg-background/95 text-ink-muted hover:bg-muted-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            >
              <X className="size-5" aria-hidden />
            </button>
          </DialogClose>
        </div>
        <div className="grid min-w-0 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="flex min-w-0 items-center justify-center border-b border-border bg-muted-surface/50 px-6 py-6 sm:border-b-0 sm:border-r">
            <PersonAvatar
              anggota={anggota}
              bentuk="potret"
              className="max-w-[200px] sm:max-w-none"
            />
          </div>
          <div className="min-w-0 self-center p-6 sm:p-8">
            <DialogHeader className="pr-6 text-left [overflow-wrap:anywhere]">
              <DialogTitle className="font-heading text-2xl font-bold leading-tight text-ink sm:text-3xl">
                <span className="sr-only">Profil </span>
                {namaLengkap(anggota)}
              </DialogTitle>
              <DialogDescription className="pt-1 text-base font-semibold text-primary">
                {anggota.jabatan}
              </DialogDescription>
            </DialogHeader>
            <dl className="mt-6 w-full divide-y divide-border rounded-lg border border-border bg-muted-surface/40 text-sm">
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
