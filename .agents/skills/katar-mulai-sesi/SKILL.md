---
name: "katar-mulai-sesi"
description: "Ritual pembuka setiap sesi kerja di proyek Karang Taruna RW 03 Cipedak (repo ukkt03cipedak). Gunakan di awal SETIAP percakapan/sesi baru, sebelum menulis kode, menjawab status proyek, atau mengusulkan apa pun."
---

# Mulai sesi — Katar RW 03

Tujuan: sebelum bekerja, posisi proyek harus jelas dari sumber tertulis, bukan dari ingatan atau ringkasan chat.

## Langkah (urut, jangan dilewati)

1. Baca penuh `backupcontext.md` (root repo) — ini aturan resmi proyek (lihat juga `AGENTS.md`).
2. Baca 3–5 section paling bawah `DEVLOG.md` (append-only; section terbaru ada di paling bawah).
3. Baca bagian hari yang akan dikerjakan di `docs/SCHEDULE.md` dan `docs/handoff/01-RENCANA-LENGKAP.md`.
   Konteks & masalah lama: `docs/handoff/02-KONTEKS-PROGRES.md`. Cara kerja: `docs/handoff/03-CARA-KERJA.md`.
4. Cek git:
   ```bash
   git branch --show-current            # harus: revisi
   git status --short                   # harus bersih; kalau tidak, TANYA Hanif (jangan timpa)
   git fetch -q && git log --oneline -3 origin/revisi
   git log --oneline -3
   ```
5. Pastikan tidak ada dev server/`workerd` sisa di port 5173/8090/8788.
6. Sapa Hanif singkat (Bahasa Indonesia santai, boleh "beb"): "Udah kubaca backupcontext & DEVLOG. Terakhir di
   Hari X (commit …), working tree bersih, branch revisi." lalu sebutkan langkah pertama dan mulai.

## Jangan

- Jangan mengandalkan ringkasan chat lama bila bertentangan dengan file — file menang.
- Jangan membaca keras atau menampilkan `.env.local` maupun folder `rahasia/`.
