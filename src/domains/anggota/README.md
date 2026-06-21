# domains/anggota/

Domain layer untuk **anggota**. Akan berisi:
- `types.ts` — tipe & enum domain.
- `anggota.service.ts` — data access (Supabase) level domain.
- `useanggota.ts` (atau cluster hooks) — TanStack Query wrappers untuk komponen.

Komponen TIDAK memanggil Supabase langsung — selalu lewat service di sini.
