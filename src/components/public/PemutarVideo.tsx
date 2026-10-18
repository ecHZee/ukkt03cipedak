import { useState } from "react";
import { ExternalLink, Play } from "lucide-react";
import type { MediaAlbum } from "@/domains/konten/types";
import { bacaLinkVideo } from "@/services/storage";

export function PemutarVideo({ media }: { media: MediaAlbum }) {
  const [muat, setMuat] = useState(false);
  const [gagal, setGagal] = useState(false);
  const judul = media.caption || "Video dokumentasi";
  const embed = media.jenis === "embed" ? bacaLinkVideo(media.url ?? "") : null;
  const penyedia = embed
    ? { youtube: "YouTube", instagram: "Instagram", tiktok: "TikTok" }[embed.penyedia]
    : null;
  if (media.jenis === "video" && media.url) {
    return (
      <div className="flex h-full min-h-0 w-full flex-col items-center justify-center gap-3">
        <video
          controls
          playsInline
          preload="metadata"
          aria-label={judul}
          width={media.lebar ?? 1280}
          height={media.tinggi ?? 720}
          className="min-h-0 max-h-full w-full object-contain"
          onError={() => setGagal(true)}
        >
          <source src={media.url} type={media.mime || undefined} />
          Browser ini belum mendukung pemutar video.
        </video>
        {gagal && <p role="status">Video belum bisa diputar di browser ini.</p>}
        <a
          className="inline-flex min-h-11 shrink-0 items-center underline underline-offset-4"
          href={media.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Buka file video
        </a>
      </div>
    );
  }
  if (!embed) return <p className="p-6 text-center">Tautan video belum didukung.</p>;
  return (
    <div className="flex h-full min-h-0 w-full flex-col items-center justify-center gap-3">
      {muat ? (
        <iframe
          src={embed.embedUrl}
          title={`${judul} — ${penyedia}`}
          loading="lazy"
          allow="encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className={`min-h-0 w-full flex-1 border-0 ${embed.penyedia === "youtube" ? "max-w-5xl" : "max-w-md"}`}
        />
      ) : (
        <button
          type="button"
          onClick={() => setMuat(true)}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/40 px-5 py-3 font-semibold hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <Play className="size-5" aria-hidden="true" /> Muat video {penyedia}
        </button>
      )}
      <a
        className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm underline underline-offset-4"
        href={embed.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        Buka di {penyedia} <ExternalLink className="size-4" aria-hidden="true" />
      </a>
    </div>
  );
}
