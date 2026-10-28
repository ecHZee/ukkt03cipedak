# Perpanjangan pra-launch dan persiapan Forbit 3.0

Dicatat 28 Oktober 2026 — Codex (GPT 6.1 Sol).

## Keputusan dan batas saat ini

Hanif meminta launching ditunda sampai dirinya dan tim siap. Hari 30 pada jadwal lama
tidak lagi menjadi tenggat launching. Tujuh pekerjaan tersisa pada review Hari 29 tetap
tercatat; persiapan kepemilikan tim, audit kapasitas, kriteria siap publikasi dan pengelolaan
setelah launch ditambahkan. Website sudah dapat diakses; pengumuman resmi dan serah terima
produksi tetap milestone tersendiri.

Forbit 3.0 (Forum Lab Digital Pemuda RW 03) direncanakan diresmikan pada pertemuan pertama.
Ini catatan persiapan, bukan pernyataan tim telah resmi terbentuk. Anggota, PIC, jadwal,
hak akun dan pembagian akhir belum ditetapkan. Tidak memberikan akses atau mengubah role.

Review bahan/tampilan dan pengujian BPH, Kabid serta Forbit dilaksanakan mendekati pertemuan
setelah tanggalnya jelas. Paket peserta difinalkan pada waktu itu; sekarang menyiapkan
kerangka dan pekerjaan teknis yang tidak bergantung peserta. Tidak memulai fitur Fase 5.

## Usulan urutan Hari 30–35

Nomor berikut adalah usulan paket pekerjaan, belum pelaksanaan atau jaminan selesai dalam
enam hari kalender. Suatu paket dapat memerlukan beberapa sesi. Persetujuan mengerjakan
tetap mengikuti arahan Hanif, terutama tindakan biaya, kredensial, akses dan produksi.

| Usulan | Fokus | Keluaran dan bukti selesai |
| --- | --- | --- |
| 30 | Kapasitas dan batas operasional | Inventaris pemakaian/kuota/cap aktual bertanggal untuk B2, Supabase, Cloudflare dan Drive; proyeksi pertumbuhan; rancangan uji terbatas serta titik berhenti. |
| 31 | Diagnosis dan perbaikan Q07 | Pengukuran setara sebelum/sesudah, perbaikan berdasarkan bottleneck, regresi fungsi/visual; target LCP ≤2,5 detik tetap, hasil gagal tetap dicatat. |
| 32 | Keamanan akses dan pemulihan | Rotasi key B2 bertahap ketika pemilik siap; bukti operasi key pengganti sebelum pencabutan lama; amati cron nyata; drill pemulihan sesuai target terisolasi yang disetujui. |
| 33 | Kesiapan kolaborasi Forbit | Usulan pembagian tanggung jawab/akses, panduan setup tanpa secret, alur issue→branch→PR→review→rilis, inventaris akun organisasi dan proses keluar anggota. |
| 34 | Pengelolaan sesudah publish | Panduan insiden/rollback, jadwal pemeriksaan manual, PIC utama/cadangan, alur konten dan perubahan fitur; target pemulihan/kehilangan data disepakati. |
| 35 | Versi calon uji pertemuan | Commit kandidat dibekukan, regresi relevan lulus, daftar risiko/hal belum diuji jelas, paket demo dan lingkungan latihan aman siap. |

Ketersediaan kredensial/target restore dapat mengubah urutan 31–34. Cron tidak dapat
diluluskan dengan memajukan waktu atau menggantinya dengan run manual. Nominal cron berikut
yang tercatat adalah 1 November 2026 pukul 01.00 WIB, dapat terlambat; verifikasi kejadian
aktual diperlukan. Hari 35 berarti siap dibawa ke pertemuan, bukan otomatis siap launch.

## Paket pertemuan saat tanggal sudah jelas

Usulan H-7 sampai H-3: tetapkan peserta/peran, lingkungan, versi uji, data latihan,
skenario wajib, pembaca hasil dan aturan pencatatan. H-2 sampai H-1: pilot oleh orang yang
belum mengembangkan alur tersebut, cek akun/perangkat dan rapikan instruksi. Rentang ini
fleksibel sesuai tanggal nyata, belum merupakan jadwal atau pengingat otomatis.

