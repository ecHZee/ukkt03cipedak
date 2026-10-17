# 04 · Skills — cara kerja Opus 5.5 dalam bentuk siap pakai untuk Codex

Skill adalah instruksi terpaket yang dimuat agen saat tugasnya cocok (format Codex: folder berisi `SKILL.md`
dengan frontmatter `name` + `description`). Sembilan skill khusus proyek ini ada di repo:

```
ukkt03cipedak/.agents/skills/
├── katar-mulai-sesi/SKILL.md            ← awal setiap sesi
├── katar-rencana-dan-keputusan/SKILL.md ← kapan kerja langsung vs bertanya, format opsi + rekomendasi
├── katar-implementasi/SKILL.md          ← konvensi kode, pola, jebakan teknis
├── katar-verifikasi/SKILL.md            ← tsc/eslint/build/test:db, uji browser 360 & 1440, keamanan, produksi
├── katar-database/SKILL.md              ← migrasi manual, RLS, skrip data, Management API
├── katar-deploy/SKILL.md                ← Cloudflare katar-rw03, secrets, log, B2, backup & ping
├── katar-keamanan-privasi/SKILL.md      ← rahasia, repo publik, foto anak/politik, batas aksi
├── katar-desain/SKILL.md                ← desain E, HP dulu, anti AI slop
└── katar-penutup-sesi/SKILL.md          ← DEVLOG, backupcontext, commit, push, cek online, laporan
```

Hubungan dengan `03-CARA-KERJA.md`: dokumen 03 menjelaskan **kenapa** (sikap & alasan); skill berisi **apa yang
dilakukan** langkah demi langkah agar bisa dimuat otomatis tanpa membaca seluruh dokumen.

## Urutan pemakaian dalam satu hari kerja

```
katar-mulai-sesi
  → katar-rencana-dan-keputusan   (tabel rencana; tanya bila keputusan milik Hanif)
  → katar-implementasi (+ katar-database / katar-desain sesuai tugas)
  → katar-verifikasi
  → katar-deploy (push → cek online)
  → katar-penutup-sesi
katar-keamanan-privasi berlaku sepanjang waktu.
```

## Cara memasang di Codex

1. **Skill repo**: Codex modern membaca skill dari folder `.agents/skills` di dalam repo yang sedang dibuka —
   cukup buka folder `ukkt03cipedak` di Codex.
2. **Cadangan global** (sudah disalin oleh Claude ke laptop Hanif): `C:\Users\Hanif Zhafran\.codex\skills\katar-*`.
   Bila skill repo tidak terbaca oleh versi Codex yang dipakai, salinan global ini tetap aktif.
   Menyalin ulang setelah skill di repo diperbarui (PowerShell, dari folder `ukkt03cipedak`):
   ```powershell
   Copy-Item -Recurse -Force .agents\skills\katar-* $HOME\.codex\skills\
   ```
3. Cek: di Codex ketik `/skills` (atau tanyakan "skill apa saja yang kamu punya?") — sembilan `katar-*` harus muncul.
4. `AGENTS.md` di root repo sudah menunjuk ke `backupcontext.md` dan `docs/handoff/` — Codex membaca file ini otomatis.

## Catatan untuk Hanif

- `~/.codex/AGENTS.md` global milikmu meminta gaya bahasa santai/nyolot. Untuk proyek ini, `AGENTS.md` repo
  meminta Bahasa Indonesia santai yang tetap sopan & jelas — keduanya bisa jalan bersama; bila ingin gaya proyek
  yang menang, sebutkan di prompt.
- Skill bukan pengganti penilaian: tetap minta agen menunjukkan bukti verifikasi (angka, output tes, HTTP 200).
