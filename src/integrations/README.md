# integrations/

Pintu masuk ke layanan eksternal.

## supabase/
Auto-generated oleh Lovable Cloud. **JANGAN diedit manual.**
- `client.ts` — Supabase client untuk browser.
- `client.server.ts` — admin client (service role) untuk kode server-only.
- `auth-middleware.ts` — `requireSupabaseAuth` untuk `createServerFn`.
- `auth-attacher.ts` — attach bearer token ke setiap server fn call.
- `types.ts` — tipe generated dari skema DB.

Tabel, RLS, dan auth flow akan ditambahkan pada Sprint 1+.
