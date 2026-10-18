# Hari 16 — Hasil QA tampilan, aksesibilitas dan performa

18 Oktober 2026. **Perbaikan dan QA teknis sudah online di https://ukkt03cipedak.pages.dev.**
Target LCP <2,5 detik belum konsisten; Hari 16 belum ditutup penuh. Checkpoint 3 menunggu review
Hanif/Ketua, `main` tetap `82487f5`. Implementasi utama `70c0e5d`; kode final `ac75043`.

## Yang diperbaiki

| Temuan                                                             | Hasil                                                                                                                                     |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Ikon masuk 36 px; sebagian tautan aksi, berita dan footer 17–42 px | Target interaktif minimal 44 px, termasuk dialog/tabel admin                                                                              |
| Teks sekunder dan badge gagal AA; footer terlalu redup             | Token teks sekunder, hijau, jingga, merah galat dan copyright diperbaiki                                                                  |
| Judul meloncat H1 → H3/H4; belum ada pintasan konten               | Hierarki judul, landmark utama, tautan “Lewati ke konten utama” dan fokus terlihat                                                        |
| Info berjalan tanpa kontrol jeda                                   | Tombol jeda/lanjut; salinan dekoratif disembunyikan dari pembaca layar. Reduced-motion menampilkan kelima info unik sebagai daftar statis |
| Fokus keluar dari drawer/dialog admin                              | Portal Radix, fokus tertahan dan kembali ke pemicu; dialog wajib tetap menolak Escape/klik luar                                           |
| Pencarian pengurus kehilangan fokus setelah satu huruf             | Toolbar dipindahkan keluar dari fungsi halaman; mengetik beberapa huruf tetap fokus                                                       |
| Stylesheet Google Fonts memblokir render                           | Font desain E disajikan lokal dengan lisensi OFL, preload Latin dan `font-display: swap`                                                  |
| Logo PNG 192 px sekitar 69 KB untuk tampilan 40–48 px              | WebP lossless 96/192 px + srcset; PNG resmi tetap tersedia                                                                                |
| Canonical/OG beranda relatif                                       | URL absolut Pages                                                                                                                         |

Desain E, biru/emas, logo, menu sejajar, sorotan BPH/Kabid dan modal potret bergradasi tetap dipakai.
Tidak ada migrasi, perubahan RLS, dependensi/lockfile, secret atau konfigurasi dashboard. CMS yang masih
maket tetap menunggu Hari 17–22. Tidak mengunggah foto nyata.

## Bukti pengujian

| Pemeriksaan                 | Hasil                                                                                                                                                                |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Publik lokal                | 31 route × 360/390/768/1024/1440 px = **155 kombinasi**                                                                                                              |
| Publik produksi             | **155 kombinasi unik**, 31 pada setiap lebar; satu H1/main, tanpa overflow halaman atau kontrol terukur <44 px                                                       |
| Admin lokal                 | Dashboard, profil, pengurus dan akun × lima lebar = **20 kombinasi**; tabel tetap boleh digeser di dalam wadah                                                       |
| Axe 4.14                    | Lokal **62 publik + 8 admin**, produksi **62 publik**, **0 pelanggaran otomatis**; menu/dialog juga diperiksa                                                        |
| Kontras manual              | **9/9** pasangan token lolos: ink-muted/putih 6,26; muted 5,57; hijau 5,83; jingga 5,89; galat 5,58; nav di biru 5,52; border input 6,26; fokus 7,57; copyright 6,96 |
| Regresi yang sudah tersedia | **41/41**: konten 15, galeri 8, organisasi 8, publik/proxy 10                                                                                                        |
| Database                    | **83/83**, cleanup lolos                                                                                                                                             |
| Statis/build final          | TypeScript/build exit 0; ESLint **0 error, 7 warning bawaan**                                                                                                        |
| HTTP Pages dan Worker       | **82/82**: route sah 200, slug hilang/fixture 404, LPJ 301 dengan filter tetap; **8/8 aset** 200 immutable                                                           |
| Respons dinamis             | Pages `X-Katar-Gateway: pages-v1`, `Cache-Control: no-store`; tidak melemahkan cache privat                                                                          |

