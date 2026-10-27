# Lokasi aset pengembangan

## Kondisi sekarang — 27 Oktober 2026

Master arsip berada di **Google Drive akun Katar**, bukan lagi di C. Seluruh 2.798 berkas
master lokal (36.192.774.655 byte / 33,71 GiB) telah dicocokkan dengan salinan Drive sebelum
berkas lokalnya dihapus satu per satu. Tidak perlu upload baru: semua salinan sudah tersedia.

| Lokasi | Isi dan kegunaan |
| --- | --- |
| Drive Katar privat | Master foto/video dan arsip asli. Unduh kembali hanya berkas yang diperlukan. |
| `katar_profile/_aset-lokal/_Pilihan Web/` | 37 foto WebP pilihan + contact sheet, 38 berkas / 10.995.506 byte; seluruh SHA256 tetap cocok. |
| `katar_profile/_aset-lokal/_Siap Upload/` | Lokasi master lama; kini tidak menyimpan berkas master. |
| `katar_profile/_aset-lokal/Referensi-Drive/` | Lima HTML referensi unduhan lama; jangan dieksekusi. |
| `katar_profile/_evakuasi-aset/2026-10-27/` | Bukti privat dan `manifest-pemulihan-private.json`: path/nama asli, ukuran, SHA256 dan ID Drive untuk pemulihan. |

Tautan folder Drive ada di README privat `katar_profile/_aset-lokal/README.md`.
Seluruh lokasi tersebut berada di luar repo publik `ukkt03cipedak`.
Logo aplikasi tetap di `public/logo/`. B2 menyimpan media website; penghapusan master lokal
ini didasarkan pada verifikasi **Drive**, bukan asumsi semua master sudah masuk B2.

## Bukti dan batas pemeriksaan

- 10 berkas diunduh utuh dan dicocokkan SHA256; 2.788 lainnya dicocokkan pada **seluruh rentang
  isi berkas** memakai MD5 yang dihitung server, dengan ukuran, cakupan rentang dan ETag konsisten.
- Sebelum setiap penghapusan, SHA256 lokal dihitung ulang dan harus cocok manifest awal.
- Dua nama salinan duplikat merujuk isi identik: 2.798 path asal dipetakan ke 2.796 file Drive.
- Satu PDF dipulihkan dari Drive **sesudah sumber lokal dihapus**; 9.143.761 byte dan SHA256 cocok.
- Lima uji penjagaan lulus, termasuk penolakan checksum/rentang/ETag/waktu lokal yang berubah.
- Tidak ada upload baru, perluasan izin Google, perubahan sharing, kode aplikasi, database,
  konfigurasi hosting atau key. Bukti ini tidak mencakup semua berkas lain di akun Drive.

## Riwayat

Pada 19 Oktober, 2.841 berkas dipindahkan dari Downloads dan dicocokkan SHA256.
349 berkas duplikat/tercadang dibersihkan (53.257.264.366 byte), sementara satu master lokal
dipertahankan karena saat itu belum ada pemeriksaan isi baru seluruh master Drive.
Verifikasi 27 Oktober memenuhi pemeriksaan yang sebelumnya belum dilakukan.
Bukti lama tetap di `katar_profile/_arsip-audit/2026-10-19/`.

Jangan memasukkan foto orang, data finansial, manifest rinci atau arsip mentah ke Git publik.
Pemeliharaan storage ini di luar Hari 30; tidak menyatakan website sudah lulus syarat launching.
