# Hari 20 — Arsip dokumen, pengurus dan crop foto

19 Oktober 2026 · branch `revisi` · baseline `d168421`.

**Implementasi Hari 20 selesai dan online**, kode `7c1e386` pada `revisi`. Pemeriksaan produksi
dan pembersihan akhir selesai; rincian di bawah. Hari 21 belum dimulai.

## Perubahan yang dapat dipakai

| Bagian          | Perilaku sekarang                                                                                                                                                                             |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dokumen admin   | Unggah PDF maksimal 20 MiB, judul, kategori, tahun, tanggal, bidang, akses publik/pengurus/BPH, draf/review/terbit, pratinjau, sunting dan hapus draf                                         |
| Ruang kelola    | BPH/Super Admin lintas bidang, Kabid sesuai bidang, kontributor mengelola draf sendiri. Pembaca tidak memperoleh daftar kelola                                                                |
| Berkas PDF      | Semua unggahan baru berada di bucket privat `dokumen-internal`, termasuk yang akan diterbitkan untuk umum                                                                                     |
| PDF publik      | `/berkas/dokumen/<id>` memeriksa status terbit dan akses publik pada setiap permintaan; GET/HEAD, PDF inline, `no-store`, POST 405                                                            |
| PDF internal    | Tautan bertanda tangan dibuat saat diminta setelah pemeriksaan akun/RLS; berlaku 600 detik                                                                                                    |
| Pengurus        | Tombol **Kelola pengurus** pada daftar anggota untuk BPH/Super Admin: tambah, sunting per periode, kelompok, jabatan, bidang, RT, urutan dan status aktif                                     |
| Akun terkait    | Perubahan jabatan/kelompok/bidang/periode menyinkronkan peran. Nonaktif atau pindah ke periode tidak berjalan menonaktifkan akun; mengaktifkan data pengurus tidak otomatis membuka akun lagi |
| Foto            | Crop 3:4, zoom/geser dengan keyboard, pratinjau potret dan avatar 1:1, hasil maksimal 900 × 1200, persetujuan untuk foto baru, lalu Simpan/Batal                                              |
| Pencabutan foto | Berkas lama dihapus melalui Storage API sebelum referensi/izin dilepas; berlaku juga foto yang dipasang BPH dan dicabut pemiliknya                                                            |
| Checklist tim   | `CHECKLIST-FOTO-LAUNCH.md` memakai bahasa umum: foto yang dicari, jumlah pilihan, izin, cerita singkat, folder dan cara menyerahkan kepada Hanif                                              |

Menambah pengurus tidak membuat akun login otomatis. Kelola akun/undangan tetap Hari 21.
Tidak mengisi dokumen atau foto asli dan tidak menghapus dummy konten untuk launching.

## Aturan database dan penyimpanan

Dua migrasi baru diterapkan melalui CLI langsung setelah dry-run:

- `20261019140000_arsip_pengurus.sql`: kolom aktif, RPC versi/CAS, sinkronisasi peran/akun,
  proteksi Super Admin, antrean pembersihan arsip dan RLS berkas privat.
- `20261019150000_tutup_jalur_arsip_lama.sql`: menolak penautan baru ke jalur PDF lama melalui
  RPC/tabel langsung; pengurus nonaktif tidak boleh mempertahankan izin foto.

Total **16 migrasi lokal/remote cocok**. Migrasi yang telah diterapkan tidak diedit.
File tipe Supabase dan route tree ikut diperbarui; dependensi dan `bun.lock` tetap.

Namespace PDF baru `arsip/<akun>/<uuid>.pdf`: unggah milik sendiri, tidak dapat ditimpa di tempat,
dan tidak dapat dihapus langsung saat masih terdaftar. Pemeriksaan referensi bersifat global,
sehingga uploader yang kehilangan hak BPH tidak dapat membaca/menghapus PDF yang tersembunyi
dari RLS metadata. Layanan memeriksa ukuran dan awalan `%PDF-`; ini bukan pemindaian malware.

Penggantian/penghapusan arsip mencatat berkas lama pada `arsip_sampah`. Gagal menghapus tidak
membatalkan metadata yang sudah tersimpan; UI memberi peringatan dan tombol **Bersihkan berkas
lama** dapat dicoba lagi. Berkas yang masih dirujuk tidak dibersihkan.

