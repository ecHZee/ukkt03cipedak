import { useRef, useState } from "react";
import { Image as ImageIcon, Play } from "lucide-react";
import type { AlbumDetail } from "@/domains/konten/types";
import { EmptyState } from "@/components/shared/EmptyState";
import { FotoGaleri } from "./FotoGaleri";
import { LightboxGaleri } from "./LightboxGaleri";

export function IsiAlbum({ album }: { album: AlbumDetail }) {
  const [aktif, setAktif] = useState<number | null>(null);
  const pemicu = useRef<HTMLButtonElement | null>(null);
  if (album.media.length === 0)
    return (
      <EmptyState
        icon={ImageIcon}
        title="Dokumentasi belum tersedia"
        description="Foto dan video album ini akan ditambahkan oleh pengurus."
      />
    );
  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>figure]:mb-4 [&>figure]:break-inside-avoid">
        {album.media.map((m, index) => (
          <figure
            key={m.id}
            className="overflow-hidden rounded-xl border border-border bg-surface shadow-tile"
          >
            <button
              type="button"
              aria-label={`Buka dokumentasi ${index + 1}: ${m.caption || album.judul}`}
              aria-haspopup="dialog"
              onClick={(event) => {
                pemicu.current = event.currentTarget;
                setAktif(index);
              }}
              className="block min-h-11 w-full overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
            >
              {m.jenis === "foto" ? (
                <FotoGaleri
                  url={m.url}
                  alt={m.caption || `${album.judul} — foto ${index + 1}`}
                  lebar={m.lebar}
                  tinggi={m.tinggi}
                />
              ) : (
                <span className="flex aspect-video flex-col items-center justify-center gap-3 bg-muted-surface p-5 text-sm font-semibold text-primary">
                  <Play className="size-9" aria-hidden="true" />{" "}
                  {m.jenis === "embed" ? "Video dari tautan" : "Putar video"}
                </span>
              )}
            </button>
            {m.caption && (
              <figcaption className="break-words px-4 py-3 text-sm text-ink-muted">
                {m.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
      {aktif !== null && (
        <LightboxGaleri
          judul={album.judul}
          media={album.media}
          index={aktif}
          onIndex={setAktif}
          onClose={() => setAktif(null)}
          pemicu={pemicu.current}
        />
      )}
    </>
  );
}
