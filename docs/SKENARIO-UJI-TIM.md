# Skenario uji internal tim website

Versi awal 26 Oktober 2026, menunggu pembahasan tim. **Seluruh kasus peserta berstatus Belum
diuji** sampai orang yang ditugaskan benar-benar mencoba dan mencatat hasil. Simulasi agen,
tes otomatis dan hasil peserta disimpan sebagai bukti yang berbeda.

Tujuan pengujian: memastikan fitur saat ini dapat dipakai untuk pekerjaan Katar, izin tiap
peran sesuai, serta tampilan dan petunjuk dipahami. Tidak perlu membaca kode untuk mencoba.
UAT adalah penilaian penerimaan oleh pengurus; black-box adalah cara merancang uji dari
masukan/tindakan dan hasil yang terlihat. Cara menjalankannya dapat manual atau otomatis.

## Persiapan bersama Hanif

1. Tetapkan versi uji: tanggal, commit/build, alamat website, peserta/peran dan pemeriksa.
   Jadwal pertemuan dan nama tim belum ditentukan. Jangan mencatat password dalam lembar uji.
2. Pastikan akun aktif dan sesuai peran. Pemilik mengganti password awal sendiri. Kasus
   kelola akun memakai akun uji yang disiapkan pengelola, bukan akun anggota lain.
3. Siapkan satu foto berizin, satu PDF latihan tanpa data pribadi dan teks latihan. Catat
   tujuan/dampak sebelum menguji. Bahan yang belum diizinkan tetap ditahan.
4. Pada website online, latihan diberi judul **LATIHAN — jangan diterbitkan**, tetap draf/
   pengajuan, lalu dibersihkan oleh pemeriksa. Uji menerbitkan/menarik konten hanya pada
   lingkungan terisolasi atau memakai bahan asli yang telah disetujui untuk tayang.
5. Siapkan HP dan laptop yang tersedia. Catat model, browser, lebar layar bila diketahui,
   jaringan dan bantuan yang diterima. Emulasi layar pengembang tidak menggantikan HP fisik.
6. Salin [lembar hasil](LEMBAR-HASIL-UJI-TIM.md) ke catatan privat tim. Jangan mengisi hasil
   peserta atau menempelkan screenshot akun/dokumen pribadi di repositori publik.

**Hentikan langkah berisiko** bila data asli berubah keliru, latihan tampil publik, data
terbatas terlihat oleh pihak lain, atau proses simpan belum jelas selesai. Catat bukti
tanpa rahasia dan hubungi Hanif; jangan mengulang submit berkali-kali.

## Daftar kasus

Kolom Peran adalah orang yang mencoba, bukan izin untuk memakai akun milik orang lain.
Kode F menghubungkan kasus dengan [inventaris fitur](INVENTARIS-FITUR-WEBSITE.md).

