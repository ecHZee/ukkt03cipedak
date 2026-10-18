import { useState } from "react";
import type { Anggota } from "@/domains/anggota/data";
import { gayaBidang } from "@/domains/program/style";
import { cn } from "@/lib/utils";

/** Tanpa foto berizin (atau foto gagal dimuat), identitas tetap terbaca dari inisial. */
export function PersonAvatar({
  anggota,
  className,
  bentuk = "avatar",
}: {
  anggota: Anggota;
  className?: string;
  bentuk?: "avatar" | "potret";
}) {
  const [gagalUrl, setGagalUrl] = useState<string | null>(null);
  const nama = anggota.nama.trim().split(/\s+/);
  const inisial = [nama[0]?.[0], nama.length > 1 ? nama.at(-1)?.[0] : ""].join("");
  const warna =
    anggota.group === "BPH"
      ? "bg-accent/15 text-accent-foreground"
      : anggota.group === "PENASIHAT"
        ? "bg-ink text-white"
        : gayaBidang(anggota.bidang ?? "").iconBg;
  return (
    <span
      aria-hidden="true"
      data-bentuk={bentuk}
      className={cn(
        "grid shrink-0 place-items-center overflow-hidden rounded-xl font-heading font-bold uppercase",
        bentuk === "potret" ? "aspect-[3/4] w-full text-6xl" : "size-12 text-base",
        warna,
        className,
      )}
    >
      {anggota.fotoUrl && anggota.fotoUrl !== gagalUrl ? (
        <img
          src={anggota.fotoUrl}
          alt=""
          loading={bentuk === "potret" ? "eager" : "lazy"}
          // Potret menampilkan foto utuh; crop yang disengaja disiapkan di alur CMS.
          className={cn("h-full w-full", bentuk === "potret" ? "object-contain" : "object-cover")}
          onError={() => setGagalUrl(anggota.fotoUrl!)}
        />
      ) : (
        inisial
      )}
    </span>
  );
}
