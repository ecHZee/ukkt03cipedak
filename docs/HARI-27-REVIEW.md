# Hari27 — foto hero, validasi WebP dan kesiapan cadangan

Pelaksanaan 26 Oktober 2026, branch `revisi`, awal HEAD/origin `87a8ee0`.
Hanif mengizinkan pelaksanaan, memilih kandidat1, lalu mengonfirmasi izin tayang publik.
Kandidat, sumber foto, catatan izin, manifest dan hasil unduh ulang disimpan privat di luar repo.

## Hasil yang dipasang

- Foto hero kiri atas diganti dengan pilihan Hanif. Kolase2×2/desain E tetap. Bagian Tentang
  pada beranda memakai foto pertama yang sama sesuai perilaku pengaturan yang sudah ada.
- Tiga slot lainnya tetap foto yang sama; hanya berkas WebP dibuat lebih ringan. Seluruh
  gambar mempertahankan bingkai asli tanpa crop baru dan tanpa metadata sumber.
- Total empat berkas 914.736 → 450.334 byte, turun50,8%. Foto pertama1200×800 untuk kolase
  sekaligus bagian Tentang; tiga lainnya lebar960. Ini ukuran berkas, bukan klaim LCP50% lebih cepat.
- Empat unggahan dibaca ulang dan SHA256 cocok. Caption tidak berubah; sebelas pengaturan
  lain serta nilai tampilan selain foto identik. Pembersihan bawaan menghapus empat turunan
  web lama; sumber asli dan salinan privat tetap ada, antrean pembersihan0.

## Bug yang ditemukan

Validasi gambar sebelumnya mendekode seluruh12byte header RIFF menjadi UTF-8, termasuk
empat byte ukuran biner. Pada salah satu WebP sah, dua byte ukuran membentuk satu karakter;
posisi teks `WEBP` bergeser sehingga file sah ditolak. Sekarang hanya tanda `RIFF` dan `WEBP`
pada posisi byte yang benar yang didekode. Batas ukuran, kepemilikan unggahan, hak akses,
versi pengaturan dan RLS tetap berlaku.

Percobaan pertama ditolak sebelum simpan pengaturan. Unggahan yang sama dipakai kembali
setelah perbaikan dan berhasil lewat layanan pengaturan aplikasi. Ada regresi untuk header
multibyte, terpotong dan tanda palsu; bukan menerima semua berkas berakhiran `.webp`.

## QA lokal

- 128 tes unit,164 tes database dan19 skenario integrasi pengaturan:311 pemeriksaan lolos.
  Integrasi memeriksa penolakan WebP palsu, izin peran, konflik versi, cleanup dan pengembalian data.
- Tsc/build berhasil; lint0error/7warning bawaan.81 berkas JS/CSS publik diperiksa terhadap
  empat nilai rahasia lokal,0 kecocokan; nilainya tidak dicetak.
- Beranda360/375/768/1024/1440 tanpa overflow, keempat gambar termuat. Pada375×740,
  tinggi normal4248px (5,74layar), reduced4412px (5,96layar); target maksimal6 tetap lulus.
- Menu HP terbuka, Escape menutup dan mengembalikan fokus; tautan Lihat Kegiatan selesai
  menuju daftar kegiatan. Periksa konsol dan screenshot final pada penutupan di bawah.
- Delapan tabel bisnis/aset identik dengan baseline;62Auth/62profil/61pengurus tetap.
  Konten4kegiatan draf,2berita,4album,13media tetap. Audit bertambah untuk perubahan sah;
  akun, objek dan audit fixture integrasi dibersihkan oleh skrip.

Worker lokal memakai override kompatibilitas19Okt karena runtime cache lokal belum26Okt;
konfigurasi produksi tidak diubah. Satu percobaan pemisahan modul publik/admin dibatalkan:
hasil build hanya mengurangi sekitar2,4KB gzip (1,1%) dan tetap memuat modul yang dicurigai.
Tidak menyisakan refactor spekulatif, perubahan dependensi atau migrasi.

## Performa

Profil Lighthouse13.5.0/Chrome155: mobile412×823,DPR1,75,simulated slow4G,CPU4×,
browser dingin. Tiga baseline sesi ini LCP6,196/7,360/7,483detik; median7,360detik,
CLS0,TBT11,5/7/7ms. Gunakan baseline sesi ini untuk pembanding, jangan memilih angkaHari26
yang lebih baik. H1 menjadi elemen LCP; variasi TTFB dan jeda render CSS/font tetap terlihat.
Header `no-store` dan pemeriksaan izin tidak dilonggarkan.

Tiga run setelah deployment selesai:

| Run | LCP        | CLS       | TBT    |
| --- | ---------- | --------- | ------ |
| 1   | 7,255detik | 0         | 7ms    |
| 2   | 7,015detik | 0         | 5,5ms  |
| 3   | 6,491detik | 0,0001283 | 15,5ms |

Median7,015detik, sekitar4,7% di bawah baseline sesi ini; **Q07/target<2,5detik belum lulus**.
Tidak cukup untuk mengatribusikan selisih kecil itu hanya ke kompresi foto, atau mengklaim
hasil lab sebagai p75 pengguna nyata. Accessibility/best-practices/SEO100 pada ketiga run;
tidak ada request gagal atau run warning. Skor performance66/63/64.

