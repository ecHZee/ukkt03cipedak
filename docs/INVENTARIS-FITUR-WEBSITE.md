# Fitur website yang dibawa ke pertemuan tim

Dicatat26Oktober2026 untuk persiapan pertemuan; tanggal dan susunan tim belum ditentukan.
Daftar ini menjelaskan fitur yang sudah dibangun. Keputusan mempertahankan, mengurangi,
atau mengembangkan fitur berikutnya dibahas bersama tim. Hasil QA teknis tidak otomatis
berarti fitur sudah diterima pengurus.

| Kode | Bagian                     | Yang dapat dilakukan sekarang                                                                              | Catatan untuk dibahas                                                                               |
| ---- | -------------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| F01  | Beranda                    | Mengenal organisasi, membuka kabar/galeri, menghubungi sekretariat melalui WhatsApp                        | Kecepatan foto utama masih perlu ditingkatkan; bagian tanpa data disembunyikan                      |
| F02  | Tentang dan Program        | Membaca profil, bidang kerja, susunan pengurus dan detail anggota yang diizinkan                           | Naskah sejarah/visi/misi dan potret perlu mengikuti bahan resmi/izin                                |
| F03  | Kegiatan                   | Membaca kegiatan terbit; pengurus menyimpan draf, mengajukan, menyunting dan menerbitkan sesuai peran      | Empat catatan awal masih draf karena jadwal belum pasti; jangan mengarang tanggal                   |
| F04  | Berita                     | Menulis judul/ringkasan/isi, memasang sampul, pratinjau, draf, pengajuan dan persetujuan                   | Anggota berizin mengajukan; Kabid/BPH memeriksa sesuai jangkauan                                    |
| F05  | Galeri                     | Membuat album, unggah banyak foto/video, caption, sampul, filter, foto besar dan tautan arsip sumber Drive | Tautan Drive tidak otomatis mengimpor foto; izin foto tetap diperiksa                               |
| F06  | Arsip                      | Mengunggah PDF dan mengatur akses publik, anggota atau BPH                                                 | Belum ada dokumen asli terisi saat audit; kemampuan diuji memakai fixture privat                    |
| F07  | Kontak                     | Membuka kontak resmi, WhatsApp, Instagram dan lokasi yang telah diisi                                      | Tombol Gabung/Usul mengarahkan ke WhatsApp; keputusan tindak lanjut oleh pengurus                   |
| F08  | Login dan Profil Saya      | Masuk dengan username, ganti password awal, ubah profil dan foto dengan izin tampil                        | Lupa password ditangani Super Admin; email reset otomatis/SMTP belum diaktifkan                     |
| F09  | Pengurus                   | BPH mengelola data/jabatan; Kabid mengatur izin kontribusi anggota bidangnya                               | Peran mengikuti jabatan; nomor/email pribadi tidak dipublikasikan                                   |
| F10  | Akun                       | Super Admin mencari akun, mengganti username, reset password sementara, aktif/nonaktif                     | Password dibagikan secara pribadi; reset asli dilakukan pemilik/pengelola yang berhak               |
| F11  | Pengaturan                 | BPH/Super Admin mengelola kontak, tampilan yang tersedia dan pengumuman                                    | Perubahan langsung berdampak pada website; gunakan bahan yang disetujui                             |
| F12  | Ringkasan, Log dan Bantuan | Melihat tugas/draf sesuai peran, petunjuk pekerjaan dan jejak perubahan sesuai akses                       | Angka penyimpanan pada Ringkasan hanya Supabase; B2 diperiksa terpisah                              |
| F13  | Operasional                | Hosting Pages→Worker, analytics, ping, SQL dan backup berkas privat setelah SQL                            | Backup objek diuji nyata; cron pertama setelah aktivasi dan restore Supabase penuh belum dibuktikan |

## Pembagian akses untuk mencoba

| Peran                         | Lingkup                                                                     |
| ----------------------------- | --------------------------------------------------------------------------- |
| Pengunjung                    | Halaman publik dan konten terbit sesuai akses; tidak mengelola website      |
| Anggota tanpa izin kontribusi | Profil sendiri, Bantuan dan informasi yang diizinkan                        |
| Anggota berizin               | Membuat/menyunting draf miliknya dalam bidangnya dan mengajukan pemeriksaan |
| Kepala Bidang                 | Mengelola konten dan izin kontribusi dalam jangkauan bidangnya              |
| BPH                           | Mengelola lintas bidang, pengurus, pengaturan dan log yang diizinkan        |
| Super Admin                   | Kewenangan BPH ditambah pengelolaan akun                                    |

Audit akun Hari 29: 62 Auth/profil aktif, 61 pengurus, 1 Super Admin/15 admin/46 anggota.
Jabatan, bidang dan pemetaan username cocok; 61 akun wajib mengganti password saat pertama
masuk. Ini audit struktur, bukan bukti pembagian password atau keberhasilan login semua orang.
Daftar akun/password dan bukti berisi data pribadi disimpan privat oleh pengelola.

## Bahan keputusan pertemuan

Untuk setiap kode fitur, tim dapat memilih: **pertahankan**, **perlu diperbaiki**, **tunda**,
atau **usulkan dikurangi**. Catat alasan, siapa pengguna utamanya, dan dampaknya pada tugas
pengurus. Pilihan ini belum mengubah website sampai disepakati dan diterapkan terpisah.

Gunakan [skenario uji tim](SKENARIO-UJI-TIM.md), [lembar hasil](LEMBAR-HASIL-UJI-TIM.md),
dan [panduan pengurus](PANDUAN-PENGURUS.md). Panduan uji beberapa hari yang sudah ada tetap
berlaku: [UJI-COBA-PENGURUS.md](UJI-COBA-PENGURUS.md).