| ID / fitur      | Peran dan prasyarat                              | Langkah yang dicoba                                                                | Berhasil kalau                                                                 |
| --------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| PUB01 / F01     | Pengunjung, belum login                          | Buka beranda; baca judul; pilih Lihat Kegiatan; kembali                            | Halaman terbuka, tujuan benar dan kembali dapat dilakukan                      |
| PUB02 / F02     | Pengunjung                                       | Buka Tentang dan Pengurus; cari satu nama; buka detail; tutup                      | Nama/jabatan/bidang/periode terbaca; foto mengikuti izin; dialog dapat ditutup |
| PUB03 / F02     | Pengunjung                                       | Buka Program; pilih satu bidang; kembali                                           | Isi bidang dan pengurus yang tampil sesuai pilihan                             |
| PUB04 / F03     | Pengunjung                                       | Buka Kegiatan; ubah filter; kosongkan kembali                                      | Hasil mengikuti filter; bila belum ada kegiatan terbit, kondisi kosong jelas   |
| PUB05 / F04     | Pengunjung, ada berita terbit                    | Buka daftar berita lalu judul; kembali ke daftar                                   | Isi dan sampul sesuai; judul mengarah ke detail yang benar                     |
| PUB06 / F05     | Pengunjung, ada album terbit                     | Filter galeri; buka album; buka foto besar; berikutnya; tutup                      | Album/foto sesuai; kontrol bekerja dan kembali ke posisi masuk akal            |
| PUB07 / F07     | Pengunjung                                       | Buka Kontak; periksa tujuan WhatsApp/Instagram/lokasi                              | Tujuan kontak sesuai organisasi; tidak perlu mengirim pesan latihan            |
| PUB08 / F01–F07 | Pengunjung, HP                                   | Buka menu, pindah halaman, tutup menu; coba Lainnya                                | Menu tidak hilang/menutupi kontrol penting; semua tujuan bisa ditemukan        |
| AKN01 / F08     | Pemilik akun aktif, password dari pengelola      | Masuk dengan username sendiri                                                      | Masuk ke ruang pengurus dengan nama dan peran yang benar                       |
| AKN02 / F08     | Akun uji login pertama                           | Coba password baru terlalu pendek, lalu dua isian berbeda                          | Ditolak dengan petunjuk yang dipahami; isian tidak dianggap berhasil           |
| AKN03 / F08     | Pemilik akun login pertama                       | Buat password sah, simpan, keluar dan masuk lagi                                   | Password pribadi bekerja; permintaan ganti awal tidak berulang                 |
| AKN04 / F08     | Akun uji, atas arahan pengelola                  | Coba password salah satu kali; lalu yang benar                                     | Pesan gagal tidak membocorkan akun; percobaan benar tetap bisa masuk           |
| AKN05 / F08/F10 | Akun uji nonaktif                                | Coba masuk                                                                         | Ditolak; akun pengurus asli tidak dinonaktifkan untuk latihan                  |
| PRO01 / F08     | Anggota, data latihan privat                     | Ubah profil sendiri, simpan, buka kembali                                          | Perubahan sendiri tersimpan; data anggota lain tidak ikut berubah              |
| PRO02 / F08     | Akun uji tertaut pengurus, foto berizin          | Pilih foto, atur potongan/pratinjau, simpan dengan izin tampil                     | Potongan sesuai dan foto publik mengikuti persetujuan                          |
| PRO03 / F08     | Akun uji dari PRO02                              | Cabut izin foto, simpan, periksa tampilan publik                                   | Foto tidak tampil lagi; penghapusan berkas lama diperiksa pengelola            |
| BRT01 / F04     | Anggota berizin                                  | Buka Tulis berita; simpan tanpa judul/isi wajib                                    | Tidak tersimpan dan letak masalah ditunjukkan                                  |
| BRT02 / F04     | Anggota berizin, teks latihan                    | Isi judul/ringkasan/dua paragraf; buka pratinjau; tutup                            | Isi terbaca sesuai dan fokus kembali; pratinjau belum menerbitkan              |
| BRT03 / F04     | Anggota berizin                                  | Simpan draf latihan; cari di daftar; buka dan sunting                              | Draf dapat ditemukan lagi; perubahannya tersimpan                              |
| BRT04 / F04     | Anggota tanpa izin kontribusi                    | Buka menu dan alamat form yang diberikan pengelola                                 | Tidak dapat membuat/menerbitkan berita di luar izin                            |
| BRT05 / F04     | Anggota berizin + Kabid/BPH                      | Anggota ajukan review; pemeriksa temukan lalu simpan kembali sebagai draf          | Status berpindah sesuai tindakan dan penulis melihat hasil pemeriksaan         |
| BRT06 / F04     | Pemeriksa, bahan tayang sah/lingkungan uji       | Periksa isi, terbitkan; pengunjung membuka hasil; tarik sesuai rencana             | Hanya peran yang berhak menerbitkan; keadaan publik mengikuti status           |
| KGT01 / F03     | Anggota/Kabid berizin                            | Isi kegiatan latihan tanpa mengarang jadwal; simpan draf                           | Draf tersimpan; tanggal yang belum diketahui dapat tetap kosong sesuai form    |
| KGT02 / F03     | Pengelola bidang                                 | Coba tanggal/akhir kegiatan yang tidak masuk akal                                  | Form memberi penolakan yang dapat dimengerti                                   |
| KGT03 / F03     | Kabid A, fixture bidang lain disiapkan pengelola | Buka kegiatan uji di luar jangkauannya                                             | Tidak dapat menyunting/menerbitkan kegiatan bidang lain                        |
| GAL01 / F05     | Anggota/Kabid berizin, foto berizin              | Buat album draf; unggah beberapa foto; isi caption; periksa hasil                  | Antrean selesai, jumlah sesuai dan foto dapat dipratinjau                      |
| GAL02 / F05     | Pengelola, salinan foto yang sama                | Pilih ulang foto yang sama pada album uji                                          | Aplikasi tidak membuat duplikat tanpa pemberitahuan                            |
| GAL03 / F05     | Pengelola, album latihan                         | Jeda unggahan; lanjutkan; uji putus-sambung singkat atas arahan pengelola          | Status dipahami; pemulihan tidak menggandakan media; hasil akhir diperiksa     |
| GAL04 / F05     | Pengelola, latihan sendiri                       | Batalkan/buang unggahan latihan; pilih Bersihkan bila tersedia                     | Antrean/berkas latihan dibersihkan; foto asli tetap utuh                       |
| DOK01 / F06     | Pengelola berizin, PDF latihan                   | Unggah PDF sebagai draf; buka pratinjau/unduhan sesuai izin                        | Isi PDF sesuai dan data draf tersimpan                                         |
| DOK02 / F06     | Pengelola                                        | Coba berkas selain PDF dan berkas melewati batas yang ditampilkan                  | Ditolak sebelum dinyatakan berhasil; alasannya jelas                           |
| DOK03 / F06     | BPH + anggota/pengunjung, fixture privat         | Buka dokumen BPH dengan masing-masing peran melalui alamat yang disiapkan          | BPH dapat membaca; peran lain ditolak, bukan sekadar tombol disembunyikan      |
| DOK04 / F06     | Pengunjung, PDF publik yang sah                  | Buka Arsip, filter, unduh dokumen publik                                           | Yang terbaca hanya dokumen berakses publik dan terbit                          |
| ADM01 / F09     | Kabid + anggota uji bidangnya                    | Beri izin kontribusi, coba menulis, cabut, coba lagi                               | Kemampuan mengikuti izin; Kabid tidak mengubah izin bidang lain                |
| ADM02 / F09     | BPH, pengurus uji                                | Tambah/sunting data pengurus uji; periksa jabatan/peran yang mengikuti             | Data sesuai dan perubahan akses tidak memberi kewenangan berlebih              |
| ADM03 / F10     | Super Admin, akun uji                            | Cari/filter akun; periksa username, peran dan status                               | Hasil cocok; BPH/Kabid tidak mendapat akses halaman pengelolaan akun           |
| ADM04 / F10     | Pemilik/pengelola berhak, akun uji               | Ganti username/reset password sementara/aktif-nonaktif sesuai rencana              | Perubahan login/status bekerja, tercatat dan data akun asli tidak tersentuh    |
| ADM05 / F11/F12 | BPH/Super Admin, bahan yang disetujui            | Buka Pengaturan dan Log; periksa pratinjau; jika disepakati simpan lalu tinjau log | Konten sesuai keputusan; pembatalan tidak mengubah data; Kabid/anggota ditolak |
| VIS01 / F01–F12 | Semua peran, HP/laptop                           | Buka halaman tugas; perbesar teks; periksa judul, tombol, gambar dan tabel         | Tidak ada geser seluruh halaman ke samping atau kontrol penting terpotong      |
| VIS02 / F01–F12 | Pengguna keyboard                                | Pakai Tab, Enter dan Escape pada menu/pratinjau/dialog                             | Fokus terlihat, urutan masuk akal dan kembali ke pemicu setelah ditutup        |
| VIS03 / F03–F06 | Pengunjung/pengelola                             | Coba pencarian tanpa hasil, daftar kosong dan alamat konten hilang                 | Pesan jelas, dapat kembali; tidak menampilkan data rekaan                      |
| VIS04 / F01/F05 | Pengunjung, atas arahan pengelola                | Coba koneksi lambat/gambar gagal; muat ulang setelah pulih                         | Teks/navigasi tetap berguna; fallback tidak mengunci halaman                   |
| OPS01 / F13     | Hanif/pengelola teknis                           | Cocokkan run SQL→berkas, waktu, izin folder dan hasil hash                         | Hasil aktual tercatat; jadwal yang belum terjadi tidak diberi status lulus     |
| OPS02 / F13     | Hanif/pengelola teknis, tujuan terisolasi        | Ikuti panduan pemulihan dan cocokkan hasil                                         | Bukti hanya untuk lingkup yang benar-benar pulih; tidak menimpa produksi       |

