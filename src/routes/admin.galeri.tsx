import { useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { FormAlbum } from "@/components/admin/FormAlbum";
import { kelasIsian } from "@/components/admin/FormKegiatan";
import { ruangGaleriFn } from "@/services/galeri-admin.functions";
import { STATUS_ALBUM } from "@/lib/galeri-admin";
export const Route = createFileRoute("/admin/galeri")({
  validateSearch: (s: Record<string, unknown>): { sunting?: string; tambah?: boolean } => ({
    sunting:
      typeof s.sunting === "string" && /^[0-9a-f-]{36}$/i.test(s.sunting) ? s.sunting : undefined,
    tambah: s.tambah === true || s.tambah === "true" || undefined,
  }),
  loaderDeps: ({ search }) => ({ albumId: search.sunting }),
  staleTime: 0,
  gcTime: 0,
  shouldReload: true,
  loader: ({ deps }) => ruangGaleriFn({ data: deps }),
  component: Page,
});
function Page() {
  const ruang = Route.useLoaderData(),
    { sunting, tambah } = Route.useSearch(),
    navigate = Route.useNavigate(),
    router = useRouter();
  const [serial, setSerial] = useState(0);
  const [cari, setCari] = useState(""),
    [status, setStatus] = useState("semua"),
    [bidang, setBidang] = useState("semua");
  const aktif = ruang.album.find((a) => a.id === sunting);
  const daftar = ruang.album.filter(
    (a) =>
      a.judul.toLocaleLowerCase("id-ID").includes(cari.trim().toLocaleLowerCase("id-ID")) &&
      (status === "semua" || status === a.status) &&
      (bidang === "semua" || bidang === (a.bidang_id ?? "umum")),
  );
  return (
    <AdminShell
      title="Galeri"
      description="Susun album, unggah dokumentasi sekaligus, lalu ajukan atau terbitkan sesuai hak aksesmu."
      actions={
        !tambah && !sunting && ruang.akses.bolehKontribusi ? (
          <Button asChild>
            <Link to="/admin/galeri" search={{ tambah: true }}>
              Album baru
            </Link>
          </Button>
        ) : undefined
      }
    >
      {!ruang.akses.bolehKontribusi ? (
        <p className="rounded-xl border bg-surface p-5">
          Izin kontribusimu belum aktif. Hubungi Kabid atau BPH.
        </p>
      ) : tambah || sunting ? (
        !tambah && !aktif ? (
          <p role="alert">Album tidak tersedia atau di luar hak aksesmu.</p>
        ) : (
          <FormAlbum
            key={`${aktif?.id ?? "baru"}:${serial}`}
            ruang={ruang}
            album={aktif}
            batal={() => void navigate({ search: {} })}
            muatUlang={async () => {
              await router.invalidate();
            }}
            selesai={async (a) => {
              await navigate({ search: { sunting: a.id } });
              await router.invalidate();
              setSerial((n) => n + 1);
            }}
          />
        )
      ) : (
        <>
          <div className="mb-5 grid gap-4 rounded-xl border bg-surface p-4 sm:grid-cols-3">
            <label className="text-sm font-semibold">
              Cari judul
              <input
                className={`${kelasIsian} mt-2`}
                type="search"
                value={cari}
                onChange={(e) => setCari(e.target.value)}
              />
            </label>
            <label className="text-sm font-semibold">
              Status publikasi
              <select
                className={`${kelasIsian} mt-2`}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="semua">Semua status</option>
                {Object.entries(STATUS_ALBUM).map(([s, l]) => (
                  <option key={s} value={s}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold">
              Bidang
              <select
                className={`${kelasIsian} mt-2`}
                value={bidang}
                onChange={(e) => setBidang(e.target.value)}
              >
                <option value="semua">Semua bidang</option>
                <option value="umum">Umum</option>
                {ruang.bidang.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nama_singkat}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="mb-4 text-sm text-ink-muted">{daftar.length} album sesuai filter</p>
          <div className="space-y-3">
            {daftar.map((a) => (
              <article
                key={a.id}
                className="flex min-w-0 flex-col gap-4 rounded-xl border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="text-sm text-ink-muted">
                    {STATUS_ALBUM[a.status]} ·{" "}
                    {ruang.bidang.find((b) => b.id === a.bidang_id)?.nama_singkat ?? "Umum"}
                    {a.tanggal ? ` · ${a.tanggal}` : ""}
                  </p>
                  <h2 className="mt-1 break-words font-heading text-lg font-semibold">{a.judul}</h2>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Button variant="outline" asChild>
                    <Link to="/admin/galeri" search={{ sunting: a.id }}>
                      Sunting<span className="sr-only"> {a.judul}</span>
                    </Link>
                  </Button>
                  {a.status === "terbit" && (
                    <Button asChild variant="outline">
                      <Link to="/galeri/$album" params={{ album: a.slug }}>
                        Lihat publik
                      </Link>
                    </Button>
                  )}
                </div>
              </article>
            ))}
            {!daftar.length && (
              <p className="rounded-xl border bg-surface p-5">Belum ada album sesuai filter.</p>
            )}
          </div>
        </>
      )}
    </AdminShell>
  );
}
