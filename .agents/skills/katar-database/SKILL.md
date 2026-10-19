---
name: "katar-database"
description: "Cara aman mengubah database Supabase proyek Katar RW 03: migrasi manual, RLS, trigger, tes, Management API, skrip data. Gunakan saat menambah/mengubah tabel, kolom, policy, fungsi, data pengaturan, atau akun."
---

# Database (Supabase, ref twmbcxjojknjtjwtntxr)

## Aturan

- CLI SELALU lewat wrapper proyek (token akun Katar dari `.env.local`): `npm run db -- <cmd>` untuk
  perintah sederhana, **`node scripts/supabase.mjs <cmd> --opsi` bila memakai flag**. PowerShell/npm
  pernah menelan `--dry-run` sehingga migrasi terpasang; wrapper Node langsung sudah diuji utuh.
  JANGAN `npx supabase` — laptop Hanif
  punya `SUPABASE_ACCESS_TOKEN` global milik akun pribadi yang harus tetap ada.
- Migrasi: tulis manual `supabase/migrations/<YYYYMMDDHHMMSS>_nama.sql` (perintah `migration new` pernah macet),
  cek `node scripts/supabase.mjs db push --dry-run`, lalu `node scripts/supabase.mjs db push --yes`.
  Beri komentar SQL Bahasa Indonesia di atas file (tujuan + format data).
- Tabel baru: RLS aktif + policy eksplisit + trigger `catat_audit` (+ `set_updated_at` bila ada `updated_at`).
- Pakai helper RLS yang ada: `peran_saya`, `is_bph`, `is_pengurus`, `bidang_saya`, `bidang_akun_saya`,
  `kontributor_saya`, `boleh_terbit`, `boleh_kelola`, `boleh_tulis_folder`.
- `app_role` (super_admin/admin/anggota) diturunkan dari jabatan oleh trigger — jangan set manual kecuali super_admin.
- Konten: `status` (draft/review/terbit), `created_by` dikunci trigger, `terbit_at` & `disetujui_oleh` otomatis, `is_dummy`.
- `akses_dokumen`: publik / anggota / bph. Dokumen internal → signed URL 10 menit.
- Setiap aturan akses baru → tambah tes di `scripts/test-db.mjs`, jalankan `npm run test:db`.

## Pola skrip data

```js
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { parseEnv } from "node:util";
const e = parseEnv(readFileSync(".env.local", "utf8"));
const db = createClient(e.SUPABASE_URL.trim(), e.SUPABASE_SERVICE_ROLE_KEY.trim(), {
  auth: { persistSession: false },
});
```

Simpan sebagai `scripts/_nama.tmp.mjs`, jalankan, lalu HAPUS. Jangan pernah mencetak kunci.

## SQL langsung / konfigurasi Auth (Management API, token `SUPABASE_ACCESS_TOKEN` dari `.env.local`)

- `POST https://api.supabase.com/v1/projects/twmbcxjojknjtjwtntxr/database/query` body `{"query":"..."}`
- `GET/PATCH .../config/auth` (site_url, uri_allow_list; `disable_signup` harus tetap true)

## Jebakan

- `pengaturan.value` NOT NULL → kosong = `'null'::jsonb` atau `""`.
- DB dipakai bersama web ONLINE: data uji singkat, berlabel UJI, dikembalikan, lalu diverifikasi di web online.
- Akun: `npm run akun -- generate [--coba] | buat | daftar | username <lama> <baru> | reset <user> | nonaktif <user> | aktifkan <user>`
  atau menu Akun (`/admin/users`). Password tidak bisa dilihat — reset saja.
