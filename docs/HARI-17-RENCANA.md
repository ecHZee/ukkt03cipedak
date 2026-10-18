# Rencana Hari 17 — Ringkasan dan kegiatan

Disetujui Hanif melalui instruksi gas Hari 17, 18 Oktober 2026. Branch revisi, mulai c9f4217.
Hari 16: target LCP <2,5 detik masih terbuka (median final 2,741 detik). Checkpoint 3 belum disetujui;
main tidak diubah. Global skills/MCP sudah disiapkan sebelum pekerjaan ini.

1. Hubungkan form kegiatan ke skema/RLS yang sudah ada, tanpa migrasi. Query privat dipisah dari konten publik.
2. Tambah validasi judul/slug/periode, jadwal WIB, rutin teks, ringkasan/detail, bidang, tahap dan status.
   Draft → pengajuan → terbit sesuai peran. Versi updated_at mencegah timpa suntingan bersamaan.
3. Ringkasan menampilkan hitungan dan antrean kegiatan dalam jangkauan akun, agenda publik serta akses cepat
   sesuai izin. BPH/Super Admin dapat meminta hitungan aktual metadata tiga bucket Storage, tanpa path privat.
4. Uji: tsc, lint, build, 83 tes DB, regresi publik, validasi dan service admin. Browser akun uji localhost:
   buat/sunting/ajukan/terbitkan/tarik; kegagalan input; 360/390/768/1024/1440 px, keyboard, fokus, overflow.
   RPC tanpa sesi/anggota/Kabid lintas bidang ditolak dan DB tidak berubah. Draft tidak masuk publik SSR/API.
5. Commit/push revisi, cek Pages + Worker, POST/GET dan cache privat. Hapus semua fixture/akun/audit serta
   server uji. Catat bukti dan batas uji di HARI-17-REVIEW, backupcontext, jadwal dan satu section DEVLOG.

File: src/lib/kegiatan-admin.ts, src/services/kegiatan-admin.{functions,server}.ts,
src/components/admin/FormKegiatan.tsx, src/routes/admin.{dashboard,kegiatan}.tsx,
src/components/admin/AdminShell.tsx; tes dan dokumentasi terkait.

Selesai bila kegiatan yang dibuat melalui admin muncul di beranda/agenda/detail setelah diterbitkan,
draft/review tersembunyi dari publik, pembatasan peran bekerja di server/RLS, pemeriksaan lolos,
dan produksi serta pembersihan terbukti. Editor berita Hari 18, crop foto dan B2 tidak dikerjakan sekarang.
