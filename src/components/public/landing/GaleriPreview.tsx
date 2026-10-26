import { Link } from "@tanstack/react-router";
import { FotoGaleri } from "@/components/public/FotoGaleri";
import type { Album } from "@/domains/konten/types";
import { urlPratinjauMedia } from "@/lib/pratinjau-media";

/** Pratinjau album memakai sampul yang sama dengan daftar dan detail galeri. */
export function GaleriPreview({ albums }: { albums: Album[] }) {
  const tersedia = albums.filter((a) => a.sampul && a.jumlahMedia > 0).slice(0, 6);
  if (!tersedia.length) return null;
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
      {tersedia.map((a) => (
        <Link
          key={a.id}
          to="/galeri/$album"
          params={{ album: a.slug }}
          className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-muted-surface"
        >
          <FotoGaleri
            url={urlPratinjauMedia(a.sampul!.url)}
            fallbackUrl={a.sampul!.url}
            fetchPriority="low"
            alt={a.sampul!.caption || a.judul}
            className="h-full w-full object-cover"
          />
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-3 pb-3 pt-9 text-sm font-semibold text-white">
            {a.judul}
            <span className="mt-1 block text-xs font-normal">{a.jumlahMedia} dokumentasi</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