Ukuran dibuktikan dengan `innerWidth` pada tab yang diperiksa. Windows/IAB memiliki gutter scrollbar:
indikator overflow adalah `scrollWidth === clientWidth`, bukan harus sama dengan `innerWidth`.
Audit admin awal ternyata terulang pada 360 px karena override browser mengenai tab lain. Login lokal
juga sempat salah dilabeli lima lebar. Keduanya **diulang dengan CDP scoped ke tab dan assert lebar/route**;
angka tabel memakai hasil ulang. Catatan koreksi tetap disimpan di DEVLOG.

Interaksi yang dibuktikan:

- Tab/Shift+Tab tertahan di menu/dialog; Enter membuka, Escape menutup dan fokus kembali ke pemicu.
  Dialog wajib tetap menolak Escape/klik luar dan menyediakan tombol Keluar. Modal potret juga diuji
  pada 360×560; nama/bidang panjang tetap terbaca.
- Pintasan konten memindahkan fokus ke main. Jeda menghasilkan `animationPlayState: paused`.
  Pada produksi kelima lebar, reduced-motion menghasilkan animasi `none`, susunan kolom, lima info
  terlihat dan lebar isi sama dengan wadahnya.
- Filter Media/Rencana menghasilkan satu kegiatan; refresh, berita utama Media, Back/Forward dan
  empat pengalihan admin anonim ke login lolos. Arsip anonim tetap menampilkan ajakan login.
- Galeri produksi masih kosong. Route uji lokal dengan gambar geometris sintetis membuktikan
  potret/lanskap/fallback, lightbox lima lebar, panah keyboard, zoom dan fokus. Emulasi sentuh Opera:
  swipe → item 2/3, cubit → 250%, pan → translate 80 px. Ini belum uji perangkat fisik.
- **Tiga akun UI sementara** tanpa tautan pengurus dipakai hanya di localhost (akun ketiga untuk
  koreksi viewport). Username uji diubah lalu dipulihkan; simpan profil uji, pembatasan menu anggota
  dan penolakan akses Akun diuji. Semuanya logout/dihapus bersama profil/audit; verifikasi ketiganya
  **0**. Kredensial, skrip akun dan route fixture sudah dihapus. Akun asli tidak disentuh.

Sesi audit lama merekam empat React #418. Pesan itu **tidak terulang pada replay sesi bersih 31 route**,
interaksi profil/jeda, maupun axe yang baru dijalankan setelah aplikasi siap; konsol ulang 0 error/warning.
Penyebab catatan lama belum dipastikan, sehingga tidak diklaim pasti berasal dari axe. IAB juga sempat
mengalami `ERR_CONNECTION_CLOSED`/`ERR_QUIC_PROTOCOL_ERROR` saat navigasi penuh berulang. Halaman yang
terhenti tidak dihitung lulus; pemulihan memakai tab HTTPS baru dan sisa detail diperiksa lewat tautan SPA.
Tidak mengubah pengamanan atau konfigurasi jaringan untuk melanjutkan audit.

## Performa produksi — target masih terbuka

Lighthouse **13.5.0 / Chrome 155**, mobile **412×823 DPR 1,75**, cache browser dingin, CPU **4×**.
Profil bawaan simulated slow 4G: RTT **150 ms**, throughput **1638,4 Kbps**; nilai penyesuaian DevTools
pada report: latency 562,5 ms, download 1474,56 Kbps, upload 675 Kbps. Tidak ada pemblokiran font/URL pada
run hasil akhir. Ini data lab, bukan p75 pengguna nyata atau bukti INP lapangan; CrUX/RUM tidak diukur.

