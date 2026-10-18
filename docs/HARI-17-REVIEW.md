# Review Hari 17 — Ringkasan dan kegiatan

18 Oktober 2026. Disetujui Hanif, dikerjakan di `revisi` dari c9f4217.
Status: selesai dan online di https://ukkt03cipedak.pages.dev. Kode fitur 60842ec, koreksi cache dcefec3.

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
| TypeScript / ESLint / build                       | tsc/build exit 0; lint 0 error/7 warning bawaan                                                                                |
| Regresi DB/RLS lama                               | 83/83                                                                                                                          |
| Validasi, WIB, izin UI, pemindaian Storage        | 12/12                                                                                                                          |
| Service asli + Supabase/RLS, tujuh akun sementara | 20/20, pembersihan dibuktikan                                                                                                  |
| Regresi publik                                    | 46/46: konten 16, galeri 8, organisasi 8, publik/proxy/Worker 14                                                               |
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
matriks, axe, log build/lint/tes, RPC). File kredensial fixture sementara sudah dihapus; artefak bukti tidak memuat password/token.

## Batas dan review Hanif

- UI admin diuji menggunakan akun sementara di localhost. Produksi diuji lewat HTTP/RPC
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

## Temuan produksi dan koreksi cache

Kode fitur 60842ec terpasang; 12 RPC Pages awal lolos. Pada origin Worker, hak akses juga benar,
tetapi respons HTML/RPC langsung tidak memiliki no-store (Pages memasangnya sendiri). Lapisan
respons server kini memasang private/no-store pada seluruh respons dinamis, termasuk error dan
redirect. Aset tetap ditangani Cloudflare Assets. Empat regresi tambahan menjaga body streaming,
cookie, status redirect dan Vary. tsc/build serta lint 0 error/7 warning lolos kembali; 90 berkas
bundle publik tidak memuat kunci aktual atau implementasi service server. Koreksi dcefec3 sudah online dan lolos pemeriksaan kedua origin.

## Produksi dan pembersihan

| Pemeriksaan produksi         | Hasil                                                                                                                            |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| HTTP/aset/header/penanda     | 50/50 di Pages + Worker: 34 route valid 200, 6 slug hilang 404, 2 redirect LPJ 301, 2 penanda bundle, 6 aset immutable           |
| RPC terdeserialisasi         | 28/28: Pages 15 dan Worker 13; anonim/peran tak berhak/nonaktif/metadata palsu/tanggal terbalik ditolak, data target tetap benar |
| Publikasi setelah deployment | Terbit melalui Pages ditemukan dalam 6 SSR beranda/agenda/detail di dua origin; kartu rutin bertanggal tepat sekali di beranda   |
| Penarikan                    | Simpan draf melalui Pages membuat detail 404 pada kedua origin (2 pemeriksaan); ringkasan/isi tidak bocor                        |
| Penyimpanan                  | BPH membaca total aktual di dua origin; anggota/Kabid ditolak; tidak ada nama/path privat pada respons                           |
| Cache                        | Respons dinamis kedua origin no-store, termasuk kegagalan RPC; aset tetap immutable; Pages memiliki X-Katar-Gateway: pages-v1    |
| Browser produksi publik      | 15/15: beranda/agenda/detail × lima lebar yang sama, tanpa overflow; filter Inventaris dan navigasi berhasil; console 0 error    |
| Pembersihan                  | 7 akun Auth + 7 profil + 2 kegiatan serta audit uji dihapus; pembacaan ulang membuktikan sisa 0. File kredensial dihapus         |
| Setelah pembersihan          | 6/6: beranda/agenda kedua origin 200 tanpa judul uji, detail fixture 404                                                         |

Total tes otomatis sumber/service/database: **161/161** (83 + 12 + 20 + 46); RPC/HTTP/browser
merupakan bukti terpisah di atas. Skrip uji sementara dihapus; Vite/port 5173/8080/8090/8788 dan
workerd tidak tersisa. Sesi browser uji lokal telah logout, tab uji ditutup, emulasi dipulihkan.
Tidak ada merge main, migrasi, perubahan akun asli, secret, layanan B2 atau dashboard Cloudflare.

Berikutnya: Hari 18, editor berita ringan dengan pratinjau dan alur setujui/tolak menurut bidang.
Belum dimulai. Temuan LCP Hari 16 dan Checkpoint 3 tetap menunggu penanganan/review terpisah.
