import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { unggahMediaAlbum } from "@/services/storage";
import { BATAS_GALERI, cekFileAlbum } from "@/lib/galeri-admin";
import { useIsianBelumDisimpan } from "@/hooks/use-isian-belum-disimpan";
import { PeringatanIsian } from "./PeringatanIsian";
type Item = {
  id: string;
  file: File;
  status: "menunggu" | "proses" | "selesai" | "gagal";
  persen: number;
  pesan: string;
};
export function AntreanGaleri({
  albumId,
  kunci,
  onSibuk,
  onSelesai,
}: {
  albumId: string;
  kunci: boolean;
  onSibuk: (b: boolean) => void;
  onSelesai: () => Promise<void>;
}) {
  const [items, setItems] = useState<Item[]>([]),
    [jalan, setJalan] = useState(false),
    [pesan, setPesan] = useState(""),
    [online, setOnline] = useState(navigator.onLine);
  const daftar = useRef(items),
    berjalan = useRef(false),
    kontrol = useRef<AbortController | null>(null),
    hidup = useRef(true),
    menungguOnline = useRef(false),
    proses = useRef(false),
    lanjut = useRef<() => void>(() => {});
  const tertunda = items.some((i) => i.status !== "selesai");
  const { penjagaan } = useIsianBelumDisimpan(tertunda);
  const ubah = (id: string, n: Partial<Item>) => {
    daftar.current = daftar.current.map((i) => (i.id === id ? { ...i, ...n } : i));
    if (hidup.current) setItems(daftar.current);
  };
  useEffect(() => {
    onSibuk(tertunda || jalan);
  }, [tertunda, jalan, onSibuk]);
  useEffect(() => {
    hidup.current = true;
    const koneksi = () => {
      setOnline(navigator.onLine);
      if (!navigator.onLine && proses.current) {
        menungguOnline.current = true;
        berjalan.current = false;
        kontrol.current?.abort();
      }
      if (navigator.onLine && menungguOnline.current && !proses.current) lanjut.current();
    };
    window.addEventListener("online", koneksi);
    window.addEventListener("offline", koneksi);
    return () => {
      hidup.current = false;
      berjalan.current = false;
      kontrol.current?.abort();
      window.removeEventListener("online", koneksi);
      window.removeEventListener("offline", koneksi);
    };
  }, []);
  async function mulai() {
    if (proses.current || kunci) return;
    proses.current = true;
    menungguOnline.current = false;
    berjalan.current = true;
    setJalan(true);
    setPesan("");
    for (const i of daftar.current) {
      if (!berjalan.current) break;
      if (i.status === "selesai") continue;
      let berhasil = false;
      for (let coba = 0; coba < 3 && berjalan.current; coba++) {
        if (!navigator.onLine) {
          ubah(i.id, {
            status: "menunggu",
            pesan: "Menunggu koneksi; dilanjutkan otomatis setelah tersambung.",
          });
          menungguOnline.current = true;
          berjalan.current = false;
          break;
        }
        kontrol.current = new AbortController();
        ubah(i.id, {
          status: "proses",
          pesan: coba ? `Mencoba lagi (${coba + 1}/3)` : "Menyiapkan",
        });
        try {
          await unggahMediaAlbum(
            i.file,
            albumId,
            (persen, pesan) => ubah(i.id, { persen, pesan }),
            kontrol.current.signal,
          );
          ubah(i.id, { status: "selesai", persen: 100, pesan: "Tersimpan" });
          berhasil = true;
          break;
        } catch (e) {
          if (!berjalan.current || kontrol.current.signal.aborted) {
            ubah(i.id, {
              status: "menunggu",
              pesan: menungguOnline.current
                ? "Menunggu koneksi; akan dilanjutkan otomatis"
                : "Dijeda; bisa dilanjutkan",
            });
            break;
          }
          ubah(i.id, {
            status: "gagal",
            pesan: e instanceof Error ? e.message : "Unggahan gagal.",
          });
          if (coba < 2) await new Promise((r) => setTimeout(r, (coba + 1) * 1500));
        }
      }
      if (!berhasil && !berjalan.current) break;
    }
    berjalan.current = false;
    if (hidup.current) {
      setJalan(false);
      setPesan(
        daftar.current.every((i) => i.status === "selesai")
          ? "Semua file tersimpan. Antrean dapat dikosongkan."
          : "Antrean belum selesai. Klik lanjutkan untuk mencoba file yang tersisa.",
      );
      if (navigator.onLine)
        try {
          await onSelesai();
        } catch {
          setPesan(
            "Unggahan tersimpan sesuai progres. Daftar media belum dapat dimuat ulang; coba lagi saat koneksi stabil.",
          );
        }
    }
    proses.current = false;
    if (hidup.current && menungguOnline.current && navigator.onLine) lanjut.current();
  }
  lanjut.current = () => void mulai();
  return (
    <section
      aria-labelledby="judul-antrean"
      className="space-y-4 rounded-xl border bg-surface p-4 sm:p-5"
    >
      <PeringatanIsian penjagaan={penjagaan} />
      <h2 id="judul-antrean" className="font-heading text-lg font-semibold">
        Unggah foto dan video
      </h2>
      <p className="text-sm text-ink-muted">
        Pilih sampai 40 file sekali pilih, maksimal 200 media per album. Foto JPG/PNG/WebP maksimal
        20 MB dikompres menjadi WebP 1920 px. Video MP4/WebM/MOV maksimal 200 MB; MP4/WebM paling
        mudah diputar. File asli tetap di Drive.
      </p>
      <label className="block text-sm font-semibold">
        Pilih file dokumentasi
        <input
          className="mt-2 block min-h-11 w-full max-w-full text-sm file:mr-3 file:min-h-11 file:rounded-lg file:border file:bg-surface file:px-3"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
          disabled={jalan || kunci || tertunda}
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            e.target.value = "";
            setPesan("");
            try {
              if (files.length > BATAS_GALERI.antrean)
                throw new Error("Pilih maksimal 40 file dalam satu antrean.");
              for (const f of files) cekFileAlbum(f);
              const n = files.map((file) => ({
                id: crypto.randomUUID(),
                file,
                status: "menunggu" as const,
                persen: 0,
                pesan: "Menunggu",
              }));
              daftar.current = n;
              setItems(n);
            } catch (e) {
              setPesan(e instanceof Error ? e.message : "Pilihan file tidak valid.");
            }
          }}
        />
      </label>
      <p className="text-sm" role="status">
        {items.filter((i) => i.status === "selesai").length}/{items.length} file tersimpan
        {!online ? " · Koneksi terputus" : ""}
        {pesan ? ` · ${pesan}` : ""}
      </p>
      {!!items.length && (
        <div className="flex flex-wrap gap-2">
          <Button disabled={jalan || kunci || !online || !tertunda} onClick={() => void mulai()}>
            Mulai / lanjutkan unggahan
          </Button>
          <Button
            variant="outline"
            disabled={!jalan && !menungguOnline.current}
            onClick={() => {
              menungguOnline.current = false;
              berjalan.current = false;
              kontrol.current?.abort();
              setPesan("Antrean dijeda. Klik lanjutkan untuk melanjutkan secara manual.");
            }}
          >
            Jeda
          </Button>
          <Button
            variant="outline"
            disabled={jalan}
            onClick={() => {
              if (
                tertunda &&
                !window.confirm(
                  "Kosongkan antrean? File yang sudah tersimpan tetap ada. Untuk melanjutkan nanti, pilih ulang file yang sama; gunakan Bersihkan unggahan bila ingin membuang reservasinya.",
                )
              )
                return;
              menungguOnline.current = false;
              daftar.current = [];
              setItems([]);
              setPesan("");
            }}
          >
            Kosongkan antrean
          </Button>
        </div>
      )}
      {tertunda && (
        <p className="text-sm text-ink-muted">
          Biarkan tab terbuka; antrean dilanjutkan otomatis saat koneksi pulih. Tombol Jeda
          menghentikan kelanjutan otomatis. Setelah tab tertutup, pilih ulang file yang sama untuk
          melanjutkan; file yang sudah tersimpan tidak digandakan.
        </p>
      )}
      {!!items.length && (
        <ol className="max-h-80 space-y-3 overflow-y-auto" aria-label="Antrean unggahan">
          {items.map((i, n) => (
            <li key={i.id} className="min-w-0 rounded-lg border p-3 text-sm">
              <p className="break-all font-semibold">
                {n + 1}. {i.file.name}
              </p>
              <p className="mt-1 break-words">
                {i.pesan} · {i.persen}%
              </p>
              <progress
                className="mt-2 h-2 w-full"
                value={i.persen}
                max={100}
                aria-label={`Progres ${i.file.name}`}
              />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
