# Hari 25 — Persiapan uji pengurus dan hasil simulasi teknis

20 Oktober 2026. **Persiapan dan simulasi teknis Hari25 selesai. Uji mandiri pengurus belum
berlangsung; masa pengamatan beberapa hari dan persetujuan checkpoint belum dapat diluluskan.**
Hanif meminta lanjut sambil ishoma; agen menuntaskan pekerjaan yang tidak membutuhkan peserta
manusia, mengikuti jadwal Hari25–29. Tidak ada fitur baru, migrasi, perubahan role/akun asli,
publikasi konten latihan, undangan ke peserta, atau merge main.

## Yang disiapkan

- [Panduan uji coba pengurus](UJI-COBA-PENGURUS.md): tugas per peran, latihan tanpa publikasi,
  target konten asli, format kendala dan catatan harian privat, serta syarat penerimaan.
- [Rencana Hari25](HARI-25-RENCANA.md) dan tautan dari panduan bergambar/README/jadwal.
- Simulasi pada **build Worker lokal**, memakai akun sementara dan database yang sama dengan
  produksi. Kode aplikasi tetap berasal dari Hari24; hasil ini tidak disebut pengujian peserta.

## Bukti yang dijalankan sesi ini

| Lapisan           | Hasil dan batas                                                                                                                                                                                                                                                                                                              |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Statis            | tsc/build exit0; ESLint 0 error, 7 warning bawaan; tanpa perubahan dependensi/lockfile                                                                                                                                                                                                                                       |
| Regresi sumber    | **127/127** tes unit/regresi; bukan klaim seluruh 373 tes Hari24 diulang                                                                                                                                                                                                                                                     |
| Layanan dan RLS   | **13/13** pemeriksaan nyata: pengajuan review, anonim tidak membaca, RPC anonim/anggota menerbitkan/lintas bidang/pembaca ditolak, akun nonaktif ditolak, Kabid lain tidak membaca/mengubah, Kabid sendiri/BPH/Super Admin mendapat pengajuan, semua percobaan gagal tidak mengubah baris                                    |
| Browser/interaksi | **11 skenario**: Bantuan, validasi kosong/fokus, pratinjau dua paragraf, simpan draf, temukan/sunting/review, Kabid mengembalikan dengan modal Batal diuji, kegiatan tanpa jadwal ditolak saat diajukan tetapi boleh Draf, album kosong Draf, pembaca tanpa tombol tulis, anggota masuk ulang melihat Draf yang dikembalikan |
| Layout            | **25 pemeriksaan**: 4 halaman Bantuan/berita/kegiatan/album pada lima lebar sebagai Kabid (20), 4 halaman sebagai pembaca pada360px, 1 Bantuan BPH pada1440px. Lebar acuan360/768/1024/1440/1920, tanpa overflow; bukan25kombinasi5peran×5lebar                                                                              |
| Konsol            | 0 error/warning pada akhir simulasi build lokal                                                                                                                                                                                                                                                                              |
| HTTP              | **38/38**: daftar/slug latihan/sitemap/beranda pada lokal, Pages dan Worker; route tambahan kedua origin. Tiga draf latihan 404 untuk anonim; semua daftar tetap memuat konten asli, sitemap22URL tanpa draf/latihan                                                                                                         |
| Pembersihan       | 7Auth/profil +1berita +1kegiatan +1album serta audit latihan dibersihkan; tidak ada unggahan/objek Storage/B2 baru                                                                                                                                                                                                           |
| Data asli         | Snapshot delapan tabel sebelum/sesudah identik:62profil,61pengurus,12pengaturan,4kegiatan,2berita,4album,13media,0dokumen. Daftar ID Auth kembali identik62; tidak menimpa data asli untuk mendapatkan hasil ini                                                                                                             |

Akun latihan hanya masuk pada localhost. Sesi asli Hanif tidak dipakai/dikeluarkan. Kredensial
fixture dan runtime `.dev.vars` dihapus; viewport dipulihkan/tabQA ditutup. Proses lokal sudah
berakhir saat penutupan; port5173/8090/8788 dan proses workerd/wrangler diperiksa kosong.
Receipt/snapshot/screenshot/log rinci berada di folder privat saudara repo
`_qa-hari25/2026-10-20/`, tidak di Git publik. File hasil berisi data tim tidak dibagikan otomatis.

