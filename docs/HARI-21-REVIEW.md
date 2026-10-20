# Hari 21 — Pengaturan website, akun, dan log aktivitas

Tanggal: 20 Oktober 2026. Branch: `revisi`. Implementasi dan QA lokal selesai; deployment dan pemeriksaan produksi dicatat pada bagian penutupan di bawah.

## Hasil

- Pengaturan BPH/Super Admin benar-benar tersimpan: nama/wilayah/jumlah RT, kalimat pembuka, WhatsApp, email, alamat/peta, tiga kanal sosial, pengumuman dan tanggal terakhir tampil WIB, logo, serta empat foto beranda. Form memerlukan konfirmasi publikasi dan menjaga isian yang belum disimpan.
- Nama dan kalimat pembuka digunakan di beranda/header/footer. Kontak tetap melalui loader publik dan satu pembentuk tautan WA. Logo kosong kembali ke logo resmi; slot foto kosong mempertahankan tempat dokumentasi desain E.
- Simpan 12 key dilakukan dalam satu transaksi RPC dengan pemeriksaan versi seluruh key. Dua admin tidak diam-diam menimpa perubahan. Perubahan identik tidak membuat audit/versi baru. Penulisan langsung lewat tabel ditolak; RPC memeriksa ulang BPH aktif, nilai, key, URL, dan referensi aset.
- Gambar melalui `src/services/storage.ts`: JPG/PNG/WebP maksimal 10 MB, kompres WebP maksimal 1920 piksel/2 MiB, namespace sendiri, tanpa overwrite. Logo persegi minimal 512×512; foto minimal 800×600, saran 1600×1200/rasio 4:3. Izin publikasi harus dicentang. Foto warga asli belum diinput.
- Reservasi aset masuk antrean persisten sebelum upload. Simpan mengeluarkan aset aktif dari antrean dan memasukkan aset yang dilepas untuk cleanup. Berkas tidak terpakai setelah pembatalan dapat dibuang; reservasi yang ditinggal dilindungi satu jam sebelum tombol pembersihan mengambilnya. Tidak ada janji job pembersihan otomatis berjalan setiap jam. Storage/DB bukan satu transaksi; cleanup dapat dicoba ulang.
- Log contoh diganti database asli: pelaku, waktu WIB, modul, aksi, ringkasan, filter modul/aksi/pelaku/tanggal, pencarian nama pelaku, pagination 25 baris. Server tidak mengirim JSON sebelum/sesudah atau nilai kontak/password ke browser.
- Halaman Akun dipoles: target sentuh minimal 44 piksel, kontras akun nonaktif diperbaiki, tautan kelola jabatan tersedia. Kelola akun yang sudah berfungsi dipertahankan: khusus Super Admin; username/reset/aktif-nonaktif. Peran tetap mengikuti jabatan pengurus. Tidak menambah undangan email/SMTP; ini di luar scope yang disepakati.

## Migrasi dan temuan QA

Empat migrasi baru sudah dry-run lalu diterapkan; total 20 migrasi lokal/remote:

1. `20261020010000_pengaturan_situs.sql`: RPC, pengaturan tampilan, namespace Storage dan antrean aset.
2. `20261020011000_perbaiki_konflik_dan_upload_situs.sql`: metadata Storage belum tersedia saat INSERT; pemeriksaan MIME/ukuran final tetap saat pemasangan aset. Konflik memakai SQLSTATE aplikasi `P0021`.
3. `20261020012000_antrean_aset_situs.sql`: aset aktif keluar antrean; aset dilepas siap dibersihkan.
4. `20261020013000_kode_konflik_admin.sql`: lima RPC CAS lama berita/album/media/dokumen/pengurus memakai kode konflik aplikasi yang sama. Handler tetap mengenali `40001` untuk kompatibilitas. Pemeriksaan negatif tidak lagi menganggap respons jaringan status 0 sebagai bukti izin ditolak.

Permintaan konflik dengan kode serialization `40001` diamati lambat/berakhir dibatalkan klien; penyebab retry internal penyedia tidak dianggap telah diaudit. Pengganti `P0021` dibuktikan lewat respons runtime dengan batas 20 detik dan integrasi DB dengan batas 15 detik. Validasi/izin/signature RPC lama tidak diubah.

