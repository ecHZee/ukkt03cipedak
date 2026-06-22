import { Instagram, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Anggota } from "@/domains/anggota/data";
import { BIDANG_BY_SLUG } from "@/domains/program/data";

type Props = {
  anggota: Anggota | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function PersonDialog({ anggota, open, onOpenChange }: Props) {
  if (!anggota) return null;
  const bidang = anggota.bidang ? BIDANG_BY_SLUG[anggota.bidang] : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">Profil {anggota.nama}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 pt-2">
          <div className="grid size-24 place-items-center overflow-hidden rounded-2xl placeholder-pattern text-primary shadow-tile">
            {anggota.fotoUrl ? (
              <img src={anggota.fotoUrl} alt={anggota.nama} className="h-full w-full object-cover" />
            ) : (
              <User className="size-9" />
            )}
          </div>
          <div className="text-center">
            <h3 className="font-heading text-lg font-bold text-ink">{anggota.nama}</h3>
            <p className="text-sm text-ink-muted">{anggota.jabatan}</p>
          </div>

          <dl className="w-full divide-y divide-border rounded-lg border border-border bg-muted-surface/40 text-sm">
            <Row label="Bidang" value={bidang ? bidang.name : "Badan Pengurus Harian (BPH)"} />
            <Row label="RT" value={anggota.rt ?? "—"} />
            <Row label="Periode" value={anggota.periode} />
            <Row
              label="Instagram"
              value={
                anggota.instagram ? (
                  <a
                    href={`https://instagram.com/${anggota.instagram.replace(/^@/, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    <Instagram className="size-3.5" />
                    {anggota.instagram}
                  </a>
                ) : (
                  "—"
                )
              }
            />
          </dl>

          {anggota.placeholder && (
            <p className="text-center text-[11px] uppercase tracking-wider text-warning">
              Data SK belum diisi · menunggu sumber resmi
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[100px_1fr] gap-3 px-4 py-2.5">
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}