import { useEffect, useRef, useState } from "react";
import { ImageOff } from "lucide-react";

/** Ukuran tetap disediakan untuk foto lama yang belum mempunyai metadata dimensi. */
export function FotoGaleri({
  url,
  alt,
  lebar,
  tinggi,
  className = "h-auto w-full object-cover",
  loading = "lazy",
  fallbackUrl = null,
  fetchPriority,
}: {
  url: string | null;
  alt: string;
  lebar?: number | null;
  tinggi?: number | null;
  className?: string;
  loading?: "lazy" | "eager";
  fallbackUrl?: string | null;
  fetchPriority?: "high" | "low" | "auto";
}) {
  const [gagal, setGagal] = useState<string[]>([]);
  const gambarRef = useRef<HTMLImageElement>(null);
  const gambar = [url, fallbackUrl].find(
    (u): u is string => typeof u === "string" && u.length > 0 && !gagal.includes(u),
  );
  useEffect(() => {
    // Error gambar SSR bisa terjadi sebelum handler React terpasang.
    const img = gambarRef.current;
    if (gambar && img?.complete && img.naturalWidth === 0) {
      setGagal((lama) => (lama.includes(gambar) ? lama : [...lama, gambar]));
    }
  }, [gambar]);
  if (!gambar) {
    return (
      <span className="flex h-full min-h-44 w-full flex-col items-center justify-center gap-2 bg-muted-surface p-5 text-center text-sm text-ink-muted">
        <ImageOff className="size-6" aria-hidden="true" />
        Foto belum tersedia
      </span>
    );
  }
  return (
    <img
      ref={gambarRef}
      src={gambar}
      alt={alt}
      width={lebar ?? 1200}
      height={tinggi ?? 900}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding="async"
      draggable={false}
      onError={() => setGagal((lama) => (lama.includes(gambar) ? lama : [...lama, gambar]))}
      className={className}
    />
  );
}
