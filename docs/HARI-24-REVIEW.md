# Hari 24 — Konten asli dari hasil kurasi

20 Oktober 2026. **Hari 24 selesai untuk pengisian awal dan sudah online.**
Arahan terbaru Hanif “lanjutkan aja selesaikan hari 24” mencabut penahanan build/push/publikasi awal.
Empat album, sebelas foto, dua berita faktual dan empat foto beranda sudah tersimpan/terbit;
empat catatan kegiatan tetap draf karena waktu kejadian belum diketahui. Tidak mengisi tanggal rekaan.

## Implementasi dan pengisian

- Beranda memakai foto pilihan asli pada empat tempat hero dan bagian pengenalan. Foto kelompok
  ditampilkan utuh; pratinjau album membuka album yang tepat, dan berita memakai foto sampul asli.
- Layanan sampul menerima path gateway B2 yang sesuai pola, tetap menolak staging/path berbahaya.
  Tidak mengubah autentikasi, RLS, migrasi, dependensi, atau lockfile.
- Album awal: pemotretan anggota inti (3 foto), rapat konsolidasi RT se-RW 03 (3), galang dana
  peduli Sumatera (2), serta dokumentasi sepak bola/futsal dari beberapa sesi (3). Tidak menyatakan
  olahraga sebagai satu acara, turnamen, atau pertandingan internal yang belum dikonfirmasi.
- Dua berita pendek hanya memakai fakta yang dibenarkan Hanif: pemotretan anggota inti dan
  dokumentasi rapat di Sadar Coffe. Tanggal terbit berita adalah tanggal publikasi sekarang,
  bukan tanggal pelaksanaan acara lama. Tanggal album dikosongkan.
- WebP utama maksimal 1920 piksel + thumbnail 480 piksel; 11 pasang berkas berjumlah 2.713.394 byte.
  Metadata foto dibuang pada hasil web; arsip sumber/Drive tetap utuh dan tidak diubah izin baginya.
  Unggah memakai alur server/RPC aplikasi, staging B2, pemeriksaan isi/ukuran dan penyelesaian,
  dengan atribusi Super Admin; tidak membuat akun atau mengambil sesi login Hanif.
- Setelah pengganti terbit dan berkas cocok SHA256, **14 data contoh** (8 kegiatan + 6 berita)
  dihapus berdasarkan `is_dummy=true`; snapshot sebelum pengisian tersimpan privat. Sisa dummy
  pada lima tabel konten **0**. Empat kegiatan asli tetap draf dan tersembunyi dari sitemap/publik.
- Foto profil individu dan PDF tidak termasuk pengisian ini. Arsip publik belum berisi dokumen;
  tidak mengklaim seluruh kebutuhan konten organisasi atau launching sudah tuntas.

## Bukti QA lokal

| Lapisan | Hasil |
| --- | --- |
| Unit/regresi sumber | 127/127, termasuk sampul gateway B2 dan sampul daftar berita |
| DB/RLS/integrasi | 246/246: 164 inti + 20 kegiatan + 26 berita/foto + 17 arsip/pengurus + 19 pengaturan |
| Statis/build | tsc/build exit 0; ESLint 0 error, 7 warning bawaan |
| Bundle publik | 93 berkas, empat nilai privat diperiksa, 0 kecocokan |
| HTTP lokal Worker | 108/108: route/canonical/no-store, 14 URL dummy 404, 11 GET foto cocok SHA256 + 11 HEAD, sitemap 22 URL, gateway/guard/redirect |
| Browser lokal | 45 kombinasi (9 halaman × 360/768/1024/1440/1920), tanpa overflow/gambar rusak; konsol akhir bersih |
| Interaksi lokal | Buka album lewat beranda, navigasi foto berikutnya, Escape dan fokus kembali ke pembuka pada 360 px |
| Data akhir | 62 Auth/profil, 61 pengurus tetap; 4 album terbit, 11 foto album + 2 sampul berita, 2 berita terbit, 4 kegiatan draf, dokumen 0, antrean aset 0 |

Sebelas reservasi galeri berstatus selesai dipertahankan sebagai bukti kepemilikan media yang sah,
bukan fixture. Hanya `situs.tampilan` berubah; kontak/logo/11 pengaturan lain tetap.
Receipt, snapshot, hasil uji dan manifest rinci berada di folder privat saudara repo,
`_kurasi-hari24/2026-10-20/penerapan/`, tidak dimasukkan Git publik.

Kesalahan alat yang sudah ditangani: satu perintah Node awal kurang flag strip-types lalu diulang
benar; build sempat `EBUSY` karena preview Windows memegang output lalu dihentikan sebelum build.
Screenshot emulasi IAB sempat mengecil/terpotong akibat skala tampilan; ukuran DOM dan interaksi
nyata diperiksa, tidak menyimpulkan bug layout hanya dari artefak tangkapan itu.

## Produksi dan penutupan

