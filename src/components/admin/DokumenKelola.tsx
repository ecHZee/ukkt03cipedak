import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { AdminShell } from "./AdminShell";
import { Button } from "@/components/ui/button";
import { kelasIsian } from "./FormKegiatan";
import { dokumenForm, type DokumenForm, type DokumenAdmin } from "@/lib/hari20-admin";
import {
  ruangDokumenFn,
  simpanDokumenFn,
  hapusDokumenFn,
  bukaDokumenFn,
  bersihkanArsipFn,
} from "@/services/hari20-admin.functions";
import { DOKUMEN_KATEGORI_LABEL, DOKUMEN_ACCESS_META } from "@/domains/dokumen/types";
import { bolehTerbitKegiatan } from "@/lib/kegiatan-admin";
import { unggahArsip, hapusFile } from "@/services/storage";
import { supabase } from "@/integrations/supabase/client";
import { useIsianBelumDisimpan } from "@/hooks/use-isian-belum-disimpan";
import { PeringatanIsian } from "./PeringatanIsian";
type Ruang = Awaited<ReturnType<typeof ruangDokumenFn>>;
export function DokumenKelola({ ruang }: { ruang: Ruang }) {
  const router = useRouter(),
    [edit, setEdit] = useState<DokumenAdmin | null | undefined>(),
    [q, setQ] = useState(""),
    [akses, setAkses] = useState("semua"),
    [status, setStatus] = useState("semua"),
    [pesan, setPesan] = useState(""),
    [sibuk, setSibuk] = useState(false),
    [serial, setSerial] = useState(0);
  const daftar = ruang.dokumen.filter(
    (d) =>
      d.judul.toLocaleLowerCase("id-ID").includes(q.trim().toLocaleLowerCase("id-ID")) &&
      (akses === "semua" || d.akses === akses) &&
      (status === "semua" || d.status === status),
  );
  async function buka(id: string) {
    setPesan("");
    try {
      const r = await bukaDokumenFn({ data: { id } });
      window.location.assign(r.url);
    } catch (e) {
      setPesan(e instanceof Error ? e.message : "PDF belum dapat dibuka.");
    }
  }
  async function hapus(d: DokumenAdmin) {
    if (!window.confirm(`Hapus draf “${d.judul}” beserta berkasnya?`)) return;
    setSibuk(true);
    try {
      const r = await hapusDokumenFn({ data: { id: d.id, versi: d.updated_at } });
      setPesan(r.peringatan ?? "Dokumen dan berkas lama telah dibersihkan.");
      await router.invalidate();
    } catch (e) {
      setPesan(e instanceof Error ? e.message : "Dokumen belum dihapus.");
    } finally {
      setSibuk(false);
    }
  }
  return (
    <AdminShell
      title="Dokumen"
      description="Kelola arsip dan tentukan siapa yang boleh membukanya."
      actions={
        edit === undefined && ruang.akses.bolehKontribusi ? (
          <Button onClick={() => setEdit(null)}>Unggah dokumen</Button>
        ) : undefined
      }
    >
      {pesan && (
        <p role="status" className="mb-5 rounded-lg border bg-surface p-4 text-sm">
          {pesan}
        </p>
      )}
      {edit !== undefined ? (
        <EditorDokumen
          key={(edit?.id ?? "baru") + serial}
          ruang={ruang}
          awal={edit}
          batal={() => setEdit(undefined)}
          selesai={async (d, p) => {
            setPesan(p ?? "Dokumen tersimpan.");
            await router.invalidate();
            setEdit(d);
            setSerial((s) => s + 1);
          }}
        />
      ) : (
        <>
          {!ruang.akses.bolehKontribusi ? (
            <p className="rounded-lg border p-5">
              Izin kontribusimu belum aktif. Dokumen yang boleh dibaca tersedia di halaman Arsip.
            </p>
          ) : (
            <>
              <div className="mb-5 grid gap-3 sm:grid-cols-3">
                <label className="text-sm">
                  Cari dokumen
                  <input className={kelasIsian} value={q} onChange={(e) => setQ(e.target.value)} />
                </label>
                <label className="text-sm">
                  Akses
                  <select
                    className={kelasIsian}
                    value={akses}
                    onChange={(e) => setAkses(e.target.value)}
                  >
                    <option value="semua">Semua akses</option>
                    {Object.entries(DOKUMEN_ACCESS_META).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm">
                  Status
                  <select
                    className={kelasIsian}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="semua">Semua status</option>
                    <option value="draft">Draf</option>
                    <option value="review">Menunggu persetujuan</option>
                    <option value="terbit">Terbit</option>
                  </select>
                </label>
              </div>
              <p className="mb-3 text-sm text-ink-muted">
                {daftar.length} dokumen sesuai hak kelolamu
              </p>
              <div className="space-y-3">
                {daftar.slice(0, 100).map((d) => (
                  <article
                    key={d.id}
                    className="flex min-w-0 flex-wrap items-center justify-between gap-4 rounded-xl border bg-surface p-5"
                  >
                    <div className="min-w-0">
                      <h2 className="break-words font-heading font-semibold">{d.judul}</h2>
                      <p className="mt-1 text-sm text-ink-muted">
                        {d.tahun} ·{" "}
                        {DOKUMEN_KATEGORI_LABEL[d.kategori as keyof typeof DOKUMEN_KATEGORI_LABEL]}{" "}
                        · {DOKUMEN_ACCESS_META[d.akses].label} ·{" "}
                        {d.status === "draft"
                          ? "Draf"
                          : d.status === "review"
                            ? "Menunggu persetujuan"
                            : "Terbit"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" disabled={sibuk} onClick={() => setEdit(d)}>
                        Sunting
                      </Button>
                      <Button
                        variant="outline"
                        disabled={sibuk || !d.storage_path}
                        onClick={() => void buka(d.id)}
                      >
                        Buka PDF
                      </Button>
                      <Button
                        variant="outline"
                        disabled={sibuk || d.status === "terbit"}
                        onClick={() => void hapus(d)}
                      >
                        Hapus
                      </Button>
                    </div>
                  </article>
                ))}
                {!daftar.length && (
                  <p className="rounded-xl border p-5 text-sm">
                    Belum ada dokumen yang sesuai. Mulai dari draf pertama.
                  </p>
                )}
              </div>
              {daftar.length > 100 && (
                <p className="mt-3 text-sm">
                  Tampilkan judul yang lebih spesifik untuk melihat dokumen lain; daftar dibatasi
                  100 hasil.
                </p>
              )}
              <Button
                className="mt-6"
                variant="outline"
                disabled={sibuk}
                onClick={async () => {
                  setSibuk(true);
                  try {
                    const r = await bersihkanArsipFn();
                    setPesan(`${r.jumlah} berkas lama dibersihkan.`);
                    await router.invalidate();
                  } catch (e) {
                    setPesan(e instanceof Error ? e.message : "Pembersihan belum selesai.");
                  } finally {
                    setSibuk(false);
                  }
                }}
              >
                Bersihkan berkas lama ({ruang.tertunda})
              </Button>
            </>
          )}
        </>
      )}
    </AdminShell>
  );
}
function EditorDokumen({
  ruang,
  awal,
  batal,
  selesai,
}: {
  ruang: Ruang;
  awal: DokumenAdmin | null;
  batal: () => void;
  selesai: (d: DokumenAdmin, p: string | null) => Promise<void>;
}) {
  const dasar: DokumenForm = {
    id: awal?.id,
    versi: awal?.updated_at,
    judul: awal?.judul ?? "",
    kategori: (awal?.kategori as DokumenForm["kategori"]) ?? "lainnya",
    tahun: awal?.tahun ?? new Date().getFullYear(),
    tanggal: awal?.tanggal ?? null,
    bidang_id: awal ? awal.bidang_id : ruang.akses.bidangId,
    akses: awal?.akses ?? "anggota",
    status: awal?.status ?? "draft",
    storage_path: awal?.storage_path ?? null,
    ukuran_bytes: awal?.ukuran_bytes ?? null,
  };
  const [form, setForm] = useState(dasar),
    [file, setFile] = useState<File | null>(null),
    [sibuk, setSibuk] = useState(false),
    [galat, setGalat] = useState("");
  const berubah = JSON.stringify(form) !== JSON.stringify(dasar) || !!file;
  const { penjagaan, tandaiTersimpan } = useIsianBelumDisimpan(berubah);
  const lintas =
    ruang.akses.role === "super_admin" || (ruang.akses.role === "admin" && !ruang.akses.bidangId);
  const terbit = bolehTerbitKegiatan(ruang.akses, {
    bidang_id: form.bidang_id,
    created_by: awal?.created_by ?? ruang.akses.id,
  });
  async function simpan() {
    setGalat("");
    setSibuk(true);
    let uploaded: string | null = null;
    try {
      let data = { ...form };
      if (file) {
        const r = await unggahArsip(file, ruang.akses.id);
        uploaded = r.path;
        data = { ...data, storage_path: r.path, ukuran_bytes: r.ukuranByte };
      }
      const parsed = dokumenForm.safeParse(data);
      if (!parsed.success) throw new Error(parsed.error.issues[0].message);
      const r = await simpanDokumenFn({ data: parsed.data });
      tandaiTersimpan();
      await selesai(r.dokumen, r.peringatan);
    } catch (e) {
      let m = e instanceof Error ? e.message : "Dokumen belum tersimpan.";
      if (uploaded) {
        const r = await supabase.from("dokumen").select("id").eq("storage_path", uploaded).limit(1);
        if (!r.error && !r.data.length)
          try {
            await hapusFile("dokumen-internal", [uploaded.slice(7)]);
          } catch {
            m += " Berkas sementara belum dibersihkan; hubungi BPH.";
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
          if (!berubah || window.confirm("Buang isian dokumen yang belum disimpan?")) batal();
        }}
      >
        ← Daftar dokumen
      </Button>
      <form
        className="space-y-4 rounded-xl border bg-surface p-5"
        onSubmit={(e) => {
          e.preventDefault();
          void simpan();
        }}
      >
        <h2 className="font-heading text-xl font-semibold">
          {awal ? "Sunting dokumen" : "Dokumen baru"}
        </h2>
        <p className="text-sm text-ink-muted">
          PDF maksimal 20 MB. Pilih akses dengan cermat. Dokumen baru disimpan privat; yang terbit
          untuk publik dibuka melalui website.
        </p>
        <fieldset disabled={sibuk} className="grid min-w-0 gap-4 sm:grid-cols-2">
          <label className="text-sm sm:col-span-2">
            Judul dokumen
            <input
              required
              maxLength={180}
              className={kelasIsian}
              value={form.judul}
              onChange={(e) => setForm({ ...form, judul: e.target.value })}
            />
          </label>
          <label className="text-sm">
            Kategori
            <select
              className={kelasIsian}
              value={form.kategori}
              onChange={(e) =>
                setForm({ ...form, kategori: e.target.value as DokumenForm["kategori"] })
              }
            >
              {Object.entries(DOKUMEN_KATEGORI_LABEL).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Tahun
            <input
              className={kelasIsian}
              type="number"
              min={2000}
              max={2100}
              value={form.tahun}
              onChange={(e) => setForm({ ...form, tahun: Number(e.target.value) })}
            />
          </label>
          <label className="text-sm">
            Tanggal dokumen
            <input
              className={kelasIsian}
              type="date"
              value={form.tanggal ?? ""}
              onChange={(e) => setForm({ ...form, tanggal: e.target.value || null })}
            />
          </label>
          <label className="text-sm">
            Bidang
            <select
              className={kelasIsian}
              value={form.bidang_id ?? "umum"}
              onChange={(e) =>
                setForm({ ...form, bidang_id: e.target.value === "umum" ? null : e.target.value })
              }
            >
              {ruang.akses.role !== "anggota" && <option value="umum">Umum</option>}
              {ruang.bidang
                .filter((b) => !ruang.akses.bidangId || b.id === ruang.akses.bidangId)
                .map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nama_singkat}
                  </option>
                ))}
            </select>
          </label>
          <label className="text-sm">
            Siapa yang boleh membaca?
            <select
              className={kelasIsian}
              value={form.akses}
              onChange={(e) => setForm({ ...form, akses: e.target.value as DokumenForm["akses"] })}
            >
              <option value="publik">Semua orang (publik)</option>
              <option value="anggota">Pengurus yang login</option>
              {lintas && <option value="bph">BPH dan Super Admin</option>}
            </select>
          </label>
          <label className="text-sm">
            Status publikasi
            <select
              className={kelasIsian}
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as DokumenForm["status"] })
              }
            >
              <option value="draft">Draf</option>
              <option value="review">Menunggu persetujuan</option>
              {terbit && <option value="terbit">Terbit</option>}
            </select>
          </label>
          <label className="text-sm sm:col-span-2">
            Pilih file PDF
            <input
              className={`${kelasIsian} file:mr-3`}
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <span className="mt-2 block text-ink-muted">
              {file
                ? `${file.name} · belum disimpan`
                : awal?.storage_path
                  ? "PDF sebelumnya tetap dipakai jika tidak diganti."
                  : "Boleh menyimpan draf dahulu; PDF wajib sebelum terbit."}
            </span>
          </label>
        </fieldset>
        {galat && (
          <p role="alert" className="text-sm text-destructive">
            {galat}
          </p>
        )}
        <Button disabled={sibuk} type="submit">
          {sibuk ? "Menyimpan…" : "Simpan dokumen"}
        </Button>
      </form>
    </div>
  );
}
