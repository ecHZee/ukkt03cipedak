import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Image as ImageIcon, Plus, Star } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Placeholder } from "@/components/public/Placeholder";
import { ALBUMS, KATEGORI_META } from "@/domains/galeri/data";

export const Route = createFileRoute("/admin/galeri")({ component: Page });

function Page() {
  const [selectedAlbum, setSelectedAlbum] = useState(ALBUMS[0]?.id ?? null);
  const [cover, setCover] = useState(0);

  const album = ALBUMS.find((a) => a.id === selectedAlbum) ?? null;
  const meta = album ? KATEGORI_META[album.kategori] : null;

  return (
    <AdminShell
      title="Galeri"
      description="Kelola album dokumentasi: pilih cover album & atur urutan thumbnail."
      actions={
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-tile transition hover:bg-primary/90">
          <Plus className="size-4" /> Album Baru
        </button>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        {/* Album list */}
        <aside className="space-y-2">
          <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
            Album ({ALBUMS.length})
          </p>
          <ul className="space-y-1.5">
            {ALBUMS.map((a) => {
              const m = KATEGORI_META[a.kategori];
              const active = a.id === selectedAlbum;
              return (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => { setSelectedAlbum(a.id); setCover(0); }}
                    className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition ${
                      active
                        ? "border-primary/40 bg-primary/5"
                        : "border-border bg-surface hover:border-primary/30"
                    }`}
                  >
                    <div className={`grid size-9 shrink-0 place-items-center rounded-md ${m.tone}`}>
                      <m.icon className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">{a.judul}</p>
                      <p className="text-[11px] tabular-nums text-ink-muted">
                        {a.tahun} · {a.jumlah} foto
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Manager */}
        <section className="rounded-xl border border-border bg-surface p-5 shadow-tile">
          {!album || !meta ? (
            <p className="text-sm text-ink-muted">Pilih album untuk mulai mengelola.</p>
          ) : (
            <>
              <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                    {meta.label}
                  </p>
                  <h2 className="font-heading text-lg font-semibold text-ink">{album.judul}</h2>
                </div>
                <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-primary hover:text-primary">
                  <Plus className="size-3.5" /> Unggah Foto
                </button>
              </header>

              <div className="mt-5">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                  Cover Selector — klik untuk menjadikan cover album
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {Array.from({ length: album.jumlah }).map((_, i) => {
                    const isCover = i === cover;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCover(i)}
                        className={`group relative aspect-square overflow-hidden rounded-lg border-2 transition ${
                          isCover ? "border-accent ring-2 ring-accent/30" : "border-border hover:border-primary/40"
                        }`}
                      >
                        <Placeholder
                          label={`Foto ${i + 1}`}
                          caption="Slot kosong"
                          icon={ImageIcon}
                          tone={i % 2 === 0 ? "neutral" : "accent"}
                          rounded="rounded-none"
                        />
                        {isCover && (
                          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">
                            <Star className="size-3" /> Cover
                          </span>
                        )}
                        {!isCover && (
                          <span className="absolute right-2 top-2 grid size-6 place-items-center rounded-full bg-surface/80 text-ink opacity-0 backdrop-blur transition group-hover:opacity-100">
                            <Check className="size-3.5" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </AdminShell>
  );
}