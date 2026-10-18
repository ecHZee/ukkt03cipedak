# Hari 16 — Audit tampilan, aksesibilitas dan performa

18 Oktober 2026. **Implementasi dan QA lokal selesai; verifikasi produksi sedang dijalankan.**
Checkpoint 3 belum disetujui, `main` tetap pada `82487f5`.

## Perbaikan berdasarkan temuan

| Temuan                                                                               | Perbaikan                                                                                                                                                        |
| ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ikon masuk 36 px; beberapa tautan aksi/berita/footer 17–42 px                        | Target interaktif minimal 44 px, termasuk tabel dan dialog CMS                                                                                                   |
| Teks sekunder/badge pada permukaan berwarna gagal AA; copyright footer terlalu redup | Gelapkan token teks sekunder, hijau, jingga, merah galat; copyright menjadi slate-400                                                                            |
| Urutan judul H1 → H3/H4 dan belum ada pintasan konten                                | Perbaiki hierarki, tambah “Lewati ke konten utama”, landmark utama dan fokus terlihat                                                                            |
| Info berjalan terus bergerak dan tidak punya jeda                                    | Tombol jeda/lanjut, salinan dekoratif disembunyikan dari pembaca layar; reduced-motion mematikan animasi dan memungkinkan penelusuran horizontal dengan keyboard |
| Drawer/dialog admin melepas fokus ke belakang                                        | Portal Radix untuk drawer, preview pengurus, dialog akun dan dialog wajib ganti password; Escape dan pemulihan fokus sesuai fungsi masing-masing                 |
| Pencarian pengurus kehilangan fokus setelah satu huruf                               | Pindahkan komponen toolbar keluar dari fungsi halaman agar input tidak dibuat ulang saat mengetik                                                                |
| Stylesheet font Google berada pada rantai render kritis                              | Sajikan font desain E dari aset lokal berlisensi OFL; preload Latin, Latin Extended sesuai karakter                                                              |
| Logo PNG 192 px sekitar 69 KB untuk ukuran tampilan 40 px                            | WebP lossless 96/192 px dengan srcset, PNG resmi tetap tersedia                                                                                                  |
| Canonical/OG beranda relatif                                                         | Gunakan URL absolut Pages                                                                                                                                        |

Tidak ada migrasi, perubahan RLS, secret, dependensi atau lockfile. Desain E, logo, biru/emas, susunan
menu sejajar, hierarki BPH/Kabid dan gradasi modal tetap dipakai. Form CMS yang masih maket tetap
menunggu Hari 17–22; audit ini tidak mengklaimnya menjadi CRUD.

## Bukti lokal

- 31 route publik yang ditautkan saat audit × 360/390/768/1024/1440 px = **155 kombinasi**.
  Satu H1, satu landmark utama, tanpa overflow horizontal dan tanpa kontrol yang terukur <44 px.
  Windows/IAB memiliki gutter scrollbar, sehingga bandingkan `scrollWidth` dengan `clientWidth`.
- Empat halaman admin fungsional (dashboard, profil, pengurus, akun) × lima lebar = **20 kombinasi**,
  tanpa overflow atau target kecil. Tabel boleh digeser di dalam wadahnya.
- Axe 4.14: **62 audit publik** (31 route × HP/desktop) dan **8 audit admin**, tanpa pelanggaran otomatis.
  Axe juga dijalankan pada menu, modal potret, lightbox dan dialog wajib. Item `incomplete`, terutama
  warna pada gradasi, tetap membutuhkan penilaian manual; skor bukan sertifikat seluruh WCAG.
- Keyboard: Tab/Shift+Tab tertahan di modal/menu, Enter membuka, Escape menutup dan fokus kembali.
  Dialog wajib tetap menolak Escape/klik luar; tombol Keluar tetap tersedia.
- `prefers-reduced-motion: reduce`: animasi info `none`, hitungan pengulangan satu dan area bisa digeser.
  Tombol jeda menghasilkan `animationPlayState: paused`. Pintasan konten memindahkan fokus ke main.
