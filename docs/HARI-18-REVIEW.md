# Hari 18 — CMS berita dan remediasi audit

19 Oktober 2026, Codex (GPT-6.1 Sol), branch `revisi`, baseline `8f07ceb`.
**Status akhir: selesai dan online. Kode fitur `477f51c`, produksi serta cleanup terverifikasi 19 Oktober 2026.**

## Hasil

- Halaman berita admin memakai data privat sesuai JWT/RLS, bukan daftar publik semua status.
  Anggota berizin hanya draf/review sendiri di bidangnya, Kabid jangkauannya, BPH/Super Admin semua.
- Form judul/slug otomatis, bidang, ringkasan, teks paragraf, pinned, sampul terkompres dan caption.
  Pratinjau menggunakan renderer publik yang sama; HTML tampil sebagai teks, tanpa WYSIWYG berat.
- Draf → review → Setujui/Tolak → terbit → sunting → tarik kembali; hapus hanya draf/review,
  dengan konfirmasi. Versi suntingan mencegah penimpaan. Gambar berita tetap di pustaka saat berita
  dihapus agar penggunaan oleh konten lain tidak rusak; ini berbeda dari pencabutan izin foto profil.
- Berita dan metadata sampul disimpan satu transaksi SQL **security invoker**, tetap lewat RLS.
  Pembuat/penerbit ditetapkan trigger. Unggahan foto tetap melalui `src/services/storage.ts`;
  unggahan thumbnail gagal membersihkan foto utama, dan kegagalan simpan memeriksa metadata sebelum cleanup.
- Antrean ringkasan sekarang memuat berita dan kegiatan sesuai peran, dengan tautan ke form yang benar.
- Q01: akun nonaktif tidak dapat insert/update/delete foto profil sendiri walaupun JWT masih berlaku.
- Q02: pilihan **A** disetujui Hanif: hapus objek lama sebelum mengganti/mencabut foto. Ada penjagaan
  database terhadap pelepasan referensi sebelum penghapusan; service menolak foto baru yang belum ada.
  Foto profil baru memakai cache 0. **Salinan/cache lama yang sudah diunduh tidak bisa ditarik kembali**;
  bucket tetap publik, bukan arsitektur foto privat. Tidak memproses foto orang asli untuk tes.
- Q03: reset memasang wajib ganti sebelum mengubah Auth, memulihkan flag jika Auth gagal. Gagal ban
  tetap menutup akses DB, mencatat keadaan parsial dan memberi pesan yang akurat. Error audit diperiksa;
  password yang sudah berlaku tetap ditampilkan sekali dengan peringatan jika hanya audit gagal.
  Pesan kegagalan rollback username juga diperjelas.
- Q04: kegagalan query profil/jaringan mengembalikan tombol login dan pesan; halaman error punya
  retry yang memuat ulang pemeriksaan. Gangguan jaringan tidak dianggap password salah atau logout.
- Q05: berita/kegiatan memakai penjaga route dan Back dengan dialog aplikasi; handler beforeunload
  terpasang, logout memeriksa isian sebelum mengubah sesi. Simpan sukses melewati penjagaan.
- Q09: instal ulang dari `bun.lock` frozen, `packageManager: bun@1.4.3`; **70/70 paket langsung cocok**.
  Start 1.167.50, Router 1.168.25, Vite 8.0.16, tanpa mengubah versi lock. `.inputValidator` tetap dipakai.

## Bukti lokal

