# Hari 26 — QA teknis dan referensi

24 Oktober 2026, baseline `c4d92fa`, branch `revisi`. Hanif belum dapat mengadakan uji pengurus;
pekerjaan ini tidak menjadi hasil uji manusia atau meluluskan Checkpoint3/4/main.

## Perbaikan beranda HP

Desain E, data dan tujuan tautan dipertahankan. Jarak antarbagian, judul dan footer dipadatkan
di HP; ukuran desktop tetap memakai breakpoint sebelumnya. Foto berita diberi posisi di
bingkai rasio agar tinggi intrinsik foto tidak memperpanjang kartunya. Informasi reduced-motion
tetap lengkap dan statis. Tautan lokasi/Instagram pada ajakan mendapat tinggi minimal44px.
Foto kolase mendapat prioritas rendah agar tidak mendahului teks/font pada jalur pemuatan
yang diukur; ini bukan klaim otomatis bahwa target LCP lulus.

| 375×740, viewport aktual; scrollbar15px | Sebelum              | Lokal final          |
| --------------------------------------- | -------------------- | -------------------- |
| Mode biasa                              | 5.318px / 7,19 layar | 4.253px / 5,75 layar |
| Reduced-motion                          | 5.520px / 7,46 layar | 4.417px / 5,97 layar |

Target Q06 lokal tercapai pada konten saat ini. Penambahan berita/kegiatan/pengumuman dapat
mengubah panjang halaman; ukur lagi bila isinya berubah. Tidak memperkecil semua teks atau
menghapus informasi reduced-motion hanya untuk mengejar target.

## Verifikasi lokal

- TypeScript/build exit0, lint0error/7warning bawaan.
- 127 tes unit/regresi dan 246 pemeriksaan DB/service/RLS lulus. Runner Node melaporkan
  132 subtest: 127 unit ditambah 5 skrip integrasi yang menjalankan 246 pemeriksaan tersebut;
  bukan 132+246 tes terpisah. Total pemeriksaan logis373.
- 30 kombinasi enam halaman (`/`, Tentang, Program, Berita, Galeri, Kontak) ×
  360/375/768/1024/1440px tanpa overflow. Lebar aktual di-assert.
- Menu HP, Escape/fokus kembali, jeda/lanjut informasi, beranda→detail berita dan
  galeri→album diuji. Bukti interaksi final disimpan privat.
- 93 berkas bundle publik diperiksa terhadap4nilai privat;0 kecocokan.
- Tidak ada migrasi, perubahan dependensi/lockfile, role asli atau publikasi konten baru.

Wildcard tes sempat menjalankan lima suite integrasi, lebih luas dari kebutuhan CSS.
Semuanya selesai dengan cleanup sendiri; pemeriksaan lanjutan membuktikan 14 tabel asli
identik dengan snapshot sebelum tes, Auth62/profil62/pengurus61 dan akun fixture0.
Beberapa klik otomatis terlalu dini sebelum hidrasi/transisi selesai diulang setelah
aplikasi siap; hasil antara tidak dihitung lulus. Kesalahan quoting PowerShell/UTF8 lokal
dikoreksi sebelum build final.

## Backup dan pemulihan

Ping23Okt sukses. Backup manual baru berhasil pada24Okt00:23WIB, repo backup privat
commit`2306a88`. Tidak mengubah jadwal atau kredensial workflow.

Skema/data aplikasi14tabel dipulihkan pada PostgreSQL17 dalam container tanpa jaringan/port,
data di tmpfs. Semua isiCOPY cocok;30foreignkey valid, RLS14tabel aktif. Anonim melihat
2berita/4album/0kegiatan. Hasil dibandingkan lagi dengan data live:14/14identik.
Tabel/fungsi pendukung Auth/Storage adalah penyangga uji, Vault tidak diuji; bukan bukti
restore Supabase lengkap atau login ke proyek pengganti. Percobaan PG16 ditinggalkan setelah
menemukan privilege MAINTAIN versi17; unduhan image17 sempat gagal DNS lalu berhasil.

30objek saat ini dicadangkan privat (8Supabase+22B2,3.970.078byte), lalu dipulihkan kefolder
berbeda denganSHA256identik. Bukan backup seluruh versi B2, bukan upload ulang kecloud dan
belum otomatis/offsite. Panduan [backup dan pemulihan](BACKUP-DAN-PEMULIHAN.md) mencatat
lapisan objek, perubahan khusus Auth/Storage, migrasi dan batas pengujian.

## Performa

Lighthouse13.5.0/Chrome155, mobile412×823DPR1,75, cache browser dingin,
simulated slow4G(RTT150ms/1638,4Kbps), CPU4×. Baseline produksi tiga run:
LCP5,088/5,311/5,776detik, median5,311; CLS0–0,0001513, TBT5,5–6ms.
Ini lab satu perangkat/jaringan, bukan p75 pengguna nyata. CrUX/RUM tidak tersedia dalam
pengujian ini. H1 menjadi elemen LCP pada diagnostik awal; CSS/font dan persaingan transfer
gambar menjadi jalur yang diperiksa. Header no-store tidak dilonggarkan untuk skor.
Pengukuran produksi setelah koreksi dicatat pada penutupan di bawah; Q07 belum dinyatakan lulus.

## Referensi

[Analisis RT08/RW04 Malaka Jaya](ANALISIS-REFERENSI-MALAKA-JAYA.md) disimpan terpisah.
Pelajaran utamanya isi program/hasil dan kolaborasi yang spesifik. Tidak menyalin aset,
mengganti desain, mengirim form atau menebak maksud pengirim. CMS mereka tidak diperiksa.

## Status

QA lokal dan pemulihan terbatas selesai. Deploy, verifikasi produksi, pengukuran akhir dan
cleanup penutup menyusul. Uji pengurus/HPfisik/WhatsAppnyata, grafikClassBprovider,
restore Supabase lengkap dan backup objek offsite otomatis tetap terpisah.
