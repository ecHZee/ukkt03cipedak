# 01 · Rencana Lengkap — Hari 12 sampai Launching (+ Fase 5)

> Dokumen serah terima dari Claude Code (Opus 5.5) ke agen berikutnya (Codex / GPT 6.1 Sol).
> Ditulis 18 Okt 2026. Sumber kebenaran jadwal tetap `docs/SCHEDULE.md` & `docs/PLANNING.md`; dokumen ini
> menambahkan **cara mengerjakan, alat yang dipakai, jebakan yang sudah diketahui, dan definisi selesai yang bisa
> diuji** untuk setiap hari. Baca juga `02-KONTEKS-PROGRES.md` (apa yang sudah ada) dan `03-CARA-KERJA.md`.

---

## 0. Peta lokasi (WAJIB tahu sebelum mulai)

| Apa                                     | Di mana                                                                                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Folder induk                            | `C:\Users\Hanif Zhafran\Documents\Tugas2_Kuliah\VSCode\Web\katar_profile\`                                                                     |
| **Repo web** (kerja di sini)            | `katar_profile\ukkt03cipedak\` — GitHub `ecHZee/ukkt03cipedak` (PUBLIC)                                                                        |
| Branch kerja                            | `revisi` (Cloudflare membangun dari branch ini). `main` = versi lolos checkpoint                                                               |
| Repo backup (PRIVATE)                   | `katar_profile\katar-rw03-backup\` — GitHub `ecHZee/katar-rw03-backup`                                                                         |
| Contoh desain A–E                       | `katar_profile\_contoh-desain\` (di LUAR repo — berisi foto orang). Hanif memilih **E**                                                        |
| Foto kegiatan asli                      | `C:\Users\Hanif Zhafran\Downloads\Download Software & Apps\Arsip Katar\_Siap Upload\…` (±2.160 foto, 25 kegiatan)                              |
| 37 foto terpilih (WebP 1920)            | `…\Arsip Katar\_Pilihan Web\` + `_RINGKASAN_PILIHAN.jpg`                                                                                       |
| Konfigurasi preview lokal               | `katar_profile\.claude\launch.json` (`cipedak-dev` port 5173, `contoh-desain` port 8090)                                                       |
| Dokumen konteks wajib                   | `ukkt03cipedak\backupcontext.md` → bawah `DEVLOG.md` → `docs\SCHEDULE.md`                                                                      |
| Rencana besar & audit awal              | `docs\PLANNING.md` (§16 = temuan audit repo Lovable), `docs\BLUEPRINT-AWAL.md` (prompt Lovable asli = hasil "reverse engineering" proyek awal) |
| Serah terima ini                        | `docs\handoff\` (01–05) + skill di `.agents\skills\katar-*\`                                                                                   |
| Rahasia (JANGAN dibaca keras/di-commit) | `ukkt03cipedak\.env.local`, `ukkt03cipedak\rahasia\` (CSV password awal 61 akun)                                                               |

### Akses layanan

| Layanan              | Akun / identitas                                                                          | Catatan                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| -------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Cloudflare**       | akun email Katar `ukktrw03cipedak@gmail.com`, subdomain `ukktrw03cipedak.workers.dev`     | Worker **`katar-rw03`** → https://katar-rw03.ukktrw03cipedak.workers.dev. Dashboard: Workers & Pages → katar-rw03. Settings → _Build_ (branch `revisi`, build `npm run build`, deploy `npx wrangler deploy`, build vars `VITE_*`) dan _Variables and Secrets_ (runtime: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — semua tipe Secret). Log error: katar-rw03 → Observability → Events. Login dashboard dilakukan **Hanif sendiri** (agen tidak memasukkan password). |
| **Supabase**         | proyek "Profile Web Database", ref `twmbcxjojknjtjwtntxr`, Singapore, Free                | CLI **selalu** `npm run db -- <perintah>` (token Katar dari `.env.local`). Laptop Hanif punya `SUPABASE_ACCESS_TOKEN` global milik akun PRIBADI — jangan dipakai/diubah. Management API bisa dipanggil dengan token dari `.env.local` (dipakai untuk config Auth & query SQL).                                                                                                                                                                                                                      |
| **GitHub**           | `ecHZee`                                                                                  | Push lewat kredensial git yang sudah tersimpan di laptop. `gh` CLI **tidak terpasang**.                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Backblaze B2**     | email Katar, tanpa kartu                                                                  | Bucket `katar-rw03-media` (PRIVATE, US West, endpoint `s3.us-west-004.backblazeb2.com`, lifecycle "keep only last version", caps $0). Application Key **belum dibuat** (dibuat Hanif di Hari 19).                                                                                                                                                                                                                                                                                                   |
| Hosting lama Lovable | editor Lovable tidak dipakai lagi; `main` masih tersambung ke Lovable — jangan force-push |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

---

## 1. Status singkat

Selesai: Hari 1–11 + Checkpoint 1 & 2 (detail: `02-KONTEKS-PROGRES.md`). Web online, login & 61 akun jalan,
database + RLS teruji 83/83, backup & ping otomatis jalan, beranda HP 6,05 layar.
**Berikutnya: Hari 12.**

Prinsip yang tidak boleh dilanggar di semua hari:

1. Desain **E** (biru Benhur #0047AB + emas #D4A017, batik halus, Plus Jakarta Sans + Inter) dipertahankan —
   **memoles**, bukan mendesain ulang. Hindari ciri "AI slop" baru (lihat skill `katar-desain`).
2. Bagian tanpa data **disembunyikan**, bukan diisi teks palsu.
3. Hak akses ditegakkan **RLS di database**, halaman admin hanya pintu depan.
4. Setiap perubahan: cek (tsc/eslint/build[/test:db]) → uji di browser 360 & 1440 px → DEVLOG → commit → push → cek web online.

---

## Fase 2 — Tampilan publik (sisa)

### Hari 12 · Halaman detail kegiatan & berita

**Tujuan:** setiap kegiatan & berita punya URL sendiri yang enak dibagikan.

Langkah:

1. Route file baru (TanStack Start file-based): `src/routes/kegiatan.$slug.tsx`, `src/routes/berita.$slug.tsx`.
   Loader memanggil service baru `ambilKegiatanSlug(slug)` / `ambilBeritaSlug(slug)` di `src/services/konten.ts`
   (filter `status = 'terbit'` — RLS juga sudah membatasi anon ke yang terbit). Slug tidak ada → `notFound()`.
   Data loader harus **plain object** (jangan kirim komponen/ikon lucide lewat loader → error serialisasi Seroval).
2. Ubah kartu di `KegiatanLatest`, `BeritaLatest`, `/kegiatan`, `/berita` agar menautkan ke detail
   (`<Link to="/kegiatan/$slug" params={{ slug }}>`). Setelah menambah route, **jalankan dev server sekali**
   supaya `src/routeTree.gen.ts` diperbarui, lalu **commit file itu** (jangan di-revert).
3. Tombol **Share WhatsApp**: `https://wa.me/?text=` + encodeURIComponent(judul + "\n" + URL absolut).
   URL absolut dari `SITE.url` (`VITE_SITE_URL`). Pakai `navigator.share` bila tersedia (HP), fallback ke WA link.
