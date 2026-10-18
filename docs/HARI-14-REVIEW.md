# Review Hari 14 — Tentang, pengurus, dan bidang

## Yang bisa direview

| Halaman                                     | Hasil                                                                                                            |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `/tentang`                                  | Profil, riwayat periode dari database, dasar hukum dalam accordion; tautan ke direktori dan program.             |
| `/tentang/pengurus`                         | 61 kartu tanpa duplikasi, filter peran/bidang, avatar inisial, badge emas BPH dan gelap Penasihat, popup profil. |
| `/program`                                  | Tujuh kartu bidang menautkan detail masing-masing.                                                               |
| `/program/okk` hingga `/program/inventaris` | Fokus kerja, pengurus, serta kegiatan terbit milik bidang tersebut. Bagian tanpa data disembunyikan.             |

Induk Tentang/Program hanya `Outlet`, sehingga detail tidak menumpuk di bawah halaman daftar.
Navbar desktop tetap tujuh tautan sejajar sesuai review Hanif; kategori tetap di hamburger/Lainnya.

## Data dan batas konten

- 61 orang = **2 Penasihat + 8 BPH + 51 pengurus bidang**. Angka pengurus aktif **59** tidak mencakup Penasihat.
- Bidang: OKK 7, Kerohanian 4, Lingkungan 8, Ekonomi 8, Pendidikan 13, Media 7, Inventaris 4.
- Nama lengkap beserta gelar pada DOM lokal dibandingkan dengan seed lampiran SK
  `supabase/migrations/20260930162925_data_awal.sql`: cocok 61/61. Tes service juga memeriksa jabatan, bidang,
  dan urutan dari seed yang sama. Ini bukan pemeriksaan ulang scan SK asli oleh BPH.
- Sejarah pendirian, visi, dan misi belum memiliki naskah yang disahkan BPH. Narasi maket lama di Tentang
  dan kalimat "Visi kami" di beranda dihapus; tidak diangkat menjadi informasi resmi.
- Tanggal **05 Juni 2025** ditulis sebagai tanggal SK, bukan tanggal pendirian/pelantikan.
  Tanggal pelantikan hanya ditampilkan bila tersedia di database.
