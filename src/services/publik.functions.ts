import { createServerFn } from "@tanstack/react-start";

// Loader publik tetap segar/anonim; SDK dan validasi pengaturan hanya dibutuhkan di server.
export const ambilSitusPublikFn = createServerFn({ method: "GET" }).handler(async () => {
  const [{ ambilPengaturan }, { ambilPeriode }] = await Promise.all([
    import("./konten"),
    import("./organisasi"),
  ]);
  const [pengaturan, periode] = await Promise.all([ambilPengaturan(), ambilPeriode()]);
  const [{ getRequest }, { fotoUntukHtml }] = await Promise.all([
    import("@tanstack/react-start/server"),
    import("./foto-html.server"),
  ]);
  const fotoBerandaHtml = await fotoUntukHtml(getRequest(), pengaturan.fotoBeranda?.[0]?.path);
  return {
    pengaturan,
    periodeAktif: periode.find((p) => p.aktif) ?? periode[0] ?? null,
    fotoBerandaHtml,
  };
});

export const ambilBerandaPublikFn = createServerFn({ method: "GET" }).handler(async () => {
  const [{ ambilKegiatan, ambilBerita, ambilAlbum }, { ambilBidang, hitungPengurusAktif }] =
    await Promise.all([import("./konten"), import("./organisasi")]);
  const [kegiatan, berita, album, bidang, pengurusAktif] = await Promise.all([
    ambilKegiatan(),
    ambilBerita(),
    ambilAlbum(),
    ambilBidang(),
    hitungPengurusAktif(),
  ]);
  return { kegiatan, berita, album, bidang, pengurusAktif };
});
