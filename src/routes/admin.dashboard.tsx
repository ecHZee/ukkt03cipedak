import { ruangGaleriFn } from "@/services/galeri-admin.functions";
import { ruangBeritaFn } from "@/services/berita-admin.functions";
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { ruangKegiatanFn, penyimpananAdminFn } from "@/services/kegiatan-admin.functions";
import { ambilKegiatan, pilihKegiatanTerdekat } from "@/services/konten";
import { hitungPengurusAktif } from "@/services/organisasi";
import { STATUS_KEGIATAN } from "@/lib/kegiatan-admin";
import { useAkun } from "@/hooks/use-akun";

export const Route = createFileRoute("/admin/dashboard")({
  staleTime: 0,
  gcTime: 0,
  shouldReload: true,
  loader: async () => {
    const [ruang, pengurusAktif, kegiatanPublik, berita, galeri] = await Promise.all([
      ruangKegiatanFn(),
      hitungPengurusAktif(),
      ambilKegiatan(),
      ruangBeritaFn(),
      ruangGaleriFn({ data: {} }),
    ]);
    return { ruang, pengurusAktif, kegiatanPublik, berita, galeri };
  },
  component: Page,
});

function Page() {
  const { ruang, pengurusAktif, kegiatanPublik, berita, galeri } = Route.useLoaderData();
  const akun = useAkun();
  const tugas = [
    ...ruang.kegiatan.map((k) => ({ ...k, jenis: "kegiatan" as const })),
    ...berita.berita.map((b) => ({ ...b, jenis: "berita" as const })),
    ...galeri.album.map((a) => ({ ...a, jenis: "album" as const })),
  ]
    .filter((k) => k.status === "review" || k.status === "draft")
    .sort(
      (a, b) =>
        Number(b.status === "review") - Number(a.status === "review") ||
        b.updated_at.localeCompare(a.updated_at),
    );
  const terdekat = pilihKegiatanTerdekat(
    kegiatanPublik.filter((k) => k.tahap !== "batal" && k.tahap !== "selesai"),
    4,
  ).items;
  return (
    <AdminShell
      title="Ringkasan"
      description={`Halo, ${akun.nama}. ${akun.lintasBidang ? "Kamu mengelola berita, kegiatan dan album semua bidang." : akun.bolehKontribusi ? `Berita, kegiatan dan album yang bisa kamu kelola ada di sini${akun.bidangNama ? `, untuk ${akun.bidangNama}` : ""}.` : "Lihat agenda organisasi dan kelola profilmu di sini."}`}
      actions={
        akun.bolehKontribusi ? (
          <Button asChild>
            <Link to="/admin/kegiatan" search={{ tambah: true }}>
              Tambah kegiatan
            </Link>
          </Button>
        ) : undefined
      }
    >
      {akun.bolehKontribusi && (
        <section aria-labelledby="judul-ringkasan-kegiatan" className="mb-6">
          <h2 id="judul-ringkasan-kegiatan" className="mb-3 font-heading text-lg font-semibold">
            Kegiatan dalam jangkauanmu
          </h2>
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {Object.entries(STATUS_KEGIATAN).map(([status, label]) => (
              <div key={status} className="rounded-xl border border-border bg-surface p-5">
                <dt className="text-sm text-ink-muted">{label}</dt>
                <dd className="mt-2 font-heading text-3xl font-bold tabular-nums">
                  {ruang.kegiatan.filter((k) => k.status === status).length}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}
      <div className="grid items-start gap-5 xl:grid-cols-[1.4fr_1fr]">
        <section
          className="rounded-xl border border-border bg-surface p-4 sm:p-6"
          aria-labelledby="judul-tugas"
        >
          <h2 id="judul-tugas" className="font-heading text-lg font-semibold">
            {akun.admin ? "Perlu ditinjau atau dilanjutkan" : "Draf dan pengajuanmu"}
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            {akun.admin
              ? "Pengajuan menunggu persetujuan didahulukan, lalu draf yang belum terbit."
              : akun.bolehKontribusi
                ? "Kabid/BPH menerbitkan berita, kegiatan dan album setelah memeriksa pengajuanmu."
                : "Izin kontribusi belum aktif. Hubungi Kabid atau BPH untuk mengajukan kegiatan."}
          </p>
          {tugas.length ? (
            <>
              <ul className="mt-4 divide-y divide-border">
                {tugas.slice(0, 8).map((k) => (
                  <li key={k.id} className="py-3">
                    <p className="text-sm text-ink-muted">
                      {k.jenis === "album" ? "Album" : k.jenis === "berita" ? "Berita" : "Kegiatan"}{" "}
                      · {STATUS_KEGIATAN[k.status]} ·{" "}
                      {ruang.bidang.find((b) => b.id === k.bidang_id)?.nama_singkat ?? "Umum"}
                    </p>
                    <Link
                      to={
                        k.jenis === "album"
                          ? "/admin/galeri"
                          : k.jenis === "berita"
                            ? "/admin/berita"
                            : "/admin/kegiatan"
                      }
                      search={{ sunting: k.id }}
                      className="inline-flex min-h-11 items-center break-words text-sm font-semibold text-primary underline underline-offset-4"
                    >
                      {k.judul}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                to="/admin/kegiatan"
                className="mt-3 inline-flex min-h-11 items-center text-sm text-primary underline"
              >
                Lihat semua kegiatan ({ruang.kegiatan.length})
              </Link>
              <Link
                to="/admin/berita"
                className="ml-4 inline-flex min-h-11 items-center text-sm text-primary underline"
              >
                Lihat semua berita ({berita.berita.length})
              </Link>
              <Link
                to="/admin/galeri"
                className="ml-4 inline-flex min-h-11 items-center text-sm text-primary underline"
              >
                Lihat semua album ({galeri.album.length})
              </Link>
            </>
          ) : (
            akun.bolehKontribusi && (
              <p className="mt-4 text-sm text-ink-muted">
                Tidak ada draf atau pengajuan berita/kegiatan/album yang menunggu.
              </p>
            )
          )}
        </section>
        <section
          className="rounded-xl border border-border bg-surface p-4 sm:p-6"
          aria-labelledby="judul-agenda"
        >
          <h2 id="judul-agenda" className="font-heading text-lg font-semibold">
            Agenda organisasi
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            {pengurusAktif} pengurus aktif · {kegiatanPublik.length} kegiatan terbit
          </p>
          {terdekat.length ? (
            <ul className="mt-4 divide-y divide-border">
              {terdekat.map((k) => (
                <li key={k.id} className="py-3">
                  <Link
                    to="/kegiatan/$slug"
                    params={{ slug: k.slug }}
                    className="inline-flex min-h-11 items-center break-words text-sm font-semibold text-primary underline underline-offset-4"
                  >
                    {k.judul}
                  </Link>
                  <p className="mt-1 text-sm text-ink-muted">
                    {[k.jadwal, k.lokasi].filter(Boolean).join(" · ")}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-ink-muted">Belum ada agenda terbit.</p>
          )}
        </section>
      </div>
      <div className="mt-5 grid items-start gap-5 xl:grid-cols-2">
        <section
          className="rounded-xl border border-border bg-surface p-4 sm:p-6"
          aria-labelledby="judul-akses-cepat"
        >
          <h2 id="judul-akses-cepat" className="font-heading text-lg font-semibold">
            Akses cepat
          </h2>
          <div className="mt-3 flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link to="/admin/profil">Profil saya</Link>
            </Button>
            {akun.bolehKontribusi && (
              <Button asChild variant="outline">
                <Link to="/admin/kegiatan">Kelola kegiatan</Link>
              </Button>
            )}
            {akun.admin && (
              <Button asChild variant="outline">
                <Link to="/admin/anggota">Pengurus dan izin kontribusi</Link>
              </Button>
            )}
            {akun.role === "super_admin" && (
              <Button asChild variant="outline">
                <Link to="/admin/users">Kelola akun</Link>
              </Button>
            )}
          </div>
        </section>
        {akun.lintasBidang && <Penyimpanan />}
      </div>
    </AdminShell>
  );
}

function Penyimpanan() {
  const [data, setData] = useState<Awaited<ReturnType<typeof penyimpananAdminFn>> | null>(null);
  const [sibuk, setSibuk] = useState(false);
  const [galat, setGalat] = useState("");
  async function periksa() {
    setSibuk(true);
    setGalat("");
    try {
      setData(await penyimpananAdminFn());
    } catch {
      setGalat("Pemakaian belum bisa diperiksa. Coba lagi nanti.");
    } finally {
      setSibuk(false);
    }
  }
  return (
    <section
      className="rounded-xl border border-border bg-surface p-4 sm:p-6"
      aria-labelledby="judul-penyimpanan"
    >
      <h2 id="judul-penyimpanan" className="font-heading text-lg font-semibold">
        Penyimpanan Supabase
      </h2>
      <p className="mt-2 text-sm text-ink-muted">
        Hitungan ini hanya mencakup berkas di Supabase. Pemakaian galeri di Backblaze B2 diperiksa
        terpisah melalui dashboard Backblaze.
      </p>
      <div className="mt-3" role="status">
        {data?.tersedia ? (
          <>
            <p className="text-lg font-semibold tabular-nums">
              {data.berkas} berkas ·{" "}
              {new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(
                data.bytes! / 1024 / 1024,
              )}{" "}
              MB
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              Diperiksa{" "}
              {new Date(data.diperiksa).toLocaleString("id-ID", {
                timeZone: "Asia/Jakarta",
                dateStyle: "medium",
                timeStyle: "short",
              })}{" "}
              WIB. Tidak termasuk database, cadangan, atau berkas B2.
            </p>
          </>
        ) : (
          <p className="text-sm text-ink-muted">
            {data
              ? "Hitungan lengkap belum tersedia. Coba periksa lagi nanti."
              : "Belum diperiksa pada kunjungan ini."}
          </p>
        )}
      </div>
      {galat && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {galat}
        </p>
      )}
      <Button type="button" variant="outline" className="mt-4" onClick={periksa} disabled={sibuk}>
        {sibuk ? "Memeriksa…" : "Periksa pemakaian"}
      </Button>
    </section>
  );
}
