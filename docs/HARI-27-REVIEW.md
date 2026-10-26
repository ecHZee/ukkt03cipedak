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

**Penutupan koreksi:** kode `4d0b4c7`, Cloudflarecheck SHA lengkap berhasil26Okt10:06:40WIB.
34/34 HTTP kedua origin lolos,termasuk301`/lpj?bidang=media`→`/arsip?bidang=media`,404slug,
no-store,gateway Pages dan penanda mask/prioritas baru. Produksi lima lebar tanpa overflow,
satu gambar latar termuat;375normal4166/reduced4330px sama dengan lokal. Menu/Escape/fokus
lolos,konsol0error/warning.93berkas publik/4nilaiprivat:0temuan.

Lighthouse profil sama,ketiga run dimulai setelah deploy: LCP4,249/4,354/7,443detik,
median4,354;CLS0,TBT34/19/6ms,performance82/80/61,a11y/best-practices/SEO100.
Tidak ada run warning. Elemen LCP sekarang gambar latar, sebelumnya H1; angka median
lebih kecil tidak berarti variasi jaringan hilang atau target<2,5detik telah tercapai.
**Q07 tetap terbuka.** Tidak melonggarkan no-store/izin untuk mengejar skor.

Bukti dan screenshot viewport normal tersimpan privat di `_qa-hero-background/2026-10-26/`.
Dev server/workerd/portuji kosong,tidak membuat .dev.vars baru,tab QA ditutup dan emulasi
pulih. Tidak mengubah data/akun/unggahan/migrasi/main atau memulaiHari28.

## Polesan lanjutan hero dan cadangan awal Drive — 26Oktober

Hanif meminta blok judul/tombol turun sedikit dan lapisan biru kanan lebih transparan.
Desktop digeser24px tanpa menambah tinggi hero; opacity lapisan biru kanan30%→20%,
alpha foto tengah16%→26% dan ujung kanan0%→10%. Teks isi menjadi putih penuh untuk
menjaga keterbacaan. HP tidak mendapat pergeseran vertikal desktop.

Tsc/build0,lint0error7warning. Enam lebar lokal360/375/768/1024/1235/1440 tanpa overflow;
translate terhitung24px hanya pada desktop, seluruh tombol tetap di dalam hero dan foto
termuat. Tinggi HP normal4166px tetap. Tidak mengulang integrasi DB untuk polesan CSS.

Sekalian menindaklanjuti pekerjaan tersisa: folder privat di Drive akun Katar dan satu
snapshot30objek aktif (8Supabase/22B2,3.505.676byte) dibuat setelah memeriksa kapasitas.
Metadata folder/ZIP hanya pemilik dan tidak shared. ZIP3.523.419byte diunduh ulang, hash
arsip cocok,30objek dipulihkan ke folder terpisah dan seluruh ukuran/SHA256 cocok.
Tidak mengubah sumber/objek produksi atau menyertakan database/Auth/runtime secret.
Rincian/batas: [cadangan dan pemulihan](BACKUP-DAN-PEMULIHAN.md).

Backup objek otomatis mingguan/retensi empat snapshot dan restore Supabase lengkap tetap
belum dipasang/diuji. Snapshot manual ini tidak menggantikan keduanya. Tidak mengubah repo
backup privat/workflow database, tidak memulaiHari28 atau meluluskan uji pengurus/checkpoint.
Deploy,QA produksi dan cleanup polesan menyusul pada penutupan bagian ini.

**Penutupan polesan/cadangan [2026-10-26 10:33 WIB]:** kode`9ea3fce`,checkSHACloudflare berhasil
10:29:54WIB.34/34HTTPkeduaorigin/no-store/gateway/301query/404/penandapolesanlolos.
Enamlebarproduksi360/375/768/1024/1235/1440tanpaoverflow,fototermuat,translate24pxhanya
1024keatas. Tinggi375normal4166px;modegerakanterbataslokal4330px. Tombolsetelahdigeser
berfungsi,konsol0error/warning. AuditLighthouseaksesibilitas/best-practices/SEO100,tanpawarning;
auditini tidak mengukurulangperforma,Q07tetapterbuka (pengukuranterakhir4,354detiksebelumpolesan).
93berkaspublik/4nilaiprivat0temuan. SkripcekHTTPawalmencariberkasQAyangtidakdisimpan,
dikoreksidenganmenjalankanpemeriksaanlangsung;hasilfinal34lolos,bukanerroraplikasi.

FolderDrive/ZIPprivat30objek sudahdibacaulangdanrestorehashcocok,sehinggacadanganobjek
manualoffsiteuntuksnapshotini selesai. Otomasimingguan/retensi4danrestoreSupabasepenuhtetap
belum. Preview/workerd/portuji/.dev.varssementara0,3tabQAditutup,emulasipulih,sesiasliutuh.
Dokumentasi rencana/cadangan diperbarui agar membedakan manual yang sudah ada dan otomasi
belum aktif. BuktirincidanIDDriveprivatdi `_qa-hero-tuning/2026-10-26/`;main/checkpointtetap.
