# Review Hari 17 — Ringkasan dan kegiatan

18 Oktober 2026. Disetujui Hanif, dikerjakan di `revisi` dari c9f4217.
Status: implementasi dan QA lokal selesai; verifikasi deployment menyusul setelah push.

## Hasil

- Ringkasan menggantikan dashboard maket: hitungan draf/review/terbit dan antrean kegiatan dalam
  jangkauan akun. Pengajuan didahulukan; agenda publik dan akses cepat mengikuti peran.
- Form nyata: judul, slug otomatis/bisa disunting, ringkasan, detail paragraf, bidang, periode,
  mulai/selesai WIB, lokasi, jadwal rutin teks dan tahap rencana/berjalan/selesai/batal.
- Simpan draf, ajukan persetujuan, terbitkan, sunting terbit dan tarik ke draf. Tahap berbeda dari
  status publikasi. Anggota berizin hanya draf/review sendiri; Kabid bidangnya + umum buatannya;
  BPH/Super Admin lintas bidang. RLS tetap berlaku pada klien JWT, tanpa service role untuk CRUD.
- Validasi bersama browser/server, penolakan slug duplikat, penguncian tombol/isian saat menyimpan,
  versi updated_at mencegah penimpaan suntingan lama. Metadata pembuat/penyetuju dikunci trigger.
- BPH/Super Admin dapat meminta total berkas/byte aktual dari tiga bucket Supabase. Semua halaman
  dan subfolder dipindai; hanya angka dan waktu pemeriksaan dikirim. Gagal/batas 200 permintaan
  menghasilkan keadaan tidak tersedia, bukan angka parsial. B2 belum terhubung; tidak ada grafik
  kuota rekaan. Pada pemeriksaan lokal saat ini, Storage memang mengembalikan 0 berkas/0 MB.
- Kegiatan rutin yang juga bertanggal tidak lagi terduplikasi dalam pilihan beranda.

## Bukti sebelum deployment

| Pemeriksaan                                       | Hasil                                                                                                                          |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| TypeScript / ESLint / build                       | tsc/build exit 0; lint 0 error/7 warning bawaan                                                                                                |
| Regresi DB/RLS lama                               | 83/83                                                                                                                          |
| Validasi, WIB, izin UI, pemindaian Storage        | 12/12                                                                                                                          |
| Service asli + Supabase/RLS, tujuh akun sementara | 20/20, pembersihan dibuktikan                                                                                                  |
| Regresi publik                                    | 42/42: konten 16, galeri 8, organisasi 8, publik/proxy 10                                                                      |
| RPC localhost                                     | 12/12; error envelope dideserialisasi, baris target tetap benar                                                                |
| Layout                                            | 15/15: ringkasan/daftar/form × 360/390/768/1024/1440 px, tanpa overflow                                                        |
| axe WCAG A/AA                                     | 6/6 tanpa pelanggaran, tiga tampilan × 390/1440 px setelah transisi selesai                                                    |
| Target/fokus                                      | Target tampak ≥44 px pada ringkasan/form; validasi memfokus isian; Tab judul→slug, Escape dialog→pemicu; kurangi animasi aktif |
| Browser peran                                     | BPH, anggota berizin, Kabid bidang lain, pembaca tanpa izin                                                                    |

Browser membuktikan buat/sunting draf → review → antrean ringkasan → terbit → tarik ke draf.
Tanggal 19 Okt 2026 19.30–21.00 WIB terbaca DB sebagai 12.30–14.00 UTC. Kegiatan uji terbit
muncul dalam SSR beranda/agenda/detail lokal serta Pages, kemudian ditarik kembali. Anggota
mengajukan kegiatan rutin tanpa tanggal; Kabid lain tidak menerima kedua draf tersebut. Pembaca
via URL langsung mendapat penjelasan izin, tanpa form. Sesi asli Hanif tidak dipakai/dikeluarkan.

Temuan uji yang diperbaiki: input datetime native bisa kembali kosong pada render berikutnya;
penanganan input diselaraskan dan rentang terbalik kini ditolak di browser, lalu hasil WIB dibaca
ulang dari DB. Fokus dialog tanpa Trigger dipulihkan eksplisit. Lint sempat menemukan format helper
fixture; diperbaiki sebelum commit. Audit kontras pertama saat transisi halaman diulang setelah
animasi selesai; hasil final bersih. Console browser final 0 error.

Artefak lokal di luar repo: `~/.codex/attachments/katar-hari17-20261018/` (screenshot desktop/HP,
matriks, axe, log build/lint/tes, RPC). File kredensial fixture bersifat sementara dan wajib dihapus.

## Batas dan review Hanif

- UI admin diuji menggunakan akun sementara di localhost. Produksi akan diuji lewat HTTP/RPC
  autentik terpisah dan browser publik; belum merupakan uji login akun asli Hanif di produksi.
- Tidak ada migrasi/RLS/dependensi/dashboard Cloudflare yang diubah. B2 dan upload/crop menunggu
  tahapnya; editor berita + penolakan beralasan Hari 18. Tidak menambah hapus kegiatan pada UI;
  gunakan tarik ke draf untuk menarik publikasi.
- Konfirmasi kehilangan perubahan berlaku pada tombol Kembali ke daftar. Berpindah lewat sidebar
  atau menutup tab belum memiliki penjaga isian. Slug terbit bisa diubah dengan peringatan tautan
  lama menjadi tidak berlaku; belum ada redirect histori slug.
- Ringkasan antrean baru khusus kegiatan; modul berita/album/dokumen dilanjutkan pada harinya.
- Hari 16: median LCP final 2,741 detik masih di atas target <2,5; Checkpoint 3 menunggu Hanif/Ketua.
  `origin/main` tetap 82487f5, cabang main lokal tetap 4bd423c. Hari 18 belum dimulai.

## Produksi dan pembersihan

Menunggu push `revisi` dan pemeriksaan Pages + Worker. Jangan menyebut sudah online sebelum
penanda bundle, respons RPC, cache privat, SSR publik serta pembersihan fixture diperiksa.
