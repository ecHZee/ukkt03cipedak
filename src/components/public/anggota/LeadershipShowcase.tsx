import type { Anggota } from "@/domains/anggota/data";
import { PersonCard } from "./PersonCard";

/** Hierarki visual mengikuti jabatan, tanpa menggandakan orang atau membuat profil terpisah. */
export function LeadershipShowcase({
  pengurus,
  onOpen,
}: {
  pengurus: Anggota[];
  onOpen: (anggota: Anggota, pemicu: HTMLButtonElement) => void;
}) {
  const jabatan = (a: Anggota) => a.jabatan.trim().toLowerCase();
  const ketua = pengurus.filter((a) => jabatan(a) === "ketua");
  const wakil = pengurus.filter((a) => jabatan(a) === "wakil ketua");
  // Jabatan BPH tambahan tetap tampil, alih-alih lenyap karena tak masuk daftar posisi saat ini.
  const lainnya = pengurus.filter((a) => !ketua.includes(a) && !wakil.includes(a));
  return (
    <div className="space-y-4">
      {ketua.length > 0 && (
        <div className="grid gap-4">
          {ketua.map((a) => (
            <PersonCard key={a.id} anggota={a} sorotan="ketua" onOpen={onOpen} />
          ))}
        </div>
      )}
      {wakil.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          {wakil.map((a) => (
            <PersonCard key={a.id} anggota={a} sorotan="wakil-ketua" onOpen={onOpen} />
          ))}
        </div>
      )}
      {lainnya.length > 0 && (
        <div className="grid items-start gap-3 sm:grid-cols-2 md:grid-cols-4">
          {lainnya.map((a) => (
            <PersonCard
              key={a.id}
              anggota={a}
              sorotan={jabatan(a).startsWith("wakil ") ? "pendamping" : "utama"}
              onOpen={onOpen}
            />
          ))}
        </div>
      )}
    </div>
  );
}