## Pilihan data yang mewakili masalah

Untuk isian wajib, coba kosong dan terisi sah. Untuk batas ukuran, coba tepat di batas yang
ditampilkan dan sedikit di atasnya memakai berkas uji yang disiapkan pengelola. Untuk alur
status, coba Draf→Menunggu persetujuan→Draf, serta Terbit hanya dengan bahan sah. Untuk hak
akses, bandingkan peran yang berhak dan yang tidak pada data uji yang sama.
Tes otomatis/server oleh pengembang melengkapi hal yang tidak terlihat dari tombol UI.

## Penilaian dan keputusan

Gunakan status **Belum diuji / Lulus / Gagal / Terhalang / Tidak berlaku**. Terhalang harus
punya alasan dan penanggung jawab; tidak dianggap Lulus. Pisahkan temuan bug, kebingungan
pengguna, dan usulan perubahan fitur. Bila tester perlu dibimbing, catat bantuannya.

Usulan kriteria penerimaan untuk disepakati tim: semua kasus wajib sesuai peran telah
dijalankan; tidak ada masalah keamanan/kehilangan data atau tugas pokok yang belum selesai;
perbaikan dicoba ulang; risiko tersisa diterima secara tertulis oleh pengambil keputusan.
Target uji beberapa hari dan tiga hari terakhir tanpa kendala berat pada
[panduan pengurus](UJI-COBA-PENGURUS.md) tetap belum terpenuhi sebelum pengamatan manusia.

Rancangan ini mengadaptasi analisis/desain uji, pelacakan kebutuhan, partisi masukan, batas,
perpindahan status dan penerimaan pada [ISTQB CTFL v4.0.1](https://istqb.org/wp-content/uploads/2024/11/ISTQB_CTFL_Syllabus_v4.0.1.pdf).
Pemeriksaan hak akses lintas peran/data merujuk [OWASP WSTG](https://owasp.github.io/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/05-Authorization_Testing/02-Testing_for_Bypassing_Authorization_Schema).
Ini panduan proyek yang dapat direview, bukan sertifikat kepatuhan terhadap seluruh standar.