- Galeri kosong diuji dengan route sementara lokal dan gambar geometris sintetis, tanpa DB/Storage.
  Lightbox di lima lebar, potret/lanskap/fallback, panah keyboard, zoom dan fokus lolos. Opera emulasi
  sentuh membuktikan swipe → item 2/3, cubit → 250%, pan → translate 80 px; perangkat fisik belum diuji.
- Dua akun sementara tanpa tautan pengurus dipakai hanya di localhost: simpan/pulihkan username,
  simpan profil uji, anggota hanya melihat Dashboard/Profil dan dialihkan saat membuka Akun.
  Akun, profil dan jejak audit sudah dihapus; verifikasi ulang ketiganya **0**. Kredensial uji dihapus.
- Regresi **41/41** (konten 15, galeri 8, organisasi 8, publik/proxy 10); database **83/83**, cleanup lolos.
  TypeScript dan build exit 0; ESLint 0 error/7 warning bawaan. Pemeriksaan final diulang setelah cleanup.

## Performa produksi

Baseline sebelum perubahan, URL Pages anonim, Lighthouse 13.5.0 / Chrome 155, mobile 412×823 DPR 1,75,
cache browser dingin dan CPU 4×. Profil bawaan simulated slow 4G: RTT 150 ms, throughput 1638,4 Kbps
(nilai penyesuaian DevTools di report: latency 562,5 ms, download 1474,56 Kbps, upload 675 Kbps).

| Halaman                        | Baseline LCP                                    | Sesudah               |
| ------------------------------ | ----------------------------------------------- | --------------------- |
| Beranda, tiga run              | 5,256 / 4,601 / 4,912 dtk; median **4,912 dtk** | Diukur setelah deploy |
| Direktori, satu run diagnostik | 4,159 dtk                                       | Diukur setelah deploy |

Baseline beranda: CLS 0,000575, aksesibilitas 94. Direktori: CLS 0,002308, aksesibilitas 95.
Trace menunjuk judul H1 sebagai elemen LCP, stylesheet font Google sebagai render blocker dan logo
sebagai transfer gambar yang berlebih. Hasil setelah deploy dilengkapi di bagian ini setelah pengukuran.
Ini data lab, bukan p75 pengguna nyata atau bukti INP lapangan; CrUX/RUM tidak diukur dalam sesi ini.

## Batas audit dan review Checkpoint 3

- Review nyata Hanif/teman/Ketua dan uji HP fisik/pembaca layar masih perlu dilakukan.
- Foto/media nyata, dokumen dan peta resmi yang belum tersedia tidak dibuat-buat untuk audit.
- Tidak membeli domain, menambah analytics atau memulai CMS Hari 17. `main` hanya fast-forward setelah
  persetujuan Checkpoint 3 atas hasil ini; deployment tetap dari `revisi`.
- Bukti JSON, log, trace dan screenshot disimpan di arsip lokal **di luar repo publik**:
  `C:/Users/Hanif Zhafran/.codex/attachments/katar-hari16-20261018/`.

Referensi metode: [pengukuran Lighthouse dan variasi kondisi](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring),
[font Google dan lisensi](https://fonts.google.com/faq). Lisensi font lengkap ikut di `src/assets/fonts/`.

## Pengukuran antara dan penyempurnaan

Kode `70c0e5d` sudah online. Tiga run setara menghasilkan LCP 2,691/2,702/2,686 dtk (median 2,691),
CLS 0–0,000287, TBT 0, aksesibilitas/SEO/best-practices 100. Target LCP belum tercapai pada versi ini.
Uji diagnostik dengan font diblokir hanya di Lighthouse menghasilkan 2,266 dtk; **bukan hasil akhir**
dan tidak boleh dipakai untuk mengklaim web lulus. Font di website tidak diblokir/dihapus.

Karena selisih berasal dari pemuatan font, lanjutkan `font-display: optional` bersama preload Latin.
Saat font siap (atau sudah tercache), font desain E tetap tampil. Pada kunjungan dingin dengan koneksi
lambat, browser boleh mempertahankan font cadangan agar teks tidak terlambat berganti. Ini kompromi
pemuatan, bukan mengganti keluarga font. Pengukuran final tanpa pemblokiran font dilakukan sesudah deploy.
Referensi: [preload dan font optional](https://web.dev/articles/preload-optional-fonts).
