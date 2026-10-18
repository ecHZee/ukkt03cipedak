import { useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { FormKegiatan, kelasIsian } from "@/components/admin/FormKegiatan";
import { Button } from "@/components/ui/button";
import { ruangKegiatanFn } from "@/services/kegiatan-admin.functions";
import { STATUS_KEGIATAN, TAHAP_KEGIATAN } from "@/lib/kegiatan-admin";

export const Route = createFileRoute("/admin/kegiatan")({
  validateSearch: (s: Record<string, unknown>): { sunting?: string; tambah?: boolean } => ({
    sunting:
      typeof s.sunting === "string" && /^[0-9a-f-]{36}$/i.test(s.sunting) ? s.sunting : undefined,
    tambah: s.tambah === true || s.tambah === "true" || undefined,
  }),
  staleTime: 0,
  gcTime: 0,
  shouldReload: true,
  loader: () => ruangKegiatanFn(),
  component: Page,
});

function Page() {
  const ruang = Route.useLoaderData();
  const { sunting, tambah } = Route.useSearch();
  const navigate = Route.useNavigate();
  const router = useRouter();
  const [status, setStatus] = useState("semua");
  const [tahap, setTahap] = useState("semua");
  const [bidang, setBidang] = useState("semua");
  const [cari, setCari] = useState("");
  const [berhasil, setBerhasil] = useState<{
    slug: string;
    status: keyof typeof STATUS_KEGIATAN;
  } | null>(null);
  const aktif = ruang.kegiatan.find((k) => k.id === sunting);
  const daftar = ruang.kegiatan.filter(
    (k) =>
      (status === "semua" || k.status === status) &&
      (tahap === "semua" || k.tahap === tahap) &&
      (bidang === "semua" || (k.bidang_id ?? "umum") === bidang) &&
      k.judul.toLocaleLowerCase("id-ID").includes(cari.trim().toLocaleLowerCase("id-ID")),
  );
  const daftarSaja = () => navigate({ search: {} });
  return (
    <AdminShell
      title="Kegiatan"
      description="Kelola draf, persetujuan, dan kegiatan terbit sesuai hak aksesmu."
      actions={
        !tambah && !sunting && ruang.akses.bolehKontribusi ? (
          <Button asChild>
            <Link to="/admin/kegiatan" search={{ tambah: true }}>
              Tambah kegiatan
            </Link>
          </Button>
        ) : undefined
      }
    >
      {!ruang.akses.bolehKontribusi ? (
        <p className="rounded-xl border border-border bg-surface p-5">
          Izin kontribusimu belum aktif. Hubungi Kabid atau BPH untuk mengajukan kegiatan.
        </p>
      ) : tambah || sunting ? (
        !tambah && !aktif ? (
          <div role="alert">
            <p>Kegiatan tidak tersedia atau di luar hak aksesmu.</p>
            <Button onClick={daftarSaja} className="mt-4">
              Kembali ke daftar
            </Button>
          </div>
        ) : (
          <FormKegiatan
            key={aktif?.id ?? "baru"}
            ruang={ruang}
            kegiatan={aktif}
            batal={daftarSaja}
            selesai={async (hasil) => {
              await router.invalidate();
              setBerhasil(hasil);
              await daftarSaja();
            }}
          />
        )
      ) : (
        <>
          {berhasil && (
            <p
              role="status"
              className="mb-5 rounded-lg border border-border bg-surface p-4 text-sm"
            >
              Kegiatan berhasil disimpan: {STATUS_KEGIATAN[berhasil.status]}.
              {berhasil.status === "terbit" && (
                <>
                  {" "}
                  <Link
                    to="/kegiatan/$slug"
                    params={{ slug: berhasil.slug }}
                    className="inline-flex min-h-11 items-center text-primary underline"
                  >
                    Lihat kegiatan publik
                  </Link>
                </>
              )}
            </p>
          )}
          <div className="mb-5 grid gap-4 rounded-xl border border-border bg-surface p-4 sm:grid-cols-2 xl:grid-cols-4">
            <label className="text-sm font-semibold">
              Cari judul
              <input
                className={`${kelasIsian} mt-1.5 font-normal`}
                value={cari}
                onChange={(e) => setCari(e.target.value)}
                type="search"
              />
            </label>
            <label className="text-sm font-semibold">
              Status publikasi
              <select
                className={`${kelasIsian} mt-1.5 font-normal`}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="semua">Semua status</option>
                {Object.entries(STATUS_KEGIATAN).map(([s, label]) => (
                  <option key={s} value={s}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold">
              Tahap pelaksanaan
              <select
                className={`${kelasIsian} mt-1.5 font-normal`}
                value={tahap}
                onChange={(e) => setTahap(e.target.value)}
              >
                <option value="semua">Semua tahap</option>
                {Object.entries(TAHAP_KEGIATAN).map(([s, label]) => (
                  <option key={s} value={s}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold">
              Bidang
              <select
                className={`${kelasIsian} mt-1.5 font-normal`}
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
          <p className="mb-3 text-sm text-ink-muted" role="status">
            {daftar.length} kegiatan dalam jangkauanmu
          </p>
          {daftar.length === 0 ? (
            <div className="rounded-xl border border-border bg-surface p-6">
              <h2 className="font-heading font-semibold">Belum ada kegiatan yang cocok</h2>
              <p className="mt-2 text-sm text-ink-muted">
                Coba ubah filter, atau buat kegiatan baru untuk disimpan sebagai draf.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {daftar.map((k) => (
                <li key={k.id} className="rounded-xl border border-border bg-surface p-4 sm:p-5">
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-ink-muted">
                    <span
                      className={
                        k.status === "terbit"
                          ? "font-semibold text-primary"
                          : "font-semibold text-ink"
                      }
                    >
                      {STATUS_KEGIATAN[k.status]}
                    </span>
                    <span>{TAHAP_KEGIATAN[k.tahap]}</span>
                    <span>
                      {ruang.bidang.find((b) => b.id === k.bidang_id)?.nama_singkat ?? "Umum"}
                    </span>
                    {k.is_dummy && <span>Data contoh</span>}
                  </div>
                  <h2 className="mt-2 break-words font-heading text-lg font-semibold">
                    <Link
                      to="/admin/kegiatan"
                      search={{ sunting: k.id }}
                      className="inline-flex min-h-11 items-center text-primary underline underline-offset-4"
                    >
                      {k.judul}
                    </Link>
                  </h2>
                  {k.ringkasan && (
                    <p className="mt-1 line-clamp-2 break-words text-sm text-ink-muted">
                      {k.ringkasan}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-ink-muted">
                    {k.mulai
                      ? new Date(k.mulai).toLocaleString("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short",
                          timeZone: "Asia/Jakarta",
                        }) + " WIB"
                      : k.rutin || "Jadwal belum diisi"}
                    {k.lokasi ? ` · ${k.lokasi}` : ""}
                  </p>
                  {k.mulai && k.rutin && (
                    <p className="mt-1 text-sm text-ink-muted">Rutin: {k.rutin}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </AdminShell>
  );
}
