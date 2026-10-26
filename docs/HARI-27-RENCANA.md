# Hari 27 — foto hero dan lanjutan kesiapan teknis

Dicatat 24 Oktober 2026 atas arahan Hanif sebelum beristirahat. **Dilaksanakan26Oktober2026**;
hasil dan batas verifikasi di [review Hari27](HARI-27-REVIEW.md).
Hari26 teknis selesai; uji pengurus tetap menunggu peserta tersedia.

## Tambahan dari review Hanif

Foto yang ditandai adalah **foto hero beranda, slot kiri atas kolase 2×2**: foto bersama
anggota inti. Masukkan pencarian foto penggantinya ke Hari27. Ini bukan permintaan mengganti
foto profil pengurus atau otomatis mengganti semua empat slot.

1. Periksa arsip lokal/Drive yang tersedia dan cari 3–5 calon foto untuk slot tersebut.
2. Pilih foto yang jelas pada ukuran kolase kecil, cukup terang dan tidak memotong orang
   secara mengganggu. Periksa tampilannya di HP dan laptop; desain E/kolase2×2 dipertahankan.
3. Buat lembar pilihan bernomor di luar repo publik. Tanyakan konteks dan izin yang belum
   pasti, tanpa mengarang nama acara, tanggal, identitas atau cakupan izin.
4. Hanif memilih kandidat sebelum foto baru diunggah/dipasang. Izin foto lama tidak otomatis
   berlaku pada kandidat baru. Foto orang dan catatan izin tetap di luar repo publik.
5. Setelah pilihan/izin jelas, pasang melalui pengaturan foto beranda yang sudah ada, lalu
   periksa empat slot, caption, pemuatan gambar, panjang halaman dan produksi.

## Pekerjaan teknis yang dibawa dari Hari26

| Urutan | Tugas                                               | Cara membuktikan                                                                                                    |
| ------ | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| 1      | Pilihan foto hero                                   | Kandidat bernomor, konteks/izin tercatat privat, pilihan Hanif jelas                                                |
| 2      | Diagnosis Q07/LCP                                   | Telusuri CSS/font, transfer foto dan variasi jaringan; tiga run setara sebelum/sesudah, laporkan semua hasil        |
| 3      | Rencana backup berkas privat berkala di luar laptop | Tentukan tujuan, akses, jadwal/retensi dan batas biaya bersama Hanif sebelum pemasangan/injeksi kredensial          |
| 4      | Lanjutan pemulihan                                  | Pisahkan bukti aplikasi14tabel/30objek yang sudah lulus dari restore Supabase/Auth/Storage lengkap yang belum diuji |

Median LCP Hari26 masih5,095detik; target<2,5detik belum lulus. Tinggi beranda saat ini
375×740 biasa5,75/reduced5,97layar sudah lulus, dan harus diukur ulang setelah perubahan foto/konten.
Header privat/no-store dan pemeriksaan izin tidak dilonggarkan untuk mengejar angka.

## Berkas acuan

- `src/components/public/landing/Hero.tsx` — penempatan kolase saat ini.
- `src/services/storage.ts` — alur unggah/kompresi yang sudah digunakan.
- `docs/HARI-26-REVIEW.md` — baseline, bukti QA dan pekerjaan terbuka.
- `docs/BACKUP-DAN-PEMULIHAN.md` — cakupan cadangan dan batas restore.
- `docs/CHECKLIST-FOTO-LAUNCH.md` — panduan pemilihan bahan untuk tim.

Catatan awal24Oktober hanya menyimpan rencana. Saat pelaksanaan26Oktober, Hanif memilih
kandidat1 dan memberikan izin tayang publik sebelum unggahan/pemasangan. Tujuan cadangan
Drive privat juga disetujui; pemasangan otomasinya terpisah. Tidak ada keputusan desain ulang,
migrasi, pengiriman pesan, merge main atau launching.