## Temuan dan keterbatasan

Tidak ada bug aplikasi baru yang terbukti pada ruang uji ini; perubahan sesi ini berupa panduan
dan catatan pengujian. Dua langkah otomasi awal perlu
perbaikan: tombol Keluar di HP berada di drawer; navigasi ke login terlalu cepat dapat memotong
proses logout. Setelah memakai menu yang benar dan menunggu form login tampil, perpindahan
akun berhasil. Itu dicatat sebagai kesalahan urutan otomasi, bukan bug produk yang dibuktikan.
Codebase Memory MCP sempat gagal tersambung (`Transport closed`); pemeriksaan memakai sumber
langsung/rg dan eksekusi nyata. Tidak mengklaim hasil graph atau mengubah konfigurasi global.

Hari19 batchunggah, crop/PDF, seluruh suiteDB dan Lighthouse tidak diulang karena aplikasi,
aturan akses dan penyimpanannya tidak diubah pada sesi ini. Bukti lama tetap di review masing-masing.
HP fisik, Q06/Q07, grafik ClassB, previewWhatsApp, backupStorage/restore dan Checkpoint3/4 masih
terbuka. Tidak ada hasil uji kemandirian manusia atau tiga hari tanpa kendala kritis yang direka.

## Pelaksanaan pengurus berikutnya

Hanif memilih satu anggota Media baru dan pemeriksa, lalu menentukan tanggal mulai nyata.
Gunakan panduan uji dan catatan tim privat. Target dua berita/satu album oleh Media dan satu
kegiatan per Kabid memakai bahan sah. Konten yang dimasukkan agen Hari24 bukan pengganti tugas
peserta. Kendala yang ditemukan dicoba ulang setelah diperbaiki; masa uji lanjut sampai syarat
penerimaan terpenuhi. Satu sesi agen tidak menggantikan uji coba beberapa hari Hari25–29.

## Pengiriman

Paket dokumentasi `48f2139` didorong ke revisi. **Cloudflare check completed/success pada
20 Oktober 2026 13:28:17 WIB**. Cek sesudah push **31/31 HTTP/dokumen GitHub** lolos:
sebelas route pada kedua origin, tiga slug latihan404 per origin, dan tiga dokumen baru terbaca
di GitHub. Bundle publik93berkas terhadap4nilai privat:0temuan. Commit penutup hanya mencatat
bukti ini; kode aplikasi tetap. Main tidak diubah. Paket siap ditinjau/dibagikan Hanif, tanpa
mengirim pesan atas namanya atau otomatis memulai sesi peserta.

## Koreksi beranda setelah review Hanif

20 Oktober 2026. Hanif menandai ruang kosong setelah tiga statistik. Penyebab direproduksi:
komponen menyembunyikan Kegiatan Tercatat ketika jumlah kegiatan terbit nol, tetapi grid desktop
masih empat kolom (pada1235px:3item dalam4kolom272,6px). Di HP tiga item juga meninggalkan satu
sel kosong pada grid2kolom. `StatsStrip.tsx` kini memilih jumlah kolom sesuai item yang tampil:
1/2/3item memakai1/2/3kolom;4item tetap2kolomHP dan4kolom mulai640px. Isi dipusatkan dan padding
HP disesuaikan; label grup Statistik organisasi membantu pembaca layar. Angka/filter nol tetap.

Tsc/build exit0, ESLint0error7warning. Browser Worker lokal pada360/375/768/1235/1440px:
5/5lolos,3item sejajar dan mengisi lebar dengan kolom sama, tanpa overflow; konsol0error/warning.
Tautan Selengkapnya menuju Tentang selesai dimuat. Tidak mengubah database/konten/akun/migrasi,
sehingga suiteDB tidak diulang. Deploy dan hasil produksi ditambahkan di DEVLOG setelah push.
