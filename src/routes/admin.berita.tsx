import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { FormBerita } from "@/components/admin/FormBerita";
import { kelasIsian } from "@/components/admin/FormKegiatan";
import { Button } from "@/components/ui/button";
import { ruangBeritaFn, simpanBeritaFn, hapusBeritaFn } from "@/services/berita-admin.functions";
import { STATUS_BERITA, bolehTerbitBerita, type BeritaAdmin } from "@/lib/berita-admin";

export const Route = createFileRoute("/admin/berita")({
  validateSearch: (s: Record<string, unknown>): { sunting?: string; tambah?: boolean } => ({
    sunting:
      typeof s.sunting === "string" && /^[0-9a-f-]{36}$/i.test(s.sunting) ? s.sunting : undefined,
    tambah: s.tambah === true || s.tambah === "true" || undefined,
  }),
  staleTime: 0,
  gcTime: 0,
  shouldReload: true,
  loader: () => ruangBeritaFn(),
  component: Page,
});
function Page() {
  const ruang = Route.useLoaderData(),
    { sunting, tambah } = Route.useSearch(),
    navigate = Route.useNavigate(),
    router = useRouter();
  const [status, setStatus] = useState("semua"),
    [cari, setCari] = useState(""),
    [bidang, setBidang] = useState("semua"),
    [pesan, setPesan] = useState(""),
    [galat, setGalat] = useState(""),
    [sibuk, setSibuk] = useState(false);
  const [konfirmasi, setKonfirmasi] = useState<{
    berita: BeritaAdmin;
    aksi: "draft" | "terbit" | "hapus";
  } | null>(null);
  const aktif = ruang.berita.find((b) => b.id === sunting);
  const daftar = ruang.berita.filter(
    (b) =>
      (status === "semua" || status === b.status) &&
      (bidang === "semua" || bidang === (b.bidang_id ?? "umum")) &&
      b.judul.toLocaleLowerCase("id-ID").includes(cari.trim().toLocaleLowerCase("id-ID")),
  );
  const daftarSaja = () => navigate({ search: {} });
  async function hapus(b: BeritaAdmin) {
    if (sibuk) return;
    setSibuk(true);
    setGalat("");
    setPesan("");
    try {
      await hapusBeritaFn({ data: { id: b.id, versi: b.updated_at } });
      await router.invalidate();
      setPesan("Berita dihapus. Gambar tetap tersimpan di pustaka media.");
    } catch (e) {
      setGalat(e instanceof Error ? e.message : "Gagal menghapus berita. Coba lagi.");
    } finally {
      setSibuk(false);
    }
  }
  async function putuskan(b: BeritaAdmin, status: "draft" | "terbit") {
    if (sibuk) return;
    setSibuk(true);
    setGalat("");
    setPesan("");
    try {
      await simpanBeritaFn({
        data: {
          id: b.id,
          versi: b.updated_at,
          judul: b.judul,
          slug: b.slug,
          ringkasan: b.ringkasan ?? "",
          isi: b.isi ?? "",
          bidang_id: b.bidang_id,
          pinned: b.pinned,
          status,
          cover_id: b.cover_id,
        },
      });
      await router.invalidate();
      setPesan(
        status === "terbit"
          ? "Berita disetujui dan diterbitkan."
          : "Pengajuan dikembalikan ke draf.",
      );
    } catch (e) {
      setGalat(e instanceof Error ? e.message : "Gagal menyimpan keputusan. Coba lagi.");
    } finally {
      setSibuk(false);
    }
  }
  return (
    <AdminShell
      title="Berita"
      description="Tulis berita, periksa pratinjau, lalu ajukan review atau terbitkan sesuai hak aksesmu."
      actions={
        !tambah && !sunting && ruang.akses.bolehKontribusi ? (
          <Button asChild>
            <Link to="/admin/berita" search={{ tambah: true }}>
              Tulis berita
            </Link>
          </Button>
        ) : undefined
      }
    >
      <AlertDialog
        open={!!konfirmasi}
        onOpenChange={(open) => {
          if (!open) setKonfirmasi(null);
        }}
      >
        <AlertDialogContent data-admin-dialog className="max-w-[calc(100%-2rem)] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {konfirmasi?.aksi === "hapus"
                ? "Hapus berita?"
                : konfirmasi?.aksi === "terbit"
                  ? "Setujui dan terbitkan?"
                  : "Kembalikan ke draf?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {konfirmasi?.aksi === "hapus"
                ? "Teks berita akan dihapus permanen. Gambar tetap di pustaka media agar konten lain tidak rusak."
                : konfirmasi?.aksi === "terbit"
                  ? "Berita akan langsung dapat dibaca pengunjung website."
                  : "Pengajuan dikembalikan ke draf agar penulis bisa memperbaikinya."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (konfirmasi) {
                  if (konfirmasi.aksi === "hapus") void hapus(konfirmasi.berita);
                  else void putuskan(konfirmasi.berita, konfirmasi.aksi);
                }
              }}
            >
              {konfirmasi?.aksi === "hapus"
                ? "Hapus berita"
                : konfirmasi?.aksi === "terbit"
                  ? "Setujui dan terbitkan"
                  : "Kembalikan ke draf"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {!ruang.akses.bolehKontribusi ? (
        <p className="rounded-xl border bg-surface p-5">
          Izin kontribusimu belum aktif. Hubungi Kabid atau BPH.
        </p>
      ) : tambah || sunting ? (
        !tambah && !aktif ? (
          <div role="alert">
            Berita tidak tersedia atau di luar hak aksesmu.
            <Button onClick={daftarSaja}>Kembali ke daftar</Button>
          </div>
        ) : (
          <FormBerita
            key={aktif?.id ?? "baru"}
            ruang={ruang}
            berita={aktif}
            batal={daftarSaja}
            selesai={async (hasil) => {
              await router.invalidate();
              setPesan(`Berita berhasil disimpan: ${STATUS_BERITA[hasil.status]}.`);
              await daftarSaja();
            }}
          />
        )
      ) : (
        <>
          {pesan && (
            <p role="status" className="mb-5 rounded-lg border bg-surface p-4 text-sm">
              {pesan}
            </p>
          )}
          {galat && (
            <p
              role="alert"
              className="mb-5 rounded-lg border border-destructive p-4 text-sm text-destructive"
            >
              {galat}
            </p>
          )}
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
                {Object.entries(STATUS_BERITA).map(([s, l]) => (
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
          <p className="mb-4 text-sm text-ink-muted">{daftar.length} berita sesuai filter</p>
          <div className="space-y-3">
            {daftar.map((b) => (
              <article
                key={b.id}
                className="flex min-w-0 flex-col gap-4 rounded-xl border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="text-sm text-ink-muted">
                    {STATUS_BERITA[b.status]} ·{" "}
                    {ruang.bidang.find((n) => n.id === b.bidang_id)?.nama_singkat ?? "Umum"}
                    {b.pinned ? " · Berita utama" : ""}
                  </p>
                  <h2 className="mt-1 break-words font-heading text-lg font-semibold">{b.judul}</h2>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Button asChild variant="outline">
                    <Link to="/admin/berita" search={{ sunting: b.id }}>
                      Sunting<span className="sr-only"> {b.judul}</span>
                    </Link>
                  </Button>
                  {b.status === "terbit" && (
                    <Button asChild variant="outline">
                      <Link to="/berita/$slug" params={{ slug: b.slug }}>
                        Lihat publik
                      </Link>
                    </Button>
                  )}
                  {b.status !== "terbit" && (
                    <Button
                      variant="outline"
                      disabled={sibuk}
                      onClick={() => setKonfirmasi({ berita: b, aksi: "hapus" })}
                    >
                      Hapus<span className="sr-only"> {b.judul}</span>
                    </Button>
                  )}
                  {b.status === "review" && bolehTerbitBerita(ruang.akses, b) && (
                    <>
                      <Button
                        disabled={sibuk}
                        onClick={() => setKonfirmasi({ berita: b, aksi: "terbit" })}
                      >
                        Setujui
                      </Button>
                      <Button
                        disabled={sibuk}
                        variant="outline"
                        onClick={() => setKonfirmasi({ berita: b, aksi: "draft" })}
                      >
                        Tolak
                      </Button>
                    </>
                  )}
                </div>
              </article>
            ))}
            {!daftar.length && (
              <p className="rounded-xl border bg-surface p-5">Belum ada berita sesuai filter.</p>
            )}
          </div>
        </>
      )}
    </AdminShell>
  );
}
