# Backup Konteks Proyek — Platform Digital Karang Taruna RW 03 Cipedak

> **WAJIB DIBACA PERTAMA** oleh siapa pun (manusia atau AI agent) sebelum mengerjakan apa pun di repo ini.
> Urutan baca: **file ini → bagian paling bawah `DEVLOG.md` → `docs/SCHEDULE.md`**.
> File ini merangkum percakapan Hanif × Claude Code (29 Sep – 1 Okt 2026) supaya konteks tidak hilang
> walau riwayat chat dipadatkan (auto-compact) atau pindah ke sesi baru.
> Terakhir diperbarui: 19 Okt 2026, Hari 20 arsip/pengurus/crop online (kode 7c1e386, Worker 97d2f5ea), produksi dan cleanup selesai; bukti docs/HARI-20-REVIEW.md. Checklist foto memakai bahasa umum untuk tim. Hari 19 CMS album massal + B2 online (kode a09cfd8), QA teknis/cleanup selesai; HP fisik dan grafik ClassB terisolasi menunggu. Hasil: docs/HARI-19-REVIEW.md. Tinggi beranda, LCP konsisten <2,5 detik dan metadata tiga halaman masih terbuka dari audit Hari 1–17. Checkpoint 3 menunggu review Hanif/Ketua. Alamat utama https://ukkt03cipedak.pages.dev. **Tidak berisi password/kunci rahasia — jangan pernah menambahkannya.**

---

## 1. Siapa & apa

- **Hanif** (Hanif Muhammad Zhafran Sutisna, S.Kom.) — anggota Bid. Media KT RW 03, sekaligus programmer &
  Super Admin web. Lebih nyaman berbahasa santai ("beb"), Bahasa Indonesia. Pakai **Antigravity IDE**
  (perintah `agy .` / `anti .` membuka Antigravity **IDE**, bukan versi agentic).
- Proyek: website profil + CMS **Karang Taruna RW 03, Kel. Cipedak, Kec. Jagakarsa, Jakarta Selatan**.
- Awalnya dibuat dengan Lovable + Hermes Agent (hasil: maket UI tanpa backend). Diaudit & dirombak oleh Claude Code.
- Repo: `github.com/ecHZee/ukkt03cipedak`, folder lokal `katar_profile/ukkt03cipedak`.
- Target utama: **"deploy lalu ditinggal"** — pengurus mengelola sendiri tanpa developer.

## 2. Aturan kerja (wajib)

1. Baca file ini + bawah `DEVLOG.md` sebelum mulai. Setiap sesi kerja **tambahkan 1 section di bawah `DEVLOG.md`**
   (append-only, jangan ubah section lama; waktu WIB).
2. Kerja di branch **`revisi`**; commit + push tiap akhir sesi. `main` hanya di-merge saat checkpoint
   (Checkpoint 1 sudah). `main` terhubung ke Lovable — **editor Lovable tidak dipakai lagi**, jangan force-push.
3. Supabase CLI **selalu** `npm run db -- <perintah>` (token akun Katar dari `.env.local`), **bukan** `npx supabase`
   — komputer Hanif punya `SUPABASE_ACCESS_TOKEN` global milik akun pribadi (proyek yolimen) yang harus tetap ada.
4. Rahasia (`.env.local`, token, password) tidak pernah dikirim lewat chat, di-screenshot, atau di-commit.
   Folder `rahasia/` (password awal akun) diabaikan git.
5. Jangan `git checkout -- src/routeTree.gen.ts` bila ada route baru — file itu harus ikut di-commit.
6. Migrasi database: tulis file SQL langsung di `supabase/migrations/<timestamp>_nama.sql`
   (`supabase migration new` pernah macet), lalu `npm run db -- db push --yes`.
7. Sebelum commit: `npx tsc --noEmit`, `npx eslint .` (0 error; 7 warning bawaan shadcn wajar),
   `npm run build`, dan `npm run test:db` bila menyentuh database.
8. Tes di browser panel: jangan logout sesi milik Hanif; pakai akun uji sementara lalu hapus.
9. Perubahan besar → tanya dulu; Hanif suka diberi pilihan + rekomendasi.

## 3. Stack & infrastruktur

| Bagian            | Pakai                                                                                | Catatan                                                      |
| ----------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| Framework         | TanStack Start (React 19, SSR, Vite)                                                 | route file-based di `src/routes`                             |
| UI                | Tailwind v4 + shadcn/ui                                                              | warna Benhur Blue #0047AB + Gold #D4A017, batik halus        |
| Database & Auth   | Supabase **"Profile Web Database"** (ref `twmbcxjojknjtjwtntxr`, Singapore, Free)    |                                                              |
| Media             | **Supabase Storage** (1 GB, 50 MB/file)                                              | Cloudflare R2 ditunda: wajib kartu/PayPal, Hanif tidak punya |
| Hosting           | **Cloudflare Workers** `katar-rw03`, alamat utama **https://ukkt03cipedak.pages.dev** via Pages Service Binding | auto-build Worker tiap push `revisi`; URL workers.dev tetap tersedia |
| Anti-pause+backup | repo PRIVATE `ecHZee/katar-rw03-backup` (GitHub Actions)                             | ping tiap 2 hari, dump DB tiap Minggu (Storage tidak ikut)   |
| Email Katar       | ukktrw03cipedak@gmail.com                                                            |                                                              |

