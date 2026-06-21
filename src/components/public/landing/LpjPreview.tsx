import { Download, Eye, FileText } from "lucide-react";

const LPJ = [
  { name: "LPJ Pekan Olahraga Antar-RT 2026", date: "20 Juni 2026",  size: "1.4 MB" },
  { name: "LPJ Pawai Obor Ramadhan 1447 H",    date: "10 April 2026", size: "980 KB" },
  { name: "LPJ Bakti Sosial Kuartal I 2026",   date: "02 April 2026", size: "1.1 MB" },
];

export function LpjPreview() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {LPJ.map((doc) => (
        <article
          key={doc.name}
          className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5 shadow-tile transition hover:shadow-tile-hover"
        >
          <div className="flex items-start gap-3">
            <div className="grid size-11 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <FileText className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-heading text-[15px] font-semibold text-ink leading-snug line-clamp-2">
                {doc.name}
              </h3>
              <p className="mt-1 text-xs text-ink-muted tabular-nums">
                {doc.date} · {doc.size} · PDF
              </p>
            </div>
          </div>
          <div className="mt-auto flex gap-2 pt-1">
            <button
              type="button"
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-muted-surface px-3 py-2 text-xs font-semibold text-ink transition hover:border-primary hover:text-primary"
            >
              <Eye className="size-3.5" />
              Pratinjau
            </button>
            <button
              type="button"
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              <Download className="size-3.5" />
              Unduh
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
