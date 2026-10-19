# Hari 18 — Editor berita dan remediasi prasyarat

Disetujui Hanif 19 Oktober 2026. Baseline `8f07ceb`, branch `revisi`.

1. Remediasi audit Q01–Q05/Q09: Storage profil memeriksa akun aktif; server menghapus objek sebelum mengganti/mencabut foto, database menolak pelepasan referensi jika objek belum dihapus. **Pilihan A disetujui Hanif:** Storage tetap, hapus foto lama; salinan/cache yang sudah diunduh tidak dapat ditarik kembali. Cache foto profil baru tidak lagi immutable setahun. Periksa error akun, login, navigasi form; gunakan `bun.lock` frozen.
2. CMS berita: teks sederhana yang dirender aman sebagai paragraf, judul/slug, bidang, ringkasan, sampul JPEG/PNG/WebP terkompres, pratinjau. Draf/review/terbit dan Setujui/Tolak sesuai jangkauan; versi mencegah penimpaan. Data berita+metadata sampul satu transaksi SQL dengan JWT/RLS, tanpa service role untuk menulis konten.
3. Uji unit/injeksi gagal, DB/RLS dan browser akun sementara. Uji membuat→pratinjau→review→terbit→sunting→tarik, sampul dan HTML sebagai teks; Kabid lintas bidang/anggota/tamu/nonaktif ditolak. Foto: ganti/cabut dan URL lama; sidebar/Back/tab/login jaringan gagal. Lebar 360/768/1024/1440/1920, axe, konsol; ulang HTTP/RPC Pages dan Worker serta cek bundle rahasia.
4. Bersihkan semua akun/baris/berkas/audit uji, matikan server, satu section DEVLOG, perbarui konteks/review, commit+push revisi dan cek produksi. Tidak merge main atau mulai Hari 19.

File utama: `src/lib/berita-admin.ts`, `src/services/berita-admin.{server,functions}.ts`, `src/components/admin/FormBerita.tsx`, `src/routes/admin.berita.tsx`; `foto-profil.{server,functions}.ts`, `auth.ts`, `storage.ts`, `akun.server.ts`, login/profil/users, hook penjaga isian, FormKegiatan/AdminShell; migrasi `20261019010000_perkuat_media_profil.sql` dan `20261019011000_simpan_berita_atomik.sql`, tipe Supabase, tes dan dokumen.

Definisi selesai: alur utama berita dapat dibuktikan dari UI hingga publik dan kembali privat; izin benar juga pada panggilan langsung; tes regresi kasus audit lulus; instal frozen sesuai lock dan dua origin terverifikasi; fixture bersih. Target tinggi beranda/LCP, preview WA nyata, review BPH/Checkpoint 3 dan foto/media asli tetap pekerjaan terbuka dari audit.

Catatan pelaksanaan: `npm run db -- db push --dry-run` kehilangan flag pada lingkungan PowerShell ini, sehingga dua migrasi terpasang lebih awal (tetap dalam lingkup persetujuan, tanpa penghapusan data asli). Pengecekan ulang melalui `node scripts/supabase.mjs db push --dry-run` membuktikan remote sesuai. Gunakan wrapper Node langsung untuk argumen berflag; wrapper tetap mengambil token akun Katar dari file, tidak mengubah token global.