- Dasar hukum: [Permensos 25/2019](https://peraturan.bpk.go.id/Details/129419/permensos-no-25-tahun-2019)
  **sebagaimana diubah** dengan [Permensos 9/2025](https://peraturan.bpk.go.id/Details/325168/permensos-no-9-tahun-2025).
  Hubungan perubahan diperiksa pada JDIH BPK, 18 Oktober 2026.
- Foto dan Instagram diperiksa izinnya **sebelum serialisasi** di service, selain trigger privasi database.
  Handle Instagram invalid disembunyikan; email/telepon pribadi tidak diambil. Foto berizin yang gagal dimuat
  kembali ke inisial. Pengujian izin menggunakan data terisolasi, tanpa mengubah data produksi.

## Bukti uji lokal

- `tsc --noEmit`: lolos; ESLint: **0 error / 7 warning bawaan**; build: exit 0.
- `test:organisasi`: **8/8**, `test:konten`: **15/15**, `test:galeri`: **8/8** — total **31/31**.
- Tidak ada migrasi, perubahan RLS, akun, atau dependensi. Suite DB 83 tes tidak dijalankan ulang;
  pemeriksaan query/privasi yang berubah dicakup tes service terisolasi di atas.
- HTTP lokal: **18 URL valid 200**, **3 slug hilang 404**. Canonical/OG halaman baru berasal dari konfigurasi
  situs, memakai origin localhost di dev; origin produksi diperiksa terpisah setelah deploy.
- **20 kombinasi**: Tentang, direktori, indeks program, detail Lingkungan pada lebar
  **360, 375, 840, 1024, 1440 px**. Satu H1 per halaman, tanpa overflow horizontal.
  IAB menyisihkan gutter scrollbar 15 px, sehingga ukuran yang dibandingkan adalah `scrollWidth === clientWidth`.
- Sembilan filter menghasilkan jumlah yang benar; modal tampil di portal body, tombol tutup 44×44 px,
  Enter/Escape, perangkap fokus, dan fokus kembali ke kartu lolos. Accordion mendukung panah dan Enter.
- Klik indeks program → detail Media → kegiatan terbit berhasil. Tautan direktori ↔ Tentang/bidang berhasil.
- Vite sempat mengoptimalkan `@radix-ui/react-accordion` saat pertama dibuka dan menimbulkan error hook
  sementara. Server direstart, interaksi diuji ulang pada tab baru: console **0 error/0 warning**.
- Bundle publik tidak memuat penanda service role ataupun fixture tes.
- Bukti JSON, log, dan screenshot disimpan di luar repo publik dalam arsip QA lokal.

## Produksi

Kode `534a487` sudah online melalui push `revisi` → Cloudflare Worker `katar-rw03`, 18 Oktober 2026.

- Penanda SSR baru "Lihat direktori pengurus" terdeteksi di `/tentang`.
- **18 URL valid HTTP 200**, **3 slug hilang HTTP 404**. Seluruh tujuh detail bidang memiliki jumlah kartu
  yang sesuai. Canonical dan `og:url` sepuluh halaman Tentang/Program memakai origin produksi dan path tepat.
- DOM direktori produksi: **61 nama/gelar cocok dengan seed lampiran SK**.
- Browser produksi: **20 kombinasi** dari empat halaman × lima lebar **360/375/840/1024/1440 px**,
  satu H1 per halaman, tanpa overflow horizontal.
- Filter Media 7 orang, popup profil, portal body, Escape/pemulihan fokus, accordion riwayat/dasar hukum,
  serta klik direktori → bidang Media → kegiatan terbit lolos. Console **0 error/0 warning**.
- Server Vite sesi ini dimatikan; tidak ada proses `workerd` tersisa. Tidak ada data produksi yang dimutasi.

## Penyesuaian review — Sorotan jabatan (18 Oktober 2026)

Atas masukan Hanif sebelum Hari 15, kartu memakai hierarki visual:

| Jabatan                              | Tampilan                                                                                |
| ------------------------------------ | --------------------------------------------------------------------------------------- |
| Ketua                                | Kartu paling besar, lebar penuh, latar biru Benhur, nama dan avatar terbesar.           |
| Wakil Ketua                          | Tiga kartu besar dengan ukuran setara, sejajar mulai tablet.                            |
| Sekretaris dan Bendahara             | Kartu menengah, lebih besar dari wakilnya.                                              |
| Wakil Sekretaris dan Wakil Bendahara | Kartu pendamping, tetap lebih lega dari kartu anggota.                                  |
| Kepala Bidang                        | Kartu lebar dengan nama/avatar besar di atas anggota, pada direktori dan detail bidang. |

`LeadershipShowcase` lama yang sebelumnya tidak dipakai disederhanakan untuk menyusun BPH dari
`PersonCard` yang sama. Popup tetap dikelola `DaftarPengurus`; tidak ada duplikasi pengurus maupun
perubahan data, izin, akun, dependensi, atau route.

QA lokal: tsc/build lolos, lint 0 error/7 warning, regresi organisasi 8/8. Sepuluh kombinasi direktori/detail
Media × 360/375/840/1024/1440 px tanpa overflow. Luas kartu BPH terukur Ketua > Wakil Ketua >
Sekretaris/Bendahara > wakilnya di kelima lebar. 61 nama/gelar tetap cocok seed, 15 kartu disorot
(8 BPH + 7 Kabid); filter Media tetap 7 orang dengan 1 Kabid. Profil kelima jenis sorotan, Enter/Escape,
portal dan pemulihan fokus lolos di HP; console 0 error/0 warning. Tinggi Ketua di HP diperbesar setelah
pengukuran awal menunjukkan nama panjang membuat kartu Wakil lebih tinggi.

Produksi kode `a474025` lolos: penanda `data-sorotan="ketua"` sudah online, 18 URL valid 200 dan 3 slug
hilang 404. Direktori tetap 61 kartu, 8 BPH + 7 Kabid disorot; seluruh tujuh detail bidang masing-masing
memiliki 1 Kabid. Browser online mengulang 10 kombinasi/lima lebar di atas: nama/gelar cocok seed,
hierarki luas kartu BPH tepat, tanpa overflow dan console error/warning. Popup Ketua dan Kabid,
filter BPH/Media, Escape dan pemulihan fokus lolos. Screenshot produksi disimpan di luar repo publik.
Dev server sudah dimatikan, tidak ada workerd tersisa. Hari 15 belum dimulai.

## Penyesuaian review — Modal foto potret dan panduan unggah

Hanif memilih **modal + panduan ukuran sekarang**, crop interaktif saat tahap CMS nanti.
Popup maksimal 820 px: foto potret 3:4 besar di kiri, nama/jabatan/bidang/periode di kanan mulai 640 px;
di HP foto berada di atas detail. Foto rasio lain tampil utuh dengan `object-contain`, tanpa crop otomatis.
Fallback inisial dan izin publik tetap berlaku. Tombol tutup 44 px tetap terlihat saat modal digulir.

Rekomendasi foto **900 × 1200 px (3:4)** dicantumkan di Foto Profil dan [panduan foto](FOTO-PROFIL.md).
Ukuran itu saran, belum menjadi syarat validasi. Alur unggah/RPC/kompresi tidak diubah; pengguna masih
merapikan crop sebelum memilih file, lalu file langsung disimpan. Editor crop belum tersedia.

QA lokal: 14 kombinasi dua profil bernama/bidang panjang pada 360/375/840/1024/1440 px, ditambah
360×560 dan 840×400. Susunan foto/detail, tanpa overflow, portal, tombol 44 px, keyboard/Escape/fokus lolos.
Pada layar pendek, PageDown mencapai bagian bawah dan tombol tutup tetap terlihat. Gambar sintetis lokal
900×1200 dan 1200×900 tampil utuh; gambar rusak kembali ke inisial. Fixture hanya di browser lokal,
tanpa DB/Storage; modul uji dihapus sebelum build. Pengukuran pertama dilakukan saat animasi masih 95%
dan diulang setelah animasi selesai. tsc/build lolos, lint 0 error/7 warning, regresi organisasi 8/8,
console 0 error/0 warning. Teks panduan form dicek secara statis; unggah akun tidak diuji ulang karena
alur simpan tidak berubah. Verifikasi produksi dilakukan setelah push.

## Review Hanif/BPH

1. Buka Tentang → direktori; cek gelar/jabatan dan posisi bidang sesuai SK asli yang dipegang BPH.
2. Coba filter di HP fisik, buka profil, tutup, lalu buka detail bidang dan kegiatannya.
3. Siapkan naskah sejarah/visi/misi yang telah disetujui BPH sebelum konten itu ditampilkan.
4. Foto pengurus tetap menunggu file dan izin pemilik; tidak ada foto orang yang dimasukkan ke repo publik.

Berikutnya **Hari 15: arsip dengan akses berjenjang, kontak/peta, filter bersama, redirect `/lpj` → `/arsip`**.
Hari 15 belum dikerjakan dalam sesi Hari 14 ini.
