# Backup Konteks Proyek — Platform Digital Karang Taruna RW 03 Cipedak

> **WAJIB DIBACA PERTAMA** oleh siapa pun (manusia atau AI agent) sebelum mengerjakan apa pun di repo ini.
> Urutan baca: **file ini → bagian paling bawah `DEVLOG.md` → `docs/SCHEDULE.md`**.
> File ini merangkum percakapan Hanif × Claude Code (29 Sep – 1 Okt 2026) supaya konteks tidak hilang
> walau riwayat chat dipadatkan (auto-compact) atau pindah ke sesi baru.
> Terakhir diperbarui: 18 Okt 2026, modal potret Hari 14 online dan lolos verifikasi produksi; crop interaktif dijadwalkan saat CMS. **Tidak berisi password/kunci rahasia — jangan pernah menambahkannya.**

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
| Hosting           | **Cloudflare Workers** `katar-rw03` → https://katar-rw03.ukktrw03cipedak.workers.dev | auto-build tiap push ke branch produksi (sekarang `revisi`)  |
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
**Berikutnya:** review Hari 14; Hari 15 (arsip, kontak/peta, filter bersama) setelah arahan Hanif. Cloudflare tetap dari
`revisi` sampai launching; main hanya diperbarui pada checkpoint (bukan otomatis setelah Hari 12).
⚠️ Versi dependensi laptop (npm, tanpa lockfile, lebih baru) ≠ Cloudflare (`bun.lock`, TanStack Start 1.167):
API baru bisa jalan di lokal tapi 500 di produksi (kasus `.validator` → pakai `.inputValidator`). Rencana:
selaraskan lockfile. Log error produksi: Cloudflare → katar-rw03 → Observability → Events.
Domain `workers.dev` tidak bisa tanpa nama worker; domain sendiri (mis. .my.id) di Fase 4.

**Keputusan storage (9 Okt 2026)** — Supabase Free terlalu kecil untuk "portal arsip" (1 GB, egress ±5 GB/bln;
video mustahil). Kartu BSI Hanif belum bisa (saldo kosong) → R2 ditunda. Dipakai **Backblaze B2** (akun email
Katar, tanpa kartu): bucket **`katar-rw03-media`**, PRIVATE, encryption on, object lock off, lifecycle "keep only
last version", region US West, endpoint `s3.us-west-004.backblazeb2.com`, semua caps $0 (tak mungkin ditagih).
Batas harian gratis: 10 GB simpan, 1 GB unduh/hari, 2.500 Class B/hari → **wajib** disajikan lewat Worker
Cloudflare dengan cache (nama file unik & immutable) agar B2 hanya disentuh sekali per file.
Pembagian: foto terkompres & video (≤200 MB, saran 720p) → B2 · PDF → Supabase Storage · file asli resolusi
penuh → GDrive Katar (tombol "Unduh asli" per album). Application key B2 dibuat saat Hari 19. Semua upload lewat
satu pintu `src/services/storage.ts`. Opsi R2 tetap terbuka bila ada kartu (bisa dipakai bersamaan, total 20 GB).
**Keputusan desain (9 Okt 2026):** dibuat 5 contoh beranda di `katar_profile/_contoh-desain/` (di luar repo, berisi
foto orang; server lokal `contoh-desain` port 8090): A Buletin Warga, B Poster Kampung, C Album Kenangan,
D Kekinian (bento/stories), E = desain web sekarang + foto asli. **Hanif memilih E** → Fase 2 = memoles desain
yang ada (bukan desain ulang total): isi foto asli, logo resmi, navbar sejajar + menu berkelompok/navigasi bawah HP (review 18 Okt),
perbaiki overflow horizontal di HP (hiasan `-right-32` di hero & marquee), kurangi ciri slop yang paling kentara.
Foto terpilih (37, WebP 1920) di `Downloads/.../Arsip Katar/_Pilihan Web/` (bukan di repo — repo publik).
Catatan lama — Desain: hindari ciri "AI slop" (Inter, label kapital berspasi, gradasi, kotak bulat+bayangan di mana-mana, hero
tengah + 3 kartu ikon); utamakan foto & konten asli, font serif bernuansa buletin warga, warna emblem
(biru tua/kuning/merah), motto "Aktif, Inovatif, Egaliter". Arah desain dipilih Hanif di awal Hari 10.
Logo resmi di `public/logo/` dari PNG transparan resolusi tinggi (Picsart, logo ±2078 px): 1024, 512, 192, 180, 48.
WA sekretariat = WA Ketum (disimpan di `pengaturan.kontak.whatsapp`). Menu "Untuk Warga" disembunyikan sampai Fase 5.
PR Hanif: password Super Admin kuat; simpan & nanti hapus CSV password awal; kumpulkan logo, nomor WA sekretariat,
akun IG resmi, ±20 foto kegiatan.

## 11. Rencana ke depan (ringkas)

- Hari 1–14 & Checkpoint 2 selesai; Hari 14 online dan verifikasi produksi lolos.
  Hari 12 menunggu review preview WA; Hari 13 menunggu review sentuhan HP fisik oleh Hanif.
  Selaraskan lockfile (laptop vs Cloudflare) masih tertunda.
- **Fase 2 (10–16)** memoles desain E: berikutnya Hari 15 arsip/kontak/filter, Hari 16 QA.
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
