# domains/galeri/

Domain layer untuk **galeri**. Akan berisi:
- `types.ts` — tipe & enum domain.
- `galeri.service.ts` — data access (Supabase) level domain.
- `usegaleri.ts` (atau cluster hooks) — TanStack Query wrappers untuk komponen.

Komponen TIDAK memanggil Supabase langsung — selalu lewat service di sini.
