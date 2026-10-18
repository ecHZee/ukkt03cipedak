# Hari 15 — Arsip, kontak, filter dan Pages

Status 18 Oktober 2026: implementasi lokal selesai; produksi fitur Hari 15 diverifikasi setelah push.
Proxy **https://ukkt03cipedak.pages.dev** sudah berjalan ke Worker, termasuk aset JavaScript.

## Hasil implementasi

- `/arsip` memakai loader berisi dokumen publik terbit saja. Setelah login, query bersesi di browser
  memuat dokumen terbit sesuai JWT/RLS. Data internal tidak diserialisasi ke HTML/cache loader.
- Cache query bersesi memakai identitas + versi sesi, tanpa token dalam kunci, `gcTime: 0`.
  Logout/pergantian akun tidak memakai data akun sebelumnya. Signed URL dibuat saat PDF internal dibuka,
  berlaku 600 detik, tidak disimpan ke data loader/DOM halaman. Bucket internal tetap privat.
- Filter bidang bersama di kegiatan, berita, arsip; chip 44 px bisa digeser dan pilihan aktif terlihat di HP.
  Bidang/status serta pencarian/tahun/kategori arsip tersimpan di URL, tervalidasi, dapat dipulihkan saat
  refresh dan Back/Forward. Berita utama ikut filter bidang.
- `/lpj` menjadi redirect 301 ke `/arsip`, mempertahankan parameter filter yang dikenal.
  Navbar/footer/hero dan daftar sitemap memakai `/arsip`.
- Peta memakai URL Google Maps resmi dari pengaturan; bila kosong tidak ada iframe/titik sekretariat
  rekaan. Tautan berbagi tetap menjadi tautan, bukan direka menjadi embed. Alamat kosong berlabel
  wilayah kegiatan. Label publik Timeline/Cover diganti Garis Waktu/Sampul.
- Login dari arsip kembali ke arsip beserta filter. Whitelist tujuan admin/arsip menolak URL luar,
  backslash dan newline; diperiksa dengan tes baru.

## Cloudflare dan Auth

Pages Direct Upload: proyek `ukkt03cipedak`, production branch `revisi`, Service Binding `KATAR_APP`
ke Worker `katar-rw03`, fail closed. Proxy di `cloudflare/pages/public/`; konfigurasi/deploy ulang
dijelaskan di [README proxy](../cloudflare/pages/README.md). Aplikasi utama tetap auto-build dari `revisi`.
Secret Supabase tetap pada Worker; tidak disalin ke Pages. Tidak ada domain dibeli atau migrasi DB.

Proxy meneruskan Request (GET/POST/body/authorization/cookie), mengembalikan stream dan status asal,
serta memperbaiki redirect absolut Worker ke origin Pages. HTML/API/admin/respons bersesi memakai
`no-store`; aset anonim mempertahankan cache asal. Penanda: `X-Katar-Gateway: pages-v1`.

`VITE_SITE_URL` pada build Worker dan Supabase Auth Site URL sudah diarahkan ke Pages.
Pendaftaran publik tetap nonaktif dan redirect allow-list tidak diubah. URL Worker tetap tersedia.
Dashboard akun Katar dibuka oleh Hanif sendiri; agen hanya mengatur konfigurasi non-rahasia.

## Bukti lokal dan akses

- Suite database **83/83**, akun/data uji suite dibersihkan.
- Tes perilaku baru **10/10**: filter/parameter invalid, peta aman, tujuan login, POST/query/body/header,
  cache privat, redirect, binding kosong dan kegagalan upstream. Regresi konten **15/15**, organisasi **8/8**.
- Empat halaman × lima lebar **360/375/768/1024/1440 px = 20 kombinasi** tanpa overflow halaman;
  semua chip bidang terukur 44 px. Pilihan arsip (Media/Proposal/kata kunci) bertahan saat refresh serta
  Back/Forward; kegiatan Media + Rencana menghasilkan satu kegiatan dan berita Media menampilkan berita
  utama Media. Peta kosong tidak menghasilkan iframe.
- Fixture sementara empat akun, empat dokumen (tiga terbit + satu draft), tiga PDF sintetis tanpa foto.
  Query nyata anon mendapat 1 dokumen; anggota/Kabid 2; BPH/Super Admin 3; draft tidak ikut daftar.
  Penolakan signed URL internal/BPH sesuai peran, TTL token tepat 600 detik, PDF sah HTTP 200.
- Browser localhost: BPH mendapat 3 kartu dan membuka PDF internal, logout kembali hanya 1 kartu,
  anggota mendapat 2 kartu. Setelah login, URL kembali ke arsip berfilter. URL PDF bertoken tidak dicetak.
- Ditemukan saat QA dan diperbaiki: tombol Cari sempat berlatar putih dengan teks putih; tujuan login
  lama hanya menerima admin sehingga arsip masuk dashboard. Tipe search optional juga disesuaikan agar
  tautan tanpa filter tetap valid. Beberapa klik terlalu awal sebelum hidrasi diulang setelah state siap.

Fixture/akun sementara dibersihkan setelah pemeriksaan produksi; hasil akhir dan bukti dicatat di bawah.
CMS berita/kegiatan/galeri/dokumen yang masih maket tetap menunggu Hari 17–22. Upload Storage tercakup
suite DB; jangan mengklaim seluruh form CMS sudah berfungsi.

## Review Hanif dan berikutnya

1. Buka alamat Pages, coba bidang Media, refresh dan Back/Forward.
2. Dokumen asli belum diisi; keadaan kosong setelah fixture dibersihkan adalah kondisi yang benar.
3. Peta sekretariat menunggu URL lokasi resmi dari BPH.
4. Hari 16: audit semua halaman di 360/390/768/1024/1440 px, kontras, keyboard/target sentuh,
   mode kurangi animasi dan LCP 4G. Checkpoint 3 memerlukan review Ketua sebelum fast-forward main.
