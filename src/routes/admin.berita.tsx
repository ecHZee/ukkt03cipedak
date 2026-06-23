import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Newspaper, Plus, Search, Star } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { EmptyState } from "@/components/shared/EmptyState";
import { BERITA_LIST } from "@/domains/berita/data";

export const Route = createFileRoute("/admin/berita")({ component: Page });

type Tab = "draft" | "published" | "archived";

const TAB_LABEL: Record<Tab, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
};

function Page() {
  const [tab, setTab] = useState<Tab>("published");
  const [q, setQ] = useState("");

  // UI-only mapping — placeholder=true → draft, lainnya → published
  const byStatus = {
    draft: BERITA_LIST.filter((b) => b.placeholder),
    published: BERITA_LIST.filter((b) => !b.placeholder),
    archived: [] as typeof BERITA_LIST,
  };

  const items = byStatus[tab].filter(
    (b) => q.trim() === "" || b.judul.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <AdminShell
      title="Berita"
      description="Kelola artikel berita organisasi. Pisahkan antara draft, published, dan archived."
      actions={
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-tile transition hover:bg-primary/90">
          <Plus className="size-4" /> Tulis Berita
        </button>
      }
    >
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="inline-flex rounded-lg border border-border bg-surface p-1 shadow-tile">
          {(Object.keys(TAB_LABEL) as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                tab === t ? "bg-primary text-primary-foreground" : "text-ink hover:text-primary"
              }`}
            >
              {TAB_LABEL[t]}{" "}
              <span className="tabular-nums opacity-80">({byStatus[t].length})</span>
            </button>
          ))}
        </div>
        <div className="relative max-w-md lg:flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari judul berita…"
            className="h-10 w-full rounded-lg border border-border bg-muted-surface pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:bg-surface focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title={`Belum ada berita ${TAB_LABEL[tab]}`}
          description="Buat draft baru untuk memulai publikasi."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((b, i) => (
            <article
              key={b.id}
              className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-5 shadow-tile transition hover:shadow-tile-hover animate-fade-in-up"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                  {b.kategori}
                </span>
                {b.featured && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">
                    <Star className="size-3" /> Featured
                  </span>
                )}
              </div>
              <h3 className="font-heading text-base font-semibold text-ink leading-snug line-clamp-2">
                {b.judul}
              </h3>
              <p className="text-xs text-ink-muted line-clamp-3">{b.ringkasan}</p>
              <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-[11px] text-ink-muted tabular-nums">
                <span>{b.tanggal}</span>
                <span>{b.penulis}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </AdminShell>
  );
}