---
name: "katar-deploy"
description: "Deploy & infrastruktur proyek Katar RW 03: Cloudflare Workers katar-rw03, branch revisi, variabel/secret, log error, Backblaze B2, repo backup & ping. Gunakan saat push yang mengubah web online, saat web online error, atau saat menyentuh hosting/storage/backup."
---

# Deploy & infrastruktur

## Alur

push `revisi` → Cloudflare Workers Builds otomatis (±20–60 detik) → https://katar-rw03.ukktrw03cipedak.workers.dev

- Build `npm run build`, deploy `npx wrangler deploy`, root `/`, worker `katar-rw03` (= `wrangler.jsonc`, `keep_vars: true`).
- Build vars: `VITE_SUPABASE_URL`, `VITE_SITE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`.
  Runtime secrets: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (tipe Secret, diisi Hanif).
  JANGAN pernah menaruh service role di build vars atau dengan awalan `VITE_`.
- Cloudflare memasang dependensi dari `bun.lock` (bukan npm). Bila ragu, uji runtime Workers lokal:
  `npx -y wrangler@4 dev --port 8788` dari ROOT repo dengan `.output/server/.dev.vars` sementara
  (hapus setelahnya; matikan proses `workerd` & wrangler sisa).
- Error 500 → dashboard Cloudflare → katar-rw03 → Observability → Events (stack trace).
- Branch control tetap `revisi` sampai launching (Hari 30) → ganti ke `main`.
- `main` hanya fast-forward saat checkpoint disetujui:
  `git merge-base --is-ancestor origin/main revisi && git push origin revisi:main`.

## Akses dashboard

Akun Cloudflare/Backblaze memakai email Katar `ukktrw03cipedak@gmail.com`; GitHub `ecHZee`. Login, OAuth,
password, kunci, dan kartu dikerjakan Hanif. Agen boleh menavigasi dashboard yang sudah login untuk konfigurasi
non-rahasia (branch, nama variabel, nilai publik seperti URL Supabase) dan memeriksa nama secret (bukan nilainya).

## Storage

- Supabase Storage: `media` (publik), `dokumen-publik`, `dokumen-internal` (signed URL 10 menit). PDF tetap di sini.
- Backblaze B2: bucket `katar-rw03-media` (private, US West, `s3.us-west-004.backblazeb2.com`, lifecycle
  "keep only last version", caps $0). Batas harian gratis: 10 GB simpan, 1 GB unduh, 2.500 Class B → WAJIB
  disajikan lewat Worker + Cache API (nama file unik & immutable). Application Key dibuat Hanif di Hari 19.

## Backup & anti-pause

Repo private `ecHZee/katar-rw03-backup` (lokal `katar_profile/katar-rw03-backup`): `ping.yml` tiap 2 hari 07:00
WIB, `backup.yml` dump roles/schema/data tiap Minggu 01:00 WIB lalu commit (menjaga repo tetap aktif agar jadwal
tidak dimatikan GitHub). Secrets (`SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_DB_URL` session pooler)
diisi Hanif. File Storage TIDAK ikut backup.