| Versi/halaman                           | LCP per run (detik)       | Median    |
| --------------------------------------- | ------------------------- | --------- |
| Baseline beranda `93be2f4`              | 5,256 / 4,601 / 4,912     | **4,912** |
| Perbaikan utama beranda `70c0e5d`       | 2,691 / 2,702 / 2,686     | **2,691** |
| Ulangan konfigurasi yang sama `c5bd633` | 3,864 / 2,994 / 1,780     | **2,994** |
| **Versi final beranda `ac75043`**       | **2,741 / 2,833 / 2,690** | **2,741** |
| Baseline direktori (diagnostik tunggal) | 4,159                     | —         |
| Direktori `c5bd633`                     | 1,447 / 2,831 / 1,238     | **1,447** |

Versi final beranda: CLS **0**, TBT **0**, skor performa **93/89/91**, aksesibilitas/best-practices/SEO
**100** di ketiga run. Median LCP turun sekitar **44%** dari baseline, tetapi belum <2,5 detik.
Sampel detail kegiatan 4,180 detik dan arsip 2,512 detik pada `c5bd633` hanya diagnostik tunggal;
tidak digunakan untuk menyimpulkan median kedua halaman atau mengklaim target menyeluruh.

Trace baseline menunjuk H1 sebagai LCP, stylesheet Google Fonts sebagai render blocker dan logo
berlebih. Font lokal/logo responsif dipertahankan. Pengukuran memperlihatkan variasi jaringan/host;
baseline sempat bersamaan dengan QA lain, sehingga perbandingan bukan eksperimen laboratorium
terkendali penuh. Tabel memuat run berulang, termasuk hasil lebih lambat, bukan memilih run tercepat.

Eksperimen yang **sudah dibuang** setelah diukur:

| Kandidat                           | Hasil dan keputusan                                                                              |
| ---------------------------------- | ------------------------------------------------------------------------------------------------ |
| `font-display: optional` + preload | 2,688 detik diagnostik; tidak memberi perbaikan berarti, kembali ke swap                         |
| CSS inline di HTML                 | Beranda 4,153/2,855/2,910; median 2,910, direktori median 2,842; kembali ke stylesheet eksternal |
| Jakarta Latin dibundel ke CSS      | Beranda 4,810/3,005/5,266; median 4,810; kembali ke font terpisah + preload                      |

Diagnostik yang memblokir font di Lighthouse mendapat 2,266 detik, tetapi **bukan hasil web final** dan
tidak dihitung lulus. Tidak menghapus font desain, mengubah cache privat, atau menyimpan eksperimen
yang memperburuk hasil hanya untuk mengejar skor.

## Temuan terbuka dan Checkpoint 3

1. **LCP <2,5 detik belum konsisten.** Lanjutan sebaiknya menarget rantai CSS/font dan paint H1 pada
   konfigurasi build yang sama, mengukur berulang dalam kondisi host stabil. Perubahan arsitektur
   atau pergantian font memerlukan keputusan desain tersendiri; jangan menganggap target sudah lulus.
2. **Review Hanif/teman/Ketua**, HP fisik dan pembaca layar nyata belum dilakukan. Axe tidak menjadi
   sertifikat seluruh WCAG; item `incomplete` pada warna gradasi dinilai manual.
3. Foto/media nyata, dokumen dan peta resmi yang belum tersedia tidak dibuat-buat. CMS Hari 17 belum
   dimulai. Pembelian domain dan analytics tetap di luar sesi ini.

`main` baru di-fast-forward setelah persetujuan Checkpoint 3; deployment tetap dari `revisi`.
Bukti JSON, log, trace dan screenshot berada di luar repo publik:
`C:/Users/Hanif Zhafran/.codex/attachments/katar-hari16-20261018/`.
Penanda arsip: `production-layout.json`, `production-axe.json`, `admin-layout.json`,
`production-console-final.json`, `production-final-home.json`, `http.json`, `verified-*-summary.json`.

Referensi metode: [variasi pengukuran Lighthouse](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring),
[font Google dan lisensi](https://fonts.google.com/faq). Lisensi lengkap ikut di `src/assets/fonts/`.
