import { Link } from "@tanstack/react-router";
import { ArrowRight, Newspaper } from "lucide-react";
import { Placeholder } from "@/components/public/Placeholder";
import type { Berita } from "@/domains/konten/types";

/** Berita utama (pinned/terbaru) + 4 berita berikutnya. Halaman detail menyusul di Hari 12. */
export function BeritaLatest({
  berita,
  namaBidang,
}: {
  berita: Berita[];
  namaBidang: Record<string, string>;
}) {
  const [utama, ...lainnya] = berita;
  if (!utama) return null;
  const kategori = (b: Berita) => (b.bidang ? (namaBidang[b.bidang] ?? "Umum") : "Umum");

  return (
    <div className="grid gap-5 lg:grid-cols-12">
      <Link
        to="/berita"
        className={`group ${lainnya.length ? "lg:col-span-7" : "lg:col-span-12"} flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-tile transition hover:shadow-tile-hover`}
      >
        <div className="relative aspect-[2/1] sm:aspect-[16/10]">
          <Placeholder
            label={utama.judul}
            caption="Cover berita"
            icon={Newspaper}
            tone="ink"
            rounded="rounded-none"
          />
        </div>
        <div className="flex flex-1 flex-col p-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-accent-foreground">
            {kategori(utama)}
          </span>
          <h3 className="mt-2 font-heading text-2xl font-bold text-ink leading-tight group-hover:text-primary transition-colors">
            {utama.judul}
          </h3>
          {utama.ringkasan && (
            <p className="mt-3 text-sm text-ink-muted leading-relaxed line-clamp-3">
              {utama.ringkasan}
            </p>
          )}
          <div className="mt-4 flex items-center justify-between text-xs text-ink-muted">
            <span>{utama.tanggal}</span>
            <span className="inline-flex items-center gap-1 font-semibold text-primary">
              Baca <ArrowRight className="size-3.5" />
            </span>
          </div>
        </div>
      </Link>

      {lainnya.length > 0 && (
        <ul className="lg:col-span-5 grid content-start gap-3">
          {lainnya.slice(0, 4).map((n, i) => (
            // HP: cukup 2 berita tambahan agar beranda ringkas
            <li key={n.id} className={i >= 2 ? "hidden sm:block" : undefined}>
              <Link
                to="/berita"
                className="group flex items-start gap-4 rounded-xl border border-border bg-surface p-4 shadow-tile transition hover:shadow-tile-hover hover:border-primary/40"
              >
                <span className="mt-1 inline-flex shrink-0 rounded-md bg-muted-surface px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                  {kategori(n)}
                </span>
                <div className="min-w-0 flex-1">
                  <h4 className="font-heading text-sm font-semibold text-ink leading-snug group-hover:text-primary transition line-clamp-2">
                    {n.judul}
                  </h4>
                  <p className="mt-1 text-[11px] text-ink-muted">{n.tanggal}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
