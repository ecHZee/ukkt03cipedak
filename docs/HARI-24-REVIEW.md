# Hari 24 — Kurasi foto kegiatan, gelombang pertama

20 Oktober 2026. **Bahan kurasi awal tersedia dan menunggu konteks/pilihan Hanif. Hari 24 masih berjalan.**
Tidak ada perubahan aplikasi, build, push, deploy, penghapusan dummy atau pengisian konten produksi.

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
| Hasil pilihan | **14 kandidat**: 3 kebersamaan, 3 rapat, 5 sosial dan 3 olahraga bersyarat. Sembilan kandidat utama diringkas pada satu lembar; ada empat lembar per kelompok serta Markdown/HTML privat |

File privat di folder saudara repo `_kurasi-hari24/2026-10-20/` meliputi indeks sumber/kode tetap,
metadata Drive, hasil integritas/kemiripan, `PILIHAN-FOTO.md`, `PILIHAN-FOTO.html`, JSON pilihan,
dan lembar kontak. HTML menyematkan thumbnail, tanpa pelacakan atau dependensi jaringan;
tautan asli di Drive memakai izin yang sudah ada. Tidak ada foto, manifest rinci atau izin pribadi di repo publik.

## Yang masih harus dikonfirmasi

Pertanyaan sudah dikirim per kelompok dengan lembar sembilan foto agar Hanif dapat mengenali acaranya:

1. Nama kegiatan, tanggal/lokasi foto bersama dan nama kelompok kecilnya. Metadata kamera hanya petunjuk.
2. Judul, tanggal/lokasi dan pembahasan rapat. Rapat konsolidasi dipisahkan dari rapat anggaran/koordinasi.
3. Waktu, tempat, penyelenggara/peran Katar dan apakah foto sosial siang/malam satu rangkaian.

Jam kamera banyak foto sosial menunjukkan 2012; tidak digunakan sebagai tanggal acara. Nama file
WhatsApp juga bukan bukti tanggal kejadian. Kandidat berspanduk/kotak donasi perlu pemeriksaan
kontak/QR lama sebelum tayang; foto olahraga menunggu konteks peserta/izin. Izin penggunaan foto
dan sumber/pemotret seluruh kandidat masih belum dikonfirmasi. Tidak ada kandidat berstatus disetujui.

Beberapa folder Drive yang lebih baru terdeteksi tetapi isinya belum ditinjau. Tidak mengklaim semua
arsip Drive sudah dikurasi. RESES, Futsal Anak-anak, takziah dan potret individu tidak dimasukkan
kandidat launching awal. Kebutuhan beranda harus menyesuaikan acara yang nyata; foto sosial
tidak diberi judul kerja bakti dan pemotretan tidak otomatis disebut pengukuhan.

## Verifikasi dan batas tahap

Artefak, kode foto, tautan sumber dan integritas lokal diperiksa tanpa mengubah sumber. Pemeriksaan
aplikasi/build/database/produksi tidak diulang karena tidak ada kode atau data aplikasi berubah dan
Hanif meminta build ditahan. Tidak menjalankan dev server, migrasi, unggah B2/Supabase/Drive,
perubahan izin berbagi, atau penghapusan dummy. Commit dokumentasi lokal tidak didorong ke remote,
sehingga tidak memicu build otomatis. Main tetap.

Tahap pengisian, pemasangan foto pada bagian pengenalan yang masih memakai placeholder, caption
final, berita/album terbit dan QA produksi menunggu persetujuan bahan serta arahan melanjutkan.
Uji anggota/Checkpoint 3/4 tetap terpisah. [Rencana tahap Hari 24](HARI-24-RENCANA.md).
