# Hari 29 — Stabilisasi dan persiapan pengujian tim website

Disetujui Hanif pada 26 Oktober 2026. Berangkat dari revisi `17fe472`. Ketua dan Hanif akan
membentuk tim website; tanggal pertemuan belum ditentukan. Paket ini menyiapkan versi
yang stabil untuk dibahas dan diuji, tanpa penambahan fitur atau perubahan desain besar.

| Urutan | Pekerjaan                                          | Bukti yang harus tersedia                                                                                                              |
| ------ | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 1      | Inventaris fitur dan audit akun read-only          | Akun Auth/profil/pengurus cocok, status dan peran diperiksa; data rinci tetap privat                                                   |
| 2      | Diagnosis/perbaikan performa dan bug yang terbukti | Tiga run setara sebelum/sesudah; regresi fungsi/visual diperiksa; target LCP 2,5 detik tetap                                           |
| 3      | Rotasi key B2 web bertahap                         | Key pengganti dibatasi bucket/prefix dan izin objek; uji baca/tulis/salin/versi/hapus fixture sebelum pencabutan key lama oleh pemilik |
| 4      | Uji fungsi dan hak akses                           | Tes otomatis relevan + interaksi localhost akun sementara tiap peran; draf/berkas privat tidak bocor                                   |
| 5      | QA visual dan produksi                             | Lebar 360/375/768/1024/1235/1440, navigasi/modal/form/kondisi kosong, kedua origin, konsol dan no-store                                |
| 6      | Paket black-box/UAT bagi tim                       | Daftar fitur, skenario bernomor, prasyarat, langkah/hasil, prioritas, formulir bukti dan pelaporan tersedia                            |

Kredensial/izin baru diisi atau disetujui Hanif ketika langkah sudah disiapkan. Akun asli
tidak dipakai untuk simulasi agen. Audit kesiapan akun bukan bukti pemilik masing-masing
telah berhasil login; distribusi password dan penerimaan dilakukan privat oleh pemilik.

Sebelum/sesudah tes yang menulis, simpan pembanding data asli secara privat, batasi fixture
berlabel UJI, lalu buktikan pembersihannya. Tidak menjalankan suite tulis bersamaan.
Tidak mengubah main, billing/cap, data resmi, desain E, atau menampilkan rahasia.

## Batas kelulusan

Implementasi/perbaikan diluluskan dengan tsc/lint/build, tes yang relevan, browser dan
produksi. Kendala yang belum selesai dicatat bersama dampak dan tindak lanjutnya.
UAT manusia, HP fisik/WhatsApp, cron mingguan pertama 1 November dan pemulihan Supabase
penuh tidak diklaim selesai dari pengujian agen. Restore penuh memerlukan target uji
Supabase terisolasi yang disetujui. Launching/checkpoint tetap keputusan Hanif/tim.

Dokumen keluaran: HARI-29-REVIEW.md, inventaris fitur dan paket pengujian tim. Hasil peserta,
akun, screenshot privat dan manifest rinci berada di catatan tim privat di luar Git publik.
