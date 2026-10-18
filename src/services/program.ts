import { ambilOrganisasi } from "@/services/organisasi";
import { ambilKegiatan } from "@/services/konten";

/** Hanya bidang yang diminta dan kegiatan terbitnya yang masuk payload halaman. */
export async function ambilDetailBidang(slug: string) {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const organisasi = await ambilOrganisasi();
  const bidang = organisasi.bidang.find((b) => b.slug === slug);
  if (!bidang) return null;
  const kegiatan = await ambilKegiatan();
  return {
    bidang,
    periode: organisasi.periodeAktif.label,
    pengurus: organisasi.pengurus.filter((a) => a.group === "BIDANG" && a.bidang === slug),
    kegiatan: kegiatan.filter((k) => k.bidang === slug),
  };
}
