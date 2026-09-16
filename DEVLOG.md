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