4. Tombol **Tambah ke Google Calendar** (khusus kegiatan bertanggal):
   `https://calendar.google.com/calendar/render?action=TEMPLATE&text=…&dates=YYYYMMDDTHHMMSS/…&ctz=Asia/Jakarta&location=…&details=…`.
   Kegiatan tanpa jam → event seharian (`dates=YYYYMMDD/YYYYMMDD+1`). Kegiatan rutin tanpa tanggal → sembunyikan tombol.
5. **OG image per konten**: `head()` di route detail mengisi `og:title`, `og:description`, `og:image` (absolut),
   `og:url`, `twitter:card=summary_large_image`. Sebelum ada foto asli: pakai `/logo/logo-512.png`. Setelah
   Hari 19: cover foto. (Opsional lanjutan: generator gambar OG dinamis — tunda, jangan over-engineer.)
6. Kartu agenda baru (tanggal besar, lokasi, warna bidang dari `gayaBidang()` di `src/domains/program/style.ts`).

Alat: TanStack Router (`createFileRoute`, `notFound`, `head`), Supabase JS, lucide-react.
Uji: buka detail di 360 & 1440 px; `curl -s <url> | grep og:` di web online untuk memastikan meta tersaji SSR;
klik tombol Calendar menghasilkan tanggal & zona benar.
**Selesai bila:** Hanif mengirim link kegiatan ke grup WA percobaan dan pratinjau menampilkan judul + gambar.
Jebakan: berita belum punya tanggal acara; `terbit_at` bisa null untuk data lama; slug unik di DB.