Modal konfirmasi bawaan sempat menghambat tab QA. Diganti modal aplikasi yang dapat diakses keyboard; Hanif menutup tab lama. Interaksi normal kemudian diteruskan, termasuk upload/batal. Tidak mengklaim kegagalan alat browser sebagai kelulusan aplikasi.

## Bukti otomatis lokal

| Lapisan                              | Hasil                                                                                                                                                                    |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Unit/regresi sumber                  | 109/109                                                                                                                                                                  |
| RLS/CRUD database                    | 164/164                                                                                                                                                                  |
| Integrasi kegiatan                   | 20/20                                                                                                                                                                    |
| Integrasi berita/foto                | 26/26                                                                                                                                                                    |
| Integrasi arsip/pengurus             | 17/17                                                                                                                                                                    |
| Integrasi pengaturan/akun/audit/aset | 19/19                                                                                                                                                                    |
| Total suite                          | **355/355**                                                                                                                                                              |
| Runtime Worker lokal                 | 24/24 RPC; termasuk baseline BPH/Super Admin positif, penolakan anon/Kabid/anggota/nonaktif, DTO audit aman, simpan identik, konflik, reservasi/batal dan cache no-store |
| TypeScript/build                     | exit 0                                                                                                                                                                   |
| ESLint                               | 0 error, 7 warning fast-refresh lama                                                                                                                                     |

`npm run test:pengaturan` dan `npm run test:pengaturan:db` menjadi pintu tes baru. Fixture transport tiga suite publik diperbarui untuk memuat parser pengaturan sumber nyata; fungsi parser tidak diganti stub yang selalu lulus.

Worker lokal memakai Wrangler 4.151.1 dengan override tanggal kompatibilitas 2026-10-19 karena binary ini belum menerima tanggal build 2026-10-20. Override hanya argumen dev, bukan perubahan konfigurasi produksi. Bukti runtime produksi tanggal build dipisahkan pada penutupan.

## Bukti browser dan batas data uji

- Pengaturan dan log diuji pada lebar aktual 360/768/1024/1440/1920; `scrollWidth <= innerWidth`, tanpa overflow. Aksesibilitas otomatis pengaturan 22 passes/log 25 passes/akun 23 passes, 0 violations. Halaman akun juga lolos lima lebar; tabel menggulir di wadah sendiri.
- URL sosial tiruan ditolak di form; penjaga isian, modal simpan/batal, upload gambar sintetis, pratinjau dan pembatalan diuji lewat UI. Filter pelaku/modul bekerja; tanggal terbalik ditolak dan filter masa depan menampilkan hasil kosong.
- Simpan melalui UI menggunakan kalimat beranda yang memang sudah ditampilkan. Nomor WA asli tidak diganti untuk uji. Field opsional JSON null dinormalisasi menjadi teks kosong dan pengumuman kosong; tampilan publiknya tetap kosong.
- Perubahan nomor WA palsu/pengumuman dan pemasangan/pencabutan aset diuji dalam transaksi DB yang di-ROLLBACK, lalu dibandingkan snapshot. Parser publik/tautan WA, empat foto/logo/tagline, serta expiry diuji terisolasi. Ini berbeda dari menerbitkan nomor/foto uji di situs bersama.
- Pengurus/akun asli tidak direset/dinonaktifkan. Reset, username, aktif/nonaktif dan audit diuji pada akun sementara; password tidak masuk audit.
- Tab publik milik Hanif dan sesi login aslinya dipertahankan.

## Batas yang tetap terbuka

SMTP/undangan email tidak termasuk pekerjaan ini. Foto asli dan konten asli menunggu seleksi tim/Hari 24. Cache/salinan unduhan foto publik tidak dapat ditarik kembali; penghapusan fisik tidak menjanjikan seluruh cache eksternal langsung hilang. Browser yang sudah terbuka memakai cache loader sampai navigasi/refresh, bukan push real-time.

QA perangkat HP fisik 30 foto, grafik provider terisolasi, tinggi beranda, LCP konsisten, metadata tiga halaman, preview WhatsApp, restore drill dan persetujuan Checkpoint 3 tetap mengikuti catatan audit sebelumnya. Tidak ada merge `main` atau klaim siap launching.

## Penutupan produksi dan cleanup

Diisi setelah push dan pemeriksaan kedua origin; status akhir hanya selesai setelah bukti produksi dan cleanup tersedia.
