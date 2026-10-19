import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  formulirBerita,
  slugBerita,
  bolehTerbitBerita,
  type BeritaAdmin,
  type FormulirBerita,
} from "@/lib/berita-admin";
import { simpanBeritaFn, type ruangBeritaFn } from "@/services/berita-admin.functions";
import { unggahFoto, hapusFile, urlPublik, type HasilFoto } from "@/services/storage";
import { supabase } from "@/integrations/supabase/client";
import { useIsianBelumDisimpan } from "@/hooks/use-isian-belum-disimpan";
import { PeringatanIsian } from "./PeringatanIsian";
import { kelasIsian } from "./FormKegiatan";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { IsiKonten } from "@/components/public/IsiKonten";

type Ruang = Awaited<ReturnType<typeof ruangBeritaFn>>;
export function FormBerita({
  ruang,
  berita,
  selesai,
  batal,
}: {
  ruang: Ruang;
  berita?: BeritaAdmin;
  selesai: (r: Awaited<ReturnType<typeof simpanBeritaFn>>) => Promise<void>;
  batal: () => void;
}) {
  const awal: FormulirBerita = {
    ...(berita ? { id: berita.id, versi: berita.updated_at } : {}),
    judul: berita?.judul ?? "",
    slug: berita?.slug ?? "",
    ringkasan: berita?.ringkasan ?? "",
    isi: berita?.isi ?? "",
    bidang_id: berita ? berita.bidang_id : ruang.akses.bidangId,
    pinned: berita?.pinned ?? false,
    status: berita?.status ?? "draft",
    cover_id: berita?.cover_id ?? null,
  };
  const [data, setData] = useState(awal),
    [otomatis, setOtomatis] = useState(!berita),
    [galat, setGalat] = useState<Record<string, string>>({}),
    [pesan, setPesan] = useState(""),
    [sibuk, setSibuk] = useState(false),
    [pratinjau, setPratinjau] = useState(false),
    [file, setFile] = useState<File | null>(null),
    [preview, setPreview] = useState<string | null>(null),
    [caption, setCaption] = useState("");
  const pemicuPratinjau = useRef<HTMLButtonElement>(null);
  const kunci = useRef(false),
    form = useRef<HTMLFormElement>(null);
  const sampulLama = ruang.sampul.find((s) => s.id === data.cover_id);
  const sampulUrl = preview ?? urlPublik("media", sampulLama?.storage_path);
  const berubah = JSON.stringify(awal) !== JSON.stringify(data) || !!file;
  const { tandaiTersimpan, penjagaan } = useIsianBelumDisimpan(berubah || sibuk);
  const bolehTerbit = bolehTerbitBerita(ruang.akses, {
    bidang_id: data.bidang_id,
    created_by: berita?.created_by ?? ruang.akses.id,
  });
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const u = URL.createObjectURL(file);
    setPreview(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);
  function ubah<K extends keyof FormulirBerita>(key: K, value: FormulirBerita[K]) {
    setData((d) => ({
      ...d,
      [key]: value,
      ...(key === "judul" && otomatis ? { slug: slugBerita(String(value)) } : {}),
    }));
    setGalat((g) => ({ ...g, [key]: "" }));
    setPesan("");
  }
  async function simpan(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (kunci.current) return;
    const status =
      ((e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null)?.value || "draft";
    const valid = formulirBerita.safeParse({ ...data, status });
    if (!valid.success) {
      setGalat(Object.fromEntries(valid.error.issues.map((i) => [i.path[0], i.message])));
      setPesan("Periksa isian yang ditandai.");
      form.current
        ?.querySelector<HTMLElement>(`[name="${valid.error.issues[0].path[0]}"]`)
        ?.focus();
      return;
    }
    kunci.current = true;
    setSibuk(true);
    setPesan("");
    let unggahan: HasilFoto | undefined;
    try {
      if (file) unggahan = await unggahFoto(file, `berita/${ruang.akses.id}`);
      const hasil = await simpanBeritaFn({
        data: { ...valid.data, sampul: unggahan ? { ...unggahan, caption } : null },
      });
      tandaiTersimpan();
      await selesai(hasil);
    } catch (err) {
      let pesan = err instanceof Error ? err.message : "Gagal menyimpan. Coba lagi.";
      // Periksa metadata sebelum membersihkan: respons jaringan dapat hilang setelah transaksi berhasil.
      if (unggahan) {
        const cek = await supabase.from("media").select("id").eq("storage_path", unggahan.path);
        if (!cek.error && !cek.data.length) {
          try {
            await hapusFile("media", [unggahan.path, unggahan.thumbPath]);
          } catch {
            pesan += " Berkas sementara belum dibersihkan; hubungi BPH.";
          }
        }
      }
      setPesan(pesan);
    } finally {
      kunci.current = false;
      setSibuk(false);
    }
  }
  function field(key: keyof FormulirBerita, label: string, child: ReactNode) {
    return (
      <div className="min-w-0">
        <label htmlFor={`berita-${key}`} className="mb-1.5 block text-sm font-semibold">
          {label}
        </label>
        {child}
        {galat[key] && (
          <p id={`galat-${key}`} className="mt-1 text-sm text-destructive">
            {galat[key]}
          </p>
        )}
      </div>
    );
  }
  const props = (key: keyof FormulirBerita) => ({
    id: `berita-${key}`,
    name: key,
    disabled: sibuk,
    className: kelasIsian,
    "aria-invalid": !!galat[key],
    "aria-describedby": galat[key] ? `galat-${key}` : undefined,
  });
  return (
    <>
      <PeringatanIsian penjagaan={penjagaan} />
      <div className="mb-5 flex flex-wrap gap-3">
        <Button variant="outline" disabled={sibuk} onClick={batal}>
          Kembali ke daftar
        </Button>
        <Button
          variant="outline"
          disabled={sibuk}
          ref={pemicuPratinjau}
          onClick={() => setPratinjau(true)}
        >
          Pratinjau berita
        </Button>
      </div>
      <form
        ref={form}
        onSubmit={simpan}
        noValidate
        aria-busy={sibuk}
        className="max-w-4xl space-y-6"
      >
        <section
          className="space-y-5 rounded-xl border border-border bg-surface p-4 sm:p-6"
          aria-labelledby="judul-form-berita"
        >
          <h2 id="judul-form-berita" className="font-heading text-lg font-semibold">
            {berita ? "Sunting berita" : "Tulis berita"}
          </h2>
          {field(
            "judul",
            "Judul berita",
            <input
              {...props("judul")}
              value={data.judul}
              maxLength={180}
              onChange={(e) => ubah("judul", e.target.value)}
            />,
          )}
          {field(
            "slug",
            "Alamat berita",
            <input
              {...props("slug")}
              value={data.slug}
              maxLength={120}
              onChange={(e) => {
                setOtomatis(false);
                ubah("slug", e.target.value);
              }}
            />,
          )}
          <p className="break-all text-sm text-ink-muted">/berita/{data.slug || "judul-berita"}</p>
          {field(
            "bidang_id",
            "Bidang",
            <select
              {...props("bidang_id")}
              value={data.bidang_id ?? ""}
              onChange={(e) => ubah("bidang_id", e.target.value || null)}
            >
              {ruang.akses.role !== "anggota" && <option value="">Umum</option>}
              {ruang.bidang
                .filter((b) => !ruang.akses.bidangId || b.id === ruang.akses.bidangId)
                .map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nama_singkat}
                  </option>
                ))}
            </select>,
          )}
          {field(
            "ringkasan",
            "Ringkasan",
            <textarea
              {...props("ringkasan")}
              rows={3}
              maxLength={500}
              value={data.ringkasan}
              onChange={(e) => ubah("ringkasan", e.target.value)}
            />,
          )}
          {field(
            "isi",
            "Isi berita",
            <textarea
              {...props("isi")}
              rows={12}
              maxLength={30000}
              value={data.isi}
              onChange={(e) => ubah("isi", e.target.value)}
            />,
          )}
          <p className="text-sm text-ink-muted">
            Gunakan baris kosong untuk memisahkan paragraf. Pratinjau menampilkan isi seperti
            halaman publik.
          </p>
          <label className="flex min-h-11 items-center gap-3 text-sm">
            <input
              type="checkbox"
              disabled={sibuk || !bolehTerbit}
              checked={data.pinned}
              onChange={(e) => ubah("pinned", e.target.checked)}
            />
            Jadikan berita utama
          </label>
        </section>
        <section
          className="space-y-4 rounded-xl border border-border bg-surface p-4 sm:p-6"
          aria-labelledby="sampul-berita"
        >
          <h2 id="sampul-berita" className="font-heading text-lg font-semibold">
            Gambar sampul
          </h2>
          <label htmlFor="file-sampul" className="block text-sm font-semibold">
            Pilih gambar (opsional, maksimal 20 MB)
          </label>
          <input
            id="file-sampul"
            className={`${kelasIsian} file:mr-3 file:rounded file:border-0 file:p-1`}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={sibuk}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              if (
                !["image/jpeg", "image/png", "image/webp"].includes(f.type) ||
                f.size > 20 * 1024 * 1024
              ) {
                setPesan("Pilih JPEG, PNG atau WebP maksimal 20 MB.");
                e.target.value = "";
                return;
              }
              setFile(f);
              setPesan("");
            }}
          />
          <p className="text-sm text-ink-muted">
            Disarankan gambar mendatar 1200 × 630 px. Gunakan foto yang boleh dipublikasikan. Foto
            dikompres saat disimpan.
          </p>
          {sampulUrl && (
            <img
              src={sampulUrl}
              alt="Pratinjau sampul berita"
              className="max-h-64 max-w-full rounded-lg object-contain"
            />
          )}
          {file && (
            <label className="block text-sm font-semibold">
              Keterangan foto
              <input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                disabled={sibuk}
                maxLength={300}
                className={`${kelasIsian} mt-2`}
              />
            </label>
          )}
          {(file || data.cover_id) && (
            <Button
              variant="outline"
              type="button"
              disabled={sibuk}
              onClick={() => {
                setFile(null);
                ubah("cover_id", null);
              }}
            >
              Lepas sampul
            </Button>
          )}
        </section>
        {pesan && (
          <p
            role="alert"
            className="rounded-lg border border-destructive p-4 text-sm text-destructive"
          >
            {pesan}
          </p>
        )}
        <div className="flex flex-wrap gap-3 pb-6">
          <Button type="submit" value="draft" disabled={sibuk}>
            {sibuk ? "Menyimpan…" : berita?.status === "terbit" ? "Tarik ke draf" : "Simpan draf"}
          </Button>
          <Button type="submit" value="review" variant="outline" disabled={sibuk}>
            Ajukan review
          </Button>
          {bolehTerbit && (
            <Button type="submit" value="terbit" disabled={sibuk}>
              Terbitkan berita
            </Button>
          )}
        </div>
      </form>
      <Dialog open={pratinjau} onOpenChange={setPratinjau}>
        <DialogContent
          data-admin-dialog
          className="max-h-[90dvh] max-w-[calc(100%-2rem)] overflow-y-auto sm:max-w-3xl [&>button]:size-11 [&>button]:right-1 [&>button]:top-1"
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            pemicuPratinjau.current?.focus();
          }}
        >
          <DialogTitle>Pratinjau berita</DialogTitle>
          <DialogDescription>
            Perubahan ini belum disimpan. Periksa judul, sampul, dan isi sebelum menyimpan.
          </DialogDescription>
          <article className="min-w-0 space-y-5 [overflow-wrap:anywhere]">
            <h3 className="font-heading text-2xl font-semibold">{data.judul || "Judul berita"}</h3>
            {sampulUrl && (
              <figure>
                <img
                  src={sampulUrl}
                  alt={caption || data.judul || "Sampul berita"}
                  className="max-h-80 w-full rounded-lg object-contain"
                />
                {(caption || sampulLama?.caption) && (
                  <figcaption className="mt-2 text-sm text-ink-muted">
                    {caption || sampulLama?.caption}
                  </figcaption>
                )}
              </figure>
            )}
            <IsiKonten isi={data.isi} ringkasan={data.ringkasan} />
          </article>
        </DialogContent>
      </Dialog>
    </>
  );
}