| Bentuk | Tujuan dan pelaku | Keluaran |
| --- | --- | --- |
| Black-box | Periksa masukan/tindakan dan hasil: isian kosong/sah, batas ukuran, perpindahan status, izin antarperan. Forbit menyiapkan dan mendampingi; BPH/Kabid mencoba sesuai haknya. | Langkah, hasil harapan/aktual, status, bukti, commit dan perangkat. |
| UAT | BPH/Kabid menilai apakah pekerjaan organisasi dapat diselesaikan dan fiturnya diterima. | Keputusan penerimaan per kebutuhan, kendala, permintaan revisi/pengurangan fitur. |
| Usability/SUS | Setelah mencoba tugas nyata, peserta mengisi SUS dan komentar tanpa diarahkan pengembang. | Skor dan sebaran, jumlah responden, versi bahasa/instrumen, peran dan batas sampel. |
| QA teknis | Pengelola teknis menguji kode, keamanan, pemulihan, performa, aksesibilitas dan kapasitas. | Hasil otomatis dan manual teknis; dipisahkan dari hasil peserta. |

UAT dan black-box saling melengkapi: UAT adalah penilaian penerimaan; black-box adalah
pendekatan perancangan pengujian, bukan dua sertifikat yang otomatis didapat dari satu rapat.
SUS berisi 10 pernyataan dengan jawaban 1–5 dan hasil 0–100; angka tersebut **bukan persentase
kelulusan** atau bukti keamanan. Jangan mengubah susunan/polaritas pertanyaan sembarangan.
Pada finalisasi pilih versi Bahasa Indonesia dengan rujukan/validasi yang jelas; jangan
mengklaim terjemahan spontan sebagai instrumen tervalidasi. Jawaban tidak lengkap dicatat
terpisah, tidak diisi agen. BPH/Kabid sebagai pengguna utama dianalisis terpisah dari
Forbit yang terlibat pengembangan; hindari menyamakan bias kedua kelompok. Target skor
proyek belum diputuskan dan bukan satu-satunya syarat launch.

Mulai dari 44 kasus di [skenario uji tim](SKENARIO-UJI-TIM.md), bukan membuat ulang semua.
Tambahkan/mapping kebutuhan yang kurang saat finalisasi. Gunakan [lembar hasil](LEMBAR-HASIL-UJI-TIM.md),
dan panduan [uji pengurus](UJI-COBA-PENGURUS.md). Catat keberhasilan tugas, bantuan yang
diterima, kebingungan, perangkat/jaringan, waktu sebagai observasi dan tingkat keparahan.
Satu kasus pada beberapa peran/perangkat tidak dihitung sebagai beberapa kebutuhan unik.

Tes yang menerbitkan/menghapus memakai lingkungan terisolasi atau bahan asli yang disetujui.
Jangan membuat peserta berlatih dengan dokumen privat asli, akun orang lain atau data rekaan
yang kemudian tampil publik. Nama/jawaban/screenshot peserta disimpan privat; tidak masuk
Git publik. Status hasil sekarang tetap Belum diuji. Pertemuan pertama belum menggantikan
pengamatan beberapa hari dan tiga hari terakhir tanpa kendala berat.

## Usulan pembagian kendali

| Bagian | Pelaksana yang diusulkan | Persetujuan/kendali |
| --- | --- | --- |
| Kebutuhan, prioritas, batas scope dan rilis | Hanif bersama perwakilan Forbit | Hanif sebagai pengarah proyek; penerimaan organisasi bersama BPH. Peran akhir disepakati pada pertemuan. |
| Keabsahan konten, izin foto/dokumen | Kabid untuk bidangnya, BPH untuk organisasi | BPH/pemilik bahan sesuai kewenangan. |
| Frontend/visual, backend, tes dan dokumentasi | Anggota Forbit sesuai minat/kemampuan, tiap pekerjaan punya PIC | Reviewer berbeda bila tersedia; Hanif atau maintainer yang ditunjuk menerima PR/rilis. |
| Infrastruktur, backup, keamanan dan insiden | PIC operasional utama + cadangan terlatih | Hanif/pengelola organisasi yang ditunjuk menyetujui akses, perubahan berisiko dan biaya. |
| Akun CMS | Sesuai jabatan/izin organisasi yang sudah ada | Super Admin mengelola akun; menjadi developer tidak otomatis menjadi BPH/Super Admin. |
| Kepemilikan akun cloud, recovery dan billing | Akun organisasi dengan dua pengelola yang ditetapkan | Awalnya tetap Hanif/pemilik; pemindahan/penambahan akses hanya sesudah persetujuan eksplisit. |

