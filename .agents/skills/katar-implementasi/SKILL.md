---
name: "katar-implementasi"
description: "Konvensi kode & jebakan teknis proyek Katar RW 03 (TanStack Start + React 19 + Tailwind v4 + shadcn + Supabase + Cloudflare Workers). Gunakan setiap kali menulis atau mengubah kode di repo ukkt03cipedak."
---

# Implementasi

## Stack

TanStack Start (React 19, SSR, Vite, route file-based di `src/routes`, loader, `ssr:false` untuk `/admin`),
Tailwind v4, shadcn/ui, Supabase (Postgres + RLS, Auth, Storage), Cloudflare Workers (preset nitro), zod.

## Konvensi

- Nama & komentar Bahasa Indonesia; komentar menjelaskan KENAPA. Ikuti kepadatan komentar file sekitar.
- Service data di `src/services/*.ts` (`ambilX`, `ubahX`); tipe domain di `src/domains/*/types.ts`.
- Loader mengembalikan **plain object** saja (tanpa komponen/ikon lucide) → hindari error serialisasi Seroval.
- Kode yang memakai service role: `*.server.ts`, dipanggil lewat `*.functions.ts`:
  `createServerFn({ method }).middleware([requireSupabaseAuth]).inputValidator(zodSchema).handler(...)`.
  **Pakai `.inputValidator`, BUKAN `.validator`** — Cloudflare memasang TanStack dari `bun.lock` (versi lebih lama).
  Cek peran pemanggil DI SERVER (pola `pastikanSuperAdmin` di `src/services/akun.server.ts`).
- Hak akses sesungguhnya = RLS di database. UI hanya menyembunyikan tombol.
- Bagian tanpa data disembunyikan, bukan diisi teks palsu.
- Modal/lightbox: render via `createPortal(..., document.body)` (animasi `<main>` mengurung `position:fixed`).
- Daftar panjang di HP — pola geser-samping:
  wadah `-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:overflow-visible sm:px-0 sm:pb-0`,
  item `w-[72%] shrink-0 snap-start sm:w-auto`. Item flex yang membungkus konten lebar WAJIB `min-w-0`.
- Route baru → jalankan dev server sekali agar `src/routeTree.gen.ts` terbarui → **commit** file itu.
- Logo: `src/components/shared/Logo.tsx`. WA: `linkWhatsApp(pengaturan, pesan)` dari `src/services/konten.ts`.
- Upload selalu lewat `src/services/storage.ts` (foto dikompres WebP 1920 di browser).
- Penggantian teks mekanis: skrip Python kecil dengan `assert lama in s` agar gagal keras bila tidak cocok.
- Format: `npx prettier --write <file>` (DEVLOG dikecualikan lewat `.prettierignore`).

## Jebakan yang sudah pernah terjadi

- `pengaturan.value` jsonb NOT NULL: kosong = `""` atau `'null'::jsonb` (null dari supabase-js = NULL SQL → ditolak).
- Relasi album↔media ambigu → `media!media_album_id_fkey(count)`.
- Sejak Hari 18, instal lokal dengan **Bun 1.4.3 + `bun install --frozen-lockfile`**; 70 paket langsung
  sudah dicocokkan dengan `bun.lock`. Jangan `npm install` tanpa lock. `.inputValidator` tetap dipakai
  karena versi produksi yang dipin 1.167.50, bukan API TanStack terbaru.
- `ambilAkunSaya` hanya sign-out bila profil tak ada/nonaktif; error query → throw (jangan logout pengguna).