Kode `9724982` lalu koreksi `1ae5b8d` sudah didorong ke `revisi`. Build Cloudflare koreksi
`b185899a-9d8b-44a6-b8d9-650f61cb893f` Ready (49 detik), Worker versi `332a1870` aktif.
Pages **123/123** dan Worker **108/108** pemeriksaan HTTP lolos setelah koreksi; sitemap
**22 URL** tanpa dummy/draf. Sebelas thumbnail diuji HEAD lebih dahulu (semuanya MISS/200),
lalu GET byte-identik; **11/11** lolos.

Browser produksi **45/45** kombinasi sembilan halaman × lima lebar lolos tanpa overflow/gambar
rusak. Filter olahraga menjadi satu album dan filter OKK menjadi satu berita, buka detail dari
beranda, next foto/ Escape/fokus kembali lolos; konsol akhir 0 error/warning. Screenshot produksi
normal tersimpan privat setelah viewport dipulihkan. Akun/profil/pengurus dan kontak/logo tetap;
tidak ada fixture baru dari importer. Server/preview/workerd berhenti, port uji 5173/8788/8090
kosong, `.dev.vars` tidak tersisa, tab QA ditutup; tab/sesi asli Hanif dipertahankan.

Bukti uji ini menutup pekerjaan teknis dan pengisian gelombang pertama Hari24. Q06/Q07, HP fisik, metrik provider, preview WhatsApp,
latihan restore, uji mandiri anggota dan Checkpoint 3/4 tetap terpisah; main tidak diubah.

## Riwayat kurasi sebelum pengisian

Catatan berikut menjelaskan tahap awal saat build masih ditahan; status sekarang mengikuti
bagian implementasi/verifikasi di atas.

## Hasil sesi

| Bagian | Bukti |
| --- | --- |
| Inventaris sumber | Master lokal masih tersedia di luar repo: **2.798 berkas / 36.192.774.655 byte**; tidak perlu mengunduh ulang seluruh Drive |
| Pilihan lama | Lembar kontak 37 foto pilihan lama dibaca ulang sebagai petunjuk, bukan persetujuan tayang |
| Pemeriksaan baru | **326 foto**: 87 kebersamaan/pemotretan, 29 dari beberapa rapat, 176 galang dana, 34 olahraga. Dimensi, orientasi, petunjuk ketajaman/kecerahan dan dHash dicatat privat; 0 gagal dibaca |
| Visual | Sepuluh lembar kontak seluruh 326 foto ditinjau; kandidat dipilih secara editorial. Momen, komposisi dan variasi lebih penting daripada skor teknis tunggal |
| Integritas lokal | SHA256 seluruh 326 file cocok dengan receipt lokal 19 Oktober; sumber tetap utuh |
| Pencocokan cloud | Seluruh 326 file cocok **nama dan ukuran** dengan metadata Drive organisasi yang dibaca sesi ini; pagination sumber yang dipakai dituntaskan. Ini bukan hash baru isi cloud |
| Kemiripan | 30 pasangan sangat mirip menurut dHash dicatat sebagai petunjuk; tidak disebut 30 duplikat identik dan tidak ada penghapusan |
| Pilihan awal | **14 kandidat**: 3 kebersamaan, 3 rapat, 5 sosial dan 3 olahraga bersyarat. Sembilan kandidat utama diringkas pada satu lembar; setelah tanggapan Hanif satu foto dipisahkan, lihat pembaruan di bawah |

File privat di folder saudara repo `_kurasi-hari24/2026-10-20/` meliputi indeks sumber/kode tetap,
metadata Drive, hasil integritas/kemiripan, `PILIHAN-FOTO.md`, `PILIHAN-FOTO.html`, JSON pilihan,
dan lembar kontak. HTML menyematkan thumbnail, tanpa pelacakan atau dependensi jaringan;
tautan asli di Drive memakai izin yang sudah ada. Tidak ada foto, manifest rinci atau izin pribadi di repo publik.

## Konfirmasi konteks dan yang masih belum diketahui

Hanif menjelaskan konteks sesudah melihat lembar pilihan. Catatan rinci dan identifikasi orang
disimpan privat, tidak dimasukkan data aplikasi atau diterbitkan:

1. Kelompok A adalah **sesi pemotretan anggota inti**. Sebagian besar pemakai PDH putih pada foto bersama adalah BPH/Kepala Bidang. Kelompok kecil berisi tujuh BPH; nama/jabatan/posisi diberi langsung oleh Hanif, bukan hasil identifikasi wajah otomatis. Tidak disebut seluruh BPH lengkap. Tanggal/tempat resmi belum dikonfirmasi.
2. Kelompok B dibenarkan sebagai rapat konsolidasi Katar RT se-RW 03, tempat dikonfirmasi Hanif. Tanggal dan pembahasan belum diketahui. Nama file WhatsApp 1 April 2026 bertentangan dengan watermark 25 Oktober 2025; tidak memilih salah satunya sebagai tanggal pasti.
3. Konteks dua foto aksi galang dana dibenarkan. **Foto bersama malam dikeluarkan dari usulan album galang dana** karena Hanif belum mengetahui acaranya; tetap disimpan sebagai perlu konfirmasi dengan kode lama yang sama. Tanggal/lokasi/peran penyelenggara masih belum diketahui.

