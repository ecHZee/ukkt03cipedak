# domains/kegiatan/

Domain layer untuk **kegiatan**. Akan berisi:
- `types.ts` — tipe & enum domain.
- `kegiatan.service.ts` — data access (Supabase) level domain.
- `usekegiatan.ts` (atau cluster hooks) — TanStack Query wrappers untuk komponen.

Komponen TIDAK memanggil Supabase langsung — selalu lewat service di sini.
