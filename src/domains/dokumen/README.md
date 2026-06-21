# domains/dokumen/

Domain layer untuk **dokumen**. Akan berisi:
- `types.ts` — tipe & enum domain.
- `dokumen.service.ts` — data access (Supabase) level domain.
- `usedokumen.ts` (atau cluster hooks) — TanStack Query wrappers untuk komponen.

Komponen TIDAK memanggil Supabase langsung — selalu lewat service di sini.