Tujuan akhirnya kolaborasi dengan cadangan pengelola, bukan semua keputusan teknis selamanya
tergantung Hanif. Bedakan akses GitHub, dashboard cloud, akun CMS dan key server. Masing-masing
menggunakan akun sendiri, hak sesuai tugas, MFA bila didukung, tanpa membagikan password utama
atau service-role key lewat grup. Rahasia disimpan pada fasilitas privat yang disetujui.

Kontribusi kode: ambil issue→branch kerja→perubahan kecil→tes→PR→review→merge terotorisasi.
Saat ini merge/push ke `revisi` memicu deploy, sehingga akses merge berbeda dari hak menulis
branch kontribusi. Audit ketersediaan branch protection/approval dan lingkungan preview sebelum
diterapkan; aturan tersebut belum dianggap terpasang. `main` tetap menunggu checkpoint.
Tetapkan prosedur pencabutan akses saat anggota keluar serta dokumentasi onboarding/offboarding.

## Audit kapasitas storage

Jawaban "mampu berapa GB" harus mencakup empat hal berbeda: kuota paket, cap akun yang nyata,
batas per file aplikasi, dan kemampuan alur unggah/unduh saat volume bertambah.

| Layanan | Yang dihitung dan diperiksa |
| --- | --- |
| Supabase | Ukuran database terpisah dari Storage PDF/foto profil; egress, penggunaan bersama proyek dalam organisasi, limit file dan izin bucket. |
| B2 | Media website, thumbnail, versi lama, unfinished upload, kuota gratis/cap akun, transaksi dan unduhan. |
| Cloudflare | Limit Worker/Pages, request, CPU, ukuran request dan cache; bukan dianggap tambahan kapasitas penyimpanan media permanen. |
| Drive | Kuota aktual akun/organisasi, master arsip terpisah dari snapshot website, ZIP sementara dan empat snapshot berhasil yang dipertahankan. |

Rujukan publik 28 Oktober: Supabase Free mencantumkan database 500 MB per proyek, Storage 1 GB
dan egress 5 GB; B2 menyebut 10 GB storage pertama gratis. Ini bukan pembacaan dashboard akun
saat ini dan bukan janji kapasitas gabungan 11 GB; jatah masing-masing tidak saling menggantikan.
Cap akun Katar dapat lebih ketat. Kuota Drive tidak diasumsikan 15 GB; harus dibaca pada akun
yang benar. Kapasitas Drive bukan alasan mengunggah semua master ke B2.

Keluaran audit: angka aktual bertanggal, batas yang berlaku, ruang tersisa, proyeksi 3/6/12
bulan dan tindakan jika ambang terlewati. Gunakan sampel ukuran foto **termasuk thumbnail**,
PDF/video/versi dan pertumbuhan bulanan; nyatakan asumsi, jangan memasarkan perkiraan sebagai
jumlah foto yang sudah dibuktikan. Retensi empat backup membutuhkan ruang empat snapshot
ditambah satu kandidat sebelum snapshot tertua dipindahkan setelah verifikasi; beri margin.

Rancangan uji: kasus file valid/tidak valid/batas, batch kecil→batch realistis yang disetujui,
jeda/retry, gagal kuota, pembersihan dan akses privat. Dekati kondisi kuota penuh melalui
fixture/mock atau lingkungan terisolasi terlebih dahulu. Tidak memenuhi produksi dengan GB
dummy atau menjalankan beban tanpa batas. Tetapkan plafon byte/request/durasi/biaya dan titik
berhenti sebelum uji nyata; anggaran awal Rp0 tetap. Bandingkan data asli sebelum/sesudah,
hapus hanya fixture milik run dan verifikasi tidak ada residu. Uji beban penyedia cloud
mengikuti aturan penyedia; tidak menganggap stress test bebas dijalankan.

Usulan ambang pemakaian awal: 70% peringatan, 85% rencana tindakan, 95% batasi unggahan baru
secara terkontrol. Ini usulan SOP, belum konfigurasi/fitur yang aktif. Saat penuh, tolak
unggahan baru dengan jelas; data lama dan pembatasan akses harus tetap terjaga.

## Kapan dinyatakan siap?

**Siap pertemuan/uji:** versi kandidat dapat dipakai, akun sesuai peran, data latihan aman,
fitur/risiko tercatat dan instruksi tersedia. Label ini tidak menyatakan siap launch.

**Siap launch:** usulan daftar persetujuan berikut harus direview Hanif/BPH/Forbit:

