# Rencana Hari 15 — Arsip, kontak, filter dan alamat Pages

Status 18 Oktober 2026: **selesai dan lolos verifikasi produksi**, kode `ab804b1`.
Nama Pages tersedia dan proxy aktif ke Worker `katar-rw03`. Hasil aktual: [review Hari 15](HARI-15-REVIEW.md).

## Keputusan alamat publik

Alur yang dipilih Hanif:

`Client → https://ukkt03cipedak.pages.dev → Worker katar-rw03`

Pages menjadi proxy melalui **Service Binding**, sehingga alamat browser tetap Pages ketika membuka
halaman dan mengirim form. Ini bukan redirect ke URL panjang dan bukan migrasi penuh aplikasi.
Worker `katar-rw03`, build otomatis dari `revisi`, secret aplikasi, Supabase dan Storage tetap dipakai.
Pembelian domain ditunda; tahap domain organisasi di Hari 23 ditinjau kembali saat siap.
Dasar kemampuan platform: [Service bindings Cloudflare Pages](https://developers.cloudflare.com/pages/functions/bindings/#service-bindings).
Pengujian route/aset, filter dan server functions melalui proxy sudah lolos; bukti serta batas uji
tercatat pada review. Daftar di bawah menyimpan urutan rencana yang dipakai.

## Urutan pekerjaan

| Urutan | Pekerjaan | Hasil yang harus dibuktikan |
| --- | --- | --- |
| 1 | Tinjau query, RLS dan Storage dokumen yang sudah ada; buat `/arsip`, lalu redirect `/lpj`. | Pengunjung/akun hanya menerima dokumen yang berhak dilihat; unduhan internal memakai signed URL 600 detik. |
| 2 | Satukan filter bidang kegiatan, berita dan arsip; simpan pilihan pada search params. | Chip nama singkat bisa digeser di HP; refresh, tautan yang dibagikan serta Back/Forward memulihkan pilihan. |
| 3 | Rapikan kontak, peta dan label/ikon publik. | Hanya kontak resmi yang diisi ditampilkan; peta tidak mengarang titik sekretariat bila URL resmi kosong. |
| 4 | Verifikasi fitur di localhost dan Worker produksi yang ada. | Statis, browser dan pemeriksaan akses lulus sebelum menambah lapisan proxy. |
| 5 | Cek nama `ukkt03cipedak`, siapkan proyek Pages dan handler proxy beserta Service Binding ke Worker. | Path, query, metode, body dan kredensial permintaan yang diperlukan aplikasi diteruskan dengan benar; alamat browser tetap Pages. |
| 6 | Uji kedua alamat, sesuaikan URL publik/konfigurasi Auth yang relevan, lalu rebuild dan verifikasi lagi. | Halaman, aset, login, server function, dokumen dan tautan memakai alamat yang tepat; respons privat tidak tertukar antar-akun. |
| 7 | Catat hasil, konfigurasi tanpa rahasia dan langkah pemulihan. | Alamat Pages baru dinyatakan siap setelah lolos; alamat Worker tersedia selama pengujian, `main` tidak diubah. |

Jika nama Pages sudah terpakai, lanjutkan fitur Hari 15 yang tidak bergantung pada nama sambil meminta
Hanif memilih alternatif. Jangan menganggap nama tersedia hanya dari hasil DNS/HTTP.

## Calon file saat implementasi

Daftar ini adalah target kerja, bukan klaim bahwa file atau fitur baru sudah dibuat.

| File | Rencana |
| --- | --- |
| `src/routes/arsip.tsx` (baru), `src/routes/lpj.tsx` | Arsip berjenjang dan redirect yang mempertahankan parameter filter relevan. |
| `src/services/konten.ts`, `src/domains/dokumen/types.ts` | Bentuk data arsip dan pengambilan sesuai sesi/RLS; pilih kolom yang diperlukan. Jangan mengirim metadata dokumen terlarang lalu menyembunyikannya di UI. |
| `src/services/storage.ts` | Gunakan `urlSementara` yang sudah ada; ubah hanya bila ada kebutuhan terbukti. Jangan mengubah bucket internal menjadi publik. |
| `src/components/public/FilterBidang.tsx` (baru), `src/routes/kegiatan.index.tsx`, `src/routes/berita.index.tsx`, `src/routes/arsip.tsx` | Satu komponen filter bidang dengan state URL tervalidasi. Filter khusus status/tahun/kategori tetap sesuai halaman. |
| `src/routes/kontak.tsx`, `src/components/public/landing/KontakSection.tsx` | Kontak/peta dari pengaturan resmi; perbaiki fallback peta umum agar tidak menyiratkan lokasi sekretariat yang belum dikonfirmasi. |
| Komponen navigasi/footer publik yang masih menaut `/lpj`; `src/routeTree.gen.ts` | Tautkan `/arsip` dan sertakan hasil generator route. Pola navbar desktop sejajar tetap berlaku. |
| `cloudflare/pages/` (baru, lokasi rencana) | Handler proxy, konfigurasi Pages/Service Binding, aturan route dan instruksi deploy; pisahkan dari `wrangler.jsonc` Worker yang ada. |
| `src/constants/site.ts`, `.env.example` bila perlu | Pertahankan sumber URL `VITE_SITE_URL`; perubahan utama nilainya dilakukan pada build vars, tanpa menaruh secret di source. |
| Skrip tes terfokus di `scripts/`, `docs/HARI-15-REVIEW.md`, `backupcontext.md`, `DEVLOG.md` | Uji perilaku/akses dan bukti lokal-produksi; jangan mengisi laporan dengan keberhasilan yang belum diuji. |

Migrasi SQL bukan kebutuhan bawaan rencana ini. Bila ditemukan celah RLS/schema, jelaskan temuan,
buat perubahan minimal dan tes yang membuktikan perbaikannya sesuai skill database.

## Pengaturan layanan saat pelaksanaan

- **Pages:** proyek baru, metode deployment dan konfigurasi proxy tercatat; Service Binding hanya menuju
  Worker `katar-rw03`. Permintaan seluruh route yang diperlukan aplikasi harus tertangani, termasuk aset.
- **Worker:** nama dan alur build `revisi` dipertahankan. Secret Supabase tetap runtime secret Worker;
  jangan disalin ke bundle browser atau lapisan Pages yang tidak membutuhkannya.
- **URL aplikasi:** sesuaikan `VITE_SITE_URL`, canonical/OG dan tautan berbagi; tinjau Supabase Auth Site URL
  serta daftar redirect yang benar-benar digunakan. URL baru membuat sesi browser terpisah; uji login ulang.
- **Cache:** respons bersesi, admin, metadata dokumen internal dan signed URL tidak boleh masuk cache
  bersama. Uji perubahan keadaan login/logout serta akun berbeda, jangan hanya memeriksa halaman publik.
- **Biaya/akses:** tetap pada cakupan gratis yang tersedia, cek kuota Functions/Worker dan tambahan waktu
  respons. Jika perlu upgrade berbayar atau login/secret baru, jelaskan kebutuhan; pengisian kredensial
  tetap oleh Hanif sesuai skill deploy. Jangan membeli domain atau mengganti target arsitektur sendiri.

## Verifikasi dan definisi selesai

1. `tsc --noEmit`, ESLint 0 error (7 warning bawaan boleh), build exit 0. Tes filter/redirect/query akses
   berdasarkan perilaku; bila menyentuh akun/DB/RLS jalankan suite DB **83 tes** dan tes aturan baru bila ada.
2. Browser **360, 375, 768, 1024 dan 1440 px**: tidak ada overflow halaman, filter dapat digulir,
   target sentuh minimal 44 px, keyboard/fokus dan console tanpa error. Uji refresh serta Back/Forward.
3. Uji tanpa login dan dengan akun uji sesuai peran (anggota/Kabid/BPH/Super Admin sesuai RLS aktual).
   Panggilan langsung untuk data/file yang dilarang harus ditolak; jangan hanya menguji tombol tersembunyi.
   Signed URL internal 600 detik; gunakan akun/data uji sementara dan bersihkan sesuai skill verifikasi.
4. Produksi **Worker dan Pages**: semua route valid 200, slug hilang 404, `/lpj` redirect ke `/arsip`;
   path/query/hash navigasi serta filter bertahan, alamat browser tetap Pages. Tidak ada loop redirect.
5. Lewat Pages: uji CSS/font/logo/gambar, SSR dan hidrasi, GET/POST/server functions, login/admin,
   unggah yang sudah fungsional dengan fixture aman, unduhan publik/internal, URL berbagi dan OG/canonical.
   Fitur CMS yang masih maket tidak boleh diklaim telah diuji sebagai fitur nyata.
6. Uji anonim → akun berhak → logout → anonim dan akun berhak → akun tak berhak untuk memastikan
   tidak ada cache privat yang bocor. Jangan menampilkan token, URL internal aktif atau profil privat di bukti publik.
7. Bandingkan waktu respons Worker langsung dan lewat Pages; cek kuota/error layanan. Simpan screenshot
   HP/desktop, hasil HTTP/akses dan catatan kendala. Batas tambahan waktu respons dinilai dari hasil ukur,
   bukan angka perkiraan yang belum diuji.
8. Semua uji di atas lulus sebelum menyatakan alamat pendek siap client. Bila belum lulus, pertahankan
   alamat Worker, tulis kendala dan perbaiki; jangan menghapus Worker atau mengalihkan client diam-diam.
   Hapus fixture/akun uji, hentikan server/`workerd`, commit/push `revisi`, pastikan working tree bersih.

Peta dengan lokasi resmi tetap menunggu `pengaturan.kontak.maps_url` yang benar. Nama Pages yang
dipilih berhasil dipakai; alamat publik utama kini https://ukkt03cipedak.pages.dev.
