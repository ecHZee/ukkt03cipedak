import type { Kegiatan, Pengaturan } from "@/domains/konten/types";

const TZ = "Asia/Jakarta";

/** "06 Juni 2025" */
export function formatTanggal(iso: string | null) {
  if (!iso) return null;
  const d = iso.length === 10 ? new Date(`${iso}T00:00:00+07:00`) : new Date(iso);
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: TZ,
  });
}

/**
 * Kegiatan untuk beranda: yang akan datang (terdekat dulu), lalu kegiatan rutin.
 * Bila tidak ada sama sekali, kembalikan kegiatan terakhir supaya beranda tidak pernah kosong.
 */
export function pilihKegiatanTerdekat(semua: Kegiatan[], jumlah = 3, sekarang = new Date()) {
  const akanDatang = semua
    .filter((k) => k.mulai && new Date(k.mulai) >= sekarang && k.tahap !== "batal")
    .sort((a, b) => a.mulai!.localeCompare(b.mulai!));
  const rutin = semua.filter((k) => k.rutin && k.tahap !== "selesai" && k.tahap !== "batal");
  const pilihan = [...new Map([...akanDatang, ...rutin].map((k) => [k.id, k])).values()].slice(
    0,
    jumlah,
  );
  if (pilihan.length > 0) return { judul: "akan-datang" as const, items: pilihan };
  const terakhir = semua.filter((k) => k.mulai).slice(0, jumlah);
  return { judul: "terakhir" as const, items: terakhir };
}

/** Link WhatsApp siap pakai, atau null bila nomor belum diisi. */
export function linkWhatsApp(p: Pengaturan, pesan?: string) {
  if (!p.whatsapp) return null;
  return `https://wa.me/${p.whatsapp}${pesan ? `?text=${encodeURIComponent(pesan)}` : ""}`;
}
