import { useEffect, useState } from "react";
import { CalendarPlus, Share2 } from "lucide-react";
import { tautanWhatsApp } from "@/lib/tautan-konten";

export function BagikanKonten({
  judul,
  url,
  kalender,
  durasiSementara = false,
}: {
  judul: string;
  url: string;
  kalender?: string | null;
  durasiSementara?: boolean;
}) {
  const [pesan, setPesan] = useState("");
  const [bisaBagikan, setBisaBagikan] = useState(false);
  useEffect(() => {
    setBisaBagikan(typeof navigator.share === "function");
  }, []);
  const wa = tautanWhatsApp(judul, url);
  const kelas =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

  async function bagikan() {
    try {
      await navigator.share({ title: judul, text: judul, url });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setPesan("Berbagi perangkat belum tersedia. Gunakan tautan WhatsApp di bawah.");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {bisaBagikan && (
          <button
            type="button"
            onClick={bagikan}
            className={`${kelas} bg-primary text-primary-foreground hover:bg-primary/90`}
          >
            <Share2 className="size-4" aria-hidden /> Bagikan
          </button>
        )}
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className={`${kelas} bg-surface text-primary hover:bg-muted-surface`}
        >
          Bagikan ke WhatsApp
        </a>
        {kalender && (
          <a
            href={kalender}
            target="_blank"
            rel="noopener noreferrer"
            className={`${kelas} bg-surface text-ink hover:bg-muted-surface`}
          >
            <CalendarPlus className="size-4" aria-hidden /> Tambah ke Google Calendar
          </a>
        )}
      </div>
      {kalender && durasiSementara && (
        <p className="mt-3 text-xs text-ink-muted">
          Waktu selesai belum ditentukan. Calendar diisi sementara satu jam; kamu bisa mengubahnya
          sebelum menyimpan.
        </p>
      )}
      <p role="status" className="mt-2 text-sm text-ink-muted">
        {pesan}
      </p>
    </div>
  );
}
