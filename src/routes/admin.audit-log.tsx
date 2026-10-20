import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { daftarAuditFn } from "@/services/pengaturan-admin.functions";
import { filterAudit, MODUL_AUDIT, LABEL_MODUL } from "@/lib/pengaturan-admin";
export const Route = createFileRoute("/admin/audit-log")({
  beforeLoad: ({ context }) => {
    if (!context.akun?.lintasBidang) throw redirect({ to: "/admin/dashboard" });
  },
  validateSearch: filterAudit,
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => daftarAuditFn({ data: deps }),
  component: Page,
});
const waktu = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Jakarta",
});
const kotak =
  "min-h-11 w-full min-w-0 rounded-lg border border-border bg-surface px-3 text-sm focus-visible:ring-2 focus-visible:ring-primary";
function Page() {
  const data = Route.useLoaderData(),
    filter = Route.useSearch(),
    navigate = Route.useNavigate();
  const [cari, setCari] = useState("");
  const [error, setError] = useState("");
  return (
    <AdminShell
      title="Log aktivitas"
      description="Riwayat perubahan nyata di database. Nilai kontak, password, dan isi data pribadi tidak ditampilkan."
    >
      {error && (
        <p role="alert" className="mb-4 text-sm text-danger">
          {error}
        </p>
      )}
      <form
        className="mb-5 grid gap-3 rounded-xl border border-border bg-surface p-4 sm:grid-cols-2 xl:grid-cols-5"
        key={JSON.stringify(filter)}
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          const kandidat = filterAudit.safeParse({
            ...filter,
            modul: String(f.get("modul")) as typeof filter.modul,
            aksi: String(f.get("aksi")) as typeof filter.aksi,
            pelaku: String(f.get("pelaku")),
            dari: String(f.get("dari")),
            sampai: String(f.get("sampai")),
            halaman: 0,
          });
          if (!kandidat.success) {
            setError(kandidat.error.issues[0].message);
            return;
          }
          setError("");
          void navigate({ search: kandidat.data });
        }}
      >
        <label className="min-w-0 text-sm">
          Modul
          <select name="modul" defaultValue={filter.modul} className={kotak}>
            <option value="">Semua modul</option>
            {MODUL_AUDIT.map((m) => (
              <option key={m} value={m}>
                {LABEL_MODUL[m]}
              </option>
            ))}
          </select>
        </label>
        <label className="min-w-0 text-sm">
          Perubahan
          <select name="aksi" defaultValue={filter.aksi} className={kotak}>
            <option value="">Semua perubahan</option>
            <option value="INSERT">Tambah</option>
            <option value="UPDATE">Ubah</option>
            <option value="DELETE">Hapus</option>
          </select>
        </label>
        <label className="min-w-0 text-sm">
          Cari nama pelaku
          <input
            className={kotak}
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Ketik nama atau username"
          />
        </label>
        <label className="min-w-0 text-sm">
          Pelaku
          <select name="pelaku" defaultValue={filter.pelaku} className={kotak}>
            <option value="">Semua pelaku</option>
            {data.pelaku
              .filter(
                (p) => p.id === filter.pelaku || p.nama.toLowerCase().includes(cari.toLowerCase()),
              )
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nama}
                </option>
              ))}
          </select>
        </label>
        <label className="min-w-0 text-sm">
          Dari tanggal (WIB)
          <input type="date" name="dari" defaultValue={filter.dari} className={kotak} />
        </label>
        <label className="min-w-0 text-sm">
          Sampai tanggal (WIB)
          <input
            type="date"
            name="sampai"
            defaultValue={filter.sampai}
            min={filter.dari || undefined}
            className={kotak}
          />
        </label>
        <button
          className={`${kotak} bg-primary font-semibold text-primary-foreground`}
          type="submit"
        >
          Terapkan filter
        </button>
        <button
          className={kotak}
          type="button"
          onClick={() => {
            setCari("");
            void navigate({ search: filterAudit.parse({}) });
          }}
        >
          Reset filter
        </button>
      </form>
      <p className="mb-3 text-sm text-ink-muted" role="status">
        {data.jumlah} aktivitas · halaman {filter.halaman + 1} · waktu WIB
      </p>
      {data.baris.length === 0 ? (
        <p className="rounded-xl border border-border bg-surface p-6">
          Belum ada aktivitas yang cocok.
        </p>
      ) : (
        <ol className="divide-y divide-border rounded-xl border border-border bg-surface">
          {data.baris.map((r) => (
            <li
              key={r.id}
              className="grid min-w-0 gap-2 p-4 text-sm lg:grid-cols-[155px_180px_1fr]"
            >
              <time dateTime={r.waktu} className="text-ink-muted">
                {waktu.format(new Date(r.waktu))}
              </time>
              <span className="break-words font-semibold">{r.pelaku}</span>
              <div className="min-w-0">
                <p>{r.ringkasan}</p>
                <p className="mt-1 break-words text-xs text-ink-muted">
                  {LABEL_MODUL[r.modul] ?? r.modul} ·{" "}
                  {
                    (
                      { INSERT: "Tambah", UPDATE: "Ubah", DELETE: "Hapus" } as Record<
                        string,
                        string
                      >
                    )[r.aksi]
                  }
                  {r.sasaran ? ` · ${r.sasaran}` : ""} · #{r.id}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
      <div className="mt-4 flex gap-3">
        <button
          className={kotak + " max-w-40"}
          disabled={filter.halaman === 0}
          onClick={() => void navigate({ search: { ...filter, halaman: filter.halaman - 1 } })}
        >
          Sebelumnya
        </button>
        <button
          className={kotak + " max-w-40"}
          disabled={(filter.halaman + 1) * 25 >= data.jumlah}
          onClick={() => void navigate({ search: { ...filter, halaman: filter.halaman + 1 } })}
        >
          Berikutnya
        </button>
      </div>
    </AdminShell>
  );
}
