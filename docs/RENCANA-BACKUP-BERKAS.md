# Rencana cadangan foto dan dokumen website

Hari28, 26 Oktober 2026: **Pilihan A terpasang dan aktif.** Run manual, pemicu otomatis
sesudah SQL, retensi empat snapshot, simulasi gagal dan pemulihan30berkas telah lulus.
Jadwal nominal Minggu01.00WIB mengikuti SQL; cron pertama setelah aktivasi belum diamati.
Lihat [bukti dan status Hari28](HARI-28-REVIEW.md).
Cadangan SQL mingguan yang sudah ada menjadi pemicu cadangan objek. Arsip foto asli di Drive
tetap disimpan; cadangan ini menyimpan berkas yang benar-benar dipakai website.

## Pilihan tujuan

| Pilihan                                      | Isi dan akses                                                                             | Pertimbangan                                                                                                                                     |
| -------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| A — Drive akun Katar, folder cadangan privat | Foto WebP/thumbnail, PDF publik dan internal, daftar path/ukuran/hash; hanya pemilik akun | Rekomendasi awal karena akun sudah dipakai. Periksa sisa ruang dan akses folder sebelum pemasangan. Izin otomasi khusus perlu disiapkan pemilik. |
| B — Tetap salinan manual lokal sementara     | Isi yang sama, tanpa akses layanan tambahan                                               | Paling sedikit pengaturan baru, tetapi belum melindungi dari kehilangan laptop dan belum otomatis.                                               |

Tidak memakai repo web publik atau folder arsip yang dibagikan sebagai tujuan cadangan.
Pilihan A mencakup dokumen internal, sehingga folder tujuan tidak boleh dibagikan lewat tautan.
Folder dan satu ZIP cadangan manual telah dibuat di Drive akun Katar, dengan akses hanya pemilik.
ZIP dibaca ulang dan30objek hasil pemulihan cocok ukuran/SHA256. Otomasi memakai folder lain
khusus aplikasi, scopeDrive.file dan key B2ReadOnly; akses diisi pemilik dan disimpan pada
GitHub Secrets repo privat. Cadangan manual lama dan arsip asli tetap dipertahankan.

## Cara kerja pilihan A yang diterapkan

1. Pemilik menyetujui tujuan, akses, jadwal, retensi, dan batas biaya. Periksa kapasitas Drive
   serta batas unduh akun B2 yang nyata; hentikan pekerjaan bila batas tidak mencukupi.
2. Siapkan folder baru privat khusus cadangan website, terpisah dari arsip kegiatan asli.
   Tetapkan akses otomasi sekecil yang tersedia untuk tujuan tersebut. Pemilik mengisi
   kredensial di penyimpanan secret workflow repo backup privat, bukan chat atau repo kode.
3. Jalankan pencadangan awal manual, lalu mingguan setelah backup SQL. Simpan empat snapshot
   mingguan yang berhasil; snapshot gagal tidak menggantikan salinan terakhir yang berhasil.
4. Setiap snapshot mencatat waktu, commit aplikasi/migrasi, nama bucket, path, ukuran, jenis
   berkas dan SHA256. Daftar objek harus mencakup semua halaman listing Storage/B2.
   Jangan mencetak isi berkas, URL bertoken atau rahasia ke log workflow.
5. Unduh ulang hasil unggahan cadangan dan cocokkan jumlah, ukuran serta hash. Tanda berhasil
   diberikan setelah pembacaan ulang ini; log kegagalan cukup menyebut objek/kode kesalahan.
6. Sebelum menghapus snapshot kedaluwarsa, buktikan snapshot terbaru lengkap. Penghapusan
   hanya di folder cadangan khusus, tidak menyentuh arsip asli atau bucket produksi.

Batas biaya usulan **Rp0 tanpa menambah kartu atau menaikkan cap**. Kebutuhan ruang dihitung
dari listing terbaru, dengan empat salinan dan ruang sementara untuk verifikasi. Angka30objek
Hari26 bukan batas permanen; jumlah akan berubah setelah penggantian foto atau unggahan baru.
Jika jadwal berbenturan dengan batas akun, job berhenti dan keputusan jadwal dibahas ulang.

## Kriteria pemasangan dan batas bukti

- Tujuan dan izin folder terbukti privat; akses secret tidak muncul di log/bundle/repo.
- Run awal dan rantai SQL→objek otomatis berhasil, dengan bukti baca ulang seluruh manifest.
- Run cron mingguan pertama tetap harus diamati; nominal berikutnya1November2026 01.00WIB,
  dapat terlambat menurut antrean GitHub. Ini belum diluluskan dari uji manual.
- Restore objek ke tempat terisolasi cocok path/ukuran/hash; PDF internal tetap privat.
- Uji kegagalan membuktikan snapshot terakhir yang baik tidak terhapus.
- Panduan menjalankan ulang, memulihkan, dan mencabut akses tersedia bagi pemilik.

Rencana ini belum membuktikan pemulihan Supabase lengkap. Login Auth, kebijakan Storage,
trigger khusus, riwayat migrasi, konfigurasi layanan dan secret runtime tetap perlu diperiksa
di lingkungan Supabase terisolasi; lihat [panduan pemulihan](BACKUP-DAN-PEMULIHAN.md).
