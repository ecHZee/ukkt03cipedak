# Hari 22 — Panduan pengurus dan bantuan admin

20 Oktober 2026. Implementasi dan QA lokal selesai; pemeriksaan produksi serta cleanup dicatat di bagian penutupan di bawah. **Uji mandiri manusia belum dilakukan; Checkpoint 4 belum disetujui dan main tidak diubah.**

## Hasil

- `docs/PANDUAN-PENGURUS.md`: panduan bahasa umum dengan lima screenshot aplikasi dari akun/tulisan latihan. Mencakup masuk/password, peran, berita, kegiatan, album/Drive/retry, PDF, profil/izin, pemeriksaan, pengurus/pengaturan/log, akun dan kendala.
- `/admin/bantuan`: petunjuk singkat dengan daftar topik, tautan tindakan dan tautan panduan bergambar. Menu Bantuan tersedia untuk semua akun aktif. Bagian/tautan mengikuti peran yang sudah ada; tidak memberikan izin baru atau mengambil data tambahan.
- Parent `/admin` tetap memeriksa akun aktif dan mengarahkan pengguna tanpa sesi ke login. Bantuan memiliki judul sendiri dan mewarisi `noindex, nofollow`.
- Lembar uji mandiri ada di bagian 11 panduan. Anggota mengajukan; Kabid/BPH memeriksa. Tulisan latihan tidak perlu diterbitkan di website umum.
- Tidak ada migrasi, perubahan RLS/Auth, dependensi, billing atau konfigurasi dashboard. SMTP tetap di luar scope.

## Bukti lokal

| Pemeriksaan                       | Hasil                                                                                                                                                                                                                                                                                                                                        |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TypeScript, ESLint, build         | tsc/build exit 0; lint 0 error dan 7 warning Fast Refresh bawaan                                                                                                                                                                                                                                                                             |
| Regresi berita dan ketahanan akun | 14/14 tes yang dijalankan ulang lolos                                                                                                                                                                                                                                                                                                        |
| Layanan sumber nyata dan RLS      | 13/13: anggota ditolak menerbitkan oleh service dan RPC (42501); pembaca, Kabid bidang lain, nonaktif ditolak; pengaturan ditolak bagi non-BPH; anon tidak membaca latihan; Kabid Media/BPH membaca draf; snapshot berita tidak berubah oleh percobaan terlarang                                                                             |
| Responsif                         | 25 kombinasi: pembaca, anggota berizin, Kabid, BPH, Super Admin × 360/768/1024/1440/1920 px; tidak ada overflow horizontal. Lebar diukur lewat `innerWidth`, bukan screenshot. Selisih 15 px adalah scrollbar                                                                                                                                |
| Bantuan sesuai peran              | Pembaca hanya profil/kendala; anggota mendapat panduan kontribusi; Kabid mendapat pemeriksaan; BPH pengurus/pengaturan/log; menu Akun hanya Super Admin                                                                                                                                                                                      |
| Aksesibilitas otomatis            | Axe WCAG A/AA: anggota, BPH, Super Admin masing-masing 21 pemeriksaan lolos, 0 pelanggaran                                                                                                                                                                                                                                                   |
| Keyboard/menu HP                  | Enter pada topik memindahkan fokus ke bagian tujuan. Semua jangkar punya target. Tautan utama minimal 44 px; menu HP menutup setelah memilih Bantuan; Escape menutup dan fokus kembali ke Buka menu                                                                                                                                          |
| Alur panduan                      | Username anggota latihan → berita tanpa sampul → pratinjau → simpan Draf → temukan/Sunting → Ajukan review → status Menunggu persetujuan. Anggota tidak punya tombol Terbitkan. Kabid melihat pengajuan; konfirmasi Setujui dibuka lalu dibatalkan, Tolak benar-benar mengembalikan ke Draf. Anggota mengajukan ulang untuk bukti screenshot |
| Isian belum disimpan              | Kembali ke daftar memunculkan peringatan; Lanjut menyunting mempertahankan isian; Tinggalkan perubahan membuang isian baru, draf tersimpan tetap ada                                                                                                                                                                                         |

QA memakai tujuh akun sementara dari helper yang sudah ada; lima di antaranya dipakai login UI localhost. Tidak memakai atau mengeluarkan sesi produksi Hanif. Tidak mengunggah foto asli, mengubah kontak/akun asli atau menerbitkan tulisan latihan. Gambar panduan hanya contoh teks dan akun latihan, tanpa password/kontak pribadi. Screenshot formulir menunjukkan keadaan Sunting, dengan isian yang sama seperti saat Tulis berita.

Catatan jujur: lint awal sempat membaca skrip fixture sementara yang belum diformat; skrip sekali pakai dihapus sesudah berhasil dan lint diulang bersih. Percobaan browser pertama terlalu awal sebelum server siap; tab QA baru dipakai sesudah server tersedia. Pada pembukaan awal admin tanpa sesi, Vite mencatat hydration mismatch ketika pending admin beralih ke login. Login dan navigasi berikutnya berjalan; pemeriksaan produksi/fresh-tab dicatat terpisah, bukan dianggap semua console sejak awal bersih. Beberapa pengamatan UI terlalu cepat membaca daftar lama sesudah pesan simpan; bukti akhir menunggu status baris yang baru, bukan pesan sukses saja.

## Batas penerimaan

Developer sudah mengulang skenario panduan, tetapi **belum membuktikan anggota Media baru bisa mengikuti tanpa dibimbing**. Hanif perlu menunjuk peserta dan pemeriksa; simpan hasilnya privat memakai format panduan. Perbaiki langkah yang membingungkan sebelum menerima Checkpoint 4. Jangan otomatis merge main berdasarkan tes teknis ini.

Tidak mengulang upload B2 massal/PDF/crop/reset akun asli atau seluruh 355 tes Hari 21 karena kode layanan/DB fitur itu tidak berubah. Angka 14 dan 13 di atas hanya pemeriksaan yang dijalankan pada sesi ini. Bukti Hari 18–21 tetap di review masing-masing. HP fisik 30 foto, Class B terisolasi, Q06–Q08, preview WhatsApp, backup Storage/restore drill dan Checkpoint 3 tetap terbuka. Konten/foto asli menunggu tim/Hari 24.

## Penutupan produksi dan cleanup

Menunggu deploy `revisi`, pemeriksaan kedua origin, verifikasi tautan/gambar panduan, penghapusan fixture dan penutupan server. Bukti privat disimpan di luar repo publik: lampiran `katar-hari22-20261020`.
