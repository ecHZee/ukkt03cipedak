# Hari 12 — Detail kegiatan dan berita

18 Oktober 2026 WIB. Implementasi dan verifikasi lokal selesai; Hanif mengizinkan alur Hari 12 sampai push
ke revisi lewat pesan "akses penuh". Hasil cek produksi setelah push dilaporkan pada chat penutup.
Tidak ada perubahan database, akun, migrasi, layanan, atau dependensi. Belum mulai Hari 13.

## Yang berubah

- `/kegiatan/$slug` dan `/berita/$slug` membaca konten terbit, isi, bidang, dan cover dari skema yang sudah ada.
- Daftar dipindah ke `kegiatan.index.tsx`/`berita.index.tsx`; induknya hanya Outlet sehingga detail tidak menampilkan daftar atau navbar ganda.
- Kartu beranda dan daftar menautkan detail. Kartu agenda bersama memiliki tanggal besar, lokasi, status, dan warna bidang.
- Ringkasan dan isi tampil sebagai teks React yang di-escape, tanpa mengeksekusi HTML dari database. Isi kosong memakai ringkasan; tidak mengarang artikel.
- Bagikan ke WhatsApp selalu tersedia. Tombol native Bagikan hanya muncul bila browser mendukung; batal berbagi tidak menampilkan error, kegagalan memberi fallback WA.
- Calendar memakai timestamp UTC + zona Asia/Jakarta. Acara tanpa tanggal dan acara batal tidak diberi tombol. Selesai kosong memakai satu jam sementara dengan keterangan ke pengguna, tanpa mengubah DB. Tidak menebak acara seharian dari jam 00:00 karena skema belum punya penandanya.
- Metadata judul/deskripsi/canonical/OG/Twitter tersaji SSR dengan URL absolut dari VITE_SITE_URL. Cover foto dipakai bila tersedia, fallback logo resmi 512 px.

## Cara review lokal

Dari root repo:

```powershell
npm run dev
```

Bila terminal Windows menghilangkan argumen saat memakai `npm run dev -- ...`, jalankan Vite langsung:

```powershell
node node_modules/vite/bin/vite.js dev --port 5173 --host 127.0.0.1
```

Buka `http://localhost:5173`, lalu:

1. Klik kartu kegiatan atau berita dari beranda; cocokkan judul dan isi dengan kartu.
2. Dari daftar Kegiatan, pilih filter Berjalan lalu buka Latihan Rutin Futsal: jadwal rutin ada, tombol Calendar tidak ada.
3. Buka `/kegiatan/rapat-konsolidasi-antar-bidang`: Calendar memuat 10 Oktober 2026 pukul 19.30–22.00 WIB.
4. Buka `/kegiatan/aktivasi-media-sosial`: Calendar memuat 24 Oktober 2026 pukul 10.00–11.00 WIB, dengan keterangan durasi sementara.
5. Buka `/berita/pengukuhan-pengurus-2025-2028`, coba Semua berita, lalu masuk kembali dan refresh.
6. Slug sembarang yang tidak ada harus menampilkan 404 berbahasa Indonesia.

Slug di atas berasal dari konten dummy yang sudah ada saat pengujian; tidak di-seed ulang pada sesi ini.
Tautan share lokal memang memakai localhost sesuai VITE_SITE_URL lokal. Preview WA publik baru dapat dicek sesudah deploy dengan VITE_SITE_URL produksi.

## Bukti yang dijalankan

| Lapisan               | Hasil                                                                                                                                                                                                                                                           |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tsc --noEmit`        | Exit 0 setelah routeTree selesai diregenerasi.                                                                                                                                                                                                                  |
| `eslint .`            | 0 error, 7 warning bawaan fast-refresh.                                                                                                                                                                                                                         |
| `npm run build`       | Exit 0, target Cloudflare dihasilkan. Warning bawaan directive/deprecation tetap ada.                                                                                                                                                                           |
| `npm run test:konten` | 15/15 lolos: encoding WA, zona waktu/lintas hari, fallback durasi, tanggal invalid/batal/rutin, service asli dengan transport Supabase terisolasi (filter terbit, draft/review tertutup, error jaringan berbeda dari tidak ditemukan, cover nonfoto diabaikan). |
| HTTP lokal            | 13 URL valid = 200; 2 slug tidak ada = 404. Empat detail berisi satu h1 dan metadata OG pada HTML mentah.                                                                                                                                                       |
| Browser               | 360/375/1440 px; lebar scroll = lebar konten viewport (selisih 15 px dari innerWidth adalah scrollbar vertikal), tanpa overflow horizontal.                                                                                                                     |
| Interaksi             | Beranda/daftar → detail, kembali, filter Berjalan, refresh detail; rutin tanpa Calendar, informasi satu jam pada acara tanpa selesai; console error 0.                                                                                                          |

Tes terisolasi dijalankan terhadap service sumber yang ditranspile, tanpa kredensial dan tanpa menulis database produksi. Ini tidak menggantikan tes RLS live.

## Batas verifikasi dan langkah publikasi

- Tidak menjalankan ulang 83 tes DB karena schema/RLS/akun tidak berubah dan suite tersebut menulis akun/data uji ke DB bersama produksi.
- Tidak ada konten/file/akun uji yang dibuat di Supabase. Browser memakai tab baru, tanpa login atau mengubah sesi Hanif.
- Pada saat dokumen ini ditulis, bukti yang tersedia adalah QA lokal. Setelah push, periksa HTTP/SSR dan browser produksi; hasilnya dilaporkan pada chat penutup. Preview WA nyata memerlukan review Hanif.
- Native share OS, pengiriman pesan WhatsApp, dan penyimpanan event Google Calendar tidak dilakukan. Parameter tautannya diuji; tidak mengirim apa pun ke orang lain.
- Gambar cover asli belum diuji dengan unggahan live baru. Mapping cover/fallback diuji terisolasi; UI memakai data yang sudah ada.
- Lockfile lokal/Cloudflare belum diselaraskan; .inputValidator tetap dipertahankan.

Alur publikasi yang diizinkan: push `revisi`, tunggu penanda detail baru di produksi, cek HTTP/SSR OG, lalu Hanif mencoba preview link WA. Tidak merge main atau mengubah Branch control di Hari 12.

Setelah review Hari 12: Hari 13 = album/galeri, lightbox, video, dan lazy load sesuai SCHEDULE/handoff.
