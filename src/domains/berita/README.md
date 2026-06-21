# domains/berita/

Domain layer untuk **berita**. Akan berisi:
- `types.ts` — tipe & enum domain.
- `berita.service.ts` — data access (Supabase) level domain.
- `useberita.ts` (atau cluster hooks) — TanStack Query wrappers untuk komponen.

Komponen TIDAK memanggil Supabase langsung — selalu lewat service di sini.