### Hari 13 · Galeri

1. `/galeri` (daftar album) & `src/routes/galeri.$album.tsx`.
2. Layout masonry (CSS `columns` cukup, tanpa library) + bingkai polaroid **hanya** bila cocok dengan gaya E.
3. Lightbox: geser, zoom di HP, tutup Esc, tombol kiri/kanan; render lewat **portal ke `document.body`**
   (animasi `<main>` membuat `position:fixed` terkurung — sudah terjadi di admin).
4. Video: file pendek (≤200 MB, nanti dari B2) diputar `<video controls preload="metadata">`; link
   YouTube/IG/TikTok di-embed (lihat `bacaLinkVideo` di `src/services/storage.ts`).
5. Lazy load (`loading="lazy"`, `decoding="async"`, ukuran eksplisit).
   **Selesai bila:** album 50 foto tetap lancar di HP. Catatan: foto asli baru masuk setelah Hari 19; uji dengan data dummy.

### Hari 14 · Tentang, pengurus, bidang

1. Tentang: sejarah, visi-misi, dasar hukum (Permensos 25/2019) sebagai accordion (shadcn `accordion`).
2. `/tentang/pengurus`: kartu pengurus dengan **avatar inisial** warna bidang (foto hanya bila `izin_foto`),
   filter per bidang; badge BPH (emas) & Penasihat (gelap) seperti di admin.
3. `src/routes/program.$bidang.tsx`: pengurus + kegiatan bidang tersebut.
   **Selesai bila:** 61 pengurus tampil benar per bidang. 🙋 Hanif minta BPH verifikasi teks visi/misi/sejarah.

### Hari 15 · Arsip, kontak, filter + alamat publik Pages

1. `/arsip` dengan akses berjenjang — dokumen yang tak boleh dilihat **tidak dikirim** dari server (RLS + query).
   Dokumen internal → signed URL 10 menit (`urlSementara`).
2. Kontak + peta (embed Google Maps; `pengaturan.kontak.maps_url` bila diisi).
3. **Satu komponen filter** (chip nama singkat bidang, bisa digeser di HP — pola `snap-x` dari Hari 11) untuk
   kegiatan, berita, arsip; state filter di search params URL.
4. Redirect `/lpj` → `/arsip` (route `lpj.tsx` → `beforeLoad: throw redirect`). Ganti badge emoji dengan ikon.
5. Tambahan disetujui Hanif 18 Okt 2026: Pages sebagai alamat publik pendek, meneruskan request ke
   Worker `katar-rw03` lewat Service Binding. Target `https://ukkt03cipedak.pages.dev` (nama belum dicek).
   Worker, alur build `revisi`, secret aplikasi, Supabase dan Storage tetap digunakan; tidak membeli domain
   atau migrasi penuh aplikasi ke Pages. Setelah fitur 1–4 selesai, uji proxy lokal lalu produksi, termasuk
   aset/GET/POST, login/admin, dokumen internal, cache privat, metadata/tautan dan kuota/waktu respons.
   Sesuaikan `VITE_SITE_URL` dan konfigurasi Auth yang relevan setelah pengujian memungkinkan peralihan.
   **Selesai bila:** fitur 1–4 teruji, tidak ada label bahasa Inggris & emoji di UI publik, alamat Pages tetap
   terlihat saat navigasi dan hak akses tetap benar. Alamat lama tersedia selama QA; bila proxy gagal,
   catat kegagalan dan pertahankan Worker sambil memperbaiki, jangan diam-diam mengganti arsitektur.
   Rencana rinci: [HARI-15-RENCANA.md](../HARI-15-RENCANA.md). Saat keputusan ini dicatat, implementasi
   Hari 15 dan konfigurasi dashboard belum dimulai. Pembaruan setelah pelaksanaan: **Hari 15 selesai
   18 Okt 2026 (ab804b1), Pages sudah utama**; lihat [review](../HARI-15-REVIEW.md).

### Hari 16 · QA tampilan

