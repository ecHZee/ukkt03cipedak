import { cn } from "@/lib/utils";
import { useState, useRef, type ReactNode } from "react";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
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
import { AdminShell } from "@/components/admin/AdminShell";
import { PeringatanIsian } from "@/components/admin/PeringatanIsian";
import { useIsianBelumDisimpan } from "@/hooks/use-isian-belum-disimpan";
import { useAkun } from "@/hooks/use-akun";
import { pengaturanForm, pathTampilan, type IsianSitus } from "@/lib/pengaturan-admin";
import {
  ruangPengaturanFn,
  simpanPengaturanFn,
  bersihkanAsetSitusFn,
  buangUnggahanSitusFn,
} from "@/services/pengaturan-admin.functions";
import { unggahAsetSitus, urlPublik } from "@/services/storage";

export const Route = createFileRoute("/admin/settings")({
  beforeLoad: ({ context }) => {
    if (!context.akun?.lintasBidang) throw redirect({ to: "/admin/dashboard" });
  },
  loader: () => ruangPengaturanFn(),
  component: Page,
});
const input =
  "mt-1 min-h-11 w-full min-w-0 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";
const tombol =
  "min-h-11 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-semibold disabled:opacity-50";
function Page() {
  const awal = Route.useLoaderData();
  const [pesan, setPesan] = useState("");
  return <Form key={JSON.stringify(awal.versi)} awal={awal} pesan={pesan} setPesan={setPesan} />;
}
function Form({
  awal,
  pesan,
  setPesan,
}: {
  awal: Awaited<ReturnType<typeof ruangPengaturanFn>>;
  pesan: string;
  setPesan: (s: string) => void;
}) {
  const akun = useAkun(),
    router = useRouter();
  const [nilai, setNilai] = useState<IsianSitus>(() => structuredClone(awal.nilai));
  const [sibuk, setSibuk] = useState(false),
    [error, setError] = useState("");
  const [izin, setIzin] = useState(false);
  const [konfirmasi, setKonfirmasi] = useState<"simpan" | "batal" | null>(null);
  const unggahan = useRef<string[]>([]);
  const berubah = JSON.stringify(nilai) !== JSON.stringify(awal.nilai);
  const { penjagaan } = useIsianBelumDisimpan(berubah || sibuk);
  const tampilan = nilai["situs.tampilan"];
  function set<K extends keyof IsianSitus>(k: K, v: IsianSitus[K]) {
    setNilai((n) => ({ ...n, [k]: v }));
    setPesan("");
  }
  async function gambar(file: File | undefined, slot: number) {
    if (!file) return;
    setError("");
    setSibuk(true);
    try {
      if (!izin) throw new Error("Centang izin publikasi gambar lebih dulu.");
      const path = await unggahAsetSitus(file, akun.id, slot === -1);
      unggahan.current.push(path);
      setNilai((n) => {
        const t = n["situs.tampilan"];
        return {
          ...n,
          "situs.tampilan":
            slot === -1
              ? { ...t, logo: path }
              : { ...t, foto: t.foto.map((f, i) => (i === slot ? { ...f, path } : f)) },
        };
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gambar belum terunggah.");
    } finally {
      setSibuk(false);
    }
  }
  async function buangSementara(keep: string[]) {
    let gagal = false;
    for (const path of unggahan.current.filter((p) => !keep.includes(p))) {
      try {
        await buangUnggahanSitusFn({ data: { path } });
      } catch {
        gagal = true;
      }
    }
    if (!gagal) unggahan.current = [];
    return gagal;
  }
  function mintaSimpan(e: React.FormEvent) {
    e.preventDefault();
    const cek = pengaturanForm.safeParse(nilai);
    if (!cek.success) {
      setError(cek.error.issues.map((i) => `${i.path.join(" · ")}: ${i.message}`).join(" "));
      return;
    }
    setKonfirmasi("simpan");
  }
  async function simpan() {
    setError("");
    setPesan("");
    const cek = pengaturanForm.safeParse(nilai);
    if (!cek.success) {
      setError(cek.error.issues.map((i) => `${i.path.join(" · ")}: ${i.message}`).join(" "));
      return;
    }
    setSibuk(true);
    try {
      const r = await simpanPengaturanFn({ data: { nilai: cek.data, versi: awal.versi } });
      setNilai(r.nilai);
      const sisa = await buangSementara(pathTampilan(cek.data["situs.tampilan"]));
      setPesan(
        r.peringatan ||
          (sisa
            ? "Tersimpan; sebagian unggahan sementara belum terhapus."
            : "Pengaturan tersimpan dan tampilan publik diperbarui."),
      );
      try {
        await router.invalidate();
      } catch {
        setPesan(
          "Pengaturan tersimpan. Tampilan belum berhasil dimuat ulang; segarkan halaman sebelum menyunting lagi.",
        );
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Pengaturan belum tersimpan.");
    } finally {
      setSibuk(false);
    }
  }
  async function batal() {
    setSibuk(true);
    try {
      const gagal = await buangSementara([]);
      if (gagal) throw new Error("Sebagian unggahan belum dibersihkan. Coba lagi.");
      setNilai(structuredClone(awal.nilai));
      setError("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSibuk(false);
    }
  }
  const teks = (k: keyof IsianSitus, label: string, type = "text") => (
    <label className="block min-w-0">
      <span className="text-sm font-medium">{label}</span>
      <input
        className={input}
        type={type}
        value={String(nilai[k])}
        onChange={(e) => set(k, e.target.value as never)}
      />
    </label>
  );
  return (
    <AdminShell
      title="Pengaturan website"
      description="Kelola identitas, kontak resmi, pengumuman, dan gambar yang tampil di website."
    >
      <PeringatanIsian penjagaan={penjagaan} />
      <AlertDialog
        open={!!konfirmasi}
        onOpenChange={(open) => {
          if (!open) setKonfirmasi(null);
        }}
      >
        <AlertDialogContent data-admin-dialog className="max-w-[calc(100%-2rem)] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {konfirmasi === "simpan" ? "Simpan pengaturan website?" : "Batalkan perubahan?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {konfirmasi === "simpan"
                ? "Isian kontak, pengumuman, logo, dan foto akan tampil di website publik."
                : "Isian yang belum disimpan akan dibuang dan gambar sementara akan dibersihkan."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Lanjut menyunting</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (konfirmasi === "simpan") void simpan();
                else void batal();
              }}
            >
              {konfirmasi === "simpan" ? "Ya, simpan" : "Ya, batalkan"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <form onSubmit={mintaSimpan} className="max-w-5xl space-y-6">
        {error && (
          <p
            role="alert"
            className="rounded-lg border border-danger/30 bg-danger/5 p-4 text-sm text-danger"
          >
            {error}
          </p>
        )}
        {pesan && (
          <p role="status" className="rounded-lg border border-border p-4 text-sm">
            {pesan}
          </p>
        )}
        <fieldset disabled={sibuk} className="min-w-0 space-y-6 disabled:opacity-70">
          <Bagian title="Identitas organisasi">
            <div className="grid gap-4 sm:grid-cols-2">
              {teks("organisasi.nama", "Nama organisasi")}
              {teks("organisasi.wilayah", "Wilayah")}
              <label className="block">
                <span className="text-sm font-medium">Jumlah RT</span>
                <input
                  type="number"
                  min={1}
                  max={1000}
                  className={input}
                  value={nilai["organisasi.jumlah_rt"]}
                  onChange={(e) => set("organisasi.jumlah_rt", Number(e.target.value))}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Kalimat pembuka beranda</span>
                <input
                  className={input}
                  maxLength={180}
                  value={tampilan.tagline}
                  placeholder="Kosong = kalimat bawaan"
                  onChange={(e) => set("situs.tampilan", { ...tampilan, tagline: e.target.value })}
                />
              </label>
            </div>
          </Bagian>
          <Bagian title="Kontak dan kanal resmi">
            <p className="mb-4 text-sm text-ink-muted">
              Isian kosong disembunyikan. Gunakan kontak yang disepakati untuk dipublikasikan.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {teks("kontak.whatsapp", "WhatsApp sekretariat (08 atau 62)", "tel")}
              {teks("kontak.email", "Email organisasi", "email")}
              {teks("kontak.alamat", "Alamat sekretariat")}
              {teks("kontak.maps_url", "Tautan Google Maps", "url")}
              {teks("sosmed.instagram", "Tautan Instagram", "url")}
              {teks("sosmed.tiktok", "Tautan TikTok", "url")}
              {teks("sosmed.youtube", "Tautan YouTube", "url")}
            </div>
          </Bagian>
          <Bagian title="Pengumuman beranda">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium">Isi pengumuman</span>
                <textarea
                  className={input}
                  maxLength={300}
                  value={nilai.pengumuman.teks}
                  onChange={(e) => set("pengumuman", { ...nilai.pengumuman, teks: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Tautan tujuan (opsional)</span>
                <input
                  className={input}
                  placeholder="/kegiatan atau https://…"
                  value={nilai.pengumuman.tautan}
                  onChange={(e) =>
                    set("pengumuman", { ...nilai.pengumuman, tautan: e.target.value })
                  }
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Terakhir tampil (WIB, opsional)</span>
                <input
                  type="date"
                  className={input}
                  value={nilai.pengumuman.sampai}
                  onChange={(e) =>
                    set("pengumuman", { ...nilai.pengumuman, sampai: e.target.value })
                  }
                />
              </label>
            </div>
            <p className="mt-3 text-sm text-ink-muted">
              Kosongkan isi untuk menyembunyikan pengumuman. Tanggal berlaku sampai pukul 23.59 WIB.
            </p>
          </Bagian>
          <Bagian title="Logo dan foto beranda">
            <p className="text-sm text-ink-muted">
              JPG, PNG, atau WebP, maksimal 10 MB. Logo persegi minimal 512 × 512 piksel; foto
              mendatar 4:3, disarankan 1600 × 1200 piksel. Letakkan subjek di tengah karena tepi
              foto bisa terpotong.
            </p>
            <label className="my-4 flex items-start gap-3 text-sm">
              <input
                className="mt-1 size-5 shrink-0"
                type="checkbox"
                checked={izin}
                onChange={(e) => setIzin(e.target.checked)}
              />
              <span>
                Saya memastikan gambar boleh dipublikasikan, menghormati izin orang di dalamnya, dan
                tidak memuat data pribadi atau materi politik.
              </span>
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <Gambar
                judul="Logo organisasi"
                path={tampilan.logo}
                logo
                disabled={!izin}
                unggah={(f) => gambar(f, -1)}
                hapus={() => set("situs.tampilan", { ...tampilan, logo: "" })}
              />
              {tampilan.foto.map((f, i) => (
                <div key={i}>
                  <Gambar
                    judul={`Foto beranda ${i + 1}`}
                    path={f.path}
                    disabled={!izin}
                    unggah={(file) => gambar(file, i)}
                    hapus={() =>
                      set("situs.tampilan", {
                        ...tampilan,
                        foto: tampilan.foto.map((p, n) => (n === i ? { ...p, path: "" } : p)),
                      })
                    }
                  />
                  <label className="mt-2 block">
                    <span className="text-sm font-medium">Keterangan foto {i + 1}</span>
                    <input
                      className={input}
                      maxLength={100}
                      value={f.caption}
                      onChange={(e) =>
                        set("situs.tampilan", {
                          ...tampilan,
                          foto: tampilan.foto.map((p, n) =>
                            n === i ? { ...p, caption: e.target.value } : p,
                          ),
                        })
                      }
                    />
                  </label>
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm text-ink-muted">
              Kosongkan logo untuk memakai logo resmi bawaan. Foto kosong memakai tempat dokumentasi
              bawaan.
            </p>
          </Bagian>
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={!berubah}
              className={cn(tombol, "bg-primary text-primary-foreground")}
            >
              {sibuk ? "Memproses…" : "Simpan pengaturan"}
            </button>
            <button type="button" className={tombol} onClick={() => setKonfirmasi("batal")}>
              Batalkan perubahan
            </button>
          </div>
          {awal.tertunda > 0 && (
            <div>
              <p className="mb-2 text-sm text-ink-muted">
                Unggahan yang belum dipakai dilindungi satu jam. Setelah itu, tombol ini dapat
                membersihkannya.
              </p>
              <button
                type="button"
                className={tombol}
                onClick={async () => {
                  setSibuk(true);
                  try {
                    await bersihkanAsetSitusFn();
                    await router.invalidate();
                  } catch (e) {
                    setError((e as Error).message);
                  } finally {
                    setSibuk(false);
                  }
                }}
              >
                Bersihkan berkas lama ({awal.tertunda})
              </button>
            </div>
          )}
        </fieldset>
      </form>
    </AdminShell>
  );
}
function Bagian({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="min-w-0 rounded-xl border border-border bg-surface p-4 sm:p-5">
      <h2 className="mb-4 font-heading text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}
function Gambar({
  judul,
  path,
  logo,
  disabled,
  unggah,
  hapus,
}: {
  judul: string;
  path: string;
  logo?: boolean;
  disabled: boolean;
  unggah: (f: File | undefined) => void;
  hapus: () => void;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-sm font-semibold">{judul}</p>
      <div
        className={`${logo ? "size-32" : "aspect-[4/3] w-full"} overflow-hidden rounded-xl border border-border bg-muted-surface`}
      >
        {path || logo ? (
          <img
            src={path ? urlPublik("media", path)! : "/logo/logo-192.webp"}
            alt={`Pratinjau ${judul}`}
            className={`size-full ${logo ? "object-contain" : "object-cover"}`}
          />
        ) : (
          <p className="flex h-full items-center justify-center text-sm text-ink-muted">
            Belum ada foto
          </p>
        )}
      </div>
      <label className="mt-3 block text-sm">
        {`Unggah ${judul.toLowerCase()}`}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={disabled}
          className="mt-2 block w-full min-w-0 text-sm file:mr-2 file:min-h-11 file:rounded-md file:border file:border-border file:bg-muted-surface file:px-3 file:text-ink"
          onChange={(e) => {
            unggah(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </label>
      {path && (
        <button
          type="button"
          onClick={hapus}
          className="mt-2 min-h-11 text-sm font-semibold text-danger"
        >
          Kosongkan {judul.toLowerCase()}
        </button>
      )}
    </div>
  );
}