Jalur lama dipertahankan untuk dokumen yang sudah ada. Mengubah PDF publik lama menjadi internal
wajib mengunggah ulang ke penyimpanan privat dan menghapus salinan publik lama. Guard database
menolak perubahan selama objek publik lama masih ada.

## Bukti pengujian

| Pemeriksaan                            | Hasil                                                                                                          |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Unit/regresi sumber                    | 94/94, termasuk perhitungan crop dan pengurus nonaktif tidak masuk halaman publik/detail bidang                |
| CRUD/RLS database                      | 156/156, termasuk 29 kasus baru arsip/pengurus                                                                 |
| Integrasi kegiatan                     | 20/20                                                                                                          |
| Integrasi berita/foto profil           | 26/26                                                                                                          |
| Integrasi baru layanan + Storage nyata | 17/17; termasuk PDF palsu, ukuran salah, legacy publik→privat, CAS, batas peran, Super Admin dan retry cleanup |
| TypeScript                             | `tsc --noEmit` bersih                                                                                          |
| ESLint                                 | 0 error, 7 warning fast-refresh lama                                                                           |
| Build                                  | exit 0; runtime Wrangler 4.151.1 menjalankan hasil build sebenarnya                                            |
| RPC/gateway build lokal                | 20/20, baseline positif sebelum uji penolakan; error TanStack dibaca dari envelope, bukan hanya HTTP           |

Total suite **313 tes otomatis**; pemeriksaan RPC/HTTP/browser dicatat terpisah.

Browser lokal memakai akun sementara, PDF satu halaman dan gambar sintetis. BPH benar-benar
mengunggah PDF, menyimpan draf, mengajukan review, menerbitkan, membuka PDF dan mengubah akses
menjadi BPH. Kelola pengurus dipakai menambah data pada periode uji, memasang crop dengan izin,
lalu menonaktifkan dan menghapus foto fisiknya. Anggota memakai crop pada profil sendiri;
simpan tanpa izin ditolak, simpan dengan izin berhasil, pencabutan menghapus foto lama (URL 400).
Guard navigasi menahan isian PDF/foto; lanjut menyunting mempertahankan isian dan tinggalkan
perubahan membuangnya. Cancel crop tidak mengunggah berkas.

Form PDF, editor pengurus, profil dan modal crop diperiksa pada **360/768/1024/1440/1920 px**.
`scrollWidth === clientWidth`; ketika scrollbar vertikal hadir, clientWidth 15 px lebih kecil
dari innerWidth. Tidak ada overflow horizontal. Foto tersimpan decode **900 × 1200**.
Axe WCAG 2 A/AA dan 2.1 AA: modal crop 24, profil 29, daftar dokumen 23, form dokumen 23 passes,
semuanya **0 pelanggaran**. Konsol alur lokal **0 error/0 warning**.

## Batas yang perlu dipahami

- PDF internal yang sudah memperoleh signed URL masih dapat dibuka sampai 600 detik. Mengubah
  hak/status menolak penerbitan URL baru; tidak menjanjikan pencabutan instan URL yang sudah terbit.
- Foto/PDF yang sudah diunduh orang atau tersalin pada cache di luar aplikasi tidak dapat ditarik
  kembali. Gateway PDF baru memeriksa izin dan memakai no-store; perilaku ini berbeda dari URL
  berkas publik lama.
- Storage API dan perubahan database bukan satu transaksi. Jika penghapusan foto/PDF publik lama
  berhasil tetapi penyimpanan metadata kemudian gagal/versi berubah, file lama sudah hilang.
  Layanan memberitahu keadaan itu dan meminta muat ulang/unggah ulang; tidak mengklaim rollback file.
- Persetujuan foto/naskah/jabatan asli harus diberikan pengurus berwenang. QA tidak menggantikan izin.
- HP fisik 30 foto Hari 19, grafik Class B terisolasi, Q06–Q08, preview WhatsApp, restore drill dan
  persetujuan Checkpoint 3 tetap terbuka. Ini belum pernyataan siap launching.

## Penutupan produksi

