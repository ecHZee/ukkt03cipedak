/**
 * Konten contoh (dummy) untuk review tampilan selama pengembangan.
 * Semua baris ditandai `is_dummy = true` supaya mudah dihapus sebelum launching.
 *
 * Pakai:
 *   npm run seed:dummy            → hapus dummy lama, lalu isi ulang
 *   npm run seed:dummy -- --hapus → hanya hapus semua dummy (dipakai sebelum launching)
 *
 * Butuh SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY di .env.local. Data asli tidak disentuh.
 * Foto dummy menyusul di Hari 8 (setelah Storage siap).
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { parseEnv } from "node:util";

const env = parseEnv(readFileSync(".env.local", "utf8"));
if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("✖ Isi SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY di .env.local");
  process.exit(1);
}
const db = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function cek(label, promise) {
  const { data, error } = await promise;
  if (error) throw new Error(`${label}: ${error.message}`);
  return data;
}

async function hapusDummy() {
  let total = 0;
  for (const t of ["berita", "media", "album", "kegiatan", "dokumen"]) {
    const rows = await cek(`hapus ${t}`, db.from(t).delete().eq("is_dummy", true).select("id"));
    total += rows.length;
  }
  return total;
}

const KEGIATAN = [
  {
    slug: "musyawarah-pengukuhan-2025",
    judul: "Musyawarah & Pengukuhan Pengurus 2025–2028",
    ringkasan: "Musyawarah warga dan pengukuhan susunan pengurus periode 2025–2028.",
    bidang: "okk",
    mulai: "2025-06-05T19:30:00+07:00",
    lokasi: "Pos RW 03 Cipedak",
    tahap: "selesai",
  },
  {
    slug: "rapat-konsolidasi-antar-bidang",
    judul: "Rapat Konsolidasi Antar-Bidang",
    ringkasan: "Penyelarasan program kerja awal tujuh bidang periode 2025–2028.",
    bidang: "okk",
    mulai: "2026-10-10T19:30:00+07:00",
    selesai: "2026-10-10T22:00:00+07:00",
    lokasi: "Sekretariat RW 03 Cipedak",
    tahap: "rencana",
  },
  {
    slug: "kerja-bakti-lingkungan",
    judul: "Kerja Bakti Lingkungan RW 03",
    ringkasan: "Bersih-bersih lingkungan bersama warga setiap akhir pekan.",
    bidang: "lingkungan",
    rutin: "Setiap Minggu pagi",
    lokasi: "Wilayah RW 03 Cipedak",
    tahap: "berjalan",
  },
  {
    slug: "latihan-rutin-futsal",
    judul: "Latihan Rutin Futsal",
    ringkasan: "Latihan persahabatan antar pemuda RW 03.",
    bidang: "pendidikan",
    rutin: "Setiap Jumat malam",
    lokasi: "Lapangan RW 03",
    tahap: "berjalan",
  },
  {
    slug: "pengajian-pemuda",
    judul: "Pengajian & Diskusi Pemuda",
    ringkasan: "Pengajian dan diskusi santai bersama pemuda RW 03.",
    bidang: "kerohanian",
    mulai: "2026-10-17T19:30:00+07:00",
    lokasi: "Sekretariat RW 03",
    tahap: "rencana",
  },
  {
    slug: "aktivasi-media-sosial",
    judul: "Aktivasi Kanal Media Sosial Resmi",
    ringkasan: "Peluncuran akun resmi Karang Taruna RW 03 di media sosial.",
    bidang: "media",
    mulai: "2026-10-24T10:00:00+07:00",
    lokasi: "Daring",
    tahap: "rencana",
  },
  {
    slug: "pendataan-inventaris",
    judul: "Pendataan Aset & Inventaris",
    ringkasan: "Pendataan ulang seluruh inventaris organisasi.",
    bidang: "inventaris",
    lokasi: "Sekretariat RW 03",
    tahap: "rencana",
  },
  {
    slug: "kajian-usaha-mandiri",
    judul: "Kajian Usaha Mandiri",
    ringkasan: "Studi kelayakan usaha mandiri untuk pendanaan organisasi.",
    bidang: "ekonomi",
    lokasi: "Sekretariat RW 03",
    tahap: "rencana",
  },
];

const BERITA = [
  {
    slug: "pengukuhan-pengurus-2025-2028",
    judul: "Pengukuhan Pengurus Karang Taruna RW 03 Cipedak Periode 2025–2028",
    ringkasan:
      "Melalui SK No. 003/SK/KT-Cipedak/VI/2025 tanggal 05 Juni 2025, susunan pengurus periode 2025–2028 resmi dikukuhkan.",
    bidang: null,
    terbit_at: "2025-06-06T09:00:00+07:00",
    pinned: true,
  },
  {
    slug: "rapat-konsolidasi-dijadwalkan",
    judul: "Rapat Konsolidasi Antar-Bidang Dijadwalkan",
    ringkasan: "Tujuh bidang akan menyelaraskan rencana kerja awal masa bakti.",
    bidang: "okk",
    terbit_at: "2026-09-20T09:00:00+07:00",
  },
  {
    slug: "jadwal-kerja-bakti-berkala",
    judul: "Jadwal Kerja Bakti Berkala Mulai Disusun",
    ringkasan: "Bidang Lingkungan menyusun jadwal kerja bakti rutin bersama warga.",
    bidang: "lingkungan",
    terbit_at: "2026-09-15T09:00:00+07:00",
  },
  {
    slug: "latihan-olahraga-akhir-pekan",
    judul: "Latihan Olahraga Rutin Akhir Pekan",
    ringkasan: "Latihan futsal & voli rutin untuk pemuda RW 03.",
    bidang: "pendidikan",
    terbit_at: "2026-09-10T09:00:00+07:00",
  },
  {
    slug: "persiapan-media-sosial-resmi",
    judul: "Persiapan Kanal Media Sosial Resmi",
    ringkasan: "Bidang Media menyiapkan tata kelola publikasi resmi organisasi.",
    bidang: "media",
    terbit_at: "2026-09-05T09:00:00+07:00",
  },
  {
    slug: "pendataan-inventaris-tahap-1",
    judul: "Pendataan Aset & Inventaris Tahap I",
    ringkasan: "Bidang Inventaris & Arsip mulai mencatat aset organisasi.",
    bidang: "inventaris",
    terbit_at: "2026-08-28T09:00:00+07:00",
  },
];

const hanyaHapus = process.argv.includes("--hapus");
try {
  const terhapus = await hapusDummy();
  console.log(`🧹 ${terhapus} baris dummy lama dihapus`);
  if (hanyaHapus) process.exit(0);

  const periode = await cek(
    "periode aktif",
    db.from("periode").select("id").eq("aktif", true).single(),
  );
  const bidang = await cek("bidang", db.from("bidang").select("id, slug"));
  const idBidang = (slug) => (slug ? bidang.find((b) => b.slug === slug)?.id : null);
  const ISI = "Konten contoh untuk keperluan review tampilan. Akan diganti konten asli.";

  const kegiatan = await cek(
    "kegiatan",
    db
      .from("kegiatan")
      .insert(
        KEGIATAN.map(({ bidang: b, ...k }) => ({
          ...k,
          bidang_id: idBidang(b),
          periode_id: periode.id,
          isi: ISI,
          status: "terbit",
          is_dummy: true,
        })),
      )
      .select("id"),
  );
  const berita = await cek(
    "berita",
    db
      .from("berita")
      .insert(
        BERITA.map(({ bidang: b, ...x }) => ({
          ...x,
          pinned: x.pinned ?? false, // insert massal: kolom yang tidak diisi dikirim sebagai null
          bidang_id: idBidang(b),
          isi: ISI,
          status: "terbit",
          is_dummy: true,
        })),
      )
      .select("id"),
  );
  console.log(`🌱 Dummy terisi: ${kegiatan.length} kegiatan, ${berita.length} berita`);
} catch (e) {
  console.error("✖", e.message);
  process.exit(1);
}
