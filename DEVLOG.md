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
