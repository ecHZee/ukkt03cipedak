import { useState } from "react";
import type { Anggota } from "@/domains/anggota/data";
import { gayaBidang } from "@/domains/program/style";
import { cn } from "@/lib/utils";

/** Tanpa foto berizin (atau foto gagal dimuat), identitas tetap terbaca dari inisial. */
export function PersonAvatar({ anggota, className }: { anggota: Anggota; className?: string }) {
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
      className={cn(
        "grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl font-heading text-base font-bold uppercase",
        warna,
        className,
      )}
    >
      {anggota.fotoUrl && anggota.fotoUrl !== gagalUrl ? (
        <img
          src={anggota.fotoUrl}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
          onError={() => setGagalUrl(anggota.fotoUrl!)}
        />
      ) : (
        inisial
      )}
    </span>
  );
}