Satu run tambahan yang mulai12detik sebelum deploy selesai memperoleh8,047detik dan tetap
disimpan. Pembanding akhir memakai tiga run pertama yang dimulai setelah deploy selesai,
tanpa memilih berdasarkan skor. Trace dan network log disimpan privat.

H1 tetap menjadi LCP. Breakdown waktu yang benar-benar diamati menunjukkan TTFB0,418–1,324detik
dan jeda render0,695–2,545detik; ini berbeda dari model throttling LCP di tabel, jangan dijumlahkan
seolah profil waktunya sama. CSS transfer sekitar19,8KB dan jalur font/preload JavaScript
masih perlu eksperimen terpisah yang terukur. Foto yang lebih kecil belum menyelesaikan jalur render teks.

## Cadangan dan pemulihan

Hanif memilih **Drive Katar privat**, mingguan dengan empat snapshot berhasil dan batas biayaRp0.
Rancangan konkret: [rencana backup berkas](RENCANA-BACKUP-BERKAS.md). Tujuan sudah disetujui;
folder/akses otomasi dan workflow objek belum dipasang, belum ada unggahan cadangan ke Drive.
Pemasangan membutuhkan pemeriksaan kapasitas dan penyiapan akses khusus oleh pemilik.

Ekspor metadata privat tambahan mencatat16policy Auth/Storage,7trigger non-internal pada
kedua skema tersebut dan20riwayat migrasi. Daftar ini melengkapi bahan pemulihan, belum
membuktikan restore layanan lengkap. Bukti Hari26 tetap terbatas pada14tabel aplikasi,
30foreign key dan30objek saat itu. Foto yang diganti Hari27 mengubah isi objek aktif,
sehingga manifest Hari26 tidak boleh disebut snapshot terkini.

Login Auth, layanan Storage/Vault, secret dan konfigurasi pada proyek Supabase terisolasi
masih perlu drill terpisah. Tidak melakukan restore/migrasi ke produksi atau menambah proyek
berbayar. Uji pengurus, HP fisik, preview WhatsApp dan checkpoint tetap menunggu bukti nyata.

## Penutupan produksi

Kode `9d38628`, Workers Builds untuk SHA lengkap berhasil26Okt09:28:31WIB.
34/34 HTTP pada17route×2origin lolos: halaman200,slug hilang404,`/lpj`301;
Pages memiliki `X-Katar-Gateway: pages-v1`, HTML tetap `no-store`. Penanda data baru foto
pertama terlihat pada kedua origin; deployment kode dibuktikan terpisah oleh check SHA.
Empat GET gambar publik200/jenisWebP/SHA256 cocok.

Produksi360/375/768/1024/1440:5/5tanpa overflow,keempat foto termuat.375×740normal4248px,
reduced4412px, sama dengan lokal. Menu HP/Escape/fokus dan jeda banner desktop lolos;
konsol0error/warning. Satu langkah otomasi awal memakai rolecheckbox pada kontrol yang
sebenarnya button; diperiksa ulang lewat DOM dan diuji dengan role yang benar. Pemeriksaan
penutupan menu dilakukan setelah transisi selesai, bukan pada pembacaan terlalu dini.

Preview/workerd berhenti,port5173/8090/8788 kosong,.dev.vars sementara dihapus,emulasi
dipulihkan,tiga tab QA ditutup;tab/sesi asli tetap. Screenshot akhir pada viewport normal
dan semua bukti rinci di `_qa-hari27/2026-10-26/` privat, di luar repo web.

Paket Hari27 selesai untuk foto, perbaikan validator, diagnosis performa, keputusan/rencana
backup dan inventaris restore. Pemasangan backup objek otomatis, perbaikan Q07 dan drill
Supabase lengkap tetap pekerjaan lanjutan; belum mengumumkan launching atau memulaiHari28.
`main` tidak diubah, uji pengurus/checkpoint tidak otomatis diluluskan.

## Koreksi arahan hero — 26 Oktober 2026

Setelah meninjau hasil, Hanif memperjelas bahwa foto pilihan harus menjadi **background
hero yang makin transparan ke kanan**. Arahan ini menggantikan kolase2×2 untuk hero beranda.
Biru, batik, font, judul dan dua tautan tetap; foto lebih jelas di kiri, teks berada di kanan
pada desktop. Di HP foto ditempatkan pada bagian atas latar agar kelompok tidak dicrop
menjadi satu wajah, lalu menyatu ke area teks biru. Foto pertama tetap dipakai bagian Tentang.

Tidak mengunggah/menghapus foto atau mengubah pengaturan database. Tiga foto lainnya tetap
tersimpan; label Pengaturan/Bantuan/panduan menjelaskan foto pertama dan foto cadangan,
termasuk fallback latar biru saat foto pertama kosong. Tidak mengubah izin/upload/RLS.

Tsc/build0,lint0error7warning. Lima lebar lokal360/375/768/1024/1440 tanpa overflow,
satu gambar latar termuat, mask terhitung memudar ke kanan, kedua tombol setidaknya45px.
375×740normal4166px/reduced4330px (5,63/5,85layar). Tautan kegiatan selesai ke halaman tujuan,
konsol0error/warning. Perubahan tampilan/label tidak menambah tes cermin atau mengulang
integrasi database yang tidak berubah. Deploy, pengukuran produksi dan cleanup menyusul.
