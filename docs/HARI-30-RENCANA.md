# Hari 30 baru — Audit kapasitas dan batas operasional

Disetujui Hanif 28 Oktober 2026 sesudah [perpanjangan pra-launch](PRA-LAUNCH-DAN-FORBIT.md).
Awal `revisi` = `e0e0918`, sinkron origin dan bersih. Ini menggantikan agenda Hari30 lama;
launching tetap ditunda. Forbit, pengujian peserta H-x dan pembagian akses belum dijalankan.

| Urutan | Pekerjaan | Definisi selesai |
| --- | --- | --- |
| 1 | Verifikasi akun/target dan paket aktif | Dashboard organisasi Katar, Worker/Pages, proyek Supabase, bucket B2 dan Drive tepat; tidak memakai akun proyek lain. |
| 2 | Inventaris read-only | Byte/jumlah objek/versi/unfinished, database, kuota/cap/egress dan ruang Drive bertanggal, dengan batas scope dan pembulatan jelas. |
| 3 | Cocokkan aplikasi dan backup | Batas file/batch/album, jalur upload, batas total/request/arsip backup dan retensi dibaca dari sumber terkini. |
| 4 | Proyeksi 3/6/12 bulan | Asumsi foto+thumbnail/PDF/video dinyatakan; pisahkan kuota penyedia, helper backup dan trafik; bukan klaim beban yang sudah dibuktikan. |
| 5 | Uji aman dan protokol lanjutan | Boundary fixture offline serta regresi relevan; rancangan uji nyata terbatas memuat plafon byte/request/waktu dan titik berhenti. |
| 6 | Laporan dan penutupan | Temuan/risiko/rekomendasi, dokumen konteks, bukti privat, commit revisi dan smoke produksi; tidak menyatakan siap launch. |

Tidak memenuhi storage produksi dengan data dummy, menjalankan stress test, membuat akun/
scope/key, menaikkan billing/cap, merotasi key, mengubah DB/RLS atau refactor helper backup.
Kalau ditemukan batas helper, catat bukti dan tindak lanjut; perubahan implementasi berikutnya
dibahas terpisah. Data, path objek, metadata privat dan kredensial tidak masuk Git publik.

Hasil dan cara mengulang audit: [review Hari30](HARI-30-REVIEW.md).
