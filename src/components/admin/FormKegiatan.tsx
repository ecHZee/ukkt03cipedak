import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  formulirKegiatan,
  keInputWib,
  slugKegiatan,
  bolehTerbitKegiatan,
  STATUS_KEGIATAN,
  TAHAP_KEGIATAN,
  type FormulirKegiatan,
  type KegiatanAdmin,
} from "@/lib/kegiatan-admin";
import { simpanKegiatanFn, type ruangKegiatanFn } from "@/services/kegiatan-admin.functions";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Ruang = Awaited<ReturnType<typeof ruangKegiatanFn>>;
export const kelasIsian =
  "min-h-11 w-full min-w-0 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink";

export function FormKegiatan({
  ruang,
  kegiatan,
  selesai,
  batal,
}: {
  ruang: Ruang;
  kegiatan?: KegiatanAdmin;
  selesai: (hasil: Awaited<ReturnType<typeof simpanKegiatanFn>>) => Promise<void>;
  batal: () => void;
}) {
  const { akses, bidang, periode } = ruang;
  const awal: FormulirKegiatan = {
    ...(kegiatan ? { id: kegiatan.id, versi: kegiatan.updated_at } : {}),
    judul: kegiatan?.judul ?? "",
    slug: kegiatan?.slug ?? "",
    ringkasan: kegiatan?.ringkasan ?? "",
    isi: kegiatan?.isi ?? "",
    bidang_id: kegiatan ? kegiatan.bidang_id : akses.bidangId,
    periode_id: kegiatan?.periode_id ?? periode.find((p) => p.aktif)?.id ?? "",
    mulai: keInputWib(kegiatan?.mulai ?? null),
    selesai: keInputWib(kegiatan?.selesai ?? null),
    rutin: kegiatan?.rutin ?? "",
    lokasi: kegiatan?.lokasi ?? "",
    tahap: kegiatan?.tahap ?? "rencana",
    status: kegiatan?.status ?? "draft",
  };
  const [data, setData] = useState(awal);
  const [otomatis, setOtomatis] = useState(!kegiatan);
  const [galat, setGalat] = useState<Record<string, string>>({});
  const [pesan, setPesan] = useState("");
  const [sibuk, setSibuk] = useState(false);
  const [konfirmasi, setKonfirmasi] = useState(false);
  const kunci = useRef(false);
  const form = useRef<HTMLFormElement>(null);
  const kembali = useRef<HTMLButtonElement>(null);
  const bolehTerbit = bolehTerbitKegiatan(akses, {
    bidang_id: data.bidang_id,
    created_by: kegiatan?.created_by ?? akses.id,
  });
  const berubah = JSON.stringify(data) !== JSON.stringify(awal);
  function ubah<K extends keyof FormulirKegiatan>(k: K, v: FormulirKegiatan[K]) {
    setData((lama) => ({
      ...lama,
      [k]: v,
      ...(k === "judul" && otomatis ? { slug: slugKegiatan(String(v)) } : {}),
    }));
    setGalat((lama) => ({ ...lama, [k]: "" }));
    setPesan("");
  }
  async function simpan(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (kunci.current) return;
    const pemicu = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const status = (pemicu?.value || "draft") as FormulirKegiatan["status"];
    const valid = formulirKegiatan.safeParse({ ...data, status });
    if (!valid.success) {
      setGalat(Object.fromEntries(valid.error.issues.map((i) => [i.path[0], i.message])));
      setPesan("Periksa isian yang ditandai sebelum menyimpan.");
      form.current
        ?.querySelector<HTMLElement>(`[name="${valid.error.issues[0].path[0]}"]`)
        ?.focus();
      return;
    }
    kunci.current = true;
    setSibuk(true);
    setPesan("");
    try {
      const hasil = await simpanKegiatanFn({ data: valid.data });
      await selesai(hasil);
    } catch (err) {
      setPesan(err instanceof Error ? err.message : "Gagal menyimpan. Coba lagi.");
    } finally {
      kunci.current = false;
      setSibuk(false);
    }
  }
  const props = (nama: keyof FormulirKegiatan) => ({
    id: `kegiatan-${nama}`,
    name: nama,
    disabled: sibuk,
    className: kelasIsian,
    "aria-invalid": Boolean(galat[nama]),
    "aria-describedby": galat[nama] ? `galat-${nama}` : undefined,
  });
  function field(nama: keyof FormulirKegiatan, label: string, isi: ReactNode, petunjuk?: string) {
    return (
      <div className="min-w-0">
        <label htmlFor={`kegiatan-${nama}`} className="mb-1.5 block text-sm font-semibold">
          {label}
        </label>
        {isi}
        {petunjuk && <p className="mt-1.5 text-sm text-ink-muted">{petunjuk}</p>}
        {galat[nama] && (
          <p id={`galat-${nama}`} className="mt-1.5 text-sm text-destructive">
            {galat[nama]}
          </p>
        )}
      </div>
    );
  }
  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Button
          ref={kembali}
          variant="outline"
          type="button"
          disabled={sibuk}
          onClick={() => (berubah ? setKonfirmasi(true) : batal())}
        >
          Kembali ke daftar
        </Button>
        {kegiatan && (
          <p className="text-sm text-ink-muted">
            Status saat ini: {STATUS_KEGIATAN[kegiatan.status]}
          </p>
        )}
      </div>
      <form
        ref={form}
        onSubmit={simpan}
        noValidate
        className="max-w-4xl space-y-6"
        aria-busy={sibuk}
      >
        <section
          className="space-y-5 rounded-xl border border-border bg-surface p-4 sm:p-6"
          aria-labelledby="judul-form-kegiatan"
        >
          <h2 id="judul-form-kegiatan" className="font-heading text-lg font-semibold">
            {kegiatan ? "Sunting kegiatan" : "Kegiatan baru"}
          </h2>
          <p className="text-sm text-ink-muted">
            Draf hanya terlihat oleh pengurus yang berhak. Kegiatan terbit tampil di agenda publik.
          </p>
          {field(
            "judul",
            "Judul kegiatan (wajib)",
            <input
              {...props("judul")}
              value={data.judul}
              maxLength={180}
              onChange={(e) => ubah("judul", e.target.value)}
              required
            />,
          )}
          {field(
            "slug",
            "Alamat kegiatan / slug (wajib)",
            <input
              {...props("slug")}
              value={data.slug}
              maxLength={120}
              onChange={(e) => {
                setOtomatis(false);
                ubah("slug", e.target.value);
              }}
              required
            />,
            kegiatan?.status === "terbit"
              ? "Mengubah slug membuat tautan lama tidak berlaku. Pertahankan bila sudah dibagikan."
              : "Dibuat dari judul; boleh diubah. Contoh: kerja-bakti-oktober.",
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
            "Maksimal 500 karakter. Wajib saat diajukan atau diterbitkan.",
          )}
          {field(
            "isi",
            "Detail kegiatan",
            <textarea
              {...props("isi")}
              rows={8}
              maxLength={20000}
              value={data.isi}
              onChange={(e) => ubah("isi", e.target.value)}
            />,
            "Tulis keterangan, persiapan, atau susunan acara. Pisahkan paragraf dengan baris kosong.",
          )}
          <div className="grid gap-5 sm:grid-cols-2">
            {field(
              "bidang_id",
              "Bidang",
              <select
                {...props("bidang_id")}
                value={data.bidang_id ?? ""}
                onChange={(e) => ubah("bidang_id", e.target.value || null)}
              >
                {(akses.bidangId === null || akses.role === "admin") && (
                  <option value="">Umum</option>
                )}
                {bidang
                  .filter(
                    (b) =>
                      (akses.bidangId === null && akses.role !== "anggota") ||
                      b.id === akses.bidangId,
                  )
                  .map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.nama_singkat}
                    </option>
                  ))}
              </select>,
            )}
            {field(
              "periode_id",
              "Periode (wajib)",
              <select
                {...props("periode_id")}
                value={data.periode_id}
                onChange={(e) => ubah("periode_id", e.target.value)}
                required
              >
                <option value="" disabled>
                  Pilih periode
                </option>
                {periode.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                    {p.aktif ? " · aktif" : ""}
                  </option>
                ))}
              </select>,
            )}
          </div>
        </section>
        <section
          className="space-y-5 rounded-xl border border-border bg-surface p-4 sm:p-6"
          aria-labelledby="judul-jadwal-kegiatan"
        >
          <h2 id="judul-jadwal-kegiatan" className="font-heading text-lg font-semibold">
            Jadwal dan pelaksanaan
          </h2>
          <p className="text-sm text-ink-muted">
            Semua tanggal dan jam memakai Waktu Indonesia Barat (WIB / UTC+7).
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            {field(
              "mulai",
              "Mulai (WIB)",
              <input
                {...props("mulai")}
                type="datetime-local"
                value={data.mulai}
                onInput={(e) => ubah("mulai", e.currentTarget.value)}
              />,
            )}
            {field(
              "selesai",
              "Selesai (WIB, opsional)",
              <input
                {...props("selesai")}
                type="datetime-local"
                value={data.selesai}
                onInput={(e) => ubah("selesai", e.currentTarget.value)}
              />,
            )}
          </div>
          {field(
            "rutin",
            "Jadwal rutin (opsional)",
            <input
              {...props("rutin")}
              value={data.rutin}
              maxLength={200}
              placeholder="Contoh: Setiap Jumat, pukul 19.30 WIB"
              onChange={(e) => ubah("rutin", e.target.value)}
            />,
            "Isi bila kegiatan berulang. Ini keterangan jadwal; tidak membuat acara kalender berulang secara otomatis.",
          )}
          {field(
            "lokasi",
            "Lokasi",
            <input
              {...props("lokasi")}
              value={data.lokasi}
              maxLength={300}
              onChange={(e) => ubah("lokasi", e.target.value)}
            />,
          )}
          {field(
            "tahap",
            "Tahap pelaksanaan",
            <select
              {...props("tahap")}
              value={data.tahap}
              onChange={(e) => ubah("tahap", e.target.value as FormulirKegiatan["tahap"])}
            >
              {Object.entries(TAHAP_KEGIATAN).map(([s, label]) => (
                <option key={s} value={s}>
                  {label}
                </option>
              ))}
            </select>,
            "Tahap pelaksanaan berbeda dari status publikasi. Acara batal tetap bisa diterbitkan sebagai pengumuman.",
          )}
        </section>
        {pesan && (
          <p
            role="alert"
            className="rounded-lg border border-destructive/30 bg-surface p-4 text-sm text-destructive"
          >
            {pesan}
          </p>
        )}
        <div className="rounded-xl border border-border bg-surface p-4 sm:p-6">
          <p className="mb-4 text-sm text-ink-muted">
            {bolehTerbit
              ? "Terbitkan agar kegiatan terlihat oleh warga. Simpan sebagai draf untuk menariknya dari halaman publik."
              : "Simpan draf untuk dilanjutkan, atau ajukan ke Kabid/BPH untuk diterbitkan."}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button type="submit" value="draft" variant="outline" disabled={sibuk}>
              {sibuk ? "Menyimpan…" : "Simpan draf"}
            </Button>
            <Button type="submit" value="review" variant="outline" disabled={sibuk}>
              Ajukan persetujuan
            </Button>
            {bolehTerbit && (
              <Button type="submit" value="terbit" disabled={sibuk}>
                {kegiatan?.status === "terbit" ? "Simpan perubahan terbit" : "Terbitkan kegiatan"}
              </Button>
            )}
          </div>
          {kegiatan?.status === "terbit" && (
            <Link
              to="/kegiatan/$slug"
              params={{ slug: kegiatan.slug }}
              className="mt-3 inline-flex min-h-11 items-center text-sm text-primary underline"
            >
              Lihat halaman publik
            </Link>
          )}
        </div>
      </form>
      <AlertDialog open={konfirmasi} onOpenChange={setKonfirmasi}>
        <AlertDialogContent
          data-admin-dialog
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            kembali.current?.focus();
          }}
          className="max-w-[calc(100%-2rem)] sm:max-w-lg"
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Tinggalkan perubahan?</AlertDialogTitle>
            <AlertDialogDescription>
              Isian yang belum disimpan akan hilang. Pilih lanjut menyunting untuk menyimpannya
              dulu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Lanjut menyunting</AlertDialogCancel>
            <AlertDialogAction onClick={batal}>Tinggalkan perubahan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
