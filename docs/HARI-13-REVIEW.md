# Review Hari 13 — Galeri

Galeri publik membaca album terbit dari Supabase. Halaman `/galeri` mempertahankan filter tahun/bidang;
kartu menautkan `/galeri/<slug>`. Isi album menampilkan foto/video sesuai urutan di database, deskripsi,
tanggal, sampul, serta tombol berbagi dari Hari 12. Album tidak ditemukan/draft/review menghasilkan 404.

## Perilaku yang bisa dicek

| Bagian        | Hasil                                                                                           |
| ------------- | ----------------------------------------------------------------------------------------------- |
| Daftar album  | Sampul asli bila tersedia, placeholder jujur bila belum ada; keadaan filter kosong              |
| Isi album     | Masonry CSS: 1 kolom di HP, 2 di tablet, 3 di laptop; caption sebagai teks, bukan HTML          |
| Foto          | Lazy load, decoding async, dimensi eksplisit; pesan cadangan untuk foto hilang/gagal dimuat     |
| Lightbox      | Portal Radix ke body, fokus terkurung di dialog dan kembali ke thumbnail saat ditutup           |
| Navigasi foto | Tombol sebelumnya/berikutnya, panah keyboard, geser; setelah foto terakhir kembali ke awal      |
| Zoom          | Tombol perbesar/atur ulang, klik dua kali, cubit 1–3× dan pan saat diperbesar                   |
| Video file    | Controls, playsInline, preload metadata, tanpa autoplay; tautan file bila pemutar gagal         |
| Video tautan  | YouTube/Instagram/TikTok; iframe dimuat setelah tombol ditekan, tautan penyedia selalu tersedia |

Portal memakai komponen Radix yang sudah terpasang, tanpa menambah dependensi. Parser video hanya menerima
host penyedia yang sesuai, HTTPS, tanpa kredensial/port khusus. Domain tiruan seperti `evilyoutube.com`
ditolak. TikTok memakai endpoint iframe `player/v1`, sesuai
[dokumentasi TikTok](https://developers.tiktok.com/docs/en/embed-player).
YouTube memakai domain `youtube-nocookie.com`, sesuai
[panduan YouTube](https://support.google.com/youtube/answer/171780?hl=en).

## Bukti lokal

- `tsc --noEmit`: exit 0; eslint: 0 error, 7 warning bawaan; build: exit 0.
- `npm run test:galeri`: 8/8. Service asli dijalankan dengan transport Supabase terisolasi:
  filter terbit, dua relasi FK album/media, urutan stabil, data polos, album kosong, 50 foto,
  error jaringan versus 404, pemetaan sumber video serta penolakan URL berbahaya.
- `npm run test:konten`: 15/15 regresi Hari 12.
- Transport asli tanpa fixture: `/galeri` 200 (belum ada album), slug hilang 404.
- Browser lokal memakai konfigurasi Vite QA sementara dengan tiga album sintetis; kode route/komponen
  yang diuji sama, hanya hasil pengambilan album diganti. Tidak menulis database/storage produksi.
- Album 50 item foto memakai empat gambar dasar WebP sintetis, empat rasio dan URL berbeda,
  ukuran 435–555 KB per file: saat awal dibuka pada 360×800,
  hanya 5/50 foto dimuat. Setelah digulir sampai bawah, 50/50 dimuat dan foto ke-50 dapat dibuka.
  Observer long task selama scrolling tidak mencatat tugas >50 ms pada browser laptop ini;
  hasil ini bukan benchmark HP fisik atau jaringan seluler.
- Lebar 360/375/840/1440 px: scrollWidth = clientWidth (gutter scrollbar 15 px dipertahankan browser),
  masonry 1/1/2/3 kolom. Tidak ada overflow horizontal.
- Klik album/filter/keadaan kosong/kembali, tombol foto/panah/wrap-around, Escape,
  Tab/Shift+Tab, fokus kembali, tombol zoom dan geser/pan melalui input browser lolos.
- Pinch dua jari diuji melalui PointerEvent sintetis (100% → 200%, tidak berpindah foto).
  IAB tidak mendukung `Input.dispatchTouchEvent`; saat simulasi, setPointerCapture dinonaktifkan hanya
  pada elemen uji lalu dipulihkan. Touch capture dan cubit pada HP fisik belum terverifikasi.
- Video sintetis WebM 1,98 detik: readyState 4, controls aktif, preload metadata, Space memulai playback
  (`paused=false`, currentTime bertambah, media error null). Video dibuat lokal tanpa foto/audio warga.
- YouTube memuat pemutar contoh resmi; URL iframe Instagram/TikTok dan tautan cadangan terverifikasi.
  Playback konten Instagram/TikTok asli belum terbukti: tergantung konten publik, izin embed dan jaringan.
- Console browser: 0 error pada alur uji. Fixture, konfigurasi QA, video dan gambar berada di arsip sesi
  di luar repo; konfigurasi sementara di root dihapus sebelum commit. Bundle diperiksa tanpa penanda QA
  maupun penanda service role di bundle browser.

## Produksi dan batas lingkup

Kode `60d3125` sudah dipush ke `revisi` dan deployment Cloudflare terverifikasi:

- Penanda deskripsi galeri baru terbaca dari HTML SSR; tidak ada fixture.
- 10 route valid HTTP 200; `/galeri/album-tidak-ada` HTTP 404.
- Canonical/OG URL absolut mengarah ke domain produksi; gambar OG memakai fallback logo resmi.
- Browser 360/840/1440 px: scrollWidth = clientWidth, hamburger tersedia di HP/tablet, console 0 error.
- Dev server dimatikan, tidak ada proses workerd tersisa, origin/revisi sama dengan HEAD.

Produksi saat pengerjaan belum memiliki album terbit. Galeri online tetap menampilkan keadaan kosong;
hasil browser dengan 50 foto adalah uji lokal, bukan album yang sudah diunggah ke produksi.
Admin unggah massal, foto warga, dan integrasi B2 tetap Hari 19. Batas unggah sekarang tetap 50 MB di
Supabase; rencana 200 MB baru berlaku setelah storage B2 disambungkan. Tidak ada perubahan DB/RLS/akun,
migrasi, dependensi atau branch main. Karena itu, 83 tes database live tidak dijalankan ulang.

Untuk review di HP asli setelah ada album: buka album, geser kiri/kanan pada zoom 100%, cubit lalu pan,
atur ulang sebelum berpindah foto; cek tutup/kembali serta video pada orientasi tegak dan mendatar.

Berikutnya: Hari 14 — Tentang, pengurus dan bidang, setelah review Hanif.