Kode `7c1e386` berhasil dibangun dan aktif sebagai versi Worker `97d2f5ea`, 19 Oktober 2026.
Deploy tetap dari `revisi`, Pages `ukkt03cipedak` meneruskan ke Worker `katar-rw03`.

- **40/40 RPC/gateway produksi**: masing-masing 20 Pages dan Worker. BPH dapat menyimpan dan
  menerbitkan PDF sintetis, GET/HEAD PDF publik 200, perubahan ke BPH membuat URL sama 404;
  GET/POST anonim, akun nonaktif, lintas peran, metadata asing dan versi lama ditolak.
- **30/30 HTTP/aset/header/redirect** di kedua origin, diulang sesudah cleanup. Halaman valid 200,
  `/lpj?bidang=media` 301 ke arsip, slug/gateway hilang 404. Gateway Pages dan no-store sesuai.
  Aset route **kelola pengurus baru** diperoleh dari referensi bootstrap produksi dan memuat
  isian baru, bukan hanya memeriksa aset lama.
- Browser produksi: daftar pengurus, modal crop, daftar dokumen dan form PDF pada lima lebar
  360/768/1024/1440/1920 tanpa overflow. Axe daftar pengurus22/form pengurus22/crop24/form PDF23
  passes, 0pelanggaran. Konsol produksi 0error/0warning. Menu HP membuka Dokumen dengan benar.
- Super Admin memasang crop foto sintetis melalui UI produksi; pemilik dapat mencabutnya memakai
  JWT/RLS melalui layanan sumber nyata. Metadata foto null/izin false, folder/objek Storage nol.
  **URL publik yang sempat hangat masih 200 pada cek pertama setelah delete**, walau download
  Storage sudah ditolak. Pada pemeriksaan berikutnya URL persis yang sama dan permintaan dengan
  nonce menjadi **400/BYPASS**. Ini batas cache yang nyata; jangan menuliskan pencabutan global
  instan. Pilihan A Hanif (hapus file, Storage tetap) dipertahankan.

Dokumentasi [Storage CDN](https://supabase.com/docs/guides/storage/cdn/fundamentals) menjelaskan
salinan edge. [Smart CDN](https://supabase.com/docs/guides/storage/cdn/smart-cdn) mempunyai
invalidasi tersendiri dan hanya otomatis pada Pro ke atas; jangan mengasumsikan batas propagasi
Smart CDN untuk akun Free. Masa token signed URL 600detik juga berbeda dari umur salinan cache.

Semua fixture sesi dibersihkan: tujuh akun Auth/profil, dua pengurus dan satu periode sintetis,
PDF, foto dan audit terkait; pembacaan ulang sisa nol. Baseline akhir Auth/profiles62, pengurus61, kegiatan8, berita6,
album0, media0, bidang7, dokumen0, arsip_sampah0. Tidak mengubah susunan/data asli untuk QA.
Halaman produksi sesudah reload menunjukkan 61pengurus, dokumen0 dan cleanup0.

Kredensial fixture dan `.output/server/.dev.vars` dihapus; localStorage QA127.0.0.1 nol,
sesi produksi Hanif tetap login. Dev Vite, Wrangler dan workerd dihentikan; port5173/8788 tidak
mendengarkan. Tab QA lokal ditutup dan viewport dipulihkan. DEVLOG baseline `d168421` utuh,
tepat satu section sesi ini dengan hasil akhir ditambahkan; `main` tidak disentuh.

Kesalahan alat QA tidak dihitung sebagai kegagalan aplikasi: skrip awal hanya mencari `src`
untuk bootstrap padahal HTML memakai `href`/module import; nama hash aset build Windows juga
berbeda dari build Cloudflare. Pemeriksaan diperbaiki untuk mengikuti referensi aset produksi.
Probe axe pertama sempat salah sintaks dan perlu injeksi ulang setelah navigasi; audit yang
lulus di atas berasal dari eksekusi yang benar.

Bukti privat disimpan di lampiran lokal `katar-hari20-20261019`, di luar repo publik; tidak
memasukkan key, JWT, signed URL, kredensial fixture atau foto orang ke Git. Berikutnya sesuai
jadwal: pengaturan web, kelola akun khusus Super Admin dan audit log Hari21; belum dimulai.
