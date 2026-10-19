import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { kelasIsian } from "./FormKegiatan";
import { AntreanGaleri } from "./AntreanGaleri";
import { PeringatanIsian } from "./PeringatanIsian";
import { useIsianBelumDisimpan } from "@/hooks/use-isian-belum-disimpan";
import {
  formulirAlbum,
  slugAlbum,
  bolehTerbitAlbum,
  STATUS_ALBUM,
  type AlbumAdmin,
  type MediaAdmin,
  type AksiMediaAlbum,
} from "@/lib/galeri-admin";
import {
  simpanAlbumFn,
  aturMediaAlbumFn,
  pratinjauMediaFn,
  ruangGaleriFn,
} from "@/services/galeri-admin.functions";
import { urlPublik } from "@/services/storage";
type Ruang = Awaited<ReturnType<typeof ruangGaleriFn>>;
export function FormAlbum({
  ruang,
  album,
  batal,
  selesai,
  muatUlang,
}: {
  ruang: Ruang;
  album?: AlbumAdmin;
  batal: () => void;
  selesai: (a: AlbumAdmin) => Promise<void>;
  muatUlang: () => Promise<void>;
}) {
  const awal = useMemo(
    () => ({
      id: album?.id,
      versi: album?.updated_at,
      judul: album?.judul ?? "",
      slug: album?.slug ?? "",
      deskripsi: album?.deskripsi ?? "",
      bidang_id: album ? album.bidang_id : ruang.akses.bidangId,
      tanggal: album?.tanggal ?? null,
      status: album?.status ?? ("draft" as "draft" | "review" | "terbit"),
      gdrive_url: album?.gdrive_url ?? "",
    }),
    [album, ruang.akses.bidangId],
  );
  const [baseline, setBaseline] = useState(awal),
    [form, setForm] = useState(awal),
    [sibuk, setSibuk] = useState(false),
    [antrean, setAntrean] = useState(false),
    [galat, setGalat] = useState(""),
    [pesan, setPesan] = useState("");
  const [caption, setCaption] = useState<MediaAdmin | null>(null),
    [konfirmasi, setKonfirmasi] = useState<AksiMediaAlbum | null>(null),
    [link, setLink] = useState(""),
    [teksLink, setTeksLink] = useState("");
  const berubah = JSON.stringify(form) !== JSON.stringify(baseline),
    { penjagaan, tandaiTersimpan } = useIsianBelumDisimpan(berubah || !!link || !!teksLink);
  useEffect(() => {
    if (!berubah && awal.versi !== baseline.versi) {
      setForm(awal);
      setBaseline(awal);
    }
  }, [awal, baseline.versi, berubah]);
  const onAntrean = useCallback((b: boolean) => setAntrean(b), []);
  const bidang = ruang.bidang.filter((b) => !ruang.akses.bidangId || b.id === ruang.akses.bidangId);
  const terbit = bolehTerbitAlbum(ruang.akses, {
    bidang_id: form.bidang_id,
    created_by: album?.created_by ?? ruang.akses.id,
  });
  async function simpan() {
    setGalat("");
    const p = formulirAlbum.safeParse(form);
    if (!p.success) {
      setGalat(p.error.issues[0].message);
      return;
    }
    setSibuk(true);
    try {
      const a = await simpanAlbumFn({ data: p.data });
      tandaiTersimpan();
      setBaseline({ ...form, id: a.id, versi: a.updated_at });
      setForm({ ...form, id: a.id, versi: a.updated_at });
      await selesai(a);
    } catch (e) {
      setGalat(e instanceof Error ? e.message : "Album gagal disimpan.");
    } finally {
      setSibuk(false);
    }
  }
  async function aksi(d: AksiMediaAlbum) {
    setSibuk(true);
    setGalat("");
    try {
      const hasil = await aturMediaAlbumFn({ data: d });
      setPesan(hasil.peringatan ?? "Perubahan tersimpan.");
      if (d.aksi === "hapus_album") {
        tandaiTersimpan();
        batal();
      } else {
        setLink("");
        setTeksLink("");
        await muatUlang();
      }
      return true;
    } catch (e) {
      setGalat(e instanceof Error ? e.message : "Perubahan gagal.");
      await muatUlang();
      return false;
    } finally {
      setSibuk(false);
    }
  }
  const dataAksi = (aksi: AksiMediaAlbum["aksi"], media_id?: string): AksiMediaAlbum => ({
    album_id: album!.id,
    versi: album!.updated_at,
    aksi,
    media_id,
  });
  const kunci = sibuk || antrean || berubah;
  return (
    <div className="space-y-6">
      <PeringatanIsian penjagaan={penjagaan} />
      <Button variant="outline" onClick={batal}>
        ← Daftar album
      </Button>
      {pesan && (
        <p role="status" className="rounded-lg border bg-surface p-4 text-sm">
          {pesan}
        </p>
      )}
      {galat && (
        <p
          role="alert"
          className="rounded-lg border border-destructive p-4 text-sm text-destructive"
        >
          {galat}
        </p>
      )}
      <form
        className="space-y-4 rounded-xl border bg-surface p-4 sm:p-6"
        onSubmit={(e) => {
          e.preventDefault();
          void simpan();
        }}
      >
        <h2 className="font-heading text-xl font-semibold">
          {album ? "Sunting album" : "Album baru"}
        </h2>
        <p className="text-sm text-ink-muted">
          Simpan draf dahulu, lalu unggah dokumentasi. Periksa izin publikasi foto dan akses folder
          Drive sebelum review/terbit.
        </p>
        <fieldset disabled={sibuk || antrean} className="grid min-w-0 gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold sm:col-span-2">
            Judul album
            <input
              className={`${kelasIsian} mt-2`}
              value={form.judul}
              required
              maxLength={180}
              onChange={(e) =>
                setForm({
                  ...form,
                  judul: e.target.value,
                  slug:
                    !album && form.slug === slugAlbum(form.judul)
                      ? slugAlbum(e.target.value)
                      : form.slug,
                })
              }
            />
          </label>
          <label className="min-w-0 text-sm font-semibold">
            Alamat album
            <input
              className={`${kelasIsian} mt-2`}
              value={form.slug}
              required
              maxLength={120}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
          </label>
          <label className="text-sm font-semibold">
            Tanggal dokumentasi
            <input
              className={`${kelasIsian} mt-2`}
              type="date"
              value={form.tanggal ?? ""}
              onChange={(e) => setForm({ ...form, tanggal: e.target.value || null })}
            />
          </label>
          <label className="text-sm font-semibold sm:col-span-2">
            Deskripsi
            <textarea
              className={`${kelasIsian} mt-2 min-h-24`}
              value={form.deskripsi}
              maxLength={3000}
              onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
            />
          </label>
          <label className="text-sm font-semibold">
            Bidang
            <select
              className={`${kelasIsian} mt-2`}
              disabled={!!album && (ruang.media.length > 0 || ruang.tertunda > 0)}
              value={form.bidang_id ?? "umum"}
              onChange={(e) =>
                setForm({ ...form, bidang_id: e.target.value === "umum" ? null : e.target.value })
              }
            >
              {ruang.akses.role !== "anggota" && <option value="umum">Umum</option>}
              {bidang.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nama_singkat}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold">
            Status publikasi
            <select
              className={`${kelasIsian} mt-2`}
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as typeof form.status })}
            >
              <option value="draft">Draf</option>
              {album && <option value="review">Menunggu persetujuan</option>}
              {album && terbit && <option value="terbit">Terbit</option>}
            </select>
          </label>
          <label className="min-w-0 text-sm font-semibold sm:col-span-2">
            Tautan folder foto asli di Google Drive
            <input
              className={`${kelasIsian} mt-2`}
              type="url"
              value={form.gdrive_url}
              maxLength={500}
              placeholder="https://drive.google.com/drive/folders/…"
              onChange={(e) => setForm({ ...form, gdrive_url: e.target.value })}
            />
            <span className="mt-2 block font-normal text-ink-muted">
              Opsional. Tautan tampil kepada publik setelah album terbit; izin folder tetap diatur
              pemilik Drive.
            </span>
          </label>
        </fieldset>
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={sibuk || antrean}>
            Simpan {STATUS_ALBUM[form.status].toLowerCase()}
          </Button>
          {album && (
            <span className="self-center text-sm text-ink-muted">
              {ruang.media.length} media · {STATUS_ALBUM[album.status]}
            </span>
          )}
        </div>
      </form>
      {album &&
        (album.status === "terbit" ? (
          <p className="rounded-xl border bg-surface p-5 text-sm">
            Album sudah terbit. Pilih status Draf lalu simpan untuk menarik album dan menyunting
            media.
          </p>
        ) : (
          <>
            {berubah && (
              <p role="status" className="text-sm">
                Simpan perubahan album sebelum mengelola media.
              </p>
            )}
            <AntreanGaleri
              albumId={album.id}
              kunci={sibuk || berubah}
              onSibuk={onAntrean}
              onSelesai={muatUlang}
            />
            <div className="rounded-xl border bg-surface p-4 sm:p-5">
              <h2 className="font-heading text-lg font-semibold">Video dari tautan</h2>
              <form
                className="mt-3 space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  void aksi({ ...dataAksi("embed"), url: link, caption: teksLink });
                }}
              >
                <fieldset disabled={kunci} className="space-y-3">
                  <label className="block text-sm font-semibold">
                    Tautan YouTube, Instagram atau TikTok
                    <input
                      className={`${kelasIsian} mt-2`}
                      type="url"
                      required
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                    />
                  </label>
                  <label className="block text-sm font-semibold">
                    Keterangan video
                    <input
                      className={`${kelasIsian} mt-2`}
                      maxLength={300}
                      value={teksLink}
                      onChange={(e) => setTeksLink(e.target.value)}
                    />
                  </label>
                  <Button type="submit" variant="outline">
                    Tambahkan video
                  </Button>
                </fieldset>
              </form>
            </div>
            <section aria-labelledby="judul-media" className="space-y-4">
              <h2 id="judul-media" className="font-heading text-lg font-semibold">
                Isi album ({ruang.media.length})
              </h2>
              <p className="text-sm text-ink-muted">
                Foto pertama otomatis menjadi sampul. Atur urutan dengan tombol naik/turun, lalu
                pilih sampul yang paling mewakili kegiatan.
              </p>
              <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {ruang.media.map((m, n) => (
                  <MediaKartu
                    key={m.id}
                    media={m}
                    nomor={n + 1}
                    jumlah={ruang.media.length}
                    cover={album.cover_id === m.id}
                    kunci={kunci || !!link || !!teksLink}
                    aksi={(a) =>
                      a === "caption"
                        ? setCaption(m)
                        : a === "hapus"
                          ? setKonfirmasi(dataAksi(a, m.id))
                          : void aksi(dataAksi(a, m.id))
                    }
                  />
                ))}
              </div>
              {!ruang.media.length && (
                <p className="text-sm text-ink-muted">
                  Belum ada media. Unggah foto pertama untuk mengisi album.
                </p>
              )}
            </section>
            <div className="flex flex-wrap gap-3 border-t pt-5">
              <Button
                variant="outline"
                disabled={kunci}
                onClick={() => setKonfirmasi(dataAksi("bersihkan"))}
              >
                Bersihkan unggahan tertunda ({ruang.tertunda})
              </Button>
              <Button
                variant="outline"
                disabled={kunci || ruang.media.length > 0 || ruang.tertunda > 0}
                onClick={() => setKonfirmasi(dataAksi("hapus_album"))}
              >
                Hapus album kosong
              </Button>
            </div>
          </>
        ))}
      <AlertDialog
        open={!!konfirmasi}
        onOpenChange={(o) => {
          if (!o) setKonfirmasi(null);
        }}
      >
        <AlertDialogContent data-admin-dialog>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {konfirmasi?.aksi === "bersihkan"
                ? "Bersihkan unggahan?"
                : konfirmasi?.aksi === "hapus_album"
                  ? "Hapus album kosong?"
                  : "Hapus media?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {konfirmasi?.aksi === "bersihkan"
                ? "Reservasi unggahanmu yang belum selesai akan dibatalkan dan berkas sementaranya dibersihkan. Media yang sudah tersimpan tetap ada. Jangan lakukan ini saat unggahan berjalan di tab lain."
                : "Data yang dipilih akan dihapus. Salinan asli di Drive tetap dikelola terpisah."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (konfirmasi) void aksi(konfirmasi);
              }}
            >
              Ya, lanjutkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {caption && (
        <CaptionDialog
          media={caption}
          tutup={() => setCaption(null)}
          simpan={async (teks) => {
            const ok = await aksi({ ...dataAksi("caption", caption.id), caption: teks });
            if (ok) setCaption(null);
            return ok;
          }}
        />
      )}
    </div>
  );
}
function MediaKartu({
  media: m,
  nomor,
  jumlah,
  cover,
  kunci,
  aksi,
}: {
  media: MediaAdmin;
  nomor: number;
  jumlah: number;
  cover: boolean;
  kunci: boolean;
  aksi: (a: "cover" | "caption" | "naik" | "turun" | "hapus") => void;
}) {
  const [url, setUrl] = useState<string | null>(
      m.storage_path?.startsWith("b2:") ? null : urlPublik("media", m.storage_path),
    ),
    [gagal, setGagal] = useState(false);
  useEffect(() => {
    let aktif = true;
    if (m.storage_path?.startsWith("b2:"))
      pratinjauMediaFn({ data: { id: m.id } })
        .then((r) => {
          if (aktif) setUrl(r.url);
        })
        .catch(() => {
          if (aktif) setGagal(true);
        });
    return () => {
      aktif = false;
    };
  }, [m.id, m.storage_path]);
  return (
    <article className="min-w-0 overflow-hidden rounded-xl border bg-surface">
      <div className="flex aspect-video items-center justify-center overflow-hidden bg-muted-surface">
        {url && m.jenis === "foto" ? (
          <img
            src={url}
            alt={m.caption || `Dokumentasi ${nomor}`}
            loading="lazy"
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="p-4 text-center text-sm text-ink-muted">
            {m.jenis === "embed"
              ? "Video dari tautan"
              : m.jenis === "video"
                ? "Berkas video"
                : gagal
                  ? "Pratinjau belum tersedia"
                  : "Menyiapkan pratinjau…"}
          </span>
        )}
      </div>
      <div className="space-y-3 p-4">
        <p className="break-words text-sm">
          {nomor}. {m.caption || "Tanpa keterangan"}
          {cover ? " · Sampul" : ""}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" disabled={kunci} onClick={() => aksi("caption")}>
            Keterangan
          </Button>
          {m.jenis === "foto" && (
            <Button variant="outline" disabled={kunci || cover} onClick={() => aksi("cover")}>
              Jadikan sampul
            </Button>
          )}
          <Button
            variant="outline"
            disabled={kunci || nomor === 1}
            aria-label={`Naikkan media ${nomor}`}
            onClick={() => aksi("naik")}
          >
            ↑ Naik
          </Button>
          <Button
            variant="outline"
            disabled={kunci || nomor === jumlah}
            aria-label={`Turunkan media ${nomor}`}
            onClick={() => aksi("turun")}
          >
            ↓ Turun
          </Button>
          <Button variant="outline" disabled={kunci} onClick={() => aksi("hapus")}>
            Hapus<span className="sr-only"> media {nomor}</span>
          </Button>
          {url && m.jenis === "video" && (
            <a
              className="inline-flex min-h-11 items-center text-sm text-primary underline"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Pratinjau video
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
function CaptionDialog({
  media,
  tutup,
  simpan,
}: {
  media: MediaAdmin;
  tutup: () => void;
  simpan: (s: string) => Promise<boolean>;
}) {
  const [teks, setTeks] = useState(media.caption ?? ""),
    [sibuk, setSibuk] = useState(false);
  const { penjagaan, tandaiTersimpan } = useIsianBelumDisimpan(teks !== (media.caption ?? ""));
  return (
    <>
      <PeringatanIsian penjagaan={penjagaan} />
      <Dialog
        open
        onOpenChange={(o) => {
          if (
            !o &&
            (teks === (media.caption ?? "") ||
              window.confirm("Buang keterangan yang belum disimpan?"))
          )
            tutup();
        }}
      >
        <DialogContent data-admin-dialog>
          <DialogHeader>
            <DialogTitle>Keterangan dokumentasi</DialogTitle>
            <DialogDescription>
              Jelaskan kegiatan dalam foto/video. Maksimal 300 karakter.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSibuk(true);
              void simpan(teks)
                .then((ok) => {
                  if (ok) tandaiTersimpan();
                })
                .finally(() => setSibuk(false));
            }}
          >
            <label className="block text-sm font-semibold">
              Keterangan
              <textarea
                className={`${kelasIsian} mt-2 min-h-28`}
                value={teks}
                maxLength={300}
                onChange={(e) => setTeks(e.target.value)}
              />
            </label>
            <Button className="mt-4" disabled={sibuk}>
              Simpan keterangan
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