| Pemeriksaan | Hasil |
| --- | --- |
| TypeScript, eslint, build | Exit 0; lint 0 error/7 warning fast-refresh bawaan. |
| Seluruh otomatis | **206/206**: DB 88, kegiatan unit 12/service-RLS 20, konten 16, galeri 8, organisasi 8, publik 14, berita unit 7/service-RLS-foto 26, ketahanan akun 7. |
| RPC HTTP localhost | **17/17**; membaca envelope Seroval dan error TanStack, bukan menganggap HTTP 200 berarti berhasil. Akun anonim/pembaca/nonaktif/anggota/Kabid lintas bidang ditolak sesuai kasus. Publikasi, penarikan, penghapusan draf dan cabut foto benar. |
| UI nyata | Anggota menulis + memilih sampul logo uji + preview + ajukan; Kabid bidang lain tidak melihat usulan; Kabid yang benar melihat antrean, menolak, mengajukan ulang dan menyetujui; BPH menyunting terbit lalu menarik. Pembaca tanpa izin tidak punya tombol tulis. |
| Data publik saat uji UI | Berita yang diterbitkan dari UI ditemukan pada 6 SSR: beranda/daftar/detail × Pages/Worker. Setelah ditarik, detail 404 pada kedua origin. Aplikasi publik saat pemeriksaan ini masih versi sebelum push Hari 18; ini bukti aliran data, belum bukti deployment kode Hari 18. |
| Foto profil | Unggah logo uji lewat UI, cabut lewat RPC HTTP, URL objek yang sama berubah 200 → bukan 200; reload UI kembali tanpa foto. Ganti foto dan penolakan RPC pelepasan referensi diuji suite DB. |
| Ketahanan | Validasi kosong; sidebar dan Back menampilkan dialog, batal menjaga isian, tinggalkan bekerja. Beforeunload diperiksa dengan event sintetis yang dicegah, bukan klaim menutup tab fisik. Pemutusan query profil menghasilkan pesan/tombol aktif; retry pulih tanpa menghapus sesi. |
| Layout | **70 kombinasi** / 14 keadaan × 360/768/1024/1440/1920 px, tinggi 900; lebar aktual dicatat, overflow 0. |
| Aksesibilitas | **16 axe** / 8 keadaan × 360 dan 1440, 0 pelanggaran WCAG otomatis dan 0 kontrol kecil pada sampel terukur. Beberapa replay memakai reduced-motion agar animasi tab latar tidak menahan pemeriksaan. Fokus preview kembali ke pemicu setelah animasi selesai. |
| Konsol | Replay normal sebelum injeksi gangguan: 0 error. Error pemeriksaan profil saat jaringan sengaja diblokir dipisahkan dari hasil normal. |

Data uji UI memakai tujuh akun sementara dan satu pengurus pada periode tidak aktif; akun/sesi asli
Hanif tidak dipakai. Tidak melakukan reset password asli ataupun mengetik credential asli di browser.
Injeksi gagal akun memakai service sumber yang ditranspilasi dan mock terisolasi, bukan memaksa
kegagalan pada akun produksi. Foto uji berupa logo organisasi/gambar sintetis, bukan foto orang.

## Produksi dan penutupan

- Commit fitur `477f51c` di-push ke `origin/revisi`; fungsi server baru dari build frozen berhasil
  dipanggil di produksi, bukan hanya penanda teks lama. RPC anonim awal saat build masih berjalan
  belum tersedia; pengujian dimulai setelah fungsi baru aktif.
- **34/34 RPC produksi**: Pages 17 dan Worker 17. Membaca error Seroval/TanStack dan memastikan
  keadaan data, termasuk tolak tamu/pembaca/nonaktif, lintas bidang, review/approve, metadata penerbit,
  larangan hapus terbit, tarik/draf/hapus, simpan foto dan cabut foto yang menghapus objek lama.
  Semua respons privat memakai no-store. Total RPC localhost + produksi **51/51**.
- Berita uji bersampul logo dari UI diterbitkan ulang melalui RPC BPH setelah deploy. Browser publik
  **15 kombinasi** (beranda/daftar/detail × 360/768/1024/1440/1920) menampilkan judul yang benar,
  tanpa overflow; sampul lengkap dan HTML literal di detail, konsol 0 error/0 warning. Screenshot
  `artikel-produksi.png` dan `pratinjau-berita.png` tersimpan di lampiran lokal. Tidak login browser
  produksi; browser admin menggunakan akun uji localhost saja.
- Admin anonim mengarah ke `/login?ke=%2Fadmin` dan formulir login tampil. HTTP `/admin` sendiri
  adalah shell 200 dengan pengalihan client; tidak keliru mengklaim redirect HTTP 307.
- Setelah penarikan dan cleanup, **40/40 pemeriksaan HTTP/aset/header** di Pages + Worker:
  24 shell/route valid 200, 8 detail hilang termasuk berita uji 404, 2 LPJ 301 mempertahankan bidang,
  6 aset 200/immutable. HTML dinamis no-store, Pages memiliki `X-Katar-Gateway: pages-v1`.
  Beranda tidak lagi mengandung judul UJI H18.