1. Scope rilis, PIC dan versi/commit yang dirilis jelas; bahan resmi/izin cukup untuk scope itu.
2. Seluruh skenario wajib sesuai peran telah dicoba dan lulus; yang tidak berlaku diberi alasan.
   Tidak ada kebocoran, kehilangan data, atau kendala kritis/berat yang belum selesai.
3. Perbaikan dicoba ulang dan tiga hari terakhir pengamatan peserta tanpa kendala berat.
4. Target performa Q07, HP fisik, upload massal dan preview WA dibuktikan. Risiko yang belum
   ditutup tidak disembunyikan; perubahan kriteria memerlukan keputusan eksplisit, bukan nilai SUS.
5. Hak akses/key tepat, tidak ada rahasia pada bundle/repo publik; rollback/backup/pemulihan
   terbukti untuk lingkup yang disepakati. Cron manual tidak dilabeli cron terjadwal.
6. Kapasitas dan margin operasional cukup menurut proyeksi yang disetujui, cap/biaya jelas.
7. Minimal dua pengelola terlatih ditetapkan, akses/panduan privat diserahkan; operasional punya PIC.
8. Checkpoint dan keputusan go/no-go dicatat oleh pengambil keputusan; agen tidak menyetujui
   launching sendiri. Temuan sedang/ringan punya PIC, target dan penerimaan risiko yang tertulis.

Belum ada status lulus baru dari dokumen ini. Pemulihan layanan penuh tetap butuh target
terisolasi yang disetujui; jangan menguji restore dengan menimpa produksi.

## Sesudah publish

| Waktu | Pekerjaan dan penanggung jawab yang perlu ditetapkan |
| --- | --- |
| 0–14 hari | Masa pendampingan: PIC operasional memeriksa akses web, error, login/unggah, laporan pengguna dan status backup; pengembang memperbaiki bug lalu reviewer menguji ulang. |
| Mingguan | PIC konten memeriksa kebenaran/jadwal konten; PIC operasional memeriksa cron, hasil backup, kuota, pertumbuhan dan laporan masalah. |
| Bulanan | Review akses anggota, perubahan dependensi/keamanan, statistik penggunaan yang relevan dan prioritas backlog oleh tim. |
| Berkala/setelah perubahan besar | Drill pemulihan terisolasi, cek panduan/recovery dan kesiapan PIC cadangan; frekuensi ditetapkan tim. |
| Insiden | Catat dampak→hentikan tindakan berisiko→hubungi PIC→rollback/pulihkan bila perlu→verifikasi→laporkan sebab/tindak lanjut. |

Tentukan toleransi kehilangan data (RPO), waktu pemulihan (RTO), jam kontak dan eskalasi.
Jadwal backup mingguan tidak menjanjikan pemulihan kehilangan nol data; keberhasilan dan
cadangan terakhir menentukan batas nyata. Usulkan backup terverifikasi sebelum perubahan
penting. Tidak menjanjikan dukungan 24/7 tanpa PIC dan kesepakatan.

Permintaan fitur baru masuk backlog→review manfaat/biaya→prioritas→branch/PR→QA→rilis terjadwal.
Fase 5 tidak otomatis dimulai saat web diumumkan. Tidak membuat automasi/pengingat dari SOP ini;
pemasangan monitor dan akses dilakukan sebagai pekerjaan tersendiri sesudah disetujui.

## Rujukan dan dokumen terkait

- [Review Hari 29](HARI-29-REVIEW.md): bukti terakhir dan tujuh pekerjaan terbuka.
- [ISTQB Acceptance Testing](https://istqb.org/wp-content/uploads/2024/11/ISTQB-CT-AcT_Syllabus_v1.0_2019.pdf): penerimaan dan teknik pengujian.
- [GitLab Handbook — SUS](https://handbook.gitlab.com/handbook/product/ux/performance-indicators/system-usability-scale/): instrumen dan interpretasi skor; bukan target normatif Katar.
- [Supabase — billing/quota](https://supabase.com/docs/guides/platform/billing-on-supabase).
- [Backblaze — pricing](https://www.backblaze.com/cloud-storage/pricing).

Angka penyedia diperiksa pada 28 Oktober 2026, dapat berubah; audit akun aktual masih menjadi
pekerjaan berikutnya. Dokumen ini mencatat keputusan penundaan dan rancangan; tidak mengubah
kode, akun, akses, billing, database atau konfigurasi produksi.
