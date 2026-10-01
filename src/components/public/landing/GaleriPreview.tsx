import { Link } from "@tanstack/react-router";
import { ImageIcon } from "lucide-react";
import { Placeholder } from "@/components/public/Placeholder";
import type { Album } from "@/domains/konten/types";

/** Pratinjau album terbaru. Foto asli tampil setelah Storage siap (Hari 8). */
export function GaleriPreview({ albums }: { albums: Album[] }) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 lg:grid-cols-6">
      {albums.slice(0, 6).map((a, i) => (
        <Link
          key={a.id}
          to="/galeri"
          className={`relative ${i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"}`}
        >
          <Placeholder
            label={a.judul}
            caption={`${a.jumlahMedia} dokumentasi`}
            icon={ImageIcon}
            tone={i % 3 === 1 ? "accent" : "neutral"}
          />
        </Link>
      ))}
    </div>
  );
}