- **12 migrasi lokal/remote cocok**. Scan **80 berkas** publik build: 0 nilai rahasia aktual dan
  0 implementasi server yang diperiksa. `.env.local`/CSV/kredensial tidak masuk Git.
- Hapus 7 akun/profil uji, 1 pengurus/periode inaktif uji, berita/media, dua berkas sampul tersisa
  serta audit milik fixture; baca ulang membuktikan **0 sisa**. Foto RPC sudah dihapus tiap pengujian.
  Berkas kredensial uji dihapus. Jumlah kembali baseline: Auth/profiles 62, pengurus 61,
  kegiatan 8, berita 6, bidang 7 dan satu periode aktif. Konten 8/6 tersebut tetap dummy lama.
- Tidak ada listener uji 5173/8080/8090/8788 atau workerd tersisa. Tab QA milik sesi ditutup,
  emulasi dipulihkan, tab pengguna dipertahankan. Tiga skrip sementara dihapus pada penutupan.
  Main lokal `4bd423c` dan origin/main `82487f5` tetap; tidak menggabungkan checkpoint.

## Migrasi dan koreksi selama pengerjaan

- Dua migrasi: `20261019010000_perkuat_media_profil.sql` dan `20261019011000_simpan_berita_atomik.sql`.
  Tipe Supabase digenerasi ulang. Tidak mengubah periode/nama/konten asli.
- Kesalahan alat: `npm run db -- db push --dry-run` kehilangan flag sehingga dua migrasi langsung
  terpasang lebih awal. Ini masih dalam lingkup implementasi yang disetujui, tanpa penghapusan data asli.
  Ulang melalui `node scripts/supabase.mjs db push --dry-run` menunjukkan remote sudah sesuai.
  Panduan wrapper lokal diperbaiki agar kejadian tidak berulang; token global pribadi tidak diubah.
- Uji awal konflik versi menerima pesan generik, sehingga ditambahkan pemeriksaan versi sebelum RPC;
  penjagaan transaksi SQL tetap ada. Regex path sampul diperjelas dan tes ulang lolos.
- Retry error boundary awal hanya mereset tampilan, belum mengulang beforeLoad; diperbaiki menjadi
  pemeriksaan ulang melalui reload dan dibuktikan lewat injeksi gagal/pemulihan UI.
- Dialog native pada replay navigasi tidak memberi hasil alat yang andal; penjagaan route dan keputusan
  review diganti dialog aplikasi yang dapat diperiksa serta dioperasikan lewat keyboard.
- Penyelarasan formatter dengan lock memerlukan format satu union di `src/domains/program/data.ts`;
  isi datanya tetap. Tipe hasil generator dan skrip uji diformat sebelum lint final.

## Batas dan langkah berikutnya

- Hari 19 belum dimulai: album massal, B2 presigned upload/Worker-cache tetap rencana berikutnya.
  Application Key B2 belum dibuat/dipasang dalam Hari 18. Crop foto profil tetap Hari 20.
- Q06/Q07/Q08 dari audit tetap terbuka: tinggi beranda, LCP konsisten <2,5 dan metadata tiga halaman.
  Tidak mengulang benchmark LCP atau mengklaim seluruh Hari 1–18 lulus penuh.
- Preview WhatsApp nyata, HP fisik, pembaca layar, naskah resmi BPH, restore drill dan Checkpoint 3
  tetap membutuhkan penerimaan terpisah. Tidak merge `main`.
- Sampul berita/draf memakai Storage publik yang sudah ada; bukan tempat dokumen rahasia. Foto berita
  yang dilepas tetap di pustaka, sedangkan foto profil dicabut melalui proses penghapusan objek.
- Gangguan proses tepat setelah upload/sebelum save (misalnya tab ditutup paksa) masih bisa memerlukan
  pembersihan berkas sementara. Cleanup otomatis lintas sesi/pustaka dibahas pada pekerjaan Storage,
  tidak mengklaim transaksi SQL juga membuat upload berkas menjadi transaksi lintas layanan.

Bukti JSON/log/screenshot berada di lampiran lokal `katar-hari18-20261019` di luar repo publik.
Hari 18 ditutup setelah produksi dan cleanup; Hari 19 tetap menunggu sesi berikutnya.
