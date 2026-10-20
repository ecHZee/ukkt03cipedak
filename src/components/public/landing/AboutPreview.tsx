import { Link } from "@tanstack/react-router";
import { ArrowRight, HeartHandshake } from "lucide-react";
import { FotoGaleri } from "@/components/public/FotoGaleri";
import { useSitus } from "@/hooks/use-situs";
import { urlPublik } from "@/services/storage";

export function AboutPreview() {
  const { periodeAktif, pengaturan } = useSitus();
  const label = periodeAktif?.label ?? "";
  const tanggal = periodeAktif?.tanggalSK;
  const foto = pengaturan.fotoBeranda?.[0];
  return (
    <div className={`grid items-center gap-8 lg:gap-12 ${foto?.path ? "lg:grid-cols-2" : ""}`}>
      {foto?.path && (
        <div className="relative hidden aspect-[4/3] overflow-hidden rounded-2xl bg-muted-surface sm:block">
          <FotoGaleri
            url={urlPublik("media", foto.path)}
            alt={foto.caption}
            className="h-full w-full object-contain"
          />
          {tanggal && (
            <div className="absolute bottom-4 left-4 rounded-lg bg-surface px-3 py-2 shadow-tile border border-border">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                SK Pengurus {label}
              </p>
              <p className="font-heading text-base font-bold text-primary tabular-nums">
                {tanggal}
              </p>
            </div>
          )}
        </div>
      )}

      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-foreground">
          <HeartHandshake className="size-3.5" />
          Tentang Kami
        </div>
        <h2 className="mt-4 font-heading text-3xl sm:text-4xl font-bold text-ink leading-tight">
          Wadah pemuda RW 03 Cipedak untuk berkarya dan berkontribusi.
        </h2>
        <p className="mt-4 text-[15px] text-ink-muted leading-relaxed">
          Karang Taruna RW 03 Cipedak adalah organisasi kepemudaan resmi yang menjadi rumah bagi
          pemuda-pemudi dari {pengaturan.jumlahRt ?? 7} RT. Periode kepengurusan {label} ditetapkan
          melalui SK Karang Taruna Kelurahan Cipedak
          {tanggal && (
            <>
              {" "}
              tanggal <span className="font-semibold text-ink">{tanggal}</span>
            </>
          )}
          .
        </p>
        <p className="mt-3 hidden text-[15px] text-ink-muted leading-relaxed sm:block">
          Kenali pengurus dan tujuh bidang kerjanya, lalu telusuri kegiatan serta dokumentasi yang
          dibagikan melalui website ini.
        </p>
        <Link
          to="/tentang"
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-ink shadow-tile transition hover:border-primary hover:text-primary"
        >
          Selengkapnya
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
