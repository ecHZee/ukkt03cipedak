import { useState } from "react";
import { Download, Eye, FileText, Loader2 } from "lucide-react";
import { DOKUMEN_ACCESS_META, DOKUMEN_KATEGORI_LABEL, type Dokumen } from "@/domains/dokumen/types";
import { urlSementara } from "@/services/storage";

export function KartuDokumen({ dokumen: d }: { dokumen: Dokumen }) {
  const [menunggu, setMenunggu] = useState(false);
  const [pesan, setPesan] = useState<string | null>(null);
  const akses = DOKUMEN_ACCESS_META[d.akses];
  const bukaInternal = async () => {
    if (!d.storagePath || menunggu) return;
    setMenunggu(true);
    setPesan(null);
    try {
      // Dibuat saat diminta, tidak disimpan dalam loader/cache/DOM halaman.
      const url = await urlSementara(d.storagePath, 600);
      window.location.assign(url);
    } catch {
      setPesan("Dokumen belum dapat dibuka. Periksa akses akun, lalu coba lagi.");
    } finally {
      setMenunggu(false);
    }
  };
  const kelas =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary";
  return (
    <article className="flex min-w-0 flex-col gap-4 rounded-xl border border-border bg-surface p-5 shadow-tile">
      <div className="flex items-start gap-3">
        <FileText aria-hidden className="mt-1 size-6 shrink-0 text-primary" />
        <div className="min-w-0">
          <p className="text-xs text-ink-muted">{DOKUMEN_KATEGORI_LABEL[d.kategori]}</p>
          <h2 className="mt-1 break-words font-heading text-lg font-semibold text-ink">
            {d.judul}
          </h2>
          <p className="mt-2 text-xs text-ink-muted">
            {[d.tanggal ?? d.tahun, d.ukuran, "PDF"].filter(Boolean).join(" · ")}
          </p>
        </div>
      </div>
      <span
        className={
          "inline-flex w-fit items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium " +
          akses.tone
        }
      >
        <akses.icon aria-hidden className="size-3.5" />
        {akses.label}
      </span>
      {d.url ? (
        <div className="mt-auto flex flex-wrap gap-2">
          <a href={d.url} target="_blank" rel="noopener noreferrer" className={kelas}>
            <Eye aria-hidden className="size-4" />
            Pratinjau
          </a>
          <a href={d.url} download className={kelas}>
            <Download aria-hidden className="size-4" />
            Unduh
          </a>
        </div>
      ) : d.storagePath ? (
        <div className="mt-auto">
          <button
            type="button"
            onClick={bukaInternal}
            disabled={menunggu}
            className={kelas + " bg-primary text-primary-foreground disabled:opacity-60"}
          >
            {menunggu ? (
              <Loader2 aria-hidden className="size-4 animate-spin" />
            ) : (
              <Eye aria-hidden className="size-4" />
            )}
            {menunggu ? "Menyiapkan…" : "Buka PDF"}
          </button>
          <p className="mt-2 text-xs text-ink-muted">Tautan internal berlaku 10 menit.</p>
        </div>
      ) : (
        <p className="mt-auto text-sm text-ink-muted">File sedang disiapkan.</p>
      )}
      {pesan && (
        <p role="alert" className="text-sm text-destructive">
          {pesan}
        </p>
      )}
    </article>
  );
}