Env (`.env.local`, lihat `.env.example`): `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL`,
`SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (sb_secret_), `SUPABASE_ACCESS_TOKEN` (sbp_, akun Katar),
`VITE_SITE_URL`. Pendaftaran publik di Supabase Auth **dimatikan**.

## 4. Data organisasi (sumber resmi)

- SK Karang Taruna Kelurahan Cipedak **No. 003/SK/KT-Cipedak/VI/2025**, ditetapkan **05 Juni 2025**
  (tanggal pelantikan belum dikonfirmasi Ketua → `tanggal_pelantikan` null). Masa bakti 2025–2028.
- **61 pengurus**: 2 Penasihat, 8 BPH (Ketua, 3 Wakil Ketua, Sekretaris+Wakil, Bendahara+Wakil), 51 anggota bidang.
  "59 pengurus aktif" = tanpa penasihat. **Kabid = nama urutan pertama** tiap bidang di SK.
- 7 bidang (nama revisi 1 Okt 2026; slug tetap):
  `okk` Organisasi, Kaderisasi, Keanggotaan (OKK) & Pemberdayaan SDM · `kerohanian` Kerohanian & Pembinaan Mental ·
  `lingkungan` Lingkungan Kemasyarakatan, Kemitraan & Tata Kelola Organisasi · `ekonomi` Ekonomi Mandiri &
  Kesejahteraan Sosial · `pendidikan` Pendidikan, Keolahragaan & Kebudayaan · `media` Media Publikasi,
  Dokumentasi & Digitalisasi · `inventaris` Inventarisasi & Kearsipan.
- Nama & gelar ditulis terpisah (gelar diseragamkan, mis. "S.Pd."). Hanif = anggota Bid. Media.
- Kontak (WA, IG, alamat, maps) **belum ada** → tabel `pengaturan` berisi null/"" dan web menyembunyikannya.

## 5. Scope (disepakati)

- Web **Karang Taruna**, tapi warga RW 03 dapat manfaat tanpa login (agenda, kas ringkas, UMKM, aspirasi,
  template surat unduhan) — Fase 5.
- **Tidak**: akun warga, pengajuan surat online (SKTM), janji temu RT/RW (wewenang RT/RW).

## 6. Akun, role & hak akses (keputusan final Hanif, 1 Okt 2026)

| Peran             | Siapa                                 | Hak                                                                                                           |
| ----------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Super Admin**   | programmer (username `ukkt03cipedak`) | segalanya + kelola akun                                                                                       |
| **Admin Level 1** | semua BPH (8)                         | kelola pengurus (tambah/hapus/pindah), setujui konten semua bidang, dokumen BPH, audit log, pengaturan        |
| **Admin Level 2** | 7 Kepala Bidang                       | konten bidangnya, beri/cabut izin anggota bidangnya                                                           |
| **Anggota**       | Anggota Bidang & Penasihat            | baca + ubah profil sendiri; buat/ubah **draft** di bidangnya bila diberi **izin kontribusi**; harus disetujui |

- DB: enum `app_role` = super_admin · admin · anggota. Role **diturunkan otomatis dari jabatan** di `pengurus`
  (trigger), kecuali super_admin. `profiles.bidang_id` null = lintas bidang.
- **Login dengan username** = kata pertama + terakhir nama (mis. `hanif.sutisna`), dipetakan ke email internal
  `<username>@akun.katar-rw03.internal`. Super Admin juga login dengan username (email Gmail disimpan di `email_kontak`).
- Password awal acak per orang (mis. "Mangga-4821-Elang"), **wajib ganti** saat login pertama (popup).
- **61 akun sudah dibuat** 1 Okt 2026; password awal di `rahasia/akun-awal-2026-10-01.csv` (lokal, jangan di-commit;
  bagikan lewat chat pribadi setelah web online, lalu hapus file).
- Password **tidak bisa dilihat siapa pun** (di-hash) — solusinya reset oleh Super Admin di menu **Akun**
  (`/admin/users`, Hari 8.6): ganti username, reset password (tampil sekali), nonaktif/aktifkan (ikut di-ban di Auth).
- Email & no. HP pribadi hanya terlihat oleh diri sendiri, Kabid bidangnya, dan BPH.
- Foto profil = foto di halaman Tentang; tampil publik hanya bila `izin_foto` (trigger mengosongkan bila tidak diizinkan).
- Login di **`/login`** (bukan /admin/masuk); CMS di `/admin/*`. Ikon kecil "Masuk pengurus" di navbar.
  Kunci 60 detik setelah 5× gagal. Belum ada "lupa password via email" (butuh SMTP; reset via Super Admin).
- ⚠️ Password Super Admin sempat terlihat di screenshot; Hanif sudah reset — pastikan **kuat sebelum online**.

## 7. Database (migrasi di `supabase/migrations`)

Tabel: `periode`, `bidang`, `pengurus`, `profiles`, `pengaturan`, `audit_log`, `kegiatan`, `berita`, `album`,
`media`, `dokumen`. Semua konten punya `status` (draft/review/terbit), `created_by` (dikunci trigger),
`terbit_at` & `disetujui_oleh` (otomatis), `is_dummy`. Audit log otomatis untuk semua tabel.
Helper RLS: `peran_saya`, `is_bph`, `is_pengurus`, `bidang_saya`, `bidang_akun_saya`, `kontributor_saya`,
`boleh_terbit`, `boleh_kelola`, `boleh_tulis_folder`. RPC: `atur_izin_kontribusi`, `ubah_profil_saya`,
`ubah_foto_saya`, `selesai_ganti_password`.
Storage: bucket `media` (publik), `dokumen-publik` (publik, PDF), `dokumen-internal` (privat, signed URL 10 menit);
path `<slug-bidang|umum|bph>/…`; foto profil `media/profil/<id-akun>/…`.
Dummy: 8 kegiatan + 6 berita (`npm run seed:dummy`, hapus: `-- --hapus`). Foto dummy belum (butuh izin unduh / foto asli).

## 8. Perintah penting

| Perintah                                                                                                                              | Fungsi                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `npm run dev`                                                                                                                         | jalankan lokal (http://localhost:5173)                       |
| `npm run test:db`                                                                                                                     | 83 tes CRUD/RLS/storage/akun (akun uji otomatis dibersihkan) |
| `npm run seed:dummy`                                                                                                                  | isi ulang konten contoh                                      |
| `npm run db -- <cmd>`                                                                                                                 | Supabase CLI akun Katar                                      |
| `npm run akun -- generate [--coba] \| buat \| daftar \| username <lama> <baru> \| reset <user> \| nonaktif <user> \| aktifkan <user>` | kelola akun                                                  |

## 9. Riwayat keputusan & masukan penting

- Arahan Hanif 19 Okt setelah Hari 19: tim menyeleksi foto awal berdasarkan checklist, lalu input
  manual setelah dipilih. `docs/CHECKLIST-FOTO-LAUNCH.md` menyiapkan 1–3 calon per kebutuhan,
  empat slot kolase, pengenalan/berita, 1–3 album dan potret bertahap; tidak mengunggah/menerbitkan
  foto dalam sesi perencanaan. Catatan hasil/izin tetap privat. Beranda masih memakai placeholder
  pada Hero/AboutPreview/BeritaLatest/GaleriPreview; upload album belum mengganti slot ini otomatis.
- Keputusan Hanif 18 Okt: gabungkan scope Hari 15 dengan `Client → ukkt03cipedak.pages.dev → Worker
  katar-rw03` via Service Binding. Pages sebagai proxy, bukan redirect ke URL panjang atau migrasi penuh.
  Nama Pages belum dicek; pembelian domain ditunda. Worker/build/secrets aplikasi tetap dipakai,
  alamat baru untuk client hanya setelah uji fitur, sesi, akses dokumen, cache privat dan aset lolos.
  Sudah dijalankan di Hari 15; hasil dan batas uji: `docs/HARI-15-REVIEW.md`.
- Review lanjutan Hanif: foto dan detail modal menyatu lewat gradasi Benhur samar; arah ke kanan pada
  desktop/tablet dan ke bawah pada HP. Hanya tepi foto yang memudar; teks tetap utuh. Hari 15 baru dijelaskan.
- Review modal Hanif: foto potret besar di kiri, nama/jabatan/bidang/periode di kanan (HP ditumpuk).
  Foto disarankan 3:4, 900×1200 px; saran belum jadi syarat validasi. Hanif memilih crop interaktif
  **saat tahap CMS nanti**, sekarang modal + panduan. Foto rasio lain ditampilkan utuh di popup.
- Review Hanif sebelum Hari 15: BPH dan Kepala Bidang perlu kartu lebih besar. BPH bertingkat menurut
  jabatan: Ketua > Wakil Ketua > Sekretaris/Bendahara > wakilnya; Kabid lebar di atas anggota.
  Berlaku di direktori dan detail bidang, tetap desain E dan pemeriksaan izin yang sama.
- Hari 14 disetujui Hanif: Tentang ringkas + direktori terpisah + detail tujuh bidang.
  Sejarah/visi/misi maket tidak dipublikasikan sebagai fakta; menunggu naskah sah dari BPH.
  Tanggal SK tidak disamakan dengan pendirian/pelantikan. Dasar hukum diperbarui: Permensos 25/2019
  sebagaimana diubah dengan 9/2025 (JDIH BPK). Izin foto/Instagram diperiksa lagi sebelum serialisasi.
- Review Hanif 18 Okt: navbar desktop kembali **sejajar**, semua tujuan sekali klik:
  Tentang · Program · Kegiatan · Berita · Galeri · Arsip · Kontak. Kategori Tentang/Kabar/Lainnya tetap
  hanya di menu hamburger/"Lainnya". Desktop mulai 1024 px; HP/tablet memakai menu dan navigasi bawah.
- Riset ±20 website (Karang Taruna, desa, PA Singapore, Kitabisa, charity: water, GOV.UK) → arah desain
  "foto asli sebagai elemen utama", navigasi bawah ala aplikasi di HP, share WA, Google Calendar.
- Hanif mengaku kurang paham UI/UX → Claude mengusulkan desain; keputusan visual tetap biru-emas.
- Masukan teman full-stack Hanif (dokumen _Masukan-Pengembangan-Website-KT-RW03.docx_) sudah dirangkum di PLANNING.
- Hari 6.5 (review Hanif): satu desain hero untuk semua halaman, kolase beranda 2×2 simetris, revisi nama bidang.
- Sesi login pendek (5–10 menit) **tidak** dipakai: sesi tidak membebani server. Usulan: auto-logout setelah
  **30 menit tanpa aktivitas** + peringatan 1 menit — **belum diputuskan Hanif**.
- Badge BPH (emas) & Penasihat (gelap) di tab Pengurus.

## 10. Status terakhir

**18 Okt 2026: proyek dialihkan ke Codex (GPT 6.1 Sol).** Paket serah terima: `docs/handoff/` (01–05) +
skill `.agents/skills/katar-*` (juga di `~/.codex/skills/`). Agen baru wajib membacanya setelah file ini.
(8 Okt 2026)

Selesai: Hari 1–9 (lihat `DEVLOG.md`). Web ONLINE di https://katar-rw03.ukktrw03cipedak.workers.dev
(Cloudflare: build var VITE_* ; runtime secrets SUPABASE_URL/PUBLISHABLE_KEY/SERVICE_ROLE_KEY, diisi Hanif).
Supabase Auth Site URL = link online. Uji E2E online 8/8. Backup & ping berjalan (repo private).
**Hari 10 selesai (9 Okt):** logo resmi, navbar berkelompok, navigasi bawah HP, bug geser-samping beres.
**Checkpoint 2 lolos (9 Okt)** → main = revisi (82487f5); Cloudflare tetap dari `revisi` sampai launching.
**Hari 11 selesai:** beranda HP 6,05 layar, bagian Ajakan, banner pengumuman (pengaturan `pengumuman`).
**Hari 12: online di revisi (6bab8bf), siap review Hanif.** Detail `/kegiatan/$slug` &
`/berita/$slug`, kartu bertaut, share WA/native, Calendar WIB, metadata SSR absolut (cover/logo fallback).
Daftar dipindah ke route index; induk hanya Outlet. Tidak ada migrasi/perubahan DB. Tes konten terisolasi
`npm run test:konten` 15/15; tsc, lint (0 error/7 warning), build, HTTP & browser lokal lolos.
Hanif memberi **akses penuh untuk menuntaskan Hari 12**: alur commit/push `revisi` diizinkan. Cek produksi
dilakukan sesudah push: 13 URL valid 200, 2 slug hilang 404, OG SSR absolut dan browser 360/1440 px lolos;
hasil akhir ada pada laporan penutup chat 18 Okt. Preview WA nyata menunggu review
Hanif. Panduan: `docs/HARI-12-REVIEW.md`.
**Koreksi review 18 Okt:** hamburger di header untuk lebar <1024 px membuka menu yang sama dengan
"Lainnya" di navigasi bawah. Tombol minimal 44 px; judul/deskripsi dialog, Escape dan fokus kembali ke
pemicu sudah diuji. Lokal 360/375/768/840/1023/1024/1440 px tanpa overflow horizontal, console 0 error;
tsc/build lolos, lint 0 error/7 warning. Verifikasi produksi koreksi dilakukan setelah push, hasil di chat.
Calendar tanpa selesai memakai praisian satu jam dengan penjelasan, tidak mengubah DB; rutin tanpa tanggal
dan acara batal tidak diberi Calendar; acara seharian belum didukung karena belum ada penanda di skema.
**Hari 13 online & siap review (kode 60d3125):** daftar album bersampul menautkan
`/galeri/$album`, isi album/media terbit, masonry 1/2/3 kolom, lightbox portal Radix ke body,
geser/pan/zoom/cubit, keyboard & fokus, video file + embed YouTube/Instagram/TikTok dengan tautan cadangan.
Lazy load, dimensi foto, fallback foto hilang; parser video menolak host tiruan; TikTok memakai player/v1.
8/8 tes galeri + 15/15 regresi, tsc/build lolos, lint 0 error/7 warning; browser 360/375/840/1440 px tanpa
overflow. Album lokal 50 foto sintetis: 5 foto dimuat awal, 50 setelah scrolling; native video terputar,
console 0 error. Pinch diuji sintetis, HP fisik & playback konten asli IG/TikTok masih perlu review.
DB produksi belum memiliki album; online tetap keadaan kosong sampai ada unggahan (admin & B2 Hari 19).
Tidak ada perubahan DB/RLS/akun/dependensi; fixture dan konfigurasi QA sementara tidak masuk build/repo.
Produksi lolos: 10 route valid HTTP 200, slug album hilang 404, canonical/OG SSR absolut,
browser 360/840/1440 px tanpa overflow dan console 0 error. Working tree bersih, server uji dimatikan.
Panduan: `docs/HARI-13-REVIEW.md`.
**Koreksi review navbar:** dropdown desktop diganti tujuh tautan sejajar sesuai permintaan Hanif.
Menu hamburger/Lainnya tetap berkelompok dan mengambil tujuan dari daftar yang sama. Lokal sembilan
lebar 360–1440 px tanpa overflow; desktop 1024–1440 px satu baris tanpa menabrak logo/aksi. Tujuh tujuan,
keyboard, penanda aktif termasuk detail kegiatan, kategori HP, Escape dan fokus kembali lolos;
tsc/build lolos, lint 0 error/7 warning, console 0 error. Kode `5d2082d` online: HTML memuat tujuh tautan,
tanpa dropdown desktop; 10 route HTTP 200. Browser produksi 1024 px satu baris tanpa tabrakan/overflow,
360 px tetap menu berkelompok; klik Program/Galeri, Escape/fokus lolos, console 0 error. Server uji dimatikan.
**Hari 14 online (kode 534a487), QA lokal dan produksi lolos:** Tentang memakai accordion profil/riwayat/dasar hukum,
direktori `/tentang/pengurus` 61 kartu (2 penasihat + 8 BPH + 51 bidang), inisial berwarna, badge peran,
filter sembilan kelompok, dan popup portal dengan pemulihan fokus. Detail `/program/$bidang` memuat fokus,
pengurus, dan kegiatan terbit yang sesuai; indeks menautkan tujuh detail. Parent hanya Outlet.
61 nama/gelar dari DOM cocok dengan seed lampiran SK; bidang 7/4/8/8/13/7/4. Foto/Instagram wajib izin;
tidak memilih email/telepon pribadi. Tidak ada migrasi/RLS/akun/dependensi baru. 8 tes organisasi + 15 konten
+ 8 galeri = 31/31, tsc/build lolos, lint 0 error/7 warning. Browser 20 kombinasi di 360/375/840/1024/1440 px
tanpa overflow; filter/profil/keyboard/navigasi lolos. Vite sempat re-optimize accordion; restart + tab bersih
lolos tanpa console error. HTTP lokal dan produksi: 18 valid 200, 3 slug hilang 404. Produksi memuat
61 nama/gelar sesuai seed, canonical/OG tepat, browser 20 kombinasi di lima lebar yang sama tanpa overflow,
filter/profil/accordion dan klik bidang → kegiatan lolos; console 0 error/0 warning. Server uji dimatikan.
Narasi sejarah/visi/misi belum disahkan BPH sehingga disembunyikan, tanggal SK ditulis sesuai jenisnya.
Panduan: `docs/HARI-14-REVIEW.md`.
**Review sorotan jabatan online (a474025):** kartu Ketua lebar penuh berlatar Benhur, tiga Wakil Ketua besar
setara, Sekretaris/Bendahara menengah dan wakilnya lebih kecil. Tujuh Kabid mendapat kartu lebar di atas
anggota, juga di detail bidang. Semua 61 nama tetap sekali dan sesuai seed. Hierarki luas kartu BPH
terukur benar pada 360/375/840/1024/1440 px; 10 kombinasi direktori/detail tanpa overflow. Profil lima
jenis kartu, keyboard, portal dan fokus kembali lolos; console 0 error/0 warning. tsc/build lolos,
lint 0 error/7 warning, regresi organisasi 8/8. Tidak ada perubahan DB/akun/dependensi. Produksi: 18 URL
valid 200, 3 hilang 404; jumlah dan penanda semua kartu sesuai. Browser 10 kombinasi/lima lebar yang sama
tanpa overflow, hierarki terukur benar, profil/filter/fokus lolos; console 0 error/0 warning. Server uji
dimatikan dan workerd tidak tersisa; Hari 15 belum dimulai.
**Review modal potret online (dc0489b):** popup 820 px, bingkai foto 3:4 kiri dan detail kanan mulai 640 px;
HP foto di atas. Foto utuh (object-contain), inisial bila kosong/gagal; close 44 px tetap terlihat saat
scroll. 14 kombinasi profil/layar termasuk 360×560 dan 840×400 tanpa overflow; foto sintetis potret,
lanskap dan rusak diuji tanpa DB/Storage. tsc/build lolos, lint 0 error/7 warning, regresi organisasi 8/8,
console 0 error/0 warning. Panduan 900×1200 ditambahkan di Foto Profil dan `docs/FOTO-PROFIL.md`;
form hanya perubahan teks, alur unggah tidak berubah dan tidak diuji ulang dengan akun.
Produksi: 18 valid 200, 3 hilang 404; 61 kartu/avatar utuh. Modal diuji di tujuh ukuran termasuk layar
pendek; susunan/overflow/portal/tombol 44 px benar, profil Ketua/Kabid dan Escape/fokus lolos,
console 0 error/0 warning. Server uji dimatikan. Crop interaktif menunggu CMS sesuai pilihan Hanif;
Hari 15 belum dimulai.
**Review gradasi modal online (63b79ad):** latar Benhur 7% → 2% → latar halaman dan tepi akhir foto memudar.
Garis pemisah kolom serta bingkai detail dihapus supaya menjadi satu permukaan. Tujuh ukuran layar
360/375/840/1024/1440 px termasuk 360×560 dan 840×400 lolos: arah gradasi/susunan benar, tanpa
overflow, teks tanpa mask, tombol 44 px dan modal tetap dalam viewport. Escape/fokus Kabid lolos,
console 0 error/warning; tsc/build lolos, lint 0 error/7 warning bawaan. Uji DB tidak diulang karena
hanya CSS modal, tanpa perubahan data/izin/akun. Produksi: penanda potret-menyatu dan gradasi aktif;
tujuh ukuran layar sama lolos, PageDown mencapai bawah, fokus kembali ke Ketua/Kabid, console
0 error/warning. Direktori tetap 61 kartu. HTTP 18 URL valid 200 dan 3 slug hilang 404 setelah deploy.
Screenshot/JSON/log di arsip QA luar repo; server uji dimatikan, workerd tidak tersisa. Hari 15 belum dimulai.
**Rencana Hari 15 diperbarui (18 Okt):** arsip/kontak/filter/redirect + Pages sebagai alamat publik pendek
di depan Worker, sesuai persetujuan Hanif. Perbarui fitur dulu, uji pada Worker, kemudian uji proxy Pages
sebelum peralihan URL publik/Auth. Nama Pages, kompatibilitas proxy dan kuota belum dibuktikan.
Rencana gabungan tersimpan di `docs/HARI-15-RENCANA.md`, jadwal dan handoff; implementasi belum dimulai.
**Hari 15 berjalan (18 Okt):** Hanif memberi arahan mulai dan meminta rincian Hari 16 setelah selesai.
Arsip berjenjang, filter URL bersama, kontak/peta resmi, redirect /lpj dan label publik sudah diimplementasikan.
Proxy Pages `ukkt03cipedak` aktif: Service Binding KATAR_APP → katar-rw03, branch revisi, fail closed.
VITE_SITE_URL Worker dan Supabase Auth Site URL sudah menjadi https://ukkt03cipedak.pages.dev;
signup tetap nonaktif, redirect allow-list tetap. Secret aplikasi tetap Worker. Suite DB 83/83,
tes publik baru 10/10, konten 15/15, organisasi 8/8; 20 kombinasi layar lokal tanpa overflow.
Fixture empat akun/empat dokumen/tiga PDF sementara diuji untuk lima peran; pembersihan setelah QA produksi.
Rincian dan hasil akhir: `docs/HARI-15-REVIEW.md`. Kode produksi diperiksa setelah push.
**Hari 15 selesai (ab804b1):** produksi Pages dan Worker 44/44 pemeriksaan route (18 valid 200 + tiga
hilang 404 + redirect 301 berfilter per alamat), lima aset 200. Penanda baru, canonical/OG Pages dan
no-store benar; HTML anonim tidak memuat dokumen internal. Browser Pages 20/20 kombinasi layar,
filter/refresh/Back/Forward dan berita utama mengikuti bidang lolos, console 0 error/warning.
POST server-function lewat Pages menolak anonim/BPH dan berhasil bagi Super Admin uji, username
sementara dipulihkan; GET-ke-POST 405. Enam pemeriksaan RPC, error TanStack dideserialisasi (bisa HTTP 200).
Semua empat akun/profil, empat dokumen, tiga PDF dan audit uji sudah dihapus; Storage/Auth/audit
diverifikasi 0 tersisa, berkas kredensial dan skrip sementara dihapus. tsc/build exit 0, lint akhir
0 error/7 warning bawaan. Tidak ada nilai service-role di bundle. Vite/workerd/port uji sudah kosong.
Screenshot/JSON/log di arsip QA luar repo; `docs/HARI-15-REVIEW.md` memuat rincian.
**Hari 16 siap review, belum ditutup penuh (18 Okt):** kode final `ac75043` online. Target 44 px,
  kontras, hierarki judul/skip link, jeda, info statis pada reduced-motion, fokus drawer/dialog CMS
  dan pencarian pengurus diperbaiki. Font desain E lokal (OFL), logo WebP lossless responsif,
  canonical absolut. Lokal 155 publik + 20 admin, produksi 155 kombinasi unik pada lima lebar
  360/390/768/1024/1440 tanpa overflow/kontrol kecil; lebar aktual di-assert setelah koreksi alat.
  Axe lokal 62+8 dan produksi 62 tanpa pelanggaran otomatis. Kontras manual 9/9. Modal/lightbox,
  swipe/cubit/pan sintetis lolos; bukan uji HP fisik. Tiga akun UI sementara/profil/audit dihapus,
  diverifikasi 0, kredensial/fixture dibersihkan; akun asli tidak disentuh. Regresi 41/41, DB 83/83,
  TypeScript/build 0, lint 0 error/7 warning. HTTP Pages+Worker 82/82, 8 aset immutable, no-store benar.
  Sesi audit lama merekam React #418, tidak terulang pada replay bersih 31 route/axe setelah siap;
  konsol ulang 0. Penyebab catatan lama belum pasti, gangguan QUIC IAB juga dicatat di review.
  Lighthouse final slow4G/CPU4×: LCP beranda 2,741/2,833/2,690 dtk, median 2,741 (baseline 4,912),
  CLS/TBT 0, a11y/SEO/best-practices 100. **Target <2,5 masih terbuka**. Eksperimen optional font,
  CSS inline dan font base64 dibuang karena tidak membaik; akhir memakai CSS/font terpisah + swap/preload.
  Rincian/batas bukti: `docs/HARI-16-REVIEW.md`. Main tetap 82487f5 sampai persetujuan Checkpoint 3. Cloudflare tetap dari
  `revisi` sampai launching; main hanya diperbarui pada checkpoint (bukan otomatis setelah Hari 12).
  ⚠️ Versi dependensi laptop (npm, tanpa lockfile, lebih baru) ≠ Cloudflare (`bun.lock`, TanStack Start 1.167):
API baru bisa jalan di lokal tapi 500 di produksi (kasus `.validator` → pakai `.inputValidator`). Rencana:
selaraskan lockfile. Log error produksi: Cloudflare → katar-rw03 → Observability → Events.
Domain `workers.dev` tidak bisa tanpa nama worker. Rencana terbaru memakai Pages sebagai proxy di
Hari 15 untuk alamat pendek gratis; pembelian domain sendiri (mis. .my.id) tetap ditunda sampai siap.

**Keputusan storage (9 Okt 2026)** — Supabase Free terlalu kecil untuk "portal arsip" (1 GB, egress ±5 GB/bln;
video mustahil). Kartu BSI Hanif belum bisa (saldo kosong) → R2 ditunda. Dipakai **Backblaze B2** (akun email
Katar, tanpa kartu): bucket **`katar-rw03-media`**, PRIVATE, encryption on, object lock off, lifecycle "keep only
last version", region US West, endpoint `s3.us-west-004.backblazeb2.com`, semua caps $0 (tak mungkin ditagih).
**Koreksi harga, diverifikasi 19 Okt 2026:** 10 GB simpan gratis; egress gratis hingga 3× rata-rata simpan
bulanan; transaksi Class A/B/C gratis pada harga umum. Dashboard akun Katar masih menampilkan cap $0:
10 GB simpan, 1 GB unduh/hari, 2.500 transaksi B/C per hari. Patuh batas akun nyata ini. Rujukan
resmi & rincian ada di `docs/B2-SETUP.md`. Tetap disajikan lewat Worker dengan cache per data center
(nama unik immutable); eviction/MISS di lokasi lain bisa membaca B2 lagi. Cap/billing tidak dinaikkan.
Pembagian: foto terkompres & video (≤200 MB, saran 720p) → B2 · PDF → Supabase Storage · file asli resolusi
penuh → GDrive Katar (tombol "Unduh asli" per album). Application key B2 dibuat saat Hari 19. Semua upload lewat
satu pintu `src/services/storage.ts`. Opsi R2 tetap terbuka bila ada kartu (bisa dipakai bersamaan, total 20 GB).
**Keputusan desain (9 Okt 2026):** dibuat 5 contoh beranda di `katar_profile/_contoh-desain/` (di luar repo, berisi
foto orang; server lokal `contoh-desain` port 8090): A Buletin Warga, B Poster Kampung, C Album Kenangan,
D Kekinian (bento/stories), E = desain web sekarang + foto asli. **Hanif memilih E** → Fase 2 = memoles desain
yang ada (bukan desain ulang total): isi foto asli, logo resmi, navbar sejajar + menu berkelompok/navigasi bawah HP (review 18 Okt),
perbaiki overflow horizontal di HP (hiasan `-right-32` di hero & marquee), kurangi ciri slop yang paling kentara.
Foto terpilih (37 WebP + contact sheet) kini di `katar_profile/_aset-lokal/_Pilihan Web/`,
master album di `_aset-lokal/_Siap Upload/` (di luar repo publik; dipindah 19 Okt, lihat `docs/ASET-LOKAL.md`).
Catatan lama — Desain: hindari ciri "AI slop" (Inter, label kapital berspasi, gradasi, kotak bulat+bayangan di mana-mana, hero
tengah + 3 kartu ikon); utamakan foto & konten asli, font serif bernuansa buletin warga, warna emblem
(biru tua/kuning/merah), motto "Aktif, Inovatif, Egaliter". Arah desain dipilih Hanif di awal Hari 10.
Logo resmi di `public/logo/` dari PNG transparan resolusi tinggi (Picsart, logo ±2078 px): 1024, 512, 192, 180, 48.
WA sekretariat = WA Ketum (disimpan di `pengaturan.kontak.whatsapp`). Menu "Untuk Warga" disembunyikan sampai Fase 5.
PR Hanif: password Super Admin kuat; simpan & nanti hapus CSV password awal; kumpulkan logo, nomor WA sekretariat,
akun IG resmi, ±20 foto kegiatan.

**Hari 17 (18 Okt):** ringkasan admin dan form kegiatan nyata, draf/review/terbit sesuai peran,
jadwal WIB + rutin teks, validasi/slug unik, versi suntingan, query privat via JWT/RLS. Pemakaian
Storage aktual atas permintaan BPH/Super Admin; B2 tetap Hari 19. Tanpa migrasi/dependensi baru.
12 tes unit, 20 integrasi service/RLS, 83 regresi DB, 46 regresi publik, 12 RPC localhost;
15 kombinasi layout lima lebar dan enam axe tanpa pelanggaran. Browser empat peran, publikasi
langsung terlihat di SSR beranda/agenda/detail lalu ditarik. Hasil: `docs/HARI-17-REVIEW.md`.
Produksi lolos 28 RPC + 50 HTTP/aset/header, 15 kombinasi browser publik. Penulisan privat memakai
JWT/RLS; respons Worker langsung kini private/no-store juga (temuan produksi yang diperbaiki).
7 akun/profil, 2 kegiatan dan audit uji dihapus, pembacaan ulang sisa 0; server/file sementara bersih.
Hari 18 (editor berita + setujui/tolak) belum dimulai.

**Audit penutup Hari 1–17 (18 Okt, baseline 4875794):** hasil lengkap dan matriks 17 hari di
`docs/QA-HARI-01-17.md`. Audit selesai, bukan persetujuan launching. Ulang seluruh 161 tes lolos,
tsc/build exit 0, lint 0 error/7 warning. Produksi 72 status/header/redirect sesuai; metadata og:url
tiga halaman belum lengkap. Browser 31 route × lima lebar (360/768/1024/1440/1920) tanpa overflow,
62 axe tanpa pelanggaran otomatis, menu 840 px/filter/modal/redirect admin anonim lolos.
LCP tiga run 4,683/1,481/2,905 detik (median 2,905); tinggi beranda 375×740 normal 7,35 layar,
reduced-motion 7,82, sehingga syarat Hari 11/16 belum penuh. Data aktif 61 nama cocok seed,
8 kegiatan/6 berita semuanya dummy; backup remote c1caaaa tercatat 18 Okt 03:02 WIB,
status ping terbaru dan restore drill belum diverifikasi; backup belum mencakup objek Storage.
**Temuan prioritas:** akun nonaktif masih dapat unggah foto profil sendiri; cabut izin menyembunyikan
foto tetapi URL berkas lama tetap publik (API dan UI sintetis). Service akun dapat mengabaikan error
langkah lanjutan; login saat query profil gagal macet; sidebar menghilangkan isian kegiatan tanpa
peringatan. Bukti jalur gagal dibedakan dari suite lulus. Rekomendasi: remediasi sebelum membagikan
akun/foto asli dan sebelum fitur Hari 18, termasuk samakan lockfile. Ini belum implementasi.
Tidak mengubah aplikasi/migrasi/dashboard/akun asli. Tujuh akun/profil, satu pengurus/periode tidak
aktif, foto dan audit sementara dihapus; sisa diverifikasi 0, kredensial/route/skrip uji dibersihkan,
server dihentikan. Hari 18 tidak dimulai; main lokal 4bd423c/origin-main 82487f5 tetap.

**Hari 18 selesai (19 Okt, kode 477f51c):** CMS berita nyata dengan sampul/pratinjau, draf/review/terbit,
setujui/tolak, tarik/hapus dan pembatasan peran. Remediasi Q01–Q05/Q09: Storage profil mensyaratkan
akun aktif; pilihan A Hanif menghapus objek lama sebelum ganti/cabut izin (salinan/cache unduhan
tidak bisa ditarik kembali); guard database, kegagalan akun/audit ditangani, login pulih setelah
koneksi gagal, penjagaan isian berita/kegiatan. Dua migrasi baru sudah diterapkan (12 total).
Bun 1.4.3 frozen dengan bun.lock tetap, 70 versi langsung cocok; kesenjangan dependensi lama
diselesaikan, tetap pakai .inputValidator. CLI berflag lewat `node scripts/supabase.mjs ...` langsung:
PowerShell/npm sempat membuang --dry-run sehingga push berjalan langsung; tidak menghapus data asli.
206/206 tes, tsc/build exit 0, lint 0 error/7 warning, 17 RPC localhost, 70 layout dan 16 axe lolos.
Produksi 34 RPC + 40 HTTP/aset/header, 15 kombinasi browser publik tanpa overflow/konsol error.
Fungsi server baru terbukti aktif pada Pages/Worker. 7 akun/profil, pengurus/periode inaktif,
berita/media/berkas/audit uji dibersihkan dan sisa diverifikasi 0; baseline Auth/profiles62,
pengurus61/kegiatan8/berita6, server/workerd/port uji kosong, kredensial dan skrip uji dihapus.
Rincian, batas bukti dan hasil produksi/cleanup akhir: `docs/HARI-18-REVIEW.md`.

**Penataan arsip lokal (19 Okt, sesudah Hari 18):** atas permintaan Hanif, 37 WebP + contact sheet,
master 2.798 berkas untuk album/data asli Hari 19/24 dan lima HTML referensi disimpan di folder
saudara repo `katar_profile/_aset-lokal/`. SHA256 2.841 berkas di lokasi baru cocok. Delapan ZIP lama
(3.883 entri) dan 336 pembanding identik dengan salinan yang tetap disimpan; lima file lepas sudah
di-backup/diunduh ulang, total 349 berkas duplikat/tercadang (53,26 GB) dibersihkan dari Downloads.
Drive akun Katar dibaca ulang: 53 folder/2.960 item; 2.802 ID lama cocok nama/ukuran/modified time.
Enam file tambahan + satu paket aset/referensi di-backup privat, tujuh readback SHA256 cocok.
Tidak mengklaim hash baru seluruh Drive lama: master lokal 36,20 GB tetap disimpan. Lokasi lama
Downloads sudah dihapus setelah kosong. Rincian publik `docs/ASET-LOKAL.md`, manifest/receipt privat
di `katar_profile/_arsip-audit/2026-10-19/`. Tidak mengubah aplikasi/DB/deploy atau memulai Hari 19.

**Hari 19 (19 Okt, implementasi dan QA lokal):** CMS album massal nyata, foto WebP1920/thumb480,
video ≤200 MiB/tautan, Drive asli, draf/review/terbit, cover/caption/urutan dan progres/jeda/retry.
Bucket private B2 tersambung, CORS empat origin spesifik, dua secret runtime diisi Hanif.
260/260 suite, tsc/build exit0, lint0 error/7 warning, 20 RPC Worker lokal; batch UI 30/30
foto sintetis, offline4/30 lalu lanjut otomatis, pilih ulang tidak menggandakan. Cache MISS→HIT,
HEAD/Range/video lolos dan tarik album 404 sebelum cache. Dua migrasi baru (14 total).
Produksi40RPC+40HTTP/header lolos, lima lebar album dan dua axe tanpa pelanggaran;
foto/video GET/HEAD/Range serta MISS→HIT.20GET ulang HIT (CGK/SIN), tarikdraf404 sebelumcache.
Hapus versi B2 tepatpath (DELETE biasa hanya marker) teruji; cleanup31reservasi termasuk1viaRPC,
7akun/profil, album/media/audit dan semua versi objek fixture sisa0. Baseline Auth/profiles62,
pengurus61/kegiatan8/berita6/album0/media0. Kode a09cfd8, web online, server/workerd ditutup.
HP fisik30 foto dan grafik transaksi provider terpisah. Rincian `docs/HARI-19-REVIEW.md`.

**Hari 20 (19 Okt 2026):** form PDF nyata dengan metadata/akses/status dan pratinjau, pengelolaan
pengurus Level 1, crop 3:4 + avatar 1:1 + Simpan/Batal/izin. Semua PDF baru tetap privat di
Supabase; publik lewat `/berkas/dokumen/<id>` yang memeriksa izin per request, internal signed URL
600 detik. Jalur arsip sendiri tidak dapat ditimpa/dihapus saat terdaftar; uploader yang kehilangan
hak BPH juga ditolak. Pergantian/hapus mencatat `arsip_sampah`, cleanup dapat dicoba ulang.
Migrasi 20261019140000 + 20261019150000 diterapkan (16 lokal/remote cocok); migrasi lama utuh.
Pengurus punya status aktif; nonaktif/periode tidak berjalan menonaktifkan akun dan menyinkronkan
peran. Mengaktifkan data pengurus tidak membuka akun otomatis. BPH tidak mengubah Super Admin;
pengurus terkait akun tidak dihapus langsung. Menambah pengurus tidak otomatis membuat akun.
Foto baru memerlukan persetujuan, penggantian/pencabutan menghapus objek lama. Storage dan DB
bukan satu transaksi: jika DB gagal sesudah hapus file, UI meminta muat ulang/unggah ulang.
Signed URL lama tetap berlaku sampai kedaluwarsa; salinan unduhan/cache eksternal tidak ditarik.
313 tes otomatis (94 unit + 156 DB + 20 kegiatan + 26 berita/foto + 17 arsip/pengurus), tsc/build
bersih, lint 0 error/7 warning. QA browser 360/768/1024/1440/1920, crop 900×1200, izin/guard,
axe dan konsol lokal lolos. Produksi Pages/Worker40RPC+30HTTP lolos; kode7c1e386/Worker97d2f5ea. QA produksi lima lebar/axe/konsol lolos.
Cleanup7akun+2pengurus+1periode+PDF/foto/audit sisa0, baseline62Auth/profil61pengurus. URL foto hangat
sempat200setelahhapusfisik, lalu400; cache eksternal tidak dijanjikan hilang instan. Kredensialfixture/
.dev.vars dihapus, server/workerd/tabQA ditutup; sesi Hanif tetap. Rincian `docs/HARI-20-REVIEW.md`.
Checklist foto sudah ditulis ulang untuk tim nonteknis. Konten/foto asli belum diinput; Hari 21
belum dimulai, main tidak diubah.

## 11. Rencana ke depan (ringkas)

- Hari 20 diimplementasikan sesuai rencana: arsip privat/gateway publik, CRUD pengurus Level 1,
  crop 3:4 + pratinjau avatar dan izin foto. Bukti/deploy/cleanup: `docs/HARI-20-REVIEW.md`. Tim
  menyeleksi foto lewat `docs/CHECKLIST-FOTO-LAUNCH.md` yang sudah memakai bahasa umum.
- Berikutnya Hari 21: pengaturan web, kelola akun khusus Super Admin dan audit log; belum dimulai.
- Hari 19 CMS album massal + B2 online dan QA teknis/cleanup selesai, bukti
  di `docs/HARI-19-REVIEW.md`. HP fisik30foto dan grafik ClassB terisolasi masih menunggu. Application Key dimasukkan Hanif di lokal dan Runtime Secret Worker.
  Hari 20 ditangani terpisah di review terbaru. Target tinggi beranda, LCP <2,5, metadata
  tiga halaman dan Checkpoint 3 tetap terbuka. Preview WA/HP fisik/restore drill belum dibuktikan.
- **Fase 2 (10–16)** memoles desain E: berikutnya Hari 15 arsip/kontak/filter + alamat Pages → Worker
  (`docs/HARI-15-RENCANA.md`) selesai; hasil Hari 16 di `docs/HARI-16-REVIEW.md`; Checkpoint 3 belum disetujui.
  Penyesuaian sorotan jabatan Hari 14 online dan lolos produksi; review Hanif dan naskah sejarah/visi/misi sah dari BPH menyusul.
- **Fase 3 (17–22)** admin: dashboard & form kegiatan, editor berita + setujui/tolak, upload album massal,
  form dokumen + CRUD pengurus (Level 1), pengaturan/audit log/(opsional) lupa password email, panduan pengurus.
  Sertakan crop foto profil 3:4 dengan pratinjau potret + avatar dan langkah Simpan (pilihan Hanif saat review modal).
- **Fase 4 (23–30)** domain + SEO + analytics, hapus dummy & isi data asli, uji coba pengurus 1 minggu, launching.
- **Fase 5** fitur warga: RSVP, kas, pendaftaran anggota, aspirasi, UMKM, template surat, inventaris, absensi QR,
  liga 17an, generator LPJ.

---

### Cara memperbarui file ini

Di akhir setiap sesi besar, perbarui bagian **6, 9, 10, 11** bila ada keputusan baru. Ringkas, tanpa rahasia.
