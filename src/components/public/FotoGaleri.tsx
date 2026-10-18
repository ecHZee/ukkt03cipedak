import { useState } from "react";
import { ImageOff } from "lucide-react";

/** Ukuran tetap disediakan untuk foto lama yang belum mempunyai metadata dimensi. */
export function FotoGaleri({
  url,
  alt,
  lebar,
  tinggi,
  className = "h-auto w-full object-cover",
  loading = "lazy",
}: {
  url: string | null;
  alt: string;
  lebar?: number | null;
  tinggi?: number | null;
  className?: string;
  loading?: "lazy" | "eager";
}) {
  const [gagal, setGagal] = useState<string | null>(null);
  if (!url || gagal === url) {
    return (
      <span className="flex h-full min-h-44 w-full flex-col items-center justify-center gap-2 bg-muted-surface p-5 text-center text-sm text-ink-muted">
        <ImageOff className="size-6" aria-hidden="true" />
        Foto belum tersedia
      </span>
    );
  }
  return (
    <img
      src={url}
      alt={alt}
      width={lebar ?? 1200}
      height={tinggi ?? 900}
      loading={loading}
      decoding="async"
      draggable={false}
      onError={() => setGagal(url)}
      className={className}
    />
  );
}