Rencana: [HARI-16-RENCANA.md](../HARI-16-RENCANA.md), disetujui Hanif 18 Oktober 2026.
Pelaksanaan dan bukti: [HARI-16-REVIEW.md](../HARI-16-REVIEW.md). Perbaikan/QA teknis sudah online,
155 kombinasi produksi dan 62 axe lolos. Median LCP final 2,741 detik; target <2,5 belum konsisten.
Hari 16 belum ditutup penuh; Checkpoint 3 menunggu Hanif/Ketua. Hari 17 belum dimulai.

1. Cek semua halaman di 360, 390, 768, 1024, 1440 px: assert `innerWidth` pada tab yang diuji;
   `document.documentElement.scrollWidth === document.documentElement.clientWidth` membuktikan tanpa
   overflow halaman (gutter scrollbar Windows membuat clientWidth dapat lebih kecil dari innerWidth).
2. Kontras (WCAG AA), target sentuh ≥44 px, `prefers-reduced-motion`.
3. Kecepatan: LCP < 2,5 s (Lighthouse / Chrome DevTools di web online, throttling 4G).
4. Perbaiki temuan. (Opsional, bila Hanif setuju) poles halus: kurangi label kapital berspasi & bayangan berlebih.
   🚩 **Checkpoint 3:** review bersama Ketua → fast-forward `main` ke `revisi`.

## Fase 3 — Admin (form yang benar-benar dipakai)

Konteks: halaman admin `/admin/berita`, `/admin/kegiatan`, `/admin/galeri`, `/admin/dokumen`, `/admin/settings`,
`/admin/audit-log` sebagian masih **maket statis dari Lovable**. Yang sudah nyata: dashboard dasar, Profil Saya,
Pengurus (izin kontribusi), **Akun** (Super Admin, fungsi server), login.

### Hari 17 · Dashboard & form kegiatan

Dashboard: ringkasan, draft menunggu persetujuan (`status in ('draft','review')` di jangkauan admin), pemakaian
penyimpanan. Form kegiatan (judul, slug otomatis, tanggal/jam, lokasi, bidang, rutin + jadwal teks, status).
Hak: anggota berizin hanya draft di bidangnya; admin menerbitkan (trigger `disetujui_oleh` otomatis).
**Selesai bila:** kegiatan baru dari admin langsung muncul di beranda.

### Hari 18 · Editor berita + Setujui/Tolak

Editor teks sederhana (markdown/textarea + pratinjau; hindari editor WYSIWYG berat), cover gambar, alur
draft → review → terbit, tombol **Setujui / Tolak** untuk admin. Kabid hanya bidangnya, BPH semua (RLS
`boleh_terbit`). **Selesai bila:** uji dengan akun uji Kabid & anggota berizin (buat via skrip, hapus setelahnya).

### Hari 19 · Upload galeri massal + **Backblaze B2**

1. 🙋 Hanif membuat **Application Key** B2 (akses hanya ke bucket `katar-rw03-media`, read+write) dan
   memasukkannya sendiri ke `.env.local` + Cloudflare Secrets (`B2_KEY_ID`, `B2_APPLICATION_KEY`,
   `B2_BUCKET`, `B2_ENDPOINT`). Agen tidak pernah melihat/mengetik nilainya.
2. Upload: browser kompres foto (sudah ada `kompresFoto` → WebP 1920) → minta **presigned PUT URL** dari fungsi
   server (AWS SigV4 kompatibel S3; gunakan `aws4fetch` — ringan & jalan di Workers) → PUT langsung ke B2.
   Nama file unik & immutable: `<bidang>/<album-id>/<uuid>.webp`.
3. Penyajian: route server `/media/*` di Worker yang mengambil dari B2 (bucket private, ditandatangani) lalu
   menyimpan di **Cloudflare Cache API** dengan `Cache-Control: public, max-age=31536000, immutable`.
   Wajib, karena batas gratis B2: **1 GB unduh/hari, 2.500 Class B/hari**.
4. Video ≤200 MB (saran rekam 720p); tolak di browser bila lebih.
5. Progress bar, lanjut otomatis bila koneksi putus (unggah satu-satu dengan retry), atur cover & urutan, link video.
6. Tombol "Unduh foto asli" per album → tautan folder GDrive (kolom baru di `album`, mis. `gdrive_url`).
7. Pindahkan semua upload lewat satu pintu `src/services/storage.ts`. PDF tetap di Supabase Storage.
   **Selesai bila:** upload 30 foto dari HP berhasil sekali proses; foto tampil di galeri publik lewat `/media/…`
   dan kunjungan kedua tidak menambah hitungan Class B di dashboard B2.

