# DEVLOG — Platform Digital Karang Taruna RW 03 Cipedak

Catatan perubahan wajib untuk **semua** yang mengedit project ini (manusia maupun AI:
Lovable, Codex, Claude Code, Cursor, dll).

## Aturan (WAJIB)

1. **Sebelum mulai kerja:** baca file ini dari bawah untuk tahu status terakhir.
2. **Setelah selesai kerja:** tambahkan **satu section baru di paling bawah** file ini.
3. **Append-only:** dilarang menghapus, menimpa, atau mengedit section lama. Hanya boleh menambah.
4. **Satu sesi kerja = satu section.** Jangan menggabung beberapa sesi jadi satu.
5. Waktu memakai zona **WIB (UTC+7)** dengan format `YYYY-MM-DD HH:mm WIB`.

### English (for non-Indonesian agents)

This is an **append-only** development log. Before you start, read the last section.
After you finish, **append one new section at the very bottom** using the template below.
Never edit, overwrite, or delete existing sections.

## Template section

```text
## [YYYY-MM-DD HH:mm WIB] — <Nama AI / Orang>
**Fase:** <fase atau sprint>
**Ringkasan:** <1–3 kalimat apa yang dikerjakan>
**File berubah:**
- path/ke/file.tsx
**Catatan / dampak:** <opsional: efek samping, yang sengaja tidak dikerjakan, TODO>
**Status:** Selesai | Sebagian | Diblokir

---
```

Field wajib: waktu, nama, fase, ringkasan, file berubah, status.
Field opsional: catatan/dampak, tindak lanjut.

---

## [2025-06-09 → 2026-09-16] — Lovable (ringkasan historis)
**Fase:** Blueprint v1.0 → Visual Design Final → Sprint 0 s/d Design Freeze (2A.75)
**Ringkasan:** Rangkuman seluruh progress sebelum DEVLOG ini dibuat, dicatat sebagai
satu entri historis agar log tidak mulai dari kosong.

- **Blueprint v1.0 (LOCKED):** konsep "Markas Digital", pemisahan Portal Publik (SSR/SEO)
  dan CMS Internal (auth-gated), peran Super Admin / Admin / Editor / Member,
  autentikasi username + password tanpa registrasi mandiri.
- **Visual Design Final (LOCKED):** hybrid 60% Markas Digital / 25% Balai Modern /
  15% Pemuda Cipedak. Heading Plus Jakarta Sans, body Inter. Primary `#0047AB`,
  accent gold `#D4A017`. Motif bento grid, batik subtle, tanpa gambar AI untuk konten utama.
- **Sprint 0 — Foundation:** integrasi Lovable Cloud, design token OKLCH di `src/styles.css`,
  arsitektur folder (`domains/`, `features/`, `components/`, `constants/`, `services/`),
  scaffolding 17 route TanStack Router, utilitas SEO, provider global.
- **Sprint 0.5 + 1A — Landing Page:** Navbar, Hero, Running Banner, Live Clock & Calendar
  (hydration-safe), Statistik, Tentang, Program, Kegiatan, Berita, Galeri, Kontak.
- **Sprint 1B–1D — Public Core:** halaman Tentang (timeline + Human Directory),
  Program (7 bidang resmi), Kegiatan (timeline + filter bidang), Berita (featured + grid).
  Data struktur organisasi 2025–2028 (BPH + 7 bidang, 27 slot) dan tanggal pelantikan
  09 Juni 2025.
- **Sprint 1E + 2A — Galeri, Arsip Digital, Kontak + CMS UI:** masonry + lightbox,
  daftar dokumen dengan search/filter dan access badge, halaman kontak;
  `AdminShell` dan 9 tampilan admin (UI saja, tanpa logic backend).
- **Final UI Polish:** micro-interaction, skeleton, empty/error state, audit a11y.
- **Design Freeze (2A.75):** varian `PageHero` per halaman, Leadership Showcase BPH,
  featured news dinamis, rebrand LPJ → Arsip Digital, batik subtle di hero/divider/footer,
  perapian Hero beranda (floating stats dihapus, label dokumentasi dipindah ke atas collage).

**Catatan / dampak:** Belum ada backend, auth, atau CRUD yang dibangun. Tahap berikutnya
adalah fase Software Engineering (auth + CMS logic) sesuai Blueprint v1.0.
**Status:** Selesai

---

## [2026-09-16 17:24 WIB] — Lovable
**Fase:** Infrastruktur dokumentasi
**Ringkasan:** Membuat `DEVLOG.md` append-only dan menambahkan aturan wajib pengisiannya
di `AGENTS.md` agar semua AI coding agent mencatat setiap editan sebagai section baru.
**File berubah:**
- DEVLOG.md (baru)
- AGENTS.md

**Catatan / dampak:** Tidak ada perubahan kode aplikasi, design token, maupun backend.
Aturan ini bersifat konvensi; penegakan teknis (pre-commit hook) belum dipasang.
**Status:** Selesai

---

## [2026-09-29 23:30 WIB] — Claude Code (Claude Opus 5.5)
**Fase:** Audit & Perencanaan
**Ringkasan:** Audit menyeluruh (kode, build, tampilan 375/1024 px) lalu menyusun rencana
pengembangan v1.0: arsitektur Supabase + Cloudflare R2, model data, role tunggal, sitemap,
arah desain, dan Fase 0–5. Struktur pengurus disesuaikan dengan SK No. 003/SK/KT-Cipedak/VI/2025.
**File berubah:**
- docs/PLANNING.md (baru)
- DEVLOG.md

**Catatan / dampak:** Tidak ada perubahan kode aplikasi. Rencana masih draft untuk dibahas
dengan Ketua; pertanyaan terbuka ada di PLANNING.md §15.
**Status:** Selesai

---

## [2026-09-30 20:35 WIB] — Claude Code (Claude Opus 5.5)
**Fase:** Perencanaan
**Ringkasan:** Menyusun jadwal harian revisi (30 hari kerja, 4 checkpoint) sebagai turunan
PLANNING.md, lengkap dengan pembagian tugas Claude/Hanif dan kriteria selesai per hari.
**File berubah:**
- docs/SCHEDULE.md (baru)
- DEVLOG.md

**Catatan / dampak:** Tidak ada perubahan kode. Proyek Supabase baru ("Profile Web Database",
Singapore, Free) sudah dibuat Hanif; belum ada migrasi.
**Status:** Selesai