Pemeriksaan EXIF termasuk IFD asli, XMP dan IPTC pada sembilan file utama selesai. DateTimeOriginal
foto kecil A adalah **27 Desember 2025 23:34**, foto bersama A **28 Desember 00:27–00:28**;
tanggal edit bukan waktu pemotretan. Ini petunjuk kemungkinan sesi melewati tengah malam, bukan
tanggal resmi yang disahkan. Ketiga foto B tidak memiliki metadata pengambilan tanggal/lokasi.
Foto sosial yang diperiksa hanya memiliki waktu kamera 1 Januari 2012; tag GPS hanya nomor versi.
**Tidak ada koordinat GPS atau isian lokasi IPTC/XMP yang dapat digunakan pada sembilan file.**
Lokasi sosial tidak ditetapkan dari papan/spanduk atau waktu salinan berkas.

Pilihan terbaru tetap 14 bahan review: **13 kandidat + satu foto ditahan karena konteks belum dikenal**.
Lembar versi kedua dan HTML memisahkan foto tersebut dari kelompok sosial.

**Pembaruan olahraga:** Hanif menyetujui tiga foto D sebagai calon dokumentasi bidang olahraga.
Foto lapangan rumput malam kemungkinan Fun Football; dua foto dalam ruangan disebut futsal.
Detail internal/sparring/turnamen, tanggal, lokasi dan peserta tidak diketahui sehingga tidak
ditambahkan ke judul/caption sebagai fakta. Ketiga foto tidak otomatis digabung sebagai satu acara.

**Pembaruan izin:** Hanif secara eksplisit mengonfirmasi izin pemilik foto dan subjek untuk
delapan kode A83/A85/A29/B24/B13/B15/C16/C80 tampil di website publik. Status per foto sudah
dicatat privat; izin tidak diperluas ke foto C lain atau foto olahraga. Arahan memasukkan D sebagai
pilihan kategori dicatat terpisah dari status izin pemilik/subjek. Izin tayang tidak menjalankan
upload, build atau publikasi, dan tidak menetapkan tanggal acara yang masih belum pasti.

Jam kamera banyak foto sosial menunjukkan 2012; tidak digunakan sebagai tanggal acara. Nama file
WhatsApp juga bukan bukti tanggal kejadian. Kandidat berspanduk/kotak donasi perlu pemeriksaan
kontak/QR lama sebelum tayang; foto olahraga masih memiliki rincian peserta/izin yang belum diketahui.
Sumber/pemotret dan caption final dilengkapi sesuai bahan yang tersedia. Pada tahap kurasi foto belum diunggah; persetujuan izin delapan foto dibedakan dari arahan
pengisian berikutnya. Sebelas foto yang dipasang dirinci pada bagian implementasi di atas.

Beberapa folder Drive yang lebih baru terdeteksi tetapi isinya belum ditinjau. Tidak mengklaim semua
arsip Drive sudah dikurasi. RESES, Futsal Anak-anak, takziah dan potret individu tidak dimasukkan
kandidat launching awal. Kebutuhan beranda harus menyesuaikan acara yang nyata; foto sosial
tidak diberi judul kerja bakti dan pemotretan tidak otomatis disebut pengukuhan.

## Batas bukti kurasi

Integritas lokal dan pencocokan nama/ukuran Drive dibuktikan pada tahap kurasi. Tidak mengklaim
hash isi cloud baru, semua arsip Drive telah dikurasi, atau izin foto lain telah dikonfirmasi.
Tahap pengisian kemudian dilanjutkan atas arahan Hanif, dengan hasil pada bagian atas review ini.
Uji anggota/Checkpoint 3/4 tetap terpisah. [Rencana Hari 24](HARI-24-RENCANA.md).


## Koreksi yang ditemukan pada produksi

Pages semula 123/123 dan 45 layout lolos. Pada Worker, beberapa HEAD foto menghasilkan 404
meskipun GET byte-identik dan HEAD langsung B2 empat foto 200. Dugaan cache perantara sesuai
[perilaku HEAD Cloudflare](https://developers.cloudflare.com/cache/concepts/cache-behavior/):
HEAD cache dingin dapat dikirim sebagai GET, bermasalah untuk permintaan bertanda tangan.
Bacaan B2 diberi `cache: no-store` agar melewati cache fetch; Cache API milik gateway tetap
berfungsi setelah pengecekan izin album. Regresi baru memeriksa metode/Range/cache bypass,
sehingga total kini **373 tes (127 unit + 246 DB)**. Sesudah deploy, kedua origin lolos dan sebelas thumbnail cold HEAD (MISS) juga 200,
lalu GET cocok SHA256. Gejala awal dan receipt tetap disimpan, tidak disembunyikan oleh retry.
Tidak mengklaim log upstream B2 produksi sebelum perbaikan sebagai bukti yang telah direkam.
