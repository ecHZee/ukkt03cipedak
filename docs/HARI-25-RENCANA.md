# Hari 25 — Persiapan uji pengurus dan simulasi teknis

20 Oktober 2026. Hanif meminta Hari25 dikerjakan sambil istirahat. Jadwal asli menempatkan
Hari25–29 sebagai uji coba pengurus selama beberapa hari, bukan penambahan fitur baru.
Pekerjaan agen hari ini menyiapkan pelaksanaan dan mengulang alur teknis dengan akun sementara.
Hasil peserta manusia serta tiga hari tanpa kendala kritis tetap membutuhkan bukti tersendiri.

| Langkah | Berkas/pekerjaan                                                                                  | Bukti selesai                                                              |
| ------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| 1       | `docs/UJI-COBA-PENGURUS.md`: tugas peserta, pencatatan masalah, aturan konten latihan             | Bahasa umum, peran peserta/pemeriksa jelas, tidak memuat identitas/rahasia |
| 2       | Simulasi pada build Worker lokal: Bantuan → berita draf → temukan kembali → review → dikembalikan | UI benar-benar diklik, status DB cocok, publik tidak membaca latihan       |
| 3       | Periksa pembaca, anggota berizin, Kabid sendiri/lain, BPH dan akun nonaktif                       | Penolakan server/RLS cocok; tidak mengubah akun/pengurus asli              |
| 4       | Periksa form kegiatan dan album draf serta layar 360/768/1024/1440/1920                           | Tidak ada overflow; pesan validasi dan tombol dapat digunakan              |
| 5       | `docs/HARI-25-REVIEW.md`, panduan, jadwal, README, konteks dan DEVLOG                             | Angka QA, batas bukti, cleanup dan status penerimaan manusia dibedakan     |

Tidak ada rencana migrasi, perubahan role/data publik asli, publikasi tulisan latihan atau merge main.
Bug yang terbukti pada alur ini diperbaiki seperlunya, lalu diverifikasi sebelum push revisi.
Foto profil/PDF/jadwal acara yang belum tersedia tidak diisi rekaan. Tidak mengirim undangan ke tim.
Akun latihan hanya dipakai di localhost; seluruh data/akun/audit latihan dibersihkan setelah QA.

## Definisi selesai

Persiapan teknis Hari25 selesai bila panduan pelaksanaan tersedia, alur simulasi lolos dan data
asli identik dengan snapshot awal, semua fixture bersih, hasil pemeriksaan dicatat, revisi ter-push,
serta web produksi tetap berjalan. Penerimaan Hari25–29 menunggu peserta menjalankan tugas nyata,
minimal dua berita dan satu album dari Media, satu kegiatan per Kabid, serta tiga hari terakhir
pengamatan tanpa kendala kritis. Konten yang dipasang agen pada Hari24 bukan bukti tugas anggota.
