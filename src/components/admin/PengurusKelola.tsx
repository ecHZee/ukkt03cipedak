import { useEffect, useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { AdminShell } from "./AdminShell";
import { Button } from "@/components/ui/button";
import { kelasIsian } from "./FormKegiatan";
import { CropFoto } from "./CropFoto";
import { pengurusForm, type PengurusForm, type PengurusAdmin } from "@/lib/hari20-admin";
import { ruangPengurusFn, simpanPengurusFn } from "@/services/hari20-admin.functions";
import { unggahFotoPengurus, hapusFile, urlPublik } from "@/services/storage";
import { supabase } from "@/integrations/supabase/client";
import { useIsianBelumDisimpan } from "@/hooks/use-isian-belum-disimpan";
import { PeringatanIsian } from "./PeringatanIsian";
type Ruang = Awaited<ReturnType<typeof ruangPengurusFn>>;
export function PengurusKelola({ ruang }: { ruang: Ruang }) {
  const router = useRouter(),
    [edit, setEdit] = useState<PengurusAdmin | null | undefined>(),
    [q, setQ] = useState(""),
    [periode, setPeriode] = useState(ruang.periode.find((p) => p.aktif)?.id ?? "semua"),
    [keaktifan, setKeaktifan] = useState("semua"),
    [pesan, setPesan] = useState(""),
    [serial, setSerial] = useState(0);
  const daftar = ruang.pengurus.filter(
    (p) =>
      (periode === "semua" || p.periode_id === periode) &&
      (keaktifan === "semua" || p.aktif === (keaktifan === "aktif")) &&
      (p.nama + " " + p.jabatan).toLocaleLowerCase("id-ID").includes(q.toLocaleLowerCase("id-ID")),
  );
  return (
    <AdminShell
      title="Kelola pengurus"
      description="BPH dan Super Admin mengelola susunan per periode. Perubahan jabatan dapat mengubah hak akses akun."
      actions={
        edit === undefined ? (
          <Button onClick={() => setEdit(null)}>Tambah pengurus</Button>
        ) : undefined
      }
    >
      {pesan && (
        <p role="status" className="mb-5 rounded-lg border p-4 text-sm">
          {pesan}
        </p>
      )}
      {edit !== undefined ? (
        <EditorPengurus
          key={(edit?.id ?? "baru") + serial}
          ruang={ruang}
          awal={edit}
          batal={() => setEdit(undefined)}
          selesai={async (p) => {
            setEdit(p);
            setSerial((s) => s + 1);
            setPesan(
              "Data pengurus tersimpan. Akun yang dinonaktifkan tidak otomatis aktif lagi; hubungi Super Admin bila perlu mengaktifkan akun.",
            );
            await router.invalidate();
          }}
        />
      ) : (
        <>
          <Button asChild variant="outline" className="mb-5">
            <Link to="/admin/anggota">← Daftar anggota dan izin kontribusi</Link>
          </Button>
          <div className="mb-5 grid gap-3 sm:grid-cols-3">
            <label className="text-sm">
              Cari nama atau jabatan
              <input className={kelasIsian} value={q} onChange={(e) => setQ(e.target.value)} />
            </label>
            <label className="text-sm">
              Periode
              <select
                className={kelasIsian}
                value={periode}
                onChange={(e) => setPeriode(e.target.value)}
              >
                <option value="semua">Semua periode</option>
                {ruang.periode.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                    {p.aktif ? " (berjalan)" : ""}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              Keaktifan
              <select
                className={kelasIsian}
                value={keaktifan}
                onChange={(e) => setKeaktifan(e.target.value)}
              >
                <option value="semua">Semua</option>
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
              </select>
            </label>
          </div>
          <p className="mb-3 text-sm">{daftar.length} pengurus</p>
          <div className="grid min-w-0 gap-3 lg:grid-cols-2">
            {daftar.slice(0, 100).map((p) => (
              <article
                key={p.id}
                className="flex min-w-0 flex-wrap items-center justify-between gap-3 rounded-xl border bg-surface p-5"
              >
                <div className="min-w-0">
                  <h2 className="break-words font-semibold">
                    {p.nama}
                    {p.gelar ? `, ${p.gelar}` : ""}
                  </h2>
                  <p className="mt-1 text-sm text-ink-muted">
                    {p.jabatan} ·{" "}
                    {ruang.bidang.find((b) => b.id === p.bidang_id)?.nama_singkat ??
                      (p.grup === "bph" ? "BPH" : "Penasihat")}{" "}
                    · {p.aktif ? "Aktif" : "Nonaktif"}
                  </p>
                </div>
                <Button variant="outline" onClick={() => setEdit(p)}>
                  Sunting
                </Button>
              </article>
            ))}
          </div>
          {!daftar.length && (
            <p className="rounded-xl border p-5">Belum ada pengurus sesuai pilihan.</p>
          )}
          {daftar.length > 100 && (
            <p className="mt-3 text-sm">
              Daftar dibatasi 100 hasil. Persempit pencarian untuk melihat nama lain.
            </p>
          )}
        </>
      )}
    </AdminShell>
  );
}
function EditorPengurus({
  ruang,
  awal,
  batal,
  selesai,
}: {
  ruang: Ruang;
  awal: PengurusAdmin | null;
  batal: () => void;
  selesai: (p: PengurusAdmin) => Promise<void>;
}) {
  const dasar: PengurusForm = {
    id: awal?.id,
    versi: awal?.updated_at,
    periode_id:
      awal?.periode_id ?? ruang.periode.find((p) => p.aktif)?.id ?? ruang.periode[0]?.id ?? "",
    nama: awal?.nama ?? "",
    gelar: awal?.gelar ?? null,
    jabatan: awal?.jabatan ?? "Anggota",
    grup: awal?.grup ?? "bidang",
    bidang_id: awal ? awal.bidang_id : (ruang.bidang[0]?.id ?? null),
    urutan: awal?.urutan ?? 1,
    rt: awal?.rt ?? null,
    aktif: awal?.aktif ?? true,
    instagram: awal?.instagram ?? null,
    izin_instagram: awal?.izin_instagram ?? false,
    foto_path: awal?.foto_path ?? null,
    izin_foto: awal?.izin_foto ?? false,
  };
  const [form, setForm] = useState(dasar),
    [file, setFile] = useState<File | null>(null),
    [preview, setPreview] = useState<string | null>(null),
    [sibuk, setSibuk] = useState(false),
    [galat, setGalat] = useState("");
  const berubah = JSON.stringify(form) !== JSON.stringify(dasar) || !!file;
  const { penjagaan, tandaiTersimpan } = useIsianBelumDisimpan(berubah);
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const u = URL.createObjectURL(file);
    setPreview(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);
  async function simpan() {
    setGalat("");
    setSibuk(true);
    let path: string | null = null;
    try {
      if (file && !form.izin_foto)
        throw new Error("Centang persetujuan foto atau batalkan foto baru sebelum menyimpan.");
      let data = { ...form };
      if (file && awal) {
        path = await unggahFotoPengurus(file, awal.id);
        data = { ...data, foto_path: path };
      }
      const p = pengurusForm.safeParse(data);
      if (!p.success) throw new Error(p.error.issues[0].message);
      const saved = await simpanPengurusFn({ data: p.data });
      tandaiTersimpan();
      await selesai(saved);
    } catch (e) {
      let m = e instanceof Error ? e.message : "Data pengurus belum tersimpan.";
      if (path && awal) {
        const r = await supabase.from("pengurus").select("foto_path").eq("id", awal.id).single();
        if (!r.error && r.data.foto_path !== path)
          try {
            await hapusFile("media", [path]);
          } catch {
            m += " Foto sementara belum dibersihkan; hubungi Super Admin.";
          }
      }
      setGalat(m);
    } finally {
      setSibuk(false);
    }
  }
  return (
    <div className="space-y-5">
      <PeringatanIsian penjagaan={penjagaan} />
      <Button
        variant="outline"
        disabled={sibuk}
        onClick={() => {
          if (!berubah || window.confirm("Buang isian pengurus yang belum disimpan?")) batal();
        }}
      >
        ← Daftar pengurus
      </Button>
      <form
        className="space-y-5 rounded-xl border bg-surface p-5"
        onSubmit={(e) => {
          e.preventDefault();
          void simpan();
        }}
      >
        <h2 className="font-heading text-xl font-semibold">
          {awal ? "Sunting pengurus" : "Pengurus baru"}
        </h2>
        <p className="text-sm text-ink-muted">
          BPH memiliki akses lintas bidang; jabatan “Kepala Bidang” memberi akses admin bidang.
          Menonaktifkan atau memindahkan pengurus ke periode yang tidak berjalan menonaktifkan akun
          terkait. Akun tidak dibuat otomatis saat menambah pengurus.
        </p>
        <fieldset disabled={sibuk} className="grid min-w-0 gap-4 sm:grid-cols-2">
          <label className="text-sm">
            Nama pengurus
            <input
              className={kelasIsian}
              required
              maxLength={150}
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
            />
          </label>
          <label className="text-sm">
            Gelar
            <input
              className={kelasIsian}
              maxLength={100}
              value={form.gelar ?? ""}
              onChange={(e) => setForm({ ...form, gelar: e.target.value || null })}
            />
          </label>
          <label className="text-sm">
            Periode kepengurusan
            <select
              className={kelasIsian}
              value={form.periode_id}
              onChange={(e) => setForm({ ...form, periode_id: e.target.value })}
            >
              {ruang.periode.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                  {p.aktif ? " (berjalan)" : ""}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Kelompok
            <select
              className={kelasIsian}
              value={form.grup}
              onChange={(e) => {
                const grup = e.target.value as PengurusForm["grup"];
                setForm({
                  ...form,
                  grup,
                  bidang_id: grup === "bidang" ? (ruang.bidang[0]?.id ?? null) : null,
                  jabatan:
                    grup === "penasihat" ? "Penasihat" : grup === "bph" ? "Ketua" : "Anggota",
                });
              }}
            >
              <option value="bidang">Bidang</option>
              <option value="bph">Badan Pengurus Harian (BPH)</option>
              <option value="penasihat">Penasihat</option>
            </select>
          </label>
          <label className="text-sm">
            Jabatan
            <input
              className={kelasIsian}
              required
              maxLength={100}
              list="pilihan-jabatan"
              value={form.jabatan}
              onChange={(e) => setForm({ ...form, jabatan: e.target.value })}
            />
            <datalist id="pilihan-jabatan">
              {(form.grup === "bidang"
                ? ["Kepala Bidang", "Anggota"]
                : form.grup === "penasihat"
                  ? ["Penasihat"]
                  : [
                      "Ketua",
                      "Wakil Ketua",
                      "Sekretaris",
                      "Wakil Sekretaris",
                      "Bendahara",
                      "Wakil Bendahara",
                    ]
              ).map((j) => (
                <option key={j} value={j} />
              ))}
            </datalist>
          </label>
          <label className="text-sm">
            Bidang
            <select
              disabled={form.grup !== "bidang"}
              className={kelasIsian}
              value={form.bidang_id ?? ""}
              onChange={(e) => setForm({ ...form, bidang_id: e.target.value || null })}
            >
              <option value="">Tanpa bidang</option>
              {ruang.bidang.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nama_singkat}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Urutan tampil
            <input
              type="number"
              min={0}
              max={1000}
              className={kelasIsian}
              value={form.urutan}
              onChange={(e) => setForm({ ...form, urutan: Number(e.target.value) })}
            />
          </label>
          <label className="text-sm">
            RT
            <select
              className={kelasIsian}
              value={form.rt ?? ""}
              onChange={(e) => setForm({ ...form, rt: e.target.value || null })}
            >
              <option value="">Belum diisi</option>
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <option key={n} value={`RT 0${n}`}>
                  RT 0{n}
                </option>
              ))}
            </select>
          </label>
          <label className="flex min-h-11 items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={form.aktif}
              onChange={(e) => {
                setForm({
                  ...form,
                  aktif: e.target.checked,
                  izin_foto: e.target.checked ? form.izin_foto : false,
                  foto_path: e.target.checked ? form.foto_path : null,
                });
                if (!e.target.checked) setFile(null);
              }}
            />
            Pengurus aktif pada periode ini
          </label>
          <label className="text-sm">
            Nama akun Instagram
            <input
              className={kelasIsian}
              value={form.instagram ?? ""}
              onChange={(e) => setForm({ ...form, instagram: e.target.value || null })}
            />
          </label>
          <label className="flex min-h-11 items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={form.izin_instagram}
              onChange={(e) => setForm({ ...form, izin_instagram: e.target.checked })}
            />
            Sudah mendapat izin menampilkan Instagram untuk umum
          </label>
        </fieldset>
        {awal ? (
          <div className="space-y-4 border-t pt-5">
            <h3 className="font-heading font-semibold">Foto pengurus</h3>
            {preview || form.foto_path ? (
              <img
                className="aspect-[3/4] w-40 rounded-lg object-cover"
                src={preview ?? urlPublik("media", form.foto_path)!}
                alt="Pratinjau foto pengurus"
              />
            ) : (
              <p className="text-sm">Belum ada foto. Huruf awal nama tetap dapat dipakai.</p>
            )}
            <CropFoto
              disabled={sibuk || !form.aktif}
              onPilih={(f) => {
                setFile(f);
                setForm((v) => ({ ...v, izin_foto: false }));
              }}
            />
            <label className="flex min-h-11 items-start gap-3 text-sm">
              <input
                type="checkbox"
                className="mt-1"
                disabled={sibuk || !form.aktif}
                checked={form.izin_foto}
                onChange={(e) => setForm({ ...form, izin_foto: e.target.checked })}
              />
              Pemilik foto telah menyetujui foto ini tampil di website untuk umum.
            </label>
            {file && (
              <Button variant="outline" disabled={sibuk} onClick={() => setFile(null)}>
                Batalkan foto baru
              </Button>
            )}
            <p className="text-xs text-ink-muted">
              Mencabut izin menghapus berkas lama. Salinan yang sudah diunduh orang tidak dapat
              ditarik kembali.
            </p>
          </div>
        ) : (
          <p className="text-sm text-ink-muted">
            Simpan data pengurus dahulu, lalu tambahkan foto dan persetujuannya.
          </p>
        )}
        {galat && (
          <p role="alert" className="text-sm text-destructive">
            {galat}
          </p>
        )}
        <Button type="submit" disabled={sibuk}>
          {sibuk ? "Menyimpan…" : "Simpan pengurus"}
        </Button>
      </form>
    </div>
  );
}
