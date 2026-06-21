import { ArrowRight } from "lucide-react";
import { PLACEHOLDERS } from "./placeholders";

const FEATURED = {
  category: "Liputan",
  title: "Antusiasme Pemuda RW 03 dalam Pekan Olahraga Antar-RT 2026",
  excerpt:
    "Lebih dari 120 pemuda dari 7 RT berpartisipasi dalam ajang tahunan yang digelar sepanjang akhir pekan, menampilkan futsal, voli, dan tarik tambang.",
  date: "18 Juni 2026",
  author: "Tim Media KT",
};

const SECONDARY = [
  { category: "Pengumuman", title: "Rapat Konsolidasi Periode 2025–2028 Resmi Dibuka", date: "12 Jun 2026" },
  { category: "Sosial",     title: "Santunan Anak Yatim Bulan Juni Diserahkan",          date: "08 Jun 2026" },
  { category: "Lingkungan", title: "Penghijauan Bantaran Sungai Cipedak Tahap II",       date: "04 Jun 2026" },
  { category: "Pendidikan", title: "Pendaftaran Bimbel Gratis Telah Dibuka",             date: "01 Jun 2026" },
];

export function BeritaLatest() {
  return (
    <div className="grid gap-5 lg:grid-cols-12">
      <a
        href="#"
        className="group lg:col-span-7 flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-tile transition hover:shadow-tile-hover"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-muted-surface">
          <img
            src={PLACEHOLDERS.beritaFeatured.src}
            alt={PLACEHOLDERS.beritaFeatured.alt}
            className="h-full w-full object-cover transition duration-200 group-hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
        <div className="flex flex-1 flex-col p-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-accent-foreground">
            {FEATURED.category}
          </span>
          <h3 className="mt-2 font-heading text-2xl font-bold text-ink leading-tight group-hover:text-primary transition-colors">
            {FEATURED.title}
          </h3>
          <p className="mt-3 text-sm text-ink-muted leading-relaxed line-clamp-3">{FEATURED.excerpt}</p>
          <div className="mt-4 flex items-center justify-between text-xs text-ink-muted">
            <span>{FEATURED.date} · {FEATURED.author}</span>
            <span className="inline-flex items-center gap-1 font-semibold text-primary">
              Baca <ArrowRight className="size-3.5" />
            </span>
          </div>
        </div>
      </a>

      <ul className="lg:col-span-5 grid gap-3">
        {SECONDARY.map((n) => (
          <li key={n.title}>
            <a
              href="#"
              className="group flex items-start gap-4 rounded-xl border border-border bg-surface p-4 shadow-tile transition hover:shadow-tile-hover hover:border-primary/40"
            >
              <span className="mt-1 inline-flex shrink-0 rounded-md bg-muted-surface px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                {n.category}
              </span>
              <div className="min-w-0 flex-1">
                <h4 className="font-heading text-sm font-semibold text-ink leading-snug group-hover:text-primary transition line-clamp-2">
                  {n.title}
                </h4>
                <p className="mt-1 text-[11px] text-ink-muted">{n.date}</p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