### Hari 20 · Arsip dokumen & CRUD pengurus (Admin Level 1)

Upload dokumen + level akses (enum `akses_dokumen`: `publik` / `anggota` / `bph`), kelola pengurus per periode (tambah, ubah
jabatan → role ikut berubah lewat trigger, izin foto). **Selesai bila:** dokumen berakses BPH tidak terlihat saat logout.

### Hari 21 · Pengaturan, audit log, (opsional) lupa password

Pengaturan web: WA, email, sosmed, alamat, peta, logo, foto hero, **pengumuman** (`{"teks","tautan","sampai"}`).
⚠️ Mengosongkan nilai harus menulis JSON `null` (`'null'::jsonb`) atau `""` — `null` dari supabase-js menjadi
NULL SQL dan ditolak (kolom NOT NULL). Audit log nyata (tabel `audit_log`, termasuk entri `tabel='akun'`).
Lupa password via email butuh SMTP — opsional; default tetap reset oleh Super Admin di menu Akun.
**Selesai bila:** ganti nomor WA dari admin langsung berubah di seluruh web.

### Hari 22 · Panduan pengurus & uji mandiri

`docs/PANDUAN-PENGURUS.md` + versi bergambar, halaman bantuan singkat di admin.
🙋 Hanif meminta 1 anggota Bid. Media yang belum pernah melihat admin mencoba posting hanya dengan panduan.
🚩 **Checkpoint 4** → `main`.

## Fase 4 — Launching

| Hari  | Isi                                                                                                                                                                                            | Catatan cara                                                                                                                                                            |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 23    | Domain (mis. `.my.id`/`.or.id`, dibeli Hanif dengan akun organisasi) + HTTPS, meta per halaman, canonical absolut, `sitemap.xml`, `robots.txt`, JSON-LD Organization, Cloudflare Web Analytics | Tambah Custom Domain di Worker; ubah `VITE_SITE_URL`, Supabase Auth Site URL (Management API `PATCH /v1/projects/{ref}/config/auth`), dan og:image absolut              |
| 24    | Hapus data `is_dummy` (`npm run seed:dummy -- --hapus`), input data awal asli, upload foto asli (37 foto terpilih sebagai awal)                                                                | Pastikan izin foto pengurus; jangan pasang foto Reses (backdrop politisi) di beranda; hindari close-up wajah anak                                                       |
| 25–29 | Uji coba pengurus 1 minggu                                                                                                                                                                     | Perbaiki kendala harian; catat di DEVLOG                                                                                                                                |
| 30    | Launching & serah terima                                                                                                                                                                       | Final check keamanan, backup, ping, analytics; tetapkan 2 Super Admin; **ganti Cloudflare Branch control ke `main`**; hapus `rahasia/akun-awal-*.csv` setelah dibagikan |

Sebelum launching juga: **selaraskan lockfile** (laptop npm tanpa lockfile vs Cloudflare `bun.lock` — lihat
`02-KONTEKS-PROGRES.md` masalah #1). Pilihan: install bun di laptop & pakai `bun install`, atau hapus
`bun.lock` + commit `package-lock.json` (Cloudflare lalu memakai npm). Putuskan bersama Hanif.

## Fase 5 — Fitur warga (setelah launching, bertahap)

RSVP agenda → transparansi kas ringkas → pendaftaran anggota → kotak aspirasi → UMKM warga → template surat
unduhan → peminjaman inventaris → absensi QR → liga 17an → generator LPJ. Tidak ada akun warga; tidak ada
pengajuan surat online/janji temu RT/RW (di luar wewenang Karang Taruna).

## Keputusan yang masih terbuka

- Auto-logout admin 30 menit tanpa aktivitas (+ peringatan 1 menit) — belum diputuskan Hanif.
- Tanggal pelantikan (SK tetap 05 Juni 2025) — menunggu Ketua.
- R2 sebagai tambahan B2 bila kelak ada kartu (saldo BSI ±Rp100rb untuk hold US$5).
- Poles anti-slop halus (label kapital, bayangan) — tawarkan di Hari 16, jangan paksakan.