---

## [2026-09-30 20:58 WIB] — Claude Code (Claude Opus 5.5) bersama Hanif
**Fase:** Fase 0 — Hari 1 (Setup & keamanan repo)
**Ringkasan:** Membuat branch `revisi`, menormalkan line ending (LF) dan format kode, mengeluarkan
`.env` proyek Supabase lama dari git, memperbaiki tipe error page dan menerjemahkan halaman 404/error,
serta menyambungkan Supabase CLI ke proyek baru lewat `npm run db` (token akun Katar dari `.env.local`).
**File berubah:**
- .gitattributes (baru), .gitignore, .prettierignore, .env.example (baru), .env (dihapus dari git)
- package.json (nama, engines, script `db`)
- scripts/supabase.mjs (baru)
- supabase/config.toml
- src/routes/__root.tsx, src/constants/site.ts, src/integrations/supabase/previewAuthStorage.ts
- ±60 file lain: format Prettier saja (tanpa perubahan logika)

**Catatan / dampak:**
- Di proyek ini selalu pakai `npm run db -- <perintah>`, bukan `npx supabase`. Komputer Hanif punya
  `SUPABASE_ACCESS_TOKEN` global milik akun pribadi; skrip sengaja membaca token dari `.env.local`.
- Editor Lovable tidak dipakai lagi mulai sesi ini.
- Proyek Supabase: "Profile Web Database" (twmbcxjojknjtjwtntxr), Singapore, Free. Belum ada migrasi.
- tsc bersih, lint 0 error (7 warning bawaan shadcn/ui), build lolos.
**Status:** Selesai

---

## [2026-09-30 21:10 WIB] — Claude Code (Claude Opus 5.5)
**Fase:** Dokumentasi
**Ringkasan:** Menulis ulang README (cara menjalankan, progres, stack, perintah, env, struktur folder,
alur kontribusi & vibe coding dengan AI). Isi README lama (prompt ke Lovable) diarsipkan.
**File berubah:**
- README.md
- docs/BLUEPRINT-AWAL.md (baru)
- DEVLOG.md

**Status:** Selesai

---

