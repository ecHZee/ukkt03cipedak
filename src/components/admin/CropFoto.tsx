import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useIsianBelumDisimpan } from "@/hooks/use-isian-belum-disimpan";
import { PeringatanIsian } from "./PeringatanIsian";
import { areaPotret } from "@/lib/crop-potret";
/** Pemilihan belum mengunggah apa pun; parent menyimpan sesudah persetujuan foto. */
export function CropFoto({
  onPilih,
  disabled = false,
}: {
  onPilih: (file: File) => void;
  disabled?: boolean;
}) {
  const [file, setFile] = useState<File | null>(null),
    [url, setUrl] = useState(""),
    [size, setSize] = useState({ w: 0, h: 0 }),
    [zoom, setZoom] = useState(1),
    [x, setX] = useState(50),
    [y, setY] = useState(35),
    [galat, setGalat] = useState(""),
    [sibuk, setSibuk] = useState(false);
  const img = useRef<HTMLImageElement>(null);
  const { penjagaan } = useIsianBelumDisimpan(!!file);
  useEffect(() => {
    if (!file) return;
    const u = URL.createObjectURL(file);
    setUrl(u);
    setSize({ w: 0, h: 0 });
    return () => URL.revokeObjectURL(u);
  }, [file]);
  const area = size.w ? areaPotret(size.w, size.h, zoom, x, y) : null;
  const tampilan = area
    ? {
        width: `${(size.w / area.sw) * 100}%`,
        height: `${(size.h / area.sh) * 100}%`,
        left: `${(-area.sx / area.sw) * 100}%`,
        top: `${(-area.sy / area.sh) * 100}%`,
      }
    : {};
  async function gunakan() {
    if (!area || !img.current) return;
    setSibuk(true);
    try {
      const c = document.createElement("canvas");
      c.width = Math.max(3, Math.floor(Math.min(900, area.sw) / 3) * 3);
      c.height = (c.width * 4) / 3;
      const ctx = c.getContext("2d");
      if (!ctx) throw new Error("Pemrosesan foto belum tersedia.");
      ctx.drawImage(img.current, area.sx, area.sy, area.sw, area.sh, 0, 0, c.width, c.height);
      const b = await new Promise<Blob | null>((r) => c.toBlob(r, "image/webp", 0.85));
      if (!b) throw new Error("Foto belum dapat dirapikan.");
      onPilih(new File([b], "potret.webp", { type: "image/webp" }));
      setFile(null);
    } catch (e) {
      setGalat(e instanceof Error ? e.message : "Foto belum siap.");
    } finally {
      setSibuk(false);
    }
  }
  return (
    <div className="space-y-3">
      <PeringatanIsian penjagaan={penjagaan} />
      <label className="inline-flex min-h-11 cursor-pointer items-center rounded-md border bg-surface px-4 text-sm font-semibold focus-within:outline focus-within:outline-2 focus-within:outline-primary">
        Pilih foto
        <input
          aria-label="Pilih foto potret"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={disabled}
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (!f) return;
            if (
              !["image/jpeg", "image/png", "image/webp"].includes(f.type) ||
              f.size > 20971520 ||
              f.size === 0
            ) {
              setGalat("Pilih JPG, PNG atau WebP maksimal 20 MB.");
              return;
            }
            setGalat("");
            setZoom(1);
            setX(50);
            setY(35);
            setFile(f);
          }}
        />
      </label>
      {galat && (
        <p role="alert" className="text-sm text-destructive">
          {galat}
        </p>
      )}
      <Dialog
        open={!!file}
        onOpenChange={(o) => {
          if (!o && !sibuk) setFile(null);
        }}
      >
        <DialogContent data-admin-dialog className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Rapikan foto pengurus</DialogTitle>
            <DialogDescription>
              Posisikan wajah dan bahu di tengah. Potongan tegak untuk profil; bagian persegi
              memperlihatkan avatar. Foto belum diunggah.
            </DialogDescription>
          </DialogHeader>
          <div className="mx-auto w-full max-w-60">
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted-surface">
              {url && (
                <img
                  ref={img}
                  src={url}
                  alt="Pratinjau potret"
                  onLoad={(e) =>
                    setSize({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })
                  }
                  onError={() => setGalat("Gambar tidak dapat dibuka. Pilih file lain.")}
                  className="absolute max-w-none"
                  style={tampilan}
                />
              )}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-[12.5%] aspect-square border-2 border-dashed border-white shadow-[0_0_0_100px_#0003]"
              />
            </div>
            <p className="mt-2 text-center text-xs text-ink-muted">
              Garis persegi: batas avatar di kartu
            </p>
          </div>
          {area && url && (
            <div className="flex items-center justify-center gap-3">
              <div className="relative size-20 overflow-hidden rounded-lg border bg-muted-surface">
                <img
                  src={url}
                  alt="Pratinjau avatar persegi"
                  className="absolute max-w-none"
                  style={{
                    width: `${(size.w / area.sw) * 100}%`,
                    height: `${(size.h / area.sw) * 100}%`,
                    left: `${(-area.sx / area.sw) * 100}%`,
                    top: `${(-(area.sy + area.sw / 6) / area.sw) * 100}%`,
                  }}
                />
              </div>
              <p className="text-xs text-ink-muted">Avatar pada kartu pengurus</p>
            </div>
          )}
          {(
            [
              ["Perbesar", zoom, 1, 3, 0.05, setZoom],
              ["Geser kiri–kanan", x, 0, 100, 1, setX],
              ["Geser atas–bawah", y, 0, 100, 1, setY],
            ] as const
          ).map(([label, value, min, max, step, set]) => (
            <label key={label} className="block text-sm">
              {label}
              <input
                type="range"
                aria-label={label}
                min={min}
                max={max}
                step={step}
                value={value}
                disabled={sibuk}
                onChange={(e) => set(Number(e.target.value))}
                className="mt-2 block min-h-11 w-full accent-primary"
              />
            </label>
          ))}
          <div className="flex flex-wrap gap-3">
            <Button disabled={!area || sibuk} onClick={() => void gunakan()}>
              Gunakan potongan ini
            </Button>
            <Button variant="outline" disabled={sibuk} onClick={() => setFile(null)}>
              Batal
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
