# Dev Log Wajib untuk Semua AI Coding Agent

Ide kamu dipakai: satu file catatan perubahan yang **wajib** diisi setiap kali ada AI (saya, Codex, Claude, Cursor, siapa pun) yang mengedit project ini. Setiap editan baru = **section baru ditambahkan di bawah**, tidak pernah menimpa yang lama.

## Apa yang dibuat

1. **`DEVLOG.md`** di root project — berisi:
   - Penjelasan singkat aturan pengisian di bagian atas
   - Template section
   - Section historis awal yang merangkum progress sampai sekarang (Blueprint v1.0, Visual Design Final, Sprint 0 → 2A, Design Freeze) supaya log tidak mulai dari kosong

2. **Aturan di `AGENTS.md`** — ini file yang otomatis dibaca hampir semua AI coding agent saat membuka repo. Ditambahkan aturan wajib:
   - Sebelum mulai kerja: baca `DEVLOG.md` untuk tahu status terakhir
   - Setelah selesai: **append** satu section baru di paling bawah
   - Dilarang menghapus/mengedit section lama (hanya boleh menambah)
   - Aturan ditulis dua bahasa singkat (ID + EN) supaya agent berbahasa Inggris tetap patuh

## Format satu section

```text
## [2026-09-16 17:24 WIB] — Lovable
**Fase:** Design Freeze / Sprint 2A
**Ringkasan:** Hero beranda dirapikan, floating stats dihapus.
**File berubah:**
- src/components/public/landing/Hero.tsx
**Catatan / dampak:** Tidak ada perubahan design token. Statistik tetap di section bawah.
**Status:** Selesai
---
```

Field yang wajib: waktu, nama AI/orang, fase, ringkasan, daftar file, status.
Field opsional: catatan, hal yang sengaja tidak dikerjakan, hal yang perlu ditindaklanjuti.

## Kenapa formatnya begini

- Append-only → riwayat progress tetap utuh walau ganti-ganti AI
- Daftar file berubah → gampang telusuri siapa menyentuh apa saat ada yang rusak
- Cocok dengan GitHub sync: `DEVLOG.md` ikut ter-commit, jadi AI lain melihatnya begitu clone/pull

## Catatan teknis

- File plain markdown, tidak memengaruhi build maupun bundle
- `AGENTS.md` sudah ada dan punya blok `LOVABLE:BEGIN/END` milik sistem — blok itu tidak disentuh, aturan baru ditulis di bawahnya
- Tidak ada perubahan kode aplikasi, design token, atau backend

## Batasannya (jujur)

Aturan ini adalah konvensi, bukan paksaan teknis. AI lain patuh kalau membaca `AGENTS.md` (Codex, Claude Code, Cursor umumnya membaca). Kalau mau lebih ketat, tahap berikutnya bisa ditambahkan git pre-commit hook yang menolak commit tanpa update `DEVLOG.md` — bilang saja kalau mau itu juga.
