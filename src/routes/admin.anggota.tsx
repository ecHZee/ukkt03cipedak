import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, Users2, X } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { EmptyState } from "@/components/shared/EmptyState";
import { STRUKTUR_2025_2028, type Anggota } from "@/domains/anggota/data";
import { BIDANG_LIST, BIDANG_BY_SLUG, type BidangSlug } from "@/domains/program/data";

export const Route = createFileRoute("/admin/anggota")({ component: Page });

const RT_LIST = ["RT 01", "RT 02", "RT 03", "RT 04", "RT 05"];
const PER_PAGE = 10;

function Page() {
  const [q, setQ] = useState("");
  const [bidang, setBidang] = useState<"semua" | BidangSlug>("semua");
  const [rt, setRt] = useState<"semua" | string>("semua");
  const [page, setPage] = useState(1);
  const [preview, setPreview] = useState<Anggota | null>(null);

  const filtered = useMemo(() => {
    return STRUKTUR_2025_2028.filter(
      (a) =>
        (bidang === "semua" || a.bidang === bidang) &&
        (rt === "semua" || a.rt === rt) &&
        (q.trim() === "" ||
          a.nama.toLowerCase().includes(q.toLowerCase()) ||
          a.jabatan.toLowerCase().includes(q.toLowerCase())),
    );
  }, [q, bidang, rt]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <AdminShell
      title="Anggota"
      description="Kelola struktur kepengurusan & data anggota Karang Taruna RW 03."
      actions={<PrimaryButton><Plus className="size-4" /> Tambah Anggota</PrimaryButton>}
    >
      <Toolbar
        q={q} setQ={setQ}
        bidang={bidang} setBidang={(v) => { setBidang(v); setPage(1); }}
        rt={rt} setRt={(v) => { setRt(v); setPage(1); }}
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users2}
          title="Tidak ada anggota cocok"
          description="Ubah kata kunci atau hapus filter aktif."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-tile">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-muted-surface text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                <tr>
                  <th className="px-4 py-3">Nama</th>
                  <th className="px-4 py-3">Jabatan</th>
                  <th className="px-4 py-3">Bidang</th>
                  <th className="px-4 py-3">RT</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pageItems.map((a) => {
                  const b = a.bidang ? BIDANG_BY_SLUG[a.bidang] : null;
                  return (
                    <tr key={a.id} className="transition hover:bg-muted-surface/60">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                            {a.nama[0]}
                          </div>
                          <div className="min-w-0">
                            <p className={`truncate font-semibold ${a.placeholder ? "text-ink-muted italic" : "text-ink"}`}>
                              {a.nama}
                            </p>
                            <p className="text-[11px] text-ink-muted">{a.periode}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-ink">{a.jabatan}</td>
                      <td className="px-4 py-3">
                        {b ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                            {b.short.split(" ")[0]}
                          </span>
                        ) : (
                          <span className="text-[11px] text-ink-muted">BPH</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-ink-muted">{a.rt ?? "—"}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setPreview(a)}
                          className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-primary hover:text-primary"
                        >
                          Preview
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-2 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-ink-muted tabular-nums">
              Menampilkan {pageItems.length} dari {filtered.length} anggota
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-md border border-border px-2.5 py-1 text-xs disabled:opacity-50"
              >Sebelumnya</button>
              <span className="px-2 text-xs tabular-nums text-ink-muted">{page} / {totalPages}</span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-md border border-border px-2.5 py-1 text-xs disabled:opacity-50"
              >Berikutnya</button>
            </div>
          </div>
        </div>
      )}

      {preview && <ProfileModal a={preview} onClose={() => setPreview(null)} />}
    </AdminShell>
  );

  function Toolbar({
    q, setQ, bidang, setBidang, rt, setRt,
  }: {
    q: string; setQ: (v: string) => void;
    bidang: "semua" | BidangSlug; setBidang: (v: "semua" | BidangSlug) => void;
    rt: "semua" | string; setRt: (v: "semua" | string) => void;
  }) {
    return (
      <div className="mb-5 rounded-xl border border-border bg-surface p-4 shadow-tile">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari nama atau jabatan…"
              className="h-10 w-full rounded-lg border border-border bg-muted-surface pl-9 pr-3 text-sm text-ink outline-none transition focus:border-primary focus:bg-surface focus:ring-2 focus:ring-ring"
            />
          </div>
          <Select value={bidang} onChange={(v) => setBidang(v as "semua" | BidangSlug)}>
            <option value="semua">Semua Bidang</option>
            {BIDANG_LIST.map((b) => (
              <option key={b.slug} value={b.slug}>{b.short}</option>
            ))}
          </Select>
          <Select value={rt} onChange={(v) => setRt(v)}>
            <option value="semua">Semua RT</option>
            {RT_LIST.map((r) => (<option key={r} value={r}>{r}</option>))}
          </Select>
        </div>
      </div>
    );
  }
}

function PrimaryButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-tile transition hover:bg-primary/90">
      {children}
    </button>
  );
}
function Select({
  value, onChange, children,
}: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-ring"
    >
      {children}
    </select>
  );
}

function ProfileModal({ a, onClose }: { a: Anggota; onClose: () => void }) {
  const b = a.bidang ? BIDANG_BY_SLUG[a.bidang] : null;
  return (
    <div
      role="dialog" aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-elevated animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary text-base font-bold">
              {a.nama[0]}
            </div>
            <div>
              <p className={`font-heading text-base font-semibold ${a.placeholder ? "text-ink-muted italic" : "text-ink"}`}>
                {a.nama}
              </p>
              <p className="text-xs text-ink-muted">{a.jabatan}</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Tutup" className="rounded-md p-1 text-ink-muted hover:bg-muted-surface">
            <X className="size-4" />
          </button>
        </div>
        <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <Detail label="Periode" value={a.periode} />
          <Detail label="Grup" value={a.group} />
          <Detail label="Bidang" value={b?.short ?? "—"} />
          <Detail label="RT" value={a.rt ?? "—"} />
        </dl>
      </div>
    </div>
  );
}
function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">{label}</dt>
      <dd className="mt-0.5 text-ink">{value}</dd>
    </div>
  );
}