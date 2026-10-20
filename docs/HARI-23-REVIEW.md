# Hari 23 — SEO, sitemap dan Web Analytics

20 Oktober 2026. **Hari 23 selesai secara teknis dan sudah online.** Uji anggota ditunda sesuai keputusan Hanif sampai pengembangan paket launching siap. Hari 22 tetap menunggu bukti uji manusia; Checkpoint 3/4 dan main tidak otomatis berubah.

## Yang dikerjakan

- Metadata Beranda/Kegiatan/Berita/Kontak/Arsip memakai helper bersama. Canonical dan og:url absolut, tanpa query/hash/trailing slash, locale id_ID, metadata Twitter/gambar ikut konsisten. Halaman lain tetap memakai helper yang sama. Q08 selesai lewat pemeriksaan HTML kedua origin.
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

Kode `1bbe28a` didorong ke `revisi`. Cloudflare Workers Builds berhasil pada **09:59:18 WIB**, build `61336223-9e9c-4d49-ae3d-111ee0a130fe`. Alamat utama tetap [Pages](https://ukkt03cipedak.pages.dev); Worker origin tetap tersedia. Tidak membeli domain atau mengubah billing, secret, maupun konfigurasi keamanan hosting.

| Lapisan produksi | Hasil |
| --- | --- |
| HTTP, HTML dan endpoint | **64/64 lolos: 32 Pages + 32 Worker**. Metadata tunggal/absolut, JSON-LD, header gateway/referrer/no-store, noindex akun/halaman hilang/detail dummy, sitemap dan robots GET/HEAD/POST termasuk 405/Allow |
| Sitemap | **16 URL**: 9 halaman tetap dan 7 bidang; seluruhnya valid. Cookie/Authorization rekaan tidak mengubah hasil anonim. Berita/kegiatan dummy tidak masuk |
| Q08 | Berita/Kegiatan/Kontak pada kedua origin memiliki canonical dan og:url yang benar; temuan metadata ditutup |
| Responsif dan konsol | **15 kombinasi** Berita/Kegiatan/Kontak × 360/768/1024/1440/1920; tanpa overflow, konsol 0 error/warning. Ini tambahan terhadap 25 kombinasi lokal |
| Beacon nyata | Script Cloudflare HTTP 200; collector POST **204**. Tiga event pageview teramati untuk Beranda, navigasi SPA Berita dan filter Berita. URL filter dikirim tanpa query; setelah navigasi SPA tetap satu script |
| Dashboard | Tampilan bawaan mengecualikan bot menunjukkan 0. Dengan hanya filter laporan bot dilepas, **2 kunjungan dan 3 tayangan QA** sudah tampil. Filter laporan kemudian dipulihkan; tidak mengubah perlindungan bot situs |

Angka dashboard tersebut mencakup trafik alat QA, **bukan jumlah warga** atau statistik historis. Sampel kecepatan yang kecil di dashboard tidak membuktikan target Q07/Lighthouse mobile. Status situs terdaftar, request collector diterima, dan data laporan terlihat semuanya dibuktikan terpisah. Pemasangan analytics pada akun produksi tidak diuji memakai sesi asli Hanif; batas halaman akun diuji lewat kebijakan kode dan navigasi dokumen baru lokal.

Probe Python urllib sempat ditolak edge Cloudflare dengan 403/1010, sedangkan browser dan Node fetch menerima 200. Transport pemeriksaan diganti menjadi Node fetch dengan user-agent bawaannya dan parser HTML tetap digunakan; **tidak menurunkan WAF atau mengganti user-agent untuk menyamarkan alat**. Hasil 64 pemeriksaan di atas berasal dari pengulangan yang berhasil. Slug berita uji juga dikoreksi ke slug yang benar, lalu status 200 dan noindex diperiksa secara eksplisit.

Cleanup diverifikasi: fixture akun/profil/audit tersisa 0; baseline **62 Auth, 62 profil, 61 pengurus, 8 kegiatan, 6 berita**, album/media/dokumen/antrean aset situs 0. Tidak menulis foto atau konten organisasi. Token Auth localhost 0, file kredensial fixture dan `.dev.vars` dihapus. Server lokal/Wrangler/workerd berhenti, port 5173/8090/8788 kosong. Viewport dipulihkan dan tab QA ditutup; tab serta sesi asli Hanif dipertahankan. Main lokal `4bd423c` dan origin/main `82487f5` tetap.

Log, hasil HTTP/layout, pemindaian bundle dan screenshot dashboard disimpan **di luar repo publik** pada lampiran lokal sesi `katar-hari23-20261020`. Dokumentasi penutup disinkronkan dalam commit terpisah. Hari 24 belum dimulai.

## Sumber teknis

- [Google: canonical](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [Organization](https://developers.google.com/search/docs/appearance/structured-data/organization).
- [Cloudflare: pemasangan](https://developers.cloudflare.com/web-analytics/get-started/), [SPA](https://developers.cloudflare.com/web-analytics/get-started/web-analytics-spa/), [data collection](https://developers.cloudflare.com/web-analytics/data-metrics/data-origin-and-collection/). Implementasi beacon yang tersedia 20 Oktober 2026 juga diperiksa: normalisasi URL menghapus kredensial/query/hash; perpindahan sameDocument=false mengakhiri pengukuran dokumen lama.

Search Console tidak dihubungkan atau didaftarkan pada sesi ini. Preview WhatsApp nyata, HP fisik, Class B terisolasi, Q06/Q07 dan backup Storage/restore tetap punya penerimaan terpisah. Berikutnya Hari 24 pengisian konten/foto asli sesuai kurasi tim; uji anggota setelah pengembangan siap.
