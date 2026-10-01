/**
 * Akses konten publik (kegiatan, berita, album, dokumen, pengaturan) dari Supabase.
 * Dipakai di loader route → data diambil saat render di server (SSR).
 * Yang terlihat ditentukan RLS: pengunjung hanya mendapat konten berstatus terbit.
 */
import { supabase } from "@/integrations/supabase/client";
import type { Album, Berita, Kegiatan, Pengaturan } from "@/domains/konten/types";
import type { Dokumen, DokumenKategori } from "@/domains/dokumen/types";

const TZ = "Asia/Jakarta";

function gagal(label: string, error: { message: string } | null): never {
  throw new Error(`Gagal memuat ${label}: ${error?.message ?? "data kosong"}`);
}

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

/** "Sab, 10 Okt 2026 · 19.30 WIB" */
function formatJadwal(iso: string) {
  const d = new Date(iso);
  const tgl = d.toLocaleDateString("id-ID", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: TZ,
  });
  const jam = d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: TZ });
  return `${tgl} · ${jam} WIB`;
}

function formatUkuran(bytes: number | null) {
  if (bytes == null) return null;
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ------------------------------------------------------------------ kegiatan

export async function ambilKegiatan(): Promise<Kegiatan[]> {
  const { data, error } = await supabase
    .from("kegiatan")
    .select("id, slug, judul, ringkasan, mulai, rutin, lokasi, tahap, bidang(slug)")
    .eq("status", "terbit")
    .order("mulai", { ascending: false, nullsFirst: false });
  if (error || !data) gagal("kegiatan", error);
  return data.map((k) => ({
    id: k.id,
    slug: k.slug,
    judul: k.judul,
    ringkasan: k.ringkasan ?? "",
    jadwal: k.mulai ? formatJadwal(k.mulai) : k.rutin,
    mulai: k.mulai,
    rutin: Boolean(k.rutin),
    lokasi: k.lokasi,
    bidang: k.bidang?.slug ?? null,
    tahap: k.tahap,
  }));
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
  const pilihan = [...akanDatang, ...rutin].slice(0, jumlah);
  if (pilihan.length > 0) return { judul: "akan-datang" as const, items: pilihan };
  const terakhir = semua.filter((k) => k.mulai).slice(0, jumlah);
  return { judul: "terakhir" as const, items: terakhir };
}

// ------------------------------------------------------------------ berita

/**
 * Berita terbit untuk publik. `semuaStatus` dipakai halaman admin: draft & review ikut,
 * sebatas yang diizinkan RLS untuk akun yang login (bidangnya sendiri / semua untuk BPH).
 */
export async function ambilBerita(opsi: { semuaStatus?: boolean } = {}): Promise<Berita[]> {
  let q = supabase
    .from("berita")
    .select("id, slug, judul, ringkasan, pinned, status, terbit_at, created_at, bidang(slug)");
  if (!opsi.semuaStatus) q = q.eq("status", "terbit");
  const { data, error } = await q
    .order("pinned", { ascending: false })
    .order("terbit_at", { ascending: false, nullsFirst: true })
    .order("created_at", { ascending: false });
  if (error || !data) gagal("berita", error);
  return data.map((b) => ({
    id: b.id,
    slug: b.slug,
    judul: b.judul,
    ringkasan: b.ringkasan ?? "",
    bidang: b.bidang?.slug ?? null,
    tanggal: formatTanggal(b.terbit_at),
    terbitAt: b.terbit_at,
    pinned: b.pinned,
    status: b.status,
  }));
}

// ------------------------------------------------------------------ album

export async function ambilAlbum(): Promise<Album[]> {
  const { data, error } = await supabase
    .from("album")
    .select("id, slug, judul, tanggal, bidang(slug), media!media_album_id_fkey(count)")
    .eq("status", "terbit")
    .order("tanggal", { ascending: false, nullsFirst: false });
  if (error || !data) gagal("album", error);
  return data.map((a) => ({
    id: a.id,
    slug: a.slug,
    judul: a.judul,
    bidang: a.bidang?.slug ?? null,
    tanggal: formatTanggal(a.tanggal),
    tahun: a.tanggal ? Number(a.tanggal.slice(0, 4)) : null,
    jumlahMedia: a.media[0]?.count ?? 0,
  }));
}

// ------------------------------------------------------------------ dokumen

export async function ambilDokumenPublik(): Promise<Dokumen[]> {
  const { data, error } = await supabase
    .from("dokumen")
    .select("id, judul, kategori, tahun, tanggal, akses, storage_path, ukuran_bytes")
    .eq("status", "terbit")
    .eq("akses", "publik")
    .order("tahun", { ascending: false })
    .order("tanggal", { ascending: false, nullsFirst: false });
  if (error || !data) gagal("dokumen", error);
  return data.map((d) => ({
    id: d.id,
    judul: d.judul,
    kategori: d.kategori as DokumenKategori,
    tahun: d.tahun,
    tanggal: formatTanggal(d.tanggal),
    akses: d.akses,
    ukuran: formatUkuran(d.ukuran_bytes),
    adaFile: Boolean(d.storage_path),
  }));
}

// ------------------------------------------------------------------ pengaturan

const teks = (v: unknown) => (typeof v === "string" && v.trim() !== "" ? v.trim() : null);

export async function ambilPengaturan(): Promise<Pengaturan> {
  const { data, error } = await supabase.from("pengaturan").select("key, value");
  if (error || !data) gagal("pengaturan", error);
  const v = Object.fromEntries(data.map((r) => [r.key, r.value]));
  const wa = teks(v["kontak.whatsapp"])?.replace(/[^0-9]/g, "") || null;
  return {
    namaOrganisasi: teks(v["organisasi.nama"]) ?? "Karang Taruna RW 03 Cipedak",
    wilayah: teks(v["organisasi.wilayah"]),
    jumlahRt: typeof v["organisasi.jumlah_rt"] === "number" ? v["organisasi.jumlah_rt"] : null,
    whatsapp: wa,
    email: teks(v["kontak.email"]),
    alamat: teks(v["kontak.alamat"]),
    mapsUrl: teks(v["kontak.maps_url"]),
    instagram: teks(v["sosmed.instagram"]),
    tiktok: teks(v["sosmed.tiktok"]),
    youtube: teks(v["sosmed.youtube"]),
  };
}

/** Link WhatsApp siap pakai, atau null bila nomor belum diisi. */
export function linkWhatsApp(p: Pengaturan, pesan?: string) {
  if (!p.whatsapp) return null;
  return `https://wa.me/${p.whatsapp}${pesan ? `?text=${encodeURIComponent(pesan)}` : ""}`;
}
