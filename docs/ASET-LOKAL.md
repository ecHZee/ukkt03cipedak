# Lokasi aset lokal pengembangan

Sejak 19 Oktober 2026, aset dari Downloads dipindah ke **folder saudara repo**:
`katar_profile/_aset-lokal/`. Folder ini di luar repo publik `ukkt03cipedak`.

| Folder | Isi dan kegunaan |
| --- | --- |
| `_aset-lokal/_Pilihan Web/` | 37 foto WebP pilihan + contact sheet; bahan kurasi web, belum berarti sudah tampil online. |
| `_aset-lokal/_Siap Upload/` | Satu master 2.798 berkas, sumber album/data asli Hari 19/24. Tidak diimpor langsung ke bundle. |
| `_aset-lokal/Referensi-Drive/` | Lima HTML tautan unduhan lama, disimpan sebagai referensi. |

Logo yang sedang dipakai aplikasi tetap `public/logo/`. Tidak ada perubahan kode aplikasi, isi
database, foto publik ataupun konfigurasi deployment pada penataan berkas ini.

Seluruh 2.841 berkas yang dipindah/disimpan telah dicocokkan SHA256. Delapan ZIP lama (3.883 entri)
dan 336 berkas pembanding memiliki isi identik dengan master yang dipertahankan. Lima berkas lepas
yang dibersihkan sudah di-backup dan diunduh ulang dengan SHA256 cocok. Total 349 berkas dihapus,
53.257.264.366 byte (53,26 GB desimal). Folder sumber Downloads kini sudah dihapus setelah kosong.

Drive akun organisasi diperiksa ulang: 53 folder/2.960 item, semua 2.802 ID arsip audit sebelumnya
cocok nama/ukuran/waktu modifikasi. Tujuh backup baru (enam berkas + paket aset/referensi) lolos
unduh ulang/hash. **Ini bukan verifikasi SHA256 baru seluruh arsip Drive lama**; satu master lokal
tetap disimpan. Laporan rinci dan tautan Drive berada di README aset lokal serta
`katar_profile/_arsip-audit/2026-10-19/`, di luar repo publik.

Jangan memasukkan foto orang, data finansial, manifest rinci atau arsip mentah ke Git publik.
Penataan ini bukan implementasi Hari 19; B2 dan upload album massal tetap pekerjaan berikutnya.
