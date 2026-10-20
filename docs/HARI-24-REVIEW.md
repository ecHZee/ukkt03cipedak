# Hari 24 — Kurasi foto kegiatan, gelombang pertama

20 Oktober 2026. **Bahan kurasi tersedia; konteks sebagian foto dan izin tayang delapan foto sudah dikonfirmasi Hanif. Pilihan olahraga juga diarahkan Hanif. Tanggal yang belum pasti, pemeriksaan bahan dan pengisian website masih menunggu. Hari 24 masih berjalan.**
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
Sumber/pemotret dan caption final dilengkapi sesuai bahan yang tersedia. Seluruh foto tetap belum
diunggah atau diterbitkan; persetujuan izin delapan foto dibedakan dari kesiapan publikasi.

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
