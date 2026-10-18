import { useRef, useState, type PointerEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, RotateCcw, X, ZoomIn } from "lucide-react";
import type { MediaAlbum } from "@/domains/konten/types";
import { FotoGaleri } from "./FotoGaleri";
import { PemutarVideo } from "./PemutarVideo";

const tombol =
  "inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-white/30 px-3 text-sm hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-40";
type Titik = { x: number; y: number };
const jarak = (a: Titik, b: Titik) => Math.hypot(a.x - b.x, a.y - b.y);

export function LightboxGaleri({
  judul,
  media,
  index,
  onIndex,
  onClose,
  pemicu,
}: {
  judul: string;
  media: MediaAlbum[];
  index: number;
  onIndex: (index: number) => void;
  onClose: () => void;
  pemicu: HTMLButtonElement | null;
}) {
  const item = media[index];
  const pindah = (langkah: number) => onIndex((index + langkah + media.length) % media.length);
  return (
    <Dialog.Root
      open
      onOpenChange={(buka) => {
        if (!buka) onClose();
      }}
    >
      {/* Portal Radix menaruh overlay langsung di body, di luar main yang beranimasi. */}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-ink/95" />
        <Dialog.Content
          className="fixed inset-0 z-[101] flex h-dvh min-w-0 flex-col gap-3 p-3 text-white outline-none sm:p-6"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            pemicu?.focus();
          }}
          onKeyDown={(event) => {
            if ((event.target as HTMLElement).closest("video, iframe, input, textarea")) return;
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault();
              pindah(event.key === "ArrowLeft" ? -1 : 1);
            }
          }}
        >
          <header className="flex shrink-0 items-center justify-between gap-3">
            <Dialog.Title className="min-w-0 font-heading text-sm font-semibold line-clamp-2 sm:text-lg">
              {judul}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button type="button" aria-label="Tutup dokumentasi" className={tombol}>
                <X className="size-5" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </header>
          <Dialog.Description className="sr-only">
            Pratinjau dokumentasi. Gunakan panah kiri atau kanan untuk berpindah dan Escape untuk
            menutup.
          </Dialog.Description>
          <div className="min-h-0 min-w-0 flex-1">
            {item.jenis === "foto" ? (
              <FotoDiperbesar key={item.id} media={item} onGeser={pindah} />
            ) : (
              <PemutarVideo key={item.id} media={item} />
            )}
          </div>
          <footer className="shrink-0 space-y-2 pb-[env(safe-area-inset-bottom)]">
            <p className="max-h-20 overflow-y-auto break-words text-center text-sm text-white/90">
              {item.caption || `Dokumentasi ${index + 1}`}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                aria-label="Dokumentasi sebelumnya"
                disabled={media.length < 2}
                onClick={() => pindah(-1)}
                className={tombol}
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>
              <span
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="min-w-16 text-center text-sm tabular-nums"
              >
                {index + 1} / {media.length}
              </span>
              <button
                type="button"
                aria-label="Dokumentasi berikutnya"
                disabled={media.length < 2}
                onClick={() => pindah(1)}
                className={tombol}
              >
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>
            </div>
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function FotoDiperbesar({
  media,
  onGeser,
}: {
  media: MediaAlbum;
  onGeser: (langkah: number) => void;
}) {
  const [zoom, setZoom] = useState(1);
  const [posisi, setPosisi] = useState<Titik>({ x: 0, y: 0 });
  const area = useRef<HTMLDivElement>(null);
  const gerak = useRef({ zoom: 1, posisi: { x: 0, y: 0 } });
  const jari = useRef(new Map<number, Titik>());
  const awal = useRef<Titik | null>(null);
  const cubit = useRef<{ jarak: number; zoom: number } | null>(null);
  const bolehGeser = useRef(true);

  const atur = (nilai: number, titik = gerak.current.posisi) => {
    const z = Math.max(1, Math.min(3, nilai));
    const r = area.current?.getBoundingClientRect();
    const foto = area.current?.querySelector("img");
    const rasio =
      (media.lebar ?? (foto?.naturalWidth || 1200)) /
      (media.tinggi ?? (foto?.naturalHeight || 900));
    const lebar = r ? Math.min(r.width, r.height * rasio) : 0;
    const tinggi = r ? Math.min(r.height, r.width / rasio) : 0;
    const batasX = r ? Math.max(0, (lebar * z - r.width) / 2) : 0;
    const batasY = r ? Math.max(0, (tinggi * z - r.height) / 2) : 0;
    const p = {
      x: Math.max(-batasX, Math.min(batasX, titik.x)),
      y: Math.max(-batasY, Math.min(batasY, titik.y)),
    };
    gerak.current = { zoom: z, posisi: p };
    setZoom(z);
    setPosisi(p);
  };
  const selesai = (event: PointerEvent<HTMLDivElement>, batal = false) => {
    if (!jari.current.has(event.pointerId)) return;
    if (!batal && bolehGeser.current && awal.current && gerak.current.zoom === 1) {
      const dx = event.clientX - awal.current.x;
      const dy = event.clientY - awal.current.y;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.25) onGeser(dx < 0 ? 1 : -1);
    }
    jari.current.delete(event.pointerId);
    cubit.current = null;
    if (jari.current.size === 0) awal.current = null;
  };
  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <div className="flex shrink-0 flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          aria-label={zoom > 1 ? "Atur ulang zoom" : "Perbesar foto"}
          aria-pressed={zoom > 1}
          onClick={() => atur(zoom > 1 ? 1 : 2, { x: 0, y: 0 })}
          className={tombol}
        >
          {zoom > 1 ? (
            <RotateCcw className="size-4" aria-hidden="true" />
          ) : (
            <ZoomIn className="size-4" aria-hidden="true" />
          )}
          {zoom > 1 ? "Atur ulang" : "Perbesar"}
        </button>
        <span className="text-xs text-white/80">
          {Math.round(zoom * 100)}% · Geser foto atau cubit untuk zoom
        </span>
      </div>
      <div
        ref={area}
        role="region"
        aria-label="Area foto: geser untuk berpindah, cubit untuk memperbesar"
        className="relative min-h-0 flex-1 touch-none overflow-hidden rounded-lg"
        onDoubleClick={() => atur(gerak.current.zoom > 1 ? 1 : 2, { x: 0, y: 0 })}
        onPointerDown={(event) => {
          if (event.pointerType === "mouse" && event.button !== 0) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          const titik = { x: event.clientX, y: event.clientY };
          if (jari.current.size === 0) {
            awal.current = titik;
            bolehGeser.current = gerak.current.zoom === 1;
          }
          jari.current.set(event.pointerId, titik);
          if (jari.current.size === 2) {
            const [a, b] = [...jari.current.values()];
            cubit.current = { jarak: jarak(a, b), zoom: gerak.current.zoom };
            bolehGeser.current = false;
          }
        }}
        onPointerMove={(event) => {
          const lalu = jari.current.get(event.pointerId);
          if (!lalu) return;
          const titik = { x: event.clientX, y: event.clientY };
          jari.current.set(event.pointerId, titik);
          if (jari.current.size === 2 && cubit.current) {
            const [a, b] = [...jari.current.values()];
            if (cubit.current.jarak > 0)
              atur((cubit.current.zoom * jarak(a, b)) / cubit.current.jarak);
          } else if (jari.current.size === 1 && gerak.current.zoom > 1) {
            atur(gerak.current.zoom, {
              x: gerak.current.posisi.x + titik.x - lalu.x,
              y: gerak.current.posisi.y + titik.y - lalu.y,
            });
          }
        }}
        onPointerUp={(event) => selesai(event)}
        onPointerCancel={(event) => selesai(event, true)}
        onLostPointerCapture={(event) => selesai(event, true)}
      >
        <div
          className="pointer-events-none h-full w-full select-none"
          style={{ transform: `translate(${posisi.x}px, ${posisi.y}px) scale(${zoom})` }}
        >
          <FotoGaleri
            url={media.url}
            alt={media.caption || "Foto dokumentasi"}
            lebar={media.lebar}
            tinggi={media.tinggi}
            loading="eager"
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
