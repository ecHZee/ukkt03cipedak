# Planning Pengembangan — Platform Digital Karang Taruna RW 03 Cipedak

> **Versi:** 1.0 · **Disusun:** 29 September 2026 · **Penyusun:** Claude (developer utama) bersama Hanif (Bid. Media)
> **Status:** Draft untuk dibahas bersama Ketua & pengurus
> **Sumber:** audit kode & tampilan (29 Sep 2026), dokumen _Masukan Pengembangan Website KT RW03_ (16 Sep 2026),
> SK No. 003/SK/KT-Cipedak/VI/2025, riset ±20 website pembanding.

---

## Daftar Isi

1. [Ringkasan](#1-ringkasan)
2. [Keputusan yang Sudah Diambil](#2-keputusan-yang-sudah-diambil)
3. [Ruang Lingkup](#3-ruang-lingkup)
4. [Prinsip Produk](#4-prinsip-produk)
5. [Arsitektur Teknis](#5-arsitektur-teknis)
6. [Model Data](#6-model-data)
7. [Role & Hak Akses](#7-role--hak-akses)
8. [Struktur Halaman (Sitemap)](#8-struktur-halaman-sitemap)
9. [Arah Desain UI/UX](#9-arah-desain-uiux)
10. [Tahapan Pengerjaan](#10-tahapan-pengerjaan)
11. [Checklist Data dari Pengurus](#11-checklist-data-dari-pengurus)
12. [Biaya](#12-biaya)
13. [Risiko & Mitigasi](#13-risiko--mitigasi)
14. [Perawatan Setelah Launching](#14-perawatan-setelah-launching)
15. [Pertanyaan Terbuka](#15-pertanyaan-terbuka)
16. [Lampiran: Temuan Audit](#16-lampiran-temuan-audit)

---

## 1. Ringkasan

Website hasil Lovable sudah punya **pondasi kode yang bagus** (TanStack Start + SSR, struktur folder rapi,
build lolos), tetapi **baru berupa maket**:

- Semua isi ditulis langsung di kode (`src/domains/*/data.ts`) → pengurus tidak bisa update sendiri.
- Halaman `/admin` terbuka untuk siapa saja dan tombolnya tidak menyimpan apa pun.
- Tidak ada satu pun foto (0 gambar), struktur pengurus tidak sesuai SK.
- Tampilan generik, beranda terlalu panjang (±14 layar di HP), hero tiap halaman tidak konsisten.

**Rencana:** kode **dipertahankan dan dirombak**, bukan diulang dari nol. Target launching **±4–5 minggu kerja**
setelah akun & data tersedia, dengan biaya bulanan **Rp0**.

### Kenapa urutannya bukan "perbaiki UI/UX dulu"?

UI/UX adalah **Fase 2**, bukan Fase 0. Alasannya:

1. Banyak perbaikan UI **bergantung pada bentuk data**: halaman detail berita, "kegiatan terdekat",
   angka statistik otomatis, dan "sembunyikan bagian yang kosong" hanya bisa dibuat benar setelah database ada.
   Kalau UI dipoles duluan, sebagian besar akan dibongkar lagi.
2. Struktur pengurus di kode **salah** (27 slot vs 61 orang di SK). Desain kartu pengurus harus mengikuti data asli.

Tapi supaya ada kemajuan yang **langsung terlihat**, Fase 0 tetap memuat perbaikan tampilan yang
murah dan tidak bergantung data (hero Tentang yang rusak, navbar luber, bahasa Inggris).

---

## 2. Keputusan yang Sudah Diambil

| #   | Keputusan                                                                          | Catatan                                                                                |
| --- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| D1  | **Web Karang Taruna**, dengan manfaat untuk seluruh warga RW 03                    | Bukan portal administrasi RT/RW. Lihat §3                                              |
| D2  | **Kode Lovable dipertahankan**, dirombak bertahap                                  | Framework & struktur folder tetap                                                      |
| D3  | **Supabase** untuk database + login, **gratis + ping anti-pause**                  | Free tier di-_pause_ bila 7 hari sepi                                                  |
| D4  | **Supabase Storage** (1 GB) untuk foto, dokumen, dan video pendek; **R2 menyusul** | R2 wajib metode pembayaran (dicek 30 Sep 2026). Kode upload dibuat bisa ganti penyedia |
| D5  | **Cloudflare** untuk hosting                                                       | Paket gratis tanpa kartu, cron gratis                                                  |
| D6  | Video panjang cukup **tempel link** YouTube/IG/TikTok                              | Hemat penyimpanan & kuota warga                                                        |
| D7  | **Login hanya untuk pengurus.** Tidak ada pendaftaran akun publik di tahap awal    | Mengurangi beban moderasi & data pribadi                                               |
| D8  | Identitas visual tetap **Benhur Blue #0047AB + Gold #D4A017**                      | Sesuai keputusan tim sebelumnya                                                        |
| D9  | **Kabid = nama nomor 1** di setiap bidang pada SK                                  | Dikonfirmasi Hanif                                                                     |
| D10 | Tanggal resmi mengikuti SK: **ditetapkan 05 Juni 2025**                            | Sementara, menunggu konfirmasi Ketua soal tanggal pelantikan (9 Juni?)                 |
| D11 | Akun layanan (Supabase, Cloudflare, domain) dibuat dengan **email organisasi**     | Dibuat oleh Hanif, bukan oleh developer                                                |

---

## 3. Ruang Lingkup

### 3.1 Termasuk (in-scope)

**Untuk Karang Taruna**

- Profil organisasi, struktur pengurus sesuai SK, 7 bidang, program kerja
- Kegiatan, berita, galeri foto/video, arsip dokumen berjenjang
- Admin (CMS) supaya pengurus bisa mengelola isi tanpa developer

**Untuk warga RW 03 (tanpa perlu login)**

- Agenda kegiatan terdekat + tombol _Tambah ke Google Calendar_ & _Share ke WhatsApp_
- Transparansi kas Karang Taruna (ringkasan pemasukan/pengeluaran per kegiatan)
- Etalase UMKM & jasa warga (dikelola Bidang Ekonomi Mandiri)
- Kotak aspirasi/usulan kegiatan
- Info peminjaman inventaris (tenda, sound system, kursi) → hubungi via WA
- **Kumpulan template/format surat yang bisa diunduh** (file saja, tidak diproses di web)
- Tombol kontak cepat (WA) ke sekretariat Karang Taruna

### 3.2 Tidak termasuk (out-of-scope) — dan alasannya

| Fitur                                           | Alasan                                                                         | Alternatif ringan                                                       |
| ----------------------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| Akun & login untuk setiap warga                 | Perlu verifikasi "siapa warga", menambah kerja admin & risiko data pribadi     | Semua fitur warga dibuat tanpa login                                    |
| Pengajuan surat (SKTM, pengantar) secara online | Wewenang RT/RW & kelurahan, bukan Karang Taruna; melibatkan NIK & data ekonomi | Sediakan **file template** untuk diunduh                                |
| Sistem janji temu ketua RT/RW                   | Wewenang pengurus RT/RW                                                        | Tombol WA / info kontak yang disetujui RW                               |
| Kas yang "hanya bisa dilihat warga"             | Butuh akun warga (lihat di atas)                                               | Kas Karang Taruna **terbuka publik** (ringkasan, bukan rincian pribadi) |

> Database dirancang supaya fitur di atas **bisa ditambahkan nanti** tanpa bongkar ulang, bila pengurus RW
> menyetujui web ini diperluas menjadi portal warga.

---

## 4. Prinsip Produk

1. **Deploy lalu ditinggal.** Tidak ada tugas rutin untuk developer. Semua isi diubah lewat admin.
2. **Yang kosong disembunyikan.** Tidak ada "TBA", "Foto menyusul", atau "Belum diisi" yang terlihat publik.
   Bagian yang belum punya data otomatis tidak ditampilkan.
3. **Data asli, bukan angka hiasan.** Statistik dihitung otomatis dari database, bukan diketik manual.
4. **HP dulu.** Mayoritas warga membuka dari link di grup WhatsApp.
5. **Foto asli adalah desain utama.** Tidak ada gambar AI untuk konten.
6. **Satu bahasa desain.** Satu pola hero, satu set komponen, satu gaya foto.
7. **Bahasa Indonesia penuh**, termasuk halaman error dan admin.
8. **Privasi anggota dijaga.** Foto & Instagram pengurus hanya tampil dengan persetujuan (sebagian mungkin di bawah umur).

---

## 5. Arsitektur Teknis

```
            Warga / Pengurus (HP & laptop)
                        │
                        ▼
      ┌─────────────────────────────────────┐
      │   Cloudflare (hosting, gratis)      │
      │   TanStack Start — SSR              │
      │   + Cron Trigger (ping & backup)    │
      └───────┬──────────────────┬──────────┘
              │                  │
              ▼                  ▼
   ┌──────────────────┐  ┌────────────────────────┐
   │ Supabase (free)  │  │ Supabase Storage (1 GB)│
   │ • Postgres + RLS │  │ • Foto (WebP, dikompres)│
   │ • Auth pengurus  │  │ • Dokumen PDF          │
   │ • Audit log      │  │ • Video pendek         │
   └──────────────────┘  │ • Backup DB mingguan   │
                         └────────────────────────┘
   Video panjang → link YouTube / Instagram / TikTok (di-embed)
```

### 5.1 Stack

| Lapisan         | Teknologi                                                               | Status                         |
| --------------- | ----------------------------------------------------------------------- | ------------------------------ |
| Framework       | TanStack Start (React 19, SSR)                                          | Sudah ada                      |
| Styling         | Tailwind CSS v4 + komponen shadcn/ui                                    | Sudah ada                      |
| Database & Auth | Supabase (Postgres, Row Level Security)                                 | Terpasang, **belum ada tabel** |
| Media           | Supabase Storage (bucket publik & privat); R2 bila kelak tersedia kartu | Baru                           |
| Hosting         | Cloudflare Workers                                                      | Baru (ganti target deploy)     |
| Jadwal otomatis | Cloudflare Cron Trigger                                                 | Baru                           |
| Analytics       | Cloudflare Web Analytics (tanpa cookie)                                 | Baru                           |

### 5.2 Aturan media

> **Update 30 Sep 2026:** Cloudflare R2 mewajibkan kartu/PayPal walau gratis. Sampai Katar punya
> kartu debit/virtual, media disimpan di **Supabase Storage (1 GB)**: batas per file 50 MB, video lebih
> panjang wajib lewat link. Dengan kompresi, 1 GB ≈ 3.000 foto. Dashboard admin menampilkan pemakaian.

| Jenis         | Aturan                                                                                                         |
| ------------- | -------------------------------------------------------------------------------------------------------------- |
| Foto          | Dikompres di browser sebelum upload → WebP, sisi terpanjang 1920 px, ±300 KB. Thumbnail 480 px dibuat otomatis |
| Dokumen       | PDF, maks. 20 MB. Dokumen non-publik disimpan privat, diakses lewat link sementara (±10 menit)                 |
| Video pendek  | MP4, maks. **50 MB / ±1 menit** (batas Supabase Free). Lebih dari itu diminta pakai link                       |
| Video panjang | Tempel link YouTube/IG/TikTok → otomatis tampil sebagai pemutar                                                |

Perkiraan kapasitas 10 GB gratis: ±25.000 foto, atau campuran ±10.000 foto + 30 video pendek.

### 5.3 Anti-pause & backup

- **Cron tiap 2 hari:** query ringan ke Supabase supaya proyek tidak dianggap tidak aktif.
- **Cron mingguan:** ekspor data penting (JSON) sebagai cadangan. Lokasi ditentukan di Hari 9 (tidak boleh di repo publik karena memuat data pengurus).
- **Cron bulanan:** laporan pemakaian penyimpanan (dicatat di tabel `pengaturan`, tampil di dashboard admin).

---

## 6. Model Data

Semua tabel memakai `id` (uuid), `created_at`, `updated_at`, `created_by`. Kolom `is_dummy` dipakai untuk data
contoh selama pengembangan, supaya mudah dihapus sebelum launching.

| Tabel            | Kolom penting                                                                                                                | Keterangan                            |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| `periode`        | `label` (2025–2028), `tanggal_sk`, `nomor_sk`, `tanggal_pelantikan`, `aktif`                                                 | Pergantian 2028 = buat periode baru   |
| `bidang`         | `slug`, `nama_resmi`, `nama_singkat`, `deskripsi`, `warna`, `urutan`                                                         | 7 bidang sesuai SK                    |
| `pengurus`       | `periode_id`, `nama`, `gelar`, `jabatan`, `bidang_id` (null untuk BPH), `urutan`, `rt`, `foto_url`, `instagram`, `izin_foto` | Jumlah per bidang bebas               |
| `profiles`       | `user_id` (auth), `pengurus_id`, `role`, `bidang_id`                                                                         | Akun login pengurus                   |
| `kegiatan`       | `judul`, `slug`, `bidang_id`, `mulai`, `selesai`, `lokasi`, `status`, `ringkasan`, `isi`, `cover_id`, `rutin`                | Sumber "kegiatan terdekat" & kalender |
| `berita`         | `judul`, `slug`, `kategori`, `isi`, `cover_id`, `status` (draft/review/terbit), `terbit_at`, `pinned`, `kegiatan_id`         | Alur draft → review → terbit          |
| `album`          | `judul`, `slug`, `kegiatan_id`, `tanggal`, `cover_id`                                                                        | Galeri per kegiatan                   |
| `media`          | `album_id`, `jenis` (foto/video/embed), `storage_path`, `embed_url`, `lebar`, `tinggi`, `ukuran`, `caption`                  | Semua file media                      |
| `dokumen`        | `judul`, `kategori`, `tahun`, `akses` (publik/anggota/bph), `r2_key`, `ukuran`, `status`                                     | Arsip digital                         |
| `kas`            | `tanggal`, `jenis` (masuk/keluar), `jumlah`, `keterangan`, `kegiatan_id`, `bukti_id`                                         | Transparansi kas (Fase 5)             |
| `umkm`           | `nama_usaha`, `pemilik`, `kategori`, `deskripsi`, `wa`, `foto_id`, `rt`, `aktif`                                             | Etalase warga (Fase 5)                |
| `aspirasi`       | `isi`, `kategori`, `kontak` (opsional), `status` (baru/diproses/selesai), `tanggapan`                                        | Kotak aspirasi (Fase 5)               |
| `template_surat` | `judul`, `deskripsi`, `r2_key`                                                                                               | File unduhan (Fase 5)                 |
| `pengaturan`     | key–value: nomor WA, email, sosmed, logo, hero, alamat, titik maps                                                           | Diubah dari admin                     |
| `audit_log`      | `tabel`, `aksi`, `record_id`, `user_id`, `sebelum`, `sesudah`, `waktu`                                                       | Diisi otomatis oleh trigger database  |

### 6.1 Isi awal dari SK (seed)

| Kelompok                                                                                      | Jumlah                      |
| --------------------------------------------------------------------------------------------- | --------------------------- |
| Penasihat                                                                                     | 2                           |
| BPH: Ketua 1, Wakil Ketua 3, Sekretaris 1, Wakil Sekretaris 1, Bendahara 1, Wakil Bendahara 1 | 8                           |
| Bid. Organisasi Kaderisasi, Keanggotaan (OKK) & Pemberdayaan SDM                              | 7                           |
| Bid. Kerohanian & Pembinaan Mental                                                            | 4                           |
| Bid. Lingkungan Kemasyarakatan, Kemitraan & Tata Kelola Organisasi                            | 8                           |
| Bid. Ekonomi Mandiri & Kesejahteraan Sosial                                                   | 8                           |
| Bid. Pendidikan, Keolahragaan & Kebudayaan                                                    | 13                          |
| Bid. Media Publikasi, Dokumentasi & Desain Grafis                                             | 7                           |
| Bid. Inventaris & Arsip                                                                       | 4                           |
| **Total**                                                                                     | **61** (59 tanpa penasihat) |

Kabid = nama urutan pertama di setiap bidang (D9).

---

## 7. Role & Hak Akses

> **Update 30 Sep 2026 (keputusan Hanif):** Super Admin khusus programmer. BPH, Kabid, dan anggota
> pilihan Kabid menjadi **Admin**. Anggota lain tidak punya akun; bahan dikirim ke Kabid lewat WA.

| Role                    | Siapa                                                         | Kelola konten                            | Terbitkan    | Kelola akun     | Arsip yang bisa dibuka           |
| ----------------------- | ------------------------------------------------------------- | ---------------------------------------- | ------------ | --------------- | -------------------------------- |
| **Publik**              | Siapa saja, termasuk anggota tanpa akun                       | —                                        | —            | —               | Publik                           |
| **Admin bidang**        | Kabid + anggota pilihan Kabid (`bidang_id` diisi)             | Konten bidangnya + konten umum buatannya | ✅ bidangnya | —               | Publik + Anggota                 |
| **Admin lintas bidang** | BPH: Ketua, Wakil, Sekretaris, Bendahara (`bidang_id` kosong) | Semua konten, pengurus, pengaturan, kas  | ✅ semua     | —               | Semua (termasuk BPH) + audit log |
| **Super Admin**         | Programmer                                                    | Semua                                    | ✅           | ✅ satu-satunya | Semua                            |

Di database hanya ada dua nilai role: `super_admin` dan `admin`. Jangkauan admin ditentukan oleh
kolom `profiles.bidang_id`. Akun admin bidang dibuat Super Admin atas permintaan Kabid.
Status `review` tetap tersedia sebagai opsi (misalnya minta BPH mengecek dulu), tetapi tidak wajib.

Semua aturan ini diuji otomatis lewat `npm run test:db`.

Aturan ini ditegakkan di **database (RLS)**, bukan hanya di tampilan. Dokumen yang tidak boleh dilihat
**tidak dikirim sama sekali** ke browser (bukan hanya tombolnya dikunci).

Keamanan tambahan: halaman `/admin` diberi `noindex`, login dibatasi percobaannya, 2FA untuk Super Admin.

---

## 8. Struktur Halaman (Sitemap)

### 8.1 Publik

```
/                         Beranda
/tentang                  Profil, sejarah, visi-misi, dasar hukum
/tentang/pengurus         Struktur pengurus per periode
/program                  7 bidang
/program/[bidang]         Detail bidang: pengurus + kegiatan bidang itu
/kabar                    Hub: kegiatan, berita, galeri
/kegiatan                 Agenda (akan datang) + arsip (selesai)
/kegiatan/[slug]          Detail + tombol Google Calendar & Share WA
/berita                   Daftar berita
/berita/[slug]            Detail berita
/galeri                   Daftar album
/galeri/[album]           Foto & video satu album
/arsip                    Arsip dokumen (sesuai akses)
/untuk-warga              Hub manfaat warga (Fase 5): kas, UMKM, aspirasi, template surat, inventaris
/kontak                   Kontak & peta
```

`/lpj` yang lama dialihkan (redirect) ke `/arsip`.

### 8.2 Navigasi

- **Desktop:** Tentang ▾ · Kabar ▾ · Arsip · Untuk Warga · Kontak + tombol **Gabung**
- **HP:** navigasi bawah tetap → **Beranda · Agenda · Gabung · Galeri · Lainnya**

### 8.3 Beranda (dari 9 section menjadi 5)

1. **Hero:** foto kegiatan asli, satu kalimat, tombol _Lihat Agenda_ & _Gabung_
2. **Kegiatan terdekat:** 3 kartu. Bila tidak ada agenda, otomatis menampilkan kegiatan terakhir (tidak pernah kosong)
3. **Angka dampak:** anggota aktif, kegiatan tahun ini, foto terdokumentasi (dihitung otomatis)
4. **Cerita terbaru:** 3 berita/album
5. **Ajakan:** Gabung Karang Taruna / Kirim usulan kegiatan / Hubungi kami

Yang **dihapus** dari beranda: jam digital, kalender bulan, Quick Information, preview Tentang yang panjang,
running banner (diganti **banner pengumuman** yang bisa ditutup & punya tanggal kedaluwarsa).

### 8.4 Admin

```
/admin/masuk              Login
/admin                    Dashboard: ringkasan, draft menunggu review, pemakaian penyimpanan
/admin/kegiatan           CRUD kegiatan
/admin/berita             Editor berita + alur review
/admin/galeri             Album + upload massal
/admin/arsip              Dokumen + level akses
/admin/pengurus           Struktur per periode
/admin/kas                (Fase 5)
/admin/warga              UMKM, aspirasi, template surat (Fase 5)
/admin/pengaturan         Kontak, sosmed, logo, hero, pengumuman
/admin/akun               Akun & role (Super Admin)
/admin/log                Audit log
```

---

## 9. Arah Desain UI/UX

### 9.1 Yang dipertahankan

- Warna **Benhur Blue + Gold**, font **Plus Jakarta Sans** (judul) + **Inter** (teks)
- Ornamen batik sangat halus
- Konsep arsip berjenjang

### 9.2 Yang diubah

| Masalah sekarang                                                      | Menjadi                                                                                                      |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 7 varian hero berbeda (Tentang rusak: teks putih di atas putih di HP) | **1 pola hero**: judul + strip foto kegiatan; hanya aksen yang berganti                                      |
| Gradien biru, glow blur, kartu ikon seragam (kesan template SaaS)     | Foto asli sebagai elemen utama; blok warna solid; bingkai foto ala **polaroid/scrapbook** untuk dokumentasi  |
| Navbar 8 menu, luber di layar 1024 px                                 | 5 menu berkelompok + navigasi bawah di HP                                                                    |
| Filter berupa kalimat panjang                                         | Chip nama bidang singkat + warna bidang, bisa digeser horizontal di HP                                       |
| Emoji pada badge akses (🌍👤👨‍💼👑)                                     | Ikon + label                                                                                                 |
| Placeholder "FOTO ASLI MENYUSUL"                                      | Selama pengembangan: foto dummy (Unsplash, ditandai `is_dummy`). Saat launching: bagian kosong disembunyikan |
| Kotak "KT" sebagai logo                                               | Logo resmi Karang Taruna                                                                                     |

### 9.3 Komponen kunci baru

- **Kartu agenda** dengan tanggal besar, lokasi, bidang, tombol _Ingatkan_ (Google Calendar) & _Share WA_
- **Kartu pengurus** dengan **avatar inisial** berwarna bidang; foto hanya bila `izin_foto = true`
- **Galeri masonry** + lightbox, mendukung foto, video, dan embed
- **Banner pengumuman** dengan tanggal mulai/berakhir
- **Empty state** yang ramah (hanya di admin; publik menyembunyikan bagian kosong)

### 9.4 Standar kualitas

- Kontras teks memenuhi WCAG AA; target sentuh minimal 44 px
- Menghormati _prefers-reduced-motion_
- Tanpa scroll horizontal dari 320 px sampai 1440 px
- Gambar pakai `srcset` + lazy load; LCP beranda < 2,5 detik di 4G
- Preview link WhatsApp (OG image) unik untuk setiap berita/kegiatan/album

---

## 10. Tahapan Pengerjaan

> Estimasi dalam hari kerja efektif, kasar, dan sangat bergantung pada kecepatan data & foto terkumpul.

### Fase 0 — Beres-beres & perbaikan cepat (±1–2 hari)

**Tujuan:** repo aman, data dasar benar, kerusakan tampilan yang jelas sudah hilang.

- [ ] Hapus `.env` dari repo, tambahkan ke `.gitignore`, buat `.env.example`
- [ ] Perbaiki error TypeScript di `src/routes/__root.tsx` (tipe `errorComponent`)
- [ ] Ganti `SITE.url` yang salah (`karangtaruna-rw03.lovable.app` tidak ada)
- [ ] Satukan model role menjadi satu (lihat §7) di `constants/site.ts` & `domains/dokumen`
- [ ] Ganti nama & urutan 7 bidang sesuai SK di `domains/program/data.ts`
- [ ] Ganti struktur pengurus menjadi 61 orang sesuai SK (sementara masih di file data)
- [ ] Tanggal SK 05 Juni 2025; tanggal pelantikan ditandai "menunggu konfirmasi"
- [ ] Perbaiki hero varian `split` (halaman Tentang) & navbar luber di 1024 px
- [ ] Hapus agenda "hari ini" palsu dan angka "12 Dokumen LPJ" yang tidak sesuai data
- [ ] Terjemahkan halaman 404 & error ke Bahasa Indonesia
- [ ] Atur `.gitattributes` (line ending LF) supaya lint tidak error di Windows
- [ ] Cantumkan `engines.node >= 22.12` di `package.json`

**Selesai bila:** `tsc` & `lint` bersih, halaman Tentang terbaca di HP, nama pengurus sesuai SK.

### Fase 1 — Fondasi backend (±5–7 hari)

**Prasyarat:** akun Supabase & Cloudflare sudah dibuat dengan email organisasi.

- [ ] Migrasi SQL semua tabel di §6 (di folder `supabase/migrations`, bukan diklik manual)
- [ ] Kebijakan RLS per tabel sesuai §7 + tes otomatis kebijakan akses
- [ ] Trigger `audit_log` untuk semua tabel konten
- [ ] Seed data: periode, 7 bidang, 61 pengurus, pengaturan awal
- [ ] Seed konten dummy (`is_dummy = true`): ±8 kegiatan, ±6 berita, ±4 album berisi foto Unsplash
- [ ] Login pengurus (email + password), halaman `/admin/masuk`, proteksi rute admin di server
- [ ] Upload ke Supabase Storage (bucket publik & privat) + kompresi foto di browser + batas video 50 MB
- [ ] Link sementara untuk dokumen non-publik
- [ ] Cron anti-pause (tiap 2 hari) & backup mingguan
- [ ] Ganti semua pembacaan `src/domains/*/data.ts` menjadi query database (via TanStack Query + loader SSR)

**Selesai bila:** isi web publik berasal dari database; `/admin` tidak bisa dibuka tanpa login;
dokumen non-publik tidak terlihat oleh pengunjung.

### Fase 2 — Desain ulang tampilan publik (±7–10 hari)

- [ ] Komponen hero tunggal + terapkan ke semua halaman
- [ ] Navigasi baru (desktop berkelompok + navigasi bawah HP)
- [ ] Beranda 5 section (§8.3) dengan data asli dari database
- [ ] Halaman detail: kegiatan, berita, album, bidang
- [ ] Halaman pengurus baru (avatar inisial, filter per bidang)
- [ ] Galeri masonry + lightbox + dukungan video & embed
- [ ] Aturan "sembunyikan bagian kosong" di semua halaman publik
- [ ] Tombol Google Calendar & Share WA; OG image per konten
- [ ] Filter kegiatan/berita/arsip dirapikan (satu komponen bersama)
- [ ] Redirect `/lpj` → `/arsip`
- [ ] Uji visual di 360, 390, 768, 1024, 1440 px + mode kurangi animasi

**Selesai bila:** semua halaman lolos uji visual di atas tanpa scroll horizontal, beranda ≤ 6 layar di HP.

### Fase 3 — Admin yang benar-benar dipakai (±5–7 hari)

- [ ] Dashboard: ringkasan, draft menunggu review, pemakaian penyimpanan
- [ ] Form kegiatan (termasuk kegiatan rutin, mis. futsal tiap Jumat)
- [ ] Editor berita dengan gambar + alur draft → terbit (review BPH opsional)
- [ ] Upload album massal (banyak foto sekaligus, progress bar, lanjut bila koneksi putus)
- [ ] Arsip dokumen dengan level akses
- [ ] Kelola pengurus per periode
- [ ] Halaman pengaturan (kontak, sosmed, logo, hero, pengumuman)
- [ ] Kelola akun & role (Super Admin)
- [ ] Tampilan audit log
- [ ] **Panduan pengurus** (`docs/PANDUAN-PENGURUS.md` + versi bergambar): posting berita, upload foto, upload LPJ

**Selesai bila:** seorang anggota Bid. Media yang belum pernah melihat admin bisa memposting berita
berfoto hanya dengan membaca panduan.

### Fase 4 — Launching (±3–5 hari)

- [ ] Domain sendiri + HTTPS
- [ ] SEO: meta per halaman, canonical absolut, `sitemap.xml`, `robots.txt`, JSON-LD (Organization, Event, NewsArticle)
- [ ] Cloudflare Web Analytics
- [ ] Hapus semua data `is_dummy`, isi data asli (§11)
- [ ] **Uji coba 1 minggu** oleh pengurus, kumpulkan masukan, perbaiki
- [ ] Buat akun untuk pengurus yang akan mengelola web
- [ ] Serah terima: akun Super Admin, dokumen panduan, dokumen ini

**Selesai bila:** web tayang di domain resmi, dikelola pengurus tanpa bantuan developer selama 2 minggu.

### Fase 5 — Manfaat untuk warga & fitur lanjutan (setelah launching, bertahap)

Urutan berdasarkan dampak dibanding usaha:

| #   | Fitur                               | Bidang                                | Keterangan                                  |
| --- | ----------------------------------- | ------------------------------------- | ------------------------------------------- |
| 1   | Agenda interaktif: RSVP "Saya ikut" | Semua                                 | Tanpa login, cukup nama                     |
| 2   | Transparansi kas Karang Taruna      | Bendahara                             | Ringkasan per kegiatan + grafik sederhana   |
| 3   | Pendaftaran anggota/relawan online  | OKK                                   | Formulir → disetujui OKK                    |
| 4   | Kotak aspirasi & usulan kegiatan    | Lingkungan Kemasyarakatan             | Warga bisa pantau status                    |
| 5   | Etalase UMKM & jasa warga           | Ekonomi Mandiri                       | Didaftarkan lewat formulir, disetujui admin |
| 6   | Template/format surat untuk diunduh | Sekretaris                            | File saja, isi disetujui RT/RW              |
| 7   | Info peminjaman inventaris          | Inventaris & Arsip                    | Katalog + tombol WA                         |
| 8   | Absensi kegiatan via QR             | OKK                                   | Rekap keaktifan otomatis                    |
| 9   | Liga / lomba 17an                   | Pendidikan, Keolahragaan & Kebudayaan | Jadwal, klasemen, hasil                     |
| 10  | Generator LPJ otomatis              | Sekretaris, Bendahara                 | Data kegiatan + foto + kas → PDF            |
| 11  | PWA (bisa dipasang di HP)           | Media                                 | Opsional                                    |

---

## 11. Checklist Data dari Pengurus

| Data                                                 | Penanggung jawab   | Dibutuhkan di | Status                    |
| ---------------------------------------------------- | ------------------ | ------------- | ------------------------- |
| Email organisasi                                     | Hanif              | Fase 1        | ⏳ dijanjikan 30 Sep 2026 |
| Akun Supabase & Cloudflare (dengan email organisasi) | Hanif              | Fase 1        | ⏳                        |
| Tanggal pelantikan resmi (5 atau 9 Juni 2025?)       | Ketua              | Fase 0        | ⏳                        |
| Nomor WhatsApp sekretariat                           | Sekretaris         | Fase 3        | ☐                         |
| Akun Instagram / TikTok / YouTube resmi              | Bid. Media         | Fase 3        | ☐                         |
| Logo resmi (PNG/SVG resolusi tinggi)                 | Bid. Media         | Fase 2        | ☐                         |
| Alamat & titik Google Maps sekretariat               | Sekretaris         | Fase 3        | ☐                         |
| Visi, misi, sejarah singkat (verifikasi)             | BPH                | Fase 2        | ☐                         |
| Deskripsi & program tiap bidang                      | Kabid              | Fase 2        | ☐                         |
| ±20–30 foto kegiatan terbaik                         | Bid. Media         | Fase 2        | ☐                         |
| Daftar kegiatan & tanggal                            | Semua bidang       | Fase 4        | ☐                         |
| Izin foto/IG tiap pengurus (terutama di bawah umur)  | OKK                | Fase 4        | ☐                         |
| File PDF: SK, LPJ, proposal                          | Inventaris & Arsip | Fase 4        | ☐                         |
| Siapa saja yang dapat akun admin + role-nya          | BPH                | Fase 4        | ☐                         |
| Nama domain pilihan                                  | BPH                | Fase 4        | ☐                         |

---

## 12. Biaya

| Item                                                      | Biaya                                                              |
| --------------------------------------------------------- | ------------------------------------------------------------------ |
| Supabase Free (+ ping anti-pause)                         | Rp0                                                                |
| Cloudflare hosting + Cron                                 | Rp0                                                                |
| Supabase Storage ≤ 1 GB                                   | Rp0                                                                |
| Pindah ke Cloudflare R2 (butuh kartu debit/virtual Katar) | Gratis s.d. 10 GB, lalu ±US$0,015 / GB / bulan                     |
| Domain                                                    | Biaya tahunan, bervariasi menurut ekstensi (.id / .or.id / .my.id) |

Upgrade opsional bila kelak dibutuhkan: Supabase Pro (±US$25/bulan, tanpa pause, 100 GB storage).

---

## 13. Risiko & Mitigasi

| Risiko                                       | Dampak                     | Mitigasi                                                                                                   |
| -------------------------------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Supabase di-pause karena sepi                | Web tidak bisa memuat data | Cron ping tiap 2 hari + notifikasi email bila ping gagal                                                   |
| Penyimpanan penuh                            | Upload gagal               | Kompresi otomatis, batas ukuran video, indikator pemakaian di dashboard                                    |
| Pengurus tidak rutin posting                 | Web terlihat mati          | Beranda tidak pernah kosong (fallback kegiatan terakhir), panduan singkat, pengingat bulanan               |
| Akun dipegang satu orang lalu orangnya pergi | Web terkunci               | Minimal 2 Super Admin, akun layanan memakai email organisasi                                               |
| Data pribadi anggota bocor                   | Masalah hukum (UU PDP)     | Foto/IG hanya dengan izin, RLS di database, tidak menyimpan NIK                                            |
| Perubahan dari Lovable menimpa kode          | Kerja hilang               | Setelah Fase 0, pengembangan dilakukan di repo (bukan editor Lovable); setiap sesi tercatat di `DEVLOG.md` |
| Kebijakan free tier berubah                  | Biaya tak terduga          | Backup mingguan memudahkan pindah layanan                                                                  |

---

## 14. Perawatan Setelah Launching

**Otomatis (tanpa manusia):** ping database, backup mingguan, laporan penyimpanan, sertifikat HTTPS.

**Tetap butuh manusia:**

- Perpanjang domain **setahun sekali**
- Pengurus memposting kegiatan & berita
- Pergantian periode 2028: buat periode baru di admin, serah terima akun Super Admin
- Cek dashboard sebulan sekali (pemakaian penyimpanan, status ping)

---

## 15. Pertanyaan Terbuka

| #   | Pertanyaan                                                                                       | Untuk                  |
| --- | ------------------------------------------------------------------------------------------------ | ---------------------- |
| Q1  | Tanggal pelantikan: 05 Juni (tanggal SK) atau 09 Juni 2025?                                      | Ketua                  |
| Q2  | ~~Siapa Super Admin?~~ → programmer (Hanif). Pertimbangkan 1 programmer cadangan                 | Ketua                  |
| Q3  | Apakah pengurus RW setuju ada tombol kontak RT/RW & template surat di web ini?                   | Ketua → Ketua RW       |
| Q4  | Apakah kas yang ditampilkan publik cukup ringkasan per kegiatan, atau rinci per transaksi?       | Bendahara              |
| Q5  | Apakah pengembangan setelah ini masih memakai editor Lovable, atau sepenuhnya di repo?           | Hanif                  |
| Q6  | Catatan: SK menyebut musyawarah "hari Minggu, 5 Juni 2025", padahal tanggal itu jatuh hari Kamis | Sekretaris (info saja) |

---

## 16. Lampiran: Temuan Audit

Audit 29 Sep 2026: membaca kode, `tsc`, `eslint`, `vite build`, dan menjalankan web di 375 px & 1024 px.

**Teknis**

- Build lolos. 1 error TypeScript (`__root.tsx:115`). Lint bersih selain masalah line ending CRLF di Windows.
- Supabase terpasang tetapi tidak ada tabel dan tidak dipakai halaman mana pun. `AuthProvider` masih kosong.
- `/admin` terbuka tanpa login. `.env` ikut ter-commit.
- `SITE.url` menunjuk alamat Lovable yang tidak ada.

**Data**

- Struktur 27 slot "Belum diisi" vs 61 pengurus di SK; nama bidang tidak sesuai SK.
- Beranda: "59 anggota" vs dashboard "27"; "12 Dokumen LPJ" padahal data 5 (semua placeholder).
- "Agenda Hari Ini" menampilkan agenda yang sama setiap hari.
- Kalender libur hanya 2026; Wafat Isa Al Masih tertulis 20 Maret (seharusnya 3 April 2026).
- Nomor WA `+62 812-0000-0000` (palsu) dipakai di tombol "Jadi Bagian Katar".

**UI/UX**

- 0 gambar di seluruh web; semua slot foto berupa placeholder.
- Beranda ±14 layar di HP, 9 section.
- Hero varian `split` (Tentang): di HP lapisan putih menutup lapisan biru → teks putih tidak terlihat;
  di desktop teks gelap berada di atas latar biru.
- Navbar luber di 1024 px → scroll horizontal.
- Filter kegiatan berupa kalimat panjang.
- Halaman 404 & error berbahasa Inggris.

**Yang sudah baik**

- Struktur folder per domain, SSR, meta per halaman sudah dimulai.
- Konsep arsip berjenjang, timeline organisasi, 7 bidang.
- Aturan `DEVLOG.md` append-only.
- Komitmen "tanpa foto AI & tanpa nama fiktif".
