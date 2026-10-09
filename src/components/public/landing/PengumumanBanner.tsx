import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Megaphone, X } from "lucide-react";
import { useSitus } from "@/hooks/use-situs";

/**
 * Banner pengumuman di atas beranda (pengaturan "pengumuman"). Hilang otomatis setelah tanggal
 * `sampai`; pengunjung bisa menutupnya — diingat per isi pengumuman, jadi pengumuman baru muncul lagi.
 */
export function PengumumanBanner() {
  const p = useSitus().pengaturan.pengumuman;
  const kunci = p ? `pengumuman-ditutup:${p.teks.slice(0, 80)}` : "";
  const [ditutup, setDitutup] = useState(false);

  useEffect(() => {
    try {
      setDitutup(!!kunci && localStorage.getItem(kunci) === "1");
    } catch {
      // penyimpanan diblokir (mode privat) → tetap tampil
    }
  }, [kunci]);

  if (!p || ditutup) return null;

  const tutup = () => {
    setDitutup(true);
    try {
      localStorage.setItem(kunci, "1");
    } catch {
      // abaikan
    }
  };
  const luar = p.tautan?.startsWith("http");
  const isi = (
    <>
      <span className="line-clamp-2">{p.teks}</span>
      {p.tautan && <ArrowRight className="size-4 shrink-0" />}
    </>
  );
  const kelasTautan = "inline-flex items-center gap-1.5 font-semibold hover:underline";

  return (
    <div role="region" aria-label="Pengumuman" className="bg-accent text-accent-foreground">
      <div className="mx-auto flex max-w-[1280px] items-center gap-3 px-4 py-2.5 text-sm sm:px-6 md:px-10 lg:px-16">
        <Megaphone className="size-4 shrink-0" />
        <div className="min-w-0 flex-1">
          {!p.tautan ? (
            <span className="font-semibold">{p.teks}</span>
          ) : luar ? (
            <a href={p.tautan} target="_blank" rel="noopener noreferrer" className={kelasTautan}>
              {isi}
            </a>
          ) : (
            <Link to={p.tautan} className={kelasTautan}>
              {isi}
            </Link>
          )}
        </div>
        <button
          type="button"
          onClick={tutup}
          aria-label="Tutup pengumuman"
          className="grid size-7 shrink-0 place-items-center rounded-full hover:bg-black/10"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
