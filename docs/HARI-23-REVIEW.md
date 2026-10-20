# Hari 23 — SEO, sitemap dan Web Analytics

20 Oktober 2026. **Implementasi dan QA lokal selesai; produksi dan hasil analytics dilengkapi pada penutupan di bawah.** Uji anggota ditunda sesuai keputusan Hanif sampai pengembangan paket launching siap. Hari 22 tetap menunggu bukti uji manusia; Checkpoint 3/4 dan main tidak otomatis berubah.

## Yang dikerjakan

- Metadata Beranda/Kegiatan/Berita/Kontak/Arsip memakai helper bersama. Canonical dan og:url absolut, tanpa query/hash/trailing slash, locale id_ID, metadata Twitter/gambar ikut konsisten. Halaman lain tetap memakai helper yang sama. Q08 ditargetkan selesai lewat pemeriksaan HTML kedua origin.
- `/sitemap.xml` dinamis: 9 halaman tetap, 7 detail bidang, serta berita/kegiatan/album yang **terbit dan bukan dummy**. Query hanya slug/updated_at, memakai client anonim tersendiri tanpa sesi pemanggil. Tidak memuat akun, draf, dokumen atau URL berkas. Lastmod dari data yang valid; tidak mengarang tanggal saat ini. Sitemap saat QA berisi 16 URL karena seluruh berita/kegiatan awal masih dummy dan album kosong.
- `/robots.txt` menunjuk sitemap Pages, membatasi endpoint server/berkas/media. Login/admin dapat dirayapi agar crawler membaca noindex; akses datanya tetap dilindungi Auth/RLS. Header noindex ditambahkan untuk login/admin/server-functions/error, bukan dijadikan pengganti izin.
- Detail berita/kegiatan/album meneruskan is_dummy menjadi noindex. Tidak menghapus atau mengubah konten contoh.
- JSON-LD Organization pada beranda hanya dari pengaturan publik. Nama, URL/logo, kontak resmi yang memang terisi dan kanal sosial; tanpa tanggal pendirian yang disimpulkan dari SK. Serialisasi mengamankan teks penutup script.
- Web Analytics didaftarkan manual untuk hostname Pages di akun Cloudflare organisasi. Token beacon pada kode adalah pengenal **publik**, bukan API key. Tidak membeli domain atau mengubah billing. Snippet hanya dimulai pada hostname Pages dan path publik; localhost/Worker/login/admin tidak memulai snippet. Navigasi publik menggunakan pelacakan SPA. Tiga tautan Masuk pada Navbar/Arsip memakai reloadDocument; observer publik tidak dibawa ke dokumen akun. Referrer-Policy strict-origin membatasi alamat perujuk menjadi origin.
- Temuan Hari 22 direproduksi pada build Worker: admin anonim berpindah ke login sebelum hidrasi, memicu React #418. Redirect guard admin dan login yang sudah bersesi kini reloadDocument. Role/RLS dan penyimpanan sesi tidak diubah.

## QA lokal

Suite database/akses juga diulang: **164/164 lolos**, data dan akun uji suite dibersihkan oleh runner. Total sesi ini **212 pemeriksaan otomatis** (48 unit/regresi + 164 database), ditambah runtime HTTP dan browser yang dicatat terpisah.

| Lapisan               | Bukti                                                                                                                                                                                                                                                    |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Statis                | tsc/build exit 0; ESLint 0 error, 7 warning Fast Refresh bawaan                                                                                                                                                                                          |
| Unit/regresi sumber   | 48/48: 13 SEO baru dan 35 regresi konten/galeri/organisasi/tautan, termasuk dua tes baru penanda dummy detail                                                                                                                                            |
| Runtime Worker        | 31 pemeriksaan HTML/meta/JSON-LD/sitemap/robots/noindex lolos, termasuk GET/HEAD/POST dan sitemap dengan cookie/Authorization rekaan tetap sama                                                                                                          |
| Responsif             | 25 kombinasi Beranda/Kegiatan/Berita/Kontak/Arsip × 360/768/1024/1440/1920; satu canonical, tanpa overflow horizontal. Selisih 15 px merupakan scrollbar                                                                                                 |
| Navigasi              | Klik bidang Media mengubah filter URL, canonical tetap /kegiatan. Masuk dari navbar terbukti dokumen baru lewat perubahan performance.timeOrigin; login noindex, tidak ada beacon localhost                                                              |
| Perbaikan render akun | Tab baru admin anonim → login → akun pembaca latihan kembali ke Bantuan; refresh dengan sesi; membuka login saat sudah masuk → Bantuan. Semua sesudah perbaikan tanpa error/warning konsol. Error #418 sebelum perbaikan tidak disamarkan sebagai sukses |
| Privasi bundle        | 94 berkas publik dipindai terhadap empat nilai privat aktual dan pola implementasi server: 0 temuan                                                                                                                                                      |

Build lokal pertama masih memakai VITE_SITE_URL localhost dari konfigurasi pengembangan sehingga pemeriksaan canonical yang mengharapkan Pages gagal. Build diulang dengan override env proses ke alamat Pages, tanpa mengedit `.env.local`; pemeriksaan diulang dan lulus. Wrangler 4.151.1 memakai override compatibility-date 19 Oktober untuk binary lokal; produksi dengan konfigurasi build sendiri harus diuji terpisah. Beberapa locator perlu memakai role button sesuai DOM meskipun AX native menyebutnya checkbox; ini koreksi alat uji, bukan perubahan filter.

Satu akun/profil latihan dibuat khusus untuk tes navigasi localhost. Tidak memakai akun asli atau menjalankan reset password/ubah peran. Sesudah tes, akun/profil/audit terkait diverifikasi 0, Auth kembali 62, file kredensial dihapus dan hitungan token Auth localhost 0. Suite database yang diulang memiliki fixture sendiri dan hasil cleanup dicatat saat selesai. Tidak menulis data/foto organisasi atau menjalankan migrasi.

## Produksi dan cleanup akhir

Menunggu push revisi, penanda aset/HTML produksi kedua origin, bukti beacon dan pembacaan dashboard. Statistik historis tidak dibuat-buat; status situs terdaftar, request collector diterima dan grafik dashboard merupakan tingkat bukti yang berbeda.

## Sumber teknis

- [Google: canonical](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [Organization](https://developers.google.com/search/docs/appearance/structured-data/organization).
- [Cloudflare: pemasangan](https://developers.cloudflare.com/web-analytics/get-started/), [SPA](https://developers.cloudflare.com/web-analytics/get-started/web-analytics-spa/), [data collection](https://developers.cloudflare.com/web-analytics/data-metrics/data-origin-and-collection/). Implementasi beacon yang tersedia 20 Oktober 2026 juga diperiksa: normalisasi URL menghapus kredensial/query/hash; perpindahan sameDocument=false mengakhiri pengukuran dokumen lama.

Search Console tidak dihubungkan atau didaftarkan pada sesi ini. Preview WhatsApp nyata, HP fisik, Class B terisolasi, Q06/Q07 dan backup Storage/restore tetap punya penerimaan terpisah. Berikutnya Hari 24 pengisian konten/foto asli sesuai kurasi tim; uji anggota setelah pengembangan siap.
