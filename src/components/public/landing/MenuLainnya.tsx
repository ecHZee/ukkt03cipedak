import { Link } from "@tanstack/react-router";
import { UserRound, X } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";

type Tautan = { to: string; label: string; ket?: string };
export default function MenuLainnya({
  terbuka,
  ubahTerbuka,
  idMenu,
  grup,
  kembalikanFokus,
}: {
  terbuka: boolean;
  ubahTerbuka: (v: boolean) => void;
  idMenu: string;
  grup: Array<{ label: string; isi: Tautan[] }>;
  kembalikanFokus: () => void;
}) {
  return (
    <Sheet open={terbuka} onOpenChange={ubahTerbuka}>
      <SheetContent
        id={idMenu}
        side="bottom"
        className="max-h-[85dvh] overflow-y-auto rounded-t-2xl p-0 [&>button]:hidden"
        onCloseAutoFocus={(event) => {
          // Dua tombol membuka menu yang sama; kembalikan fokus ke tombol yang dipakai.
          event.preventDefault();
          kembalikanFokus();
        }}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <SheetTitle className="font-heading font-semibold text-ink">Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Jelajahi semua halaman Karang Taruna RW 03 Cipedak.
          </SheetDescription>
          <button
            type="button"
            onClick={() => ubahTerbuka(false)}
            aria-label="Tutup menu navigasi"
            className="grid size-11 place-items-center rounded-lg hover:bg-muted-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <nav className="grid gap-5 p-5" aria-label="Semua halaman">
          {grup.map((g) => (
            <div key={g.label}>
              <p className="mb-1.5 text-xs font-semibold text-ink-muted">{g.label}</p>
              <div className="grid gap-1">
                {g.isi.map((t) => (
                  <Link
                    key={t.to}
                    to={t.to}
                    onClick={() => ubahTerbuka(false)}
                    className="flex min-h-11 flex-col justify-center rounded-lg px-3 py-2.5 hover:bg-muted-surface"
                    activeProps={{ className: "bg-primary/8 text-primary" }}
                  >
                    <span className="text-[15px] font-semibold">{t.label}</span>
                    {t.ket && <span className="text-xs text-ink-muted">{t.ket}</span>}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <Link
            to="/login"
            reloadDocument
            onClick={() => ubahTerbuka(false)}
            className="flex min-h-11 items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm text-ink-muted"
          >
            <UserRound className="size-4" /> Masuk pengurus
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
