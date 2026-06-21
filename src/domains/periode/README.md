# domains/periode/

Domain layer untuk **periode**. Akan berisi:
- `types.ts` — tipe & enum domain.
- `periode.service.ts` — data access (Supabase) level domain.
- `useperiode.ts` (atau cluster hooks) — TanStack Query wrappers untuk komponen.

Komponen TIDAK memanggil Supabase langsung — selalu lewat service di sini.