## [2026-09-30 21:15 WIB] — Claude Code (Claude Opus 5.5)
**Fase:** Fase 0 — Hari 2 (Data SK & perbaikan tampilan cepat)
**Ringkasan:** Struktur pengurus & 7 bidang disesuaikan dengan SK No. 003/SK/KT-Cipedak/VI/2025
(61 orang: 2 penasihat, 8 BPH, 51 anggota bidang; Kabid = nama urutan pertama). Model role disatukan,
data palsu dihapus, hero Tentang & navbar 1024 px diperbaiki, arsip publik hanya memuat dokumen publik.
**File berubah:**
- src/domains/anggota/data.ts, src/domains/program/data.ts, src/domains/dokumen/data.ts
- src/domains/berita/data.ts, src/domains/kegiatan/data.ts, src/domains/galeri/data.ts
- src/constants/site.ts (ROLES, ROLE_LABEL, RT_LIST)
- src/components/public/anggota/* (LeadershipShowcase, HumanDirectory, PersonCard, PersonDialog)
- src/components/public/landing/* (AboutPreview, BeritaLatest, Footer, Hero, LiveClockCalendar,
  Navbar, ProgramBento, QuickInformation, RunningBanner, StatsStrip, placeholders)
- src/components/public/PageHero.tsx
- src/routes/tentang.tsx, lpj.tsx, kegiatan.tsx, berita.tsx, program.tsx,
  admin.anggota.tsx, admin.users.tsx, admin.dashboard.tsx, admin.kegiatan.tsx, admin.audit-log.tsx

**Catatan / dampak:**
- Slug bidang berubah: kemasyarakatan→lingkungan, usaha→ekonomi, olahraga→pendidikan, inventarisasi→inventaris.
  Field `short` dipecah menjadi `singkat` (chip/filter) dan `tagline`.
- Role tunggal: super_admin · bph · editor_bidang · anggota. Akses dokumen: publik · anggota · bph.
- Semua "dilantik 09 Juni 2025" diganti "dikukuhkan melalui SK tanggal 05 Juni 2025" (keputusan D10).
  `PERIODE_AKTIF.tanggalPelantikan` = null sampai Ketua mengonfirmasi; bila ada acara pelantikan
  terpisah, tambahkan kembali sebagai kegiatan/berita tersendiri.
- Libur nasional 2026 diganti sesuai SKB 3 Menteri (sebelumnya Wafat Yesus & Waisak salah, 4 libur hilang).
- Agenda "hari ini" palsu dan statistik "12 Dokumen LPJ" dihapus; statistik dihitung dari data.
- PageHero `split` sementara disamakan dengan `primary`; menu desktop kini muncul mulai 1280 px.
- Diverifikasi di browser: 375 px & 1024 px tanpa scroll horizontal, 61 kartu pengurus, 59 pengurus aktif,
  arsip publik tidak lagi menampilkan judul dokumen internal.
- Nama & gelar pengurus perlu dicek ulang oleh Hanif (penulisan gelar diseragamkan, mis. "S. Pd." → "S.Pd.").
**Status:** Selesai (menunggu review Hanif → Checkpoint 1)

---

## [2026-09-30 21:25 WIB] — Claude Code (Claude Opus 5.5)
**Fase:** Checkpoint 1 (akhir Fase 0)
**Ringkasan:** Hanif menyetujui hasil Fase 0. Branch `revisi` di-merge (fast-forward) ke `main`.
Tabel progres README diperbarui.
**File berubah:**
- README.md
- DEVLOG.md

**Catatan / dampak:** Penasihat dipisah dari BPH, Wakil Ketua tanpa penomoran, dan penulisan gelar
diseragamkan — disetujui. Berikutnya: Fase 1 (Hari 3, tabel inti Supabase).
**Status:** Selesai

---

## [2026-09-30 21:32 WIB] — Claude Code (Claude Opus 5.5)
**Fase:** Fase 1 — Hari 3 (Tabel inti)
**Ringkasan:** Migrasi pertama diterapkan ke Supabase: tabel `periode`, `bidang`, `pengurus`, `profiles`,
`pengaturan`, `audit_log`, enum role, helper role, RLS per tabel, trigger `updated_at`, trigger privasi
foto/Instagram, dan trigger audit log otomatis. Rencana media diubah ke Supabase Storage.
**File berubah:**
- supabase/migrations/20260930143033_tabel_inti.sql (baru)
- docs/PLANNING.md, docs/SCHEDULE.md (R2 → Supabase Storage)
- DEVLOG.md

**Catatan / dampak:**
- Diuji dengan publishable key (sebagai pengunjung): baca tabel publik OK; tulis `bidang`, membuat
  `profiles` super_admin palsu, dan menulis `audit_log` semuanya ditolak (401). `catat_audit` tidak bisa dipanggil via API.
- Diuji dengan secret key: IG/foto tanpa izin otomatis null; anggota bidang tanpa bidang ditolak;
  audit log tercatat. Data uji sudah dihapus (tabel kembali kosong).
- `supabase db lint --linked`: tidak ada error.
- Cloudflare R2 wajib kartu/PayPal walau gratis → media memakai Supabase Storage (1 GB, maks 50 MB/file)
  sampai Katar punya kartu debit/virtual. Akun Cloudflare tetap dipakai untuk hosting.
- Belum ada data di tabel: seed dijadwalkan Hari 5. Tabel konten dijadwalkan Hari 4.
**Status:** Selesai

---

## [2026-09-30 23:25 WIB] — Claude Code (Claude Opus 5.5)
**Fase:** Fase 1 — Hari 4 (Tabel konten) + perubahan model role
**Ringkasan:** Tabel `kegiatan`, `album`, `media`, `berita`, `dokumen` beserta RLS, trigger pembuat &
tanggal terbit, dan audit log. Model role diganti sesuai keputusan Hanif: `super_admin` (programmer saja)
dan `admin` (BPH lintas bidang, atau Kabid & anggota pilihan Kabid per bidang). Tes CRUD otomatis
`npm run test:db` ditambahkan: 44/44 lolos.
**File berubah:**
- supabase/migrations/20260930161229_tabel_konten.sql (baru)
- supabase/migrations/20260930161751_role_programmer_admin.sql (baru)
- scripts/test-db.mjs (baru), package.json (script `test:db`)
- src/integrations/supabase/types.ts (generate ulang dari database)
- src/constants/site.ts, src/routes/admin.users.tsx (role baru)
- docs/PLANNING.md (§7 role), docs/SCHEDULE.md (Hari 9: uji CRUD ujung-ke-ujung; Hari 18), README.md
- DEVLOG.md

**Catatan / dampak:**
- Role di database: `super_admin` | `admin`. Jangkauan admin = `profiles.bidang_id` (null = BPH, lintas bidang).
  Hanya Super Admin yang bisa membuat/mengubah akun. Anggota lain tidak punya akun.
- Admin boleh langsung menerbitkan dalam jangkauannya; status `review` tetap ada tapi opsional.
- Dokumen berakses `bph` hanya bisa dibuat/diubah/dilihat BPH & Super Admin; `anggota` = semua admin login.
- `test:db` membuat 2 bidang + 3 akun uji (BPH, Kabid A, Kabid B), menguji C/R/U/D + batas bidang + role
  + audit log, lalu menghapus semuanya (dicek: semua tabel & auth users kembali 0).
- `db lint --linked` bersih. Migrasi Hari 3 tidak diubah; perubahan role lewat migrasi baru.
- Disepakati: Hari 9 ditambah uji CRUD ujung-ke-ujung dari layar (login → berita + foto + PDF → publik → edit → hapus).
- Catatan risiko: Super Admin hanya satu programmer = titik tunggal; disarankan 1 programmer cadangan (PLANNING Q2).
**Status:** Selesai

---

## [2026-09-30 23:36 WIB] — Claude Code (Claude Opus 5.5)
**Fase:** Fase 1 — Hari 5 (Isi awal & sambungan pertama)
**Ringkasan:** Data resmi SK dimasukkan ke database lewat migrasi (periode 2025–2028, 7 bidang,
61 pengurus, pengaturan awal). Skrip konten dummy ditambahkan. Halaman Tentang & Program kini
mengambil data dari Supabase saat render di server (SSR).
**File berubah:**
- supabase/migrations/20260930162925_data_awal.sql (baru)
- scripts/seed-dummy.mjs (baru), package.json (script `seed:dummy`)
- src/services/organisasi.ts (baru) — ambilBidang, ambilPeriode, ambilPengurus, ambilOrganisasi
- src/domains/program/style.ts (baru) — ikon & warna per bidang (bukan data)
- src/routes/tentang.tsx, src/routes/program.tsx (loader dari database)
- src/components/public/anggota/* (data lewat props; nama bidang dari database)
- src/domains/anggota/data.ts (field bidangNama/bidangSingkat)
- README.md, docs/SCHEDULE.md, DEVLOG.md

**Catatan / dampak:**
- Migrasi punya pengaman: batal bila jumlah pengurus ≠ 2 penasihat / 8 BPH / 51 anggota bidang.
- Pengaturan kontak/sosmed diisi `null` (belum ada data); bagian terkait disembunyikan mulai Hari 6.
- Dummy: 8 kegiatan & 6 berita (`is_dummy = true`, status terbit). `npm run seed:dummy -- --hapus`
  menghapus semuanya. Album & foto dummy ditunda ke Hari 8 (Storage belum ada).
- Data loader harus polos (bisa diserialisasi): ikon lucide dipasang di komponen, bukan di loader.
- Dibuktikan: tagline bidang diubah langsung di database → tampil di /tentang; dikembalikan → hilang.
  Navigasi klien (klik menu) juga memuat data dari database. Tanpa error console. `test:db` tetap 44/44.
- Halaman lain (beranda, kegiatan, berita, galeri, arsip, admin) masih memakai file statis → Hari 6.
**Status:** Selesai

---

## [2026-10-01 19:20 WIB] — Claude Code (Claude Opus 5.5)
**Fase:** Fase 1 — Hari 6 (Semua halaman dari database)
**Ringkasan:** Beranda, Kegiatan, Berita, Galeri, Arsip, Kontak, dan 7 halaman admin kini membaca data
dari Supabase lewat loader SSR. Pengaturan situs & periode aktif dimuat sekali di root route. Bagian tanpa
data otomatis disembunyikan. File data statis lama dihapus.
**File berubah:**
- src/services/konten.ts (baru) — kegiatan, berita, album, dokumen publik, pengaturan, link WA, kegiatan terdekat
- src/services/organisasi.ts (hitungPengurusAktif)
- src/domains/konten/types.ts (baru), src/domains/dokumen/types.ts (baru)
- src/hooks/use-situs.ts (baru), src/routes/__root.tsx (loader pengaturan + periode, staleTime 5 menit)
- src/routes/index.tsx, kegiatan.tsx, berita.tsx, galeri.tsx, lpj.tsx, kontak.tsx, tentang.tsx, program.tsx
- src/routes/admin.dashboard/anggota/kegiatan/berita/galeri/dokumen/settings.tsx
- src/components/public/landing/* (Navbar, Footer, Hero, AboutPreview, StatsStrip, RunningBanner,
  ProgramBento, KegiatanLatest, BeritaLatest, GaleriPreview, QuickInformation, KontakSection)
- src/components/public/anggota/PersonCard.tsx, PersonDialog.tsx
- src/domains/anggota/data.ts & src/domains/program/data.ts → tinggal tipe
- DIHAPUS: src/domains/{kegiatan,berita,galeri,dokumen}/data.ts, src/config/app.ts,
  src/components/public/landing/placeholders.tsx

**Catatan / dampak:**
- Sembunyikan-kosong: tombol Gabung/CTA WA hanya muncul bila `kontak.whatsapp` terisi; kanal email/sosmed
  hanya yang terisi; bagian Galeri/Berita/Kegiatan beranda hilang bila datanya kosong; statistik 0 tidak tampil.
  Diuji dua arah: WA & album uji diisi → muncul; dihapus → hilang lagi.
- Konvensi pengaturan "belum diisi" = JSON null atau string kosong "" (kolom `value` NOT NULL, jadi lewat API
  pakai ""). `ambilPengaturan` memperlakukan keduanya sebagai kosong.
- Relasi album↔media ganda (media.album_id & album.cover_id) → query memakai `media!media_album_id_fkey`.
- Galeri: filter kategori karangan (Rapat/Futsal/Pawai Obor) diganti filter bidang (sesuai database).
- Kontak: tabel "Jam Operasional" dihapus (data belum diverifikasi). Tombol "Baca Selengkapnya" berita yang
  tidak mengarah ke mana pun dihapus; halaman detail menyusul Hari 12.
- Admin masih tampilan saja dan sebelum login (Hari 7) hanya membaca konten terbit/publik.
- Kegiatan terdekat: akan datang (terdekat dulu) + rutin; bila kosong, tampil kegiatan terakhir.
- Semua 17 route 200 (404 untuk route tak dikenal), tanpa error console, tanpa scroll horizontal di 375 px.
  Beranda di HP kini ±12 layar (target ≤6 di Fase 2). `test:db` 44/44, build lolos.
**Status:** Selesai

---

## [2026-10-01 19:36 WIB] — Claude Code (Claude Opus 5.5)
**Fase:** Hari 6.5 — Perbaikan dari review Hanif (WIP, dijeda)
**Ringkasan:** Satu desain hero untuk semua halaman (7 varian lama dihapus) dan kolase hero Beranda
dibuat grid 2×2 simetris. Revisi nama bidang BELUM diterapkan ke database.
**File berubah:**
- src/components/public/PageHero.tsx (satu desain biru + batik; prop `variant` dihapus)
- src/components/public/landing/Hero.tsx (grid 2×2 sama ukuran)
- src/routes/berita, galeri, kegiatan, kontak, lpj, program, tentang (hapus `variant=`)

**Catatan / dampak:**
- Catatan review Hanif: (1) kolase hero tidak simetris ✅, (3) hero Program/Kegiatan/Arsip tanpa latar ✅,
  (4) hero Berita rusak ✅, (5) warna hero tidak konsisten ✅ — semua lewat satu PageHero. Belum dicek di browser.
- (2) Revisi nama bidang dari gambar pengumuman: Media → "Media Publikasi, Dokumentasi & Digitalisasi",
  Inventaris → "Inventarisasi & Kearsipan", OKK penyeragaman koma ("Organisasi, Kaderisasi, …").
  **Belum diterapkan**: `supabase migration new` macet dan menghasilkan file kosong (sudah dihapus).
  Lanjutkan: buat migrasi `revisi_nama_bidang` (update nama_resmi/deskripsi/fokus by slug), `db push`, cek.
- Sesi dijeda atas permintaan Hanif; lanjut di rumah, lalu Hari 7 (login admin).
**Status:** Sebagian

---

## [2026-10-01 21:10 WIB] — Claude Code (Claude Opus 5.5)
**Fase:** Hari 6.5 — Perbaikan dari review Hanif (lanjutan, selesai)
**Ringkasan:** Revisi nama bidang diterapkan ke database lewat migrasi. Hero tunggal & kolase simetris
dari sesi sebelumnya dicek di browser.
**File berubah:**
- supabase/migrations/20261001140314_revisi_nama_bidang.sql (baru)
- src/routes/lpj.tsx (teks nama bidang)
- DEVLOG.md

**Catatan / dampak:**
- Nama bidang kini: Media Publikasi, Dokumentasi & Digitalisasi; Inventarisasi & Kearsipan;
  OKK diseragamkan "Organisasi, Kaderisasi, Keanggotaan (OKK) & Pemberdayaan SDM". Migrasi punya pengaman.
  Lampiran SK 003/2025 tetap memakai nama lama (dokumen historis). Gambar pengumuman menulis "Keanggotan"
  (typo) — di web ditulis "Keanggotaan".
- File migrasi dibuat langsung (tanpa `supabase migration new`, yang sempat macet).
- Dicek di browser: semua 8 halaman publik 200; hero Beranda/Berita/Program/Arsip/Galeri seragam
  (latar `oklch(0.45 0.18 257)` + batik); kolase Beranda 2×2 sama ukuran.
**Status:** Selesai

---

## [2026-10-01 21:30 WIB] — Claude Code (Claude Opus 5.5)
**Fase:** Fase 1 — Hari 7 (Login admin)
**Ringkasan:** Halaman `/admin/masuk`, penjaga semua `/admin/*`, header akun + tombol Keluar, menu sesuai
peran, admin Berita melihat draft, dan alat programmer `npm run akun` untuk membuat/mengelola akun.
**File berubah:**
- src/services/auth.ts (baru) — ambilAkunSaya, masuk, keluar, tujuanAman
- src/routes/admin.tsx (penjaga: ssr:false, noindex, redirect ke /admin/masuk?ke=…)
- src/routes/admin.masuk.tsx (baru) — form login, kunci 60 detik setelah 5× gagal
- src/routeTree.gen.ts (route baru /admin/masuk)
- src/hooks/use-akun.ts (baru), src/components/admin/AdminShell.tsx (akun, Keluar, menu per peran, label Indonesia)
- src/routes/admin.users.tsx (khusus Super Admin), admin.audit-log.tsx (khusus BPH/Super Admin)
- src/routes/admin.berita.tsx, src/services/konten.ts, src/domains/konten/types.ts (draft untuk admin)
- scripts/akun.mjs (baru), package.json (script `akun`)

**Catatan / dampak:**
- Pendaftaran publik dimatikan Hanif di Supabase; diverifikasi: signup → 422 `signup_disabled`.
- Halaman admin dirender di browser (ssr:false) karena sesi ada di browser; data tetap dijaga RLS.
- Akun tanpa profil / profil nonaktif: sesi langsung ditutup. Dinonaktifkan saat sedang login → tertendang
  pada navigasi berikutnya.
- Pesan gagal login sama untuk email tak terdaftar & password salah. Redirect setelah login hanya ke /admin/*.
- Diuji di browser dengan 2 akun uji sementara (dihapus setelahnya, 0 akun tersisa): redirect tanpa login,
  password salah, akun nonaktif, login sukses kembali ke halaman tujuan, label "Admin · Media", menu
  Pengaturan/Akun/Audit Log tersembunyi untuk admin bidang, /admin/users & /admin/audit-log → dashboard,
  dinonaktifkan saat login → tertendang, Keluar, kunci 5× gagal.
- PERINGATAN untuk agent lain: jangan `git checkout -- src/routeTree.gen.ts` bila ada route baru —
  file ini harus ikut di-commit. Sejak .gitattributes (Hari 1) tidak ada lagi diff CRLF.
- Belum: akun Super Admin Hanif (dibuat Hanif sendiri via `npm run akun -- buat`), lupa password via email.
**Status:** Selesai (menunggu Hanif membuat akun Super Admin)

---

## [2026-10-01 21:45 WIB] — Claude Code (Claude Opus 5.5)
**Fase:** Fase 1 — Hari 7 (perbaikan keamanan)
**Ringkasan:** Input password di `npm run akun` bocor — readline ikut menggemakan huruf asli di sela "*".
Diperbaiki: keluaran readline dibisukan selama input rahasia, hanya "*" yang ditulis.
**File berubah:**
- scripts/akun.mjs
- DEVLOG.md

**Catatan / dampak:** Akun Super Admin Hanif sudah dibuat, tetapi passwordnya sempat terlihat di terminal
(dan screenshot) → wajib diganti lewat `npm run akun -- reset <email>` dengan password baru yang kuat.
**Status:** Selesai (menunggu Hanif reset password)

---

## [2026-10-01 22:05 WIB] — Claude Code (Claude Opus 5.5)
**Fase:** Fase 1 — Hari 7 (penyesuaian dari Hanif)
**Ringkasan:** Halaman login dipindah dari `/admin/masuk` ke `/login` (judul "Masuk Pengurus"); CMS tetap
di `/admin/*`. Tombol ikon kecil "Masuk pengurus" ditambahkan di navbar (desktop & menu HP) untuk dinilai.
**File berubah:**
- src/routes/admin.masuk.tsx → src/routes/login.tsx (ssr:false, noindex)
- src/routes/admin.tsx (redirect ke /login), src/services/auth.ts, src/components/admin/AdminShell.tsx
- src/components/public/landing/Navbar.tsx (ikon masuk pengurus)
- src/routeTree.gen.ts
- DEVLOG.md

**Catatan / dampak:** Pindah alamat bersifat kosmetik, bukan pengaman; keamanan tetap dari login, kunci 5×,
dan RLS. Diuji: ikon navbar → /login; /admin/berita tanpa login → /login?ke=/admin/berita; /admin/masuk → 404.
Tombol navbar masih menunggu penilaian Hanif (bisa diganti link footer bila kurang cocok).
**Status:** Selesai

---

## [2026-10-01 22:20 WIB] — Claude Code (Claude Opus 5.5)
**Fase:** Fase 1 — Hari 8 (Penyimpanan media & dokumen)
**Ringkasan:** Tiga bucket Supabase Storage + kebijakan akses per folder bidang, layanan unggah di web
(kompresi foto WebP di browser, video ≤ 50 MB, PDF, link video YouTube/IG/TikTok, URL publik & link
sementara), tombol Pratinjau/Unduh Arsip memakai file asli, dan 14 tes storage di `test:db`.
**File berubah:**
- supabase/migrations/20261001145825_storage.sql (baru) — bucket media, dokumen-publik, dokumen-internal
- src/services/storage.ts (baru) — kompresFoto, unggahFoto/Video/Dokumen, hapusFile, urlPublik,
  urlSementara, bacaLinkVideo
- src/services/konten.ts, src/domains/dokumen/types.ts (`url` dokumen), src/routes/lpj.tsx (tombol berfungsi)
- src/routes/login.tsx (hapus catatan kaki atas permintaan Hanif)
- scripts/test-db.mjs (tes storage)
- DEVLOG.md

**Catatan / dampak:**
- Path: `<folder>/<file>`; folder = slug bidang | "umum" | "bph". Admin bidang hanya menulis ke folder
  bidangnya (+ "umum" untuk media & dokumen publik); BPH/Super Admin bebas. Folder "bph" di dokumen-internal
  hanya untuk BPH. Bucket publik tetap dibaca lewat URL publik.
- Diuji: `test:db` 58/58 (14 storage: unggah per folder, tipe file, hapus lintas bidang, signed URL, URL
  publik internal ditolak); storage bersih setelah tes. Kompresi di browser: JPEG 4000×3000 6,6 MB →
  WebP 1920×1440 338 KB + thumb 16 KB dalam ±0,4 dtk.
- Foto dummy (Unsplash) BELUM diunggah: perlu persetujuan unduh file dari luar; dijadwalkan bersama uji
  ujung-ke-ujung Hari 9 atau diganti foto asli dari Bid. Media.
- Supabase Storage free 1 GB; pemakaian ditampilkan di dashboard admin (Fase 3).
**Status:** Selesai

---

## [2026-10-01 23:10 WIB] — Claude Code (Claude Opus 5.5)
**Fase:** Hari 8.5 — Akun berbasis jabatan, username, izin kontribusi, persetujuan
**Ringkasan:** Model akun diubah sesuai ide Hanif: login dengan username, role diturunkan dari jabatan di
tabel pengurus, anggota hanya baca + ubah profil sendiri sampai diberi izin kontribusi oleh Kabid/BPH,
konten anggota wajib disetujui (tercatat "disetujui oleh"), password awal acak + wajib ganti, halaman
Profil Saya, kolom akun & tombol izin di tab Pengurus, alat `npm run akun -- generate`.
**File berubah:**
- supabase/migrations/20261001152519_role_anggota.sql, 20261001152628_akun_dari_jabatan.sql,
  20261001153204_foto_profil.sql (baru)
- src/services/auth.ts, src/constants/site.ts, src/integrations/supabase/types.ts
- src/routes/login.tsx (username), src/routes/admin.profil.tsx (baru), src/routes/admin.anggota.tsx,
  src/routes/admin.users.tsx, src/routeTree.gen.ts
- src/components/admin/AdminShell.tsx (menu per peran, popup), src/components/admin/GantiPasswordWajib.tsx (baru)
- src/services/storage.ts (unggahFotoProfil), src/services/organisasi.ts (URL foto publik)
- scripts/akun.mjs (generate/username/reset/nonaktif/aktifkan/daftar), scripts/test-db.mjs, .gitignore (rahasia/)
- DEVLOG.md

**Catatan / dampak:**
- Role: super_admin (manual) · admin (BPH lintas bidang / Kepala Bidang) · anggota (Anggota Bidang & Penasihat).
  Trigger menjaga role mengikuti jabatan; ganti jabatan di pengurus → akun ikut berubah.
- Email internal `<username>@akun.katar-rw03.internal` (TLD .internal khusus jaringan privat). Login juga
  menerima email asli. Super Admin: username `ukkt03cipedak` + email Katar.
- RPC aman: atur_izin_kontribusi, ubah_profil_saya, ubah_foto_saya (hanya folder profil/<id>/), selesai_ganti_password.
  Email & no. HP pribadi hanya terlihat oleh diri sendiri, Kabid bidangnya, dan BPH.
- `test:db` 83/83 (+25: anggota/izin/persetujuan/kontak/role dari jabatan). Diuji di browser dengan akun uji
  sementara (dihapus): login username, popup wajib ganti password (tolak password pendek), menu Kabid, Keluar.
- `npm run akun -- generate --coba`: 61 username tanpa bentrok. Akun BELUM dibuat — menunggu Hanif menjalankan
  tanpa --coba (file password awal di rahasia/, jangan di-commit, hapus setelah dibagikan).
- ambilAkunSaya tidak lagi menutup sesi saat query gagal (hanya bila profil tidak ada / nonaktif).
- WAJIB sebelum Hari 9 (online): password Super Admin diganti dari password yang sempat terlihat.
**Status:** Selesai

---

## [2026-10-01 23:00 WIB] — Claude Code (Claude Opus 5.5)
**Fase:** Hari 8.5 (perbaikan)
**Ringkasan:** Super Admin gagal login dengan username karena akunnya terdaftar dengan email Gmail, sedangkan
form mengubah username menjadi email internal. Atas pilihan Hanif (opsi A), email login Super Admin dipindah
ke `ukkt03cipedak@akun.katar-rw03.internal`; Gmail disimpan sebagai `profiles.email_kontak`. Password tidak berubah.
**File berubah:**
- DEVLOG.md (perubahan data akun lewat Admin API, tanpa perubahan kode)

**Catatan / dampak:** Semua akun kini login dengan username. Akun yang dibuat dengan email asli lewat
`npm run akun -- buat` hanya bisa login dengan email tersebut — gunakan username saja kecuali ada alasan khusus.
**Status:** Selesai

---

## [2026-10-01 23:20 WIB] — Claude Code (Claude Opus 5.5)
**Fase:** Hari 8.5 (masukan Hanif)
**Ringkasan:** Tab Pengurus: pilihan jumlah per halaman (10/20/50/100); jendela Preview dirender lewat portal
ke <body> sehingga overlay menutupi seluruh layar (sebelumnya header tetap terang karena animasi <main>
membuat position:fixed terkurung di area konten).
**File berubah:**
- src/routes/admin.anggota.tsx
- DEVLOG.md

**Catatan / dampak:** Hanif sudah menjalankan `npm run akun -- generate` (61 akun; password awal di
rahasia/akun-awal-2026-10-01.csv, diabaikan git). Modal lain di dalam <main> admin perlu pola portal yang sama.
**Status:** Selesai

---

## [2026-10-01 23:30 WIB] — Claude Code (Claude Opus 5.5)
**Fase:** Hari 8.5 (masukan Hanif)
**Ringkasan:** Jendela Preview pengurus dirombak jadi kartu profil: foto besar di kiri (atas di HP), inisial
besar bila belum ada foto/izin, detail kelompok/periode/bidang/RT, dan info akun (username, izin, status).
Bisa ditutup dengan Esc.
**File berubah:**
- src/routes/admin.anggota.tsx
- DEVLOG.md

**Status:** Selesai

---

## [2026-10-01 23:35 WIB] — Claude Code (Claude Opus 5.5)
**Fase:** Hari 8.5 (keputusan Hanif)
**Ringkasan:** Tingkatan admin ditetapkan: Level 1 = seluruh BPH (Ketua, Wakil, Sekretaris & Wakil,
Bendahara & Wakil) — kelola pengurus & semua bidang; Level 2 = Kepala Bidang — bidangnya saja.
Sesuai RLS yang sudah ada (is_bph), jadi tanpa perubahan database. Label akun di admin diperbarui.
**File berubah:**
- src/services/auth.ts (label "Admin Level 1 · BPH" / "Admin Level 2 · <bidang>")
- DEVLOG.md

**Catatan / dampak:** Form tambah/hapus/pindah pengurus untuk Level 1 tetap dijadwalkan di Fase 3.
**Status:** Selesai

---

## [2026-10-01 23:45 WIB] — Claude Code (Claude Opus 5.5)
**Fase:** Hari 8.5 (masukan Hanif) — penutup sesi
**Ringkasan:** Tab Pengurus: badge BPH (emas) dan Penasihat (gelap) agar setara badge bidang.
**File berubah:**
- src/routes/admin.anggota.tsx
- DEVLOG.md

**Catatan / dampak:** Sesi dijeda (lanjut minggu depan). Berikutnya: Hari 8.6 (halaman Akun Super Admin)
lalu Hari 9 (online). Sebelum online: password Super Admin harus kuat; file rahasia/akun-awal-*.csv
dihapus setelah dibagikan.
**Status:** Selesai

---

## [2026-10-01 23:55 WIB] — Claude Code (Claude Opus 5.5)
**Fase:** Penutup minggu
**Ringkasan:** Semua server dev dimatikan. Dibuat `backupcontext.md` (ringkasan lengkap konteks & keputusan
percakapan 29 Sep–1 Okt) dan dijadikan aturan resmi: wajib dibaca pertama sebelum mengerjakan apa pun.
**File berubah:**
- backupcontext.md (baru)
- AGENTS.md (aturan baca backupcontext.md), README.md
- DEVLOG.md

**Catatan / dampak:** Lanjut minggu depan dari Hari 8.6 di sesi chat baru.
**Status:** Selesai

---

## [2026-10-07 15:41 WIB] — Claude Code (Claude Opus 5.5)
**Fase:** Hari 8.6 — Halaman Akun (Super Admin)
**Ringkasan:** Halaman `/admin/users` (menu "Akun") kini memakai data asli: daftar semua akun (peran, jabatan,
status, terakhir masuk), cari & filter (Admin / Belum ganti password / Nonaktif), ganti username, reset password
(password sementara acak tampil SEKALI + tombol salin; wajib ganti saat login), dan nonaktifkan/aktifkan akun.
Semua aksi lewat fungsi server (service role) dengan pengecekan Super Admin aktif DI SERVER dari token yang
diverifikasi; Super Admin tidak bisa mereset/menonaktifkan dirinya sendiri dari halaman ini. Nonaktif juga
memblokir akun di Supabase Auth (ban) sehingga sesi terbuka tidak bisa diperpanjang; login menampilkan
"Akun ini sedang tidak aktif". Setiap aksi dicatat di audit_log (tabel "akun") dengan pelaku yang benar.
**File berubah:**
- src/services/akun.server.ts (baru — logika server, service role)
- src/services/akun.functions.ts (baru — createServerFn + requireSupabaseAuth + validasi zod)
- src/routes/admin.users.tsx (data dummy diganti halaman kelola akun)
- src/services/auth.ts (pesan login untuk akun nonaktif / user_banned)
- scripts/akun.mjs (nonaktif/aktifkan juga ban/unban di Supabase Auth)
- DEVLOG.md, backupcontext.md

**Catatan / dampak:** Diuji di browser dengan 3 akun uji sementara (sudah dihapus beserta catatan auditnya):
reset → login password baru berhasil & password lama gagal; username dipakai → ditolak; ganti username → login
username baru berhasil; nonaktif → `user_banned`; aktifkan → bisa login lagi. Akun Anggota & tanpa login yang
memanggil fungsi server langsung dari console → ditolak. Bundle browser tidak memuat kode server/kunci service
role. tsc, eslint (0 error), build, test:db 83/83 lolos.
**Status:** Selesai

## [2026-10-07 16:30 WIB] — Claude Code (Claude Opus 5.5)
**Fase:** Hari 9 — Online pertama (Cloudflare Workers)
**Ringkasan:** Project Cloudflare Workers `katar-rw03` dibuat dari repo GitHub (Workers Builds) di akun
Cloudflare Katar. Production branch = `revisi` (ganti ke `main` setelah Checkpoint 2). Build `npm run build`,
deploy `npx wrangler deploy`. Build variables: VITE_SUPABASE_URL, VITE_SITE_URL, VITE_SUPABASE_PUBLISHABLE_KEY.
Runtime secrets: SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, SUPABASE_SERVICE_ROLE_KEY (diisi Hanif sendiri).
Link: https://katar-rw03.ukktrw03cipedak.workers.dev
**File berubah:**
- wrangler.jsonc (baru — nama worker, nodejs_compat, keep_vars)
- DEVLOG.md

**Catatan / dampak:** Hasil build diuji dulu di runtime Cloudflare lokal (wrangler dev): semua halaman 200.
Setiap push ke `revisi` otomatis membangun ulang web. Jangan pernah menaruh SUPABASE_SERVICE_ROLE_KEY di
build variables atau dengan awalan VITE_.
**Status:** Berjalan (lanjut: Supabase Auth URL, anti-pause, backup, uji E2E)

## [2026-10-07 16:50 WIB] — Claude Code (Claude Opus 5.5)
**Fase:** Hari 9 — Online pertama (lanjutan)
**Ringkasan:** Build pertama dari `revisi` membuat semua halaman 500: Cloudflare memasang dependensi dari
`bun.lock` (@tanstack/react-start 1.167) yang belum punya `.validator` — laptop memakai versi lebih baru
(npm, tanpa lockfile). Diganti `.inputValidator` (dikenal kedua versi). Setelah itu 10 halaman publik +
/login + /admin = 200. Supabase Auth: Site URL → link workers.dev, redirect allow list ditambah link
online & localhost:5173 (lewat Management API).
**File berubah:**
- src/services/akun.functions.ts
- DEVLOG.md

**Catatan / dampak:** ⚠️ Versi dependensi lokal ≠ produksi. Selama belum diselaraskan, cek API TanStack
terhadap versi di bun.lock. Log error produksi: Cloudflare → katar-rw03 → Observability → Events.
**Status:** Berjalan

## [2026-10-08 23:55 WIB] — Claude Code (Claude Opus 5.5)
**Fase:** Hari 9 — Online pertama (selesai, menunggu Checkpoint 2)
**Ringkasan:** (1) Hanif berhasil login Super Admin di web online. (2) Repo PRIVATE baru
`ecHZee/katar-rw03-backup` (folder lokal `katar_profile/katar-rw03-backup`): GitHub Actions `ping.yml` (baca
tabel pengaturan tiap 2 hari, 07:00 WIB) dan `backup.yml` (supabase db dump roles/schema/data tiap Minggu
01:00 WIB, di-commit ke repo → repo selalu aktif sehingga jadwal tidak dimatikan aturan 60 hari GitHub).
Secrets diisi Hanif: SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, SUPABASE_DB_URL (session pooler). Uji manual
keduanya hijau; backup pertama berisi auth.users + semua tabel public. (3) Uji ujung-ke-ujung terhadap web
online (skrip sementara): upload foto & PDF → akses publik → berita & dokumen terbit tampil di /berita & /lpj →
edit judul → draft tidak tampil → hapus hilang dari web: 8/8 lolos, data uji dibersihkan.
**File berubah:**
- DEVLOG.md, backupcontext.md

**Catatan / dampak:** File Storage (foto/PDF) TIDAK ikut backup mingguan. Uji CRUD lewat form admin menunggu
Fase 3 (form masih maket). Berikutnya: Checkpoint 2 (Hanif + 1–2 teman mencoba link) → merge revisi → main →
ganti Branch control Cloudflare ke `main`.
**Status:** Selesai

## [2026-10-09 00:40 WIB] — Claude Code (Claude Opus 5.5)
**Fase:** Diskusi pra-Hari 10 (storage, desain, logo, kontak)
**Ringkasan:** Logo resmi dipotong lingkaran dengan latar transparan → `public/logo/` (utama 417 px, 192, 180
apple-touch, favicon 48). Nomor WA sekretariat (WA Ketum) diisi di `pengaturan.kontak.whatsapp`, tampil di
/kontak online. Keputusan storage: Backblaze B2 bucket `katar-rw03-media` (private, US West, caps $0) untuk
foto & video, disajikan lewat cache Cloudflare; PDF tetap Supabase; file asli di GDrive. Riset ciri desain
"AI slop" untuk dihindari di Fase 2. Detail di backupcontext.md §10.
**File berubah:**
- public/logo/* (baru), backupcontext.md, DEVLOG.md

**Status:** Selesai

## [2026-10-09 01:05 WIB] — Claude Code (Claude Opus 5.5)
**Fase:** Hari 10 — Fondasi desain & navigasi (arah desain E: memoles desain yang ada)
**Ringkasan:** (1) Logo resmi menggantikan kotak "KT" di navbar, footer, sidebar admin, dan halaman login
(komponen `Logo`); favicon, apple-touch-icon, og:image (pratinjau saat dibagikan) dan theme-color dipasang.
(2) Bug halaman bisa digeser ke samping di HP diperbaiki di sumbernya: wadah marquee `RunningBanner` butuh
`min-w-0` (tanpa itu item flex melebar ±6000px), plus pengaman global `overflow-x: clip` di html/body.
(3) Navbar desktop berkelompok: Tentang ▾ (Profil & Pengurus, Program & Bidang) · Kabar ▾ (Kegiatan, Berita,
Galeri) · Arsip · Kontak + tombol Gabung (WA). (4) Navigasi bawah di HP/tablet (< lg): Beranda · Agenda ·
Gabung (tombol bulat kuning, hanya bila nomor WA terisi) · Galeri · Lainnya (lembar menu dari bawah berisi
semua halaman berkelompok + Masuk pengurus). Footer diberi ruang agar tidak tertutup navigasi bawah.
**File berubah:**
- src/components/shared/Logo.tsx (baru)
- src/components/public/landing/Navbar.tsx, Footer.tsx, RunningBanner.tsx
- src/components/admin/AdminShell.tsx, src/routes/login.tsx, src/routes/__root.tsx, src/styles.css
- DEVLOG.md, backupcontext.md

**Catatan / dampak:** Diuji di browser 1440 px & 360 px: lebar halaman = lebar layar, dropdown & menu
Lainnya berfungsi, 0 error console (error "Invalid hook call" sempat muncul hanya saat Vite pertama kali
memaket radix dropdown — hilang setelah server dimulai ulang). Belum: mengurangi label kapital berspasi &
bayangan (ditunda, desain E dipertahankan); foto asli menunggu admin + Backblaze (Hari 19).
**Status:** Selesai

## [2026-10-09 10:30 WIB] — Claude Code (Claude Opus 5.5)
**Fase:** Checkpoint 2 + Hari 11 — Beranda
**Ringkasan:** Checkpoint 2 lolos (Hanif menguji di Chrome & Opera desktop, Chrome iPhone, Chrome Android) →
`main` di-fast-forward ke `revisi` (82487f5). Cloudflare tetap membangun dari `revisi` sampai launching.
Hari 11: beranda di HP dipangkas dari 13,4 → 6,05 layar (375×740) tanpa mengubah gaya E:
Program 7 bidang & Kegiatan jadi baris geser-samping (snap) di HP, grid 3 kolom di laptop; foto & paragraf
kedua Tentang disembunyikan di HP; berita tambahan maks 2 di HP; Info Singkat, Kalender (generik) & Kontak
diganti satu bagian **Ajakan** (Gabung · Usul kegiatan · Hubungi — WA dengan pesan siap ketik + lokasi &
sosmed); kolom Navigasi footer disembunyikan di HP (sudah ada menu Lainnya). **Banner pengumuman** baru di
atas navbar: pengaturan `pengumuman` = `{"teks","tautan","sampai"}` atau JSON null; otomatis hilang setelah
tanggal `sampai` (WIB), bisa ditutup pengunjung (diingat per isi pengumuman di localStorage).
**File berubah:**
- supabase/migrations/20261009020000_pengumuman.sql (baru)
- src/components/public/landing/PengumumanBanner.tsx, AjakanSection.tsx (baru)
- src/components/public/landing/QuickInformation.tsx, LiveClockCalendar.tsx (dihapus, tak terpakai)
- src/routes/index.tsx, src/services/konten.ts, src/domains/konten/types.ts
- src/components/public/landing/ProgramBento.tsx, KegiatanLatest.tsx, BeritaLatest.tsx, AboutPreview.tsx, Hero.tsx, Footer.tsx
- DEVLOG.md, backupcontext.md

**Catatan / dampak:** Banner diuji dengan pengumuman sementara (kedaluwarsa → tidak tampil; aktif → tampil,
tautan benar, bisa ditutup & tetap tertutup setelah muat ulang) lalu dikembalikan. ⚠️ Mengosongkan pengumuman
harus menulis JSON `'null'::jsonb` — `null` dari supabase-js menjadi NULL SQL dan ditolak (kolom NOT NULL);
perhatikan saat membuat halaman Pengaturan (Hari 21). Hero foto asli menunggu admin + Backblaze (Hari 19).
**Status:** Selesai
